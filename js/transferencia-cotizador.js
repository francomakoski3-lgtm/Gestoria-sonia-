const TRANSFERENCIA_WA_NUMBER = '543743668039';
const FIXED_SERVICE_FEE = 150000;
const STAMP_RATE = 0.03;
const ZERO_AMOUNT = 0;
const MONTHLY_INTEREST_RATE = 0.0589;

const TRANSFERENCIA_DATA = {
  auto: { label: 'Auto' },
  moto: { label: 'Moto' }
};

const REGISTRY_RATE_BY_SELLER_SIGNATURE = {
  lt90: 0.01,
  '90d1y': 0.012,
  '1y2y': 0.014,
  '2y3y': 0.016,
  '3y4y': 0.018,
  gt4: 0.02
};

const TRANSFERENCIA_AGE_OPTIONS = {
  lt90: 'Menos de 90 dias',
  '90d1y': 'Mas de 90 dias y hasta 1 ano',
  '1y2y': 'Entre 1 ano y 2 anos',
  '2y3y': 'Entre 2 anos y 3 anos',
  '3y4y': 'Entre 3 anos y 4 anos',
  gt4: 'Mas de 4 anos'
};

const BUYER_SIGNATURE_OPTIONS = {
  lt15: 'Menos de 15 dias habiles',
  gt15: 'Mas de 15 dias habiles'
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('transferencia-form');
  if (!form) return;

  const vehicleInputs = Array.from(form.querySelectorAll('input[name="vehicleType"]'));
  const misionesInputs = Array.from(form.querySelectorAll('input[name="misionesResidence"]'));
  const buyerSignatureInputs = Array.from(form.querySelectorAll('input[name="buyerSignatureRange"]'));
  const priceInput = document.getElementById('transfer-price');
  const ageSelect = document.getElementById('transfer-age');
  const buyerSignatureDateInput = document.getElementById('buyer-signature-date');
  const buyerSignatureDateGroup = document.getElementById('buyer-signature-date-group');
  const buyerSignatureDateHelp = document.getElementById('buyer-signature-date-help');
  const whatsappButton = document.getElementById('transferencia-whatsapp');
  const summaryType = document.getElementById('summary-type');
  const summaryMisiones = document.getElementById('summary-misiones');
  const summaryPrice = document.getElementById('summary-price');
  const summaryAge = document.getElementById('summary-age');
  const summaryBuyerSignature = document.getElementById('summary-buyer-signature');
  const breakdownServiceFee = document.getElementById('breakdown-service-fee');
  const breakdownRegistry = document.getElementById('breakdown-registry');
  const breakdownRegistryNote = document.getElementById('breakdown-registry-note');
  const breakdownStampedTotal = document.getElementById('breakdown-stamped-total');
  const breakdownStamps = document.getElementById('breakdown-stamps');
  const breakdownInterest = document.getElementById('breakdown-interest');
  const breakdownPenalty = document.getElementById('breakdown-penalty');
  const breakdownTotal = document.getElementById('breakdown-total');

  const moneyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  });

  const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  buyerSignatureDateInput.max = formatDateForInput(new Date());
  breakdownServiceFee.textContent = moneyFormatter.format(FIXED_SERVICE_FEE);

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseInputDate(value) {
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }

  function countBusinessDays(startDate, endDate) {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) return 0;

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const last = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    if (current > last) return 0;

    let count = 0;

    while (current < last) {
      current.setDate(current.getDate() + 1);
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count += 1;
      }
    }

    return count;
  }

  function getVehicleType() {
    return vehicleInputs.find(input => input.checked)?.value || 'auto';
  }

  function getMisionesResidence() {
    return misionesInputs.find(input => input.checked)?.value || '';
  }

  function getBuyerSignatureRange() {
    return buyerSignatureInputs.find(input => input.checked)?.value || '';
  }

  function setActiveOption(inputs) {
    inputs.forEach(input => {
      const option = input.closest('.vehicle-type-option');
      if (!option) return;
      option.classList.toggle('is-active', input.checked);
    });
  }

  function getAgeLabel(key) {
    return TRANSFERENCIA_AGE_OPTIONS[key] || '-';
  }

  function getMisionesLabel(value) {
    if (value === 'si') return 'Si';
    if (value === 'no') return 'No';
    return '-';
  }

  function getBuyerSignatureLabel(range, dateValue) {
    if (!range) return '-';

    if (range === 'lt15') {
      return BUYER_SIGNATURE_OPTIONS.lt15;
    }

    if (range !== 'gt15') {
      return '-';
    }

    if (!dateValue) {
      return BUYER_SIGNATURE_OPTIONS.gt15;
    }

    const selectedDate = parseInputDate(dateValue);
    if (!selectedDate) {
      return BUYER_SIGNATURE_OPTIONS.gt15;
    }

    const businessDays = countBusinessDays(selectedDate, new Date());
    return `${BUYER_SIGNATURE_OPTIONS.gt15} (${businessDays} dias habiles aprox. desde el ${dateFormatter.format(selectedDate)})`;
  }

  function formatPercent(rate, decimals = 1) {
    return `${(rate * 100).toFixed(decimals).replace('.', ',')}%`;
  }

  function roundCurrency(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  function formatDateLabel(date) {
    return dateFormatter.format(date);
  }

  function getTodayDateOnly() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  function getSelladoCharges(stamps, buyerSignatureRange, buyerSignatureDate) {
    if (buyerSignatureRange !== 'gt15' || !buyerSignatureDate) {
      return {
        interest: ZERO_AMOUNT,
        penalty: ZERO_AMOUNT,
        stampedTotal: roundCurrency(stamps),
        dueDate: null,
        selladoNote: 'Sellado sin mora cargada.'
      };
    }

    const calculator = window.TransferenciaCalculatorCore;
    const signatureDate = parseInputDate(buyerSignatureDate);

    if (!calculator || !signatureDate) {
      return {
        interest: ZERO_AMOUNT,
        penalty: ZERO_AMOUNT,
        stampedTotal: roundCurrency(stamps),
        dueDate: null,
        selladoNote: 'No se pudo resolver el calculo exacto del sellado.'
      };
    }

    const liquidationDate = getTodayDateOnly();
    const dueDate = calculator.agregarDiasHabiles(signatureDate, 15, new Set());
    const interest = roundCurrency(
      calculator.calcularInteresProrrateadoPorMes({
        liquidacionSellos: stamps,
        fechaVencimiento: dueDate,
        fechaLiquidacion: liquidationDate
      })
    );
    const penalty = roundCurrency(
      calculator.calcularMulta({
        liquidacionSellos: stamps,
        fechaVencimiento: dueDate,
        fechaLiquidacion: liquidationDate,
        holidaySet: new Set()
      }).multa
    );
    const stampedTotal = roundCurrency(stamps + interest + penalty);

    return {
      interest,
      penalty,
      stampedTotal,
      dueDate,
      selladoNote: `Vencimiento estimado del sellado: ${formatDateLabel(dueDate)}. Interes mensual aplicado: ${formatPercent(MONTHLY_INTEREST_RATE, 2)}.`
    };
  }

  function updateBuyerSignatureDateField() {
    const range = getBuyerSignatureRange();
    const shouldShow = range === 'gt15';

    buyerSignatureDateGroup.hidden = !shouldShow;
    buyerSignatureDateInput.required = shouldShow;

    if (!shouldShow) {
      buyerSignatureDateHelp.textContent = 'Selecciona la fecha para calcular los dias habiles aproximados.';
      return;
    }

    if (!buyerSignatureDateInput.value) {
      buyerSignatureDateHelp.textContent = 'Selecciona la fecha para calcular los dias habiles aproximados.';
      return;
    }

    const selectedDate = parseInputDate(buyerSignatureDateInput.value);
    if (!selectedDate) {
      buyerSignatureDateHelp.textContent = 'Selecciona la fecha para calcular los dias habiles aproximados.';
      return;
    }

    const businessDays = countBusinessDays(selectedDate, new Date());
    buyerSignatureDateHelp.textContent = `Han pasado ${businessDays} dias habiles aprox. desde el ${dateFormatter.format(selectedDate)}.`;
  }

  function setSummary(data) {
    summaryType.textContent = data.typeLabel || '-';
    summaryMisiones.textContent = data.misionesLabel || '-';
    summaryPrice.textContent = data.price ? moneyFormatter.format(data.price) : '-';
    summaryAge.textContent = data.ageLabel || '-';
    summaryBuyerSignature.textContent = data.buyerSignatureLabel || '-';
  }

  function resetBreakdown() {
    breakdownServiceFee.textContent = moneyFormatter.format(FIXED_SERVICE_FEE);
    breakdownRegistry.textContent = '-';
    breakdownRegistryNote.textContent = 'Base 1%';
    breakdownStampedTotal.textContent = '-';
    breakdownStamps.textContent = '-';
    breakdownInterest.textContent = '-';
    breakdownPenalty.textContent = '-';
    breakdownTotal.textContent = '-';
  }

  function setBreakdown(data) {
    breakdownServiceFee.textContent = moneyFormatter.format(data.serviceFee);
    breakdownRegistry.textContent = moneyFormatter.format(data.registryAmount);
    breakdownRegistryNote.textContent = `Base ${formatPercent(data.registryRate)} segun la firma del vendedor: ${data.ageLabel}.`;
    breakdownStampedTotal.textContent = moneyFormatter.format(data.stampedTotal);
    breakdownStamps.textContent = moneyFormatter.format(data.stamps);
    breakdownInterest.textContent = moneyFormatter.format(data.interest);
    breakdownPenalty.textContent = moneyFormatter.format(data.penalty);
    breakdownTotal.textContent = moneyFormatter.format(data.total);
  }

  function setWhatsappState(enabled, href = '', label = 'Pedir cotizacion exacta por WhatsApp') {
    whatsappButton.classList.toggle('is-disabled', !enabled);
    whatsappButton.setAttribute('aria-disabled', String(!enabled));
    whatsappButton.textContent = label;

    if (enabled) {
      whatsappButton.href = href;
    } else {
      whatsappButton.removeAttribute('href');
    }
  }

  function buildWhatsappLink(data) {
    const lines = [
      'Hola, quiero pedir una cotizacion exacta de transferencia.',
      `Tipo: ${data.typeLabel}`,
      `Titular nuevo con domicilio en Misiones: ${data.misionesLabel}`,
      `Precio de compra informado: ${moneyFormatter.format(data.price)}`,
      `Firma del vendedor certificada hace: ${data.ageLabel}`,
      `Firma del comprador certificada hace: ${data.buyerSignatureLabel}`
    ];

    if (data.includeBreakdown !== false) {
      lines.push(
        `Formulario + Escribania + Honorarios: ${moneyFormatter.format(data.serviceFee)}`,
        `Registro (${formatPercent(data.registryRate)}): ${moneyFormatter.format(data.registryAmount)}`,
        `Sellado total: ${moneyFormatter.format(data.stampedTotal)}`,
        `- Liquidacion de sellos: ${moneyFormatter.format(data.stamps)}`,
        `- Intereses: ${moneyFormatter.format(data.interest)}`,
        `- Multas: ${moneyFormatter.format(data.penalty)}`
      );
      if (data.selladoNote) {
        lines.push(data.selladoNote);
      }
    }

    lines.push(data.totalText);

    return `https://wa.me/${TRANSFERENCIA_WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  function hasCompleteData(misionesResidence, price, sellerAgeKey, buyerSignatureRange, buyerSignatureDate) {
    if (!misionesResidence) return false;
    if (!Number.isFinite(price) || price <= 0) return false;
    if (!sellerAgeKey) return false;
    if (!buyerSignatureRange) return false;
    if (buyerSignatureRange === 'gt15' && !buyerSignatureDate) return false;
    return true;
  }

  function updateQuote() {
    const vehicleType = getVehicleType();
    const typeLabel = TRANSFERENCIA_DATA[vehicleType].label;
    const misionesResidence = getMisionesResidence();
    const misionesLabel = getMisionesLabel(misionesResidence);
    const price = Number(priceInput.value);
    const sellerAgeKey = ageSelect.value;
    const ageLabel = getAgeLabel(sellerAgeKey);
    const buyerSignatureRange = getBuyerSignatureRange();
    const buyerSignatureDate = buyerSignatureDateInput.value;
    const buyerSignatureLabel = getBuyerSignatureLabel(buyerSignatureRange, buyerSignatureDate);
    const completeData = hasCompleteData(
      misionesResidence,
      price,
      sellerAgeKey,
      buyerSignatureRange,
      buyerSignatureDate
    );

    setSummary({
      typeLabel,
      misionesLabel,
      price: Number.isFinite(price) && price > 0 ? price : null,
      ageLabel: sellerAgeKey ? ageLabel : '',
      buyerSignatureLabel: buyerSignatureRange ? buyerSignatureLabel : ''
    });

    if (!misionesResidence && !Number.isFinite(price) && !sellerAgeKey && !buyerSignatureRange) {
      resetBreakdown();
      setWhatsappState(false);
      return;
    }

    if (misionesResidence === 'no') {
      resetBreakdown();

      if (!completeData) {
        setWhatsappState(false, '', 'Cotizacion exacta por WhatsApp');
        return;
      }

      setWhatsappState(
        true,
        buildWhatsappLink({
          typeLabel,
          misionesLabel,
          price,
          ageLabel,
          buyerSignatureLabel,
          includeBreakdown: false,
          serviceFee: FIXED_SERVICE_FEE,
          registryRate: REGISTRY_RATE_BY_SELLER_SIGNATURE[sellerAgeKey] || REGISTRY_RATE_BY_SELLER_SIGNATURE.lt90,
          registryAmount: ZERO_AMOUNT,
          stampedTotal: ZERO_AMOUNT,
          stamps: ZERO_AMOUNT,
          interest: ZERO_AMOUNT,
          penalty: ZERO_AMOUNT,
          totalText: 'Titular nuevo sin domicilio en Misiones. Solicito cotizacion exacta por WhatsApp.'
        }),
        'Cotizacion exacta por WhatsApp'
      );
      return;
    }

    if (!completeData) {
      resetBreakdown();
      setWhatsappState(false);
      return;
    }

    const registryRate = REGISTRY_RATE_BY_SELLER_SIGNATURE[sellerAgeKey] || REGISTRY_RATE_BY_SELLER_SIGNATURE.lt90;
    const registryAmount = roundCurrency(price * registryRate);
    const stamps = roundCurrency(price * STAMP_RATE);
    const selladoCharges = getSelladoCharges(stamps, buyerSignatureRange, buyerSignatureDate);
    const interest = selladoCharges.interest;
    const penalty = selladoCharges.penalty;
    const stampedTotal = selladoCharges.stampedTotal;
    const total = roundCurrency(FIXED_SERVICE_FEE + registryAmount + stampedTotal);
    const totalText = `Total estimado web: ${moneyFormatter.format(total)}.`;

    setBreakdown({
      serviceFee: FIXED_SERVICE_FEE,
      registryRate,
      registryAmount,
      ageLabel,
      stampedTotal,
      stamps,
      interest,
      penalty,
      total
    });

    setWhatsappState(
      true,
      buildWhatsappLink({
        typeLabel,
        misionesLabel,
        price,
        ageLabel,
        buyerSignatureLabel,
        serviceFee: FIXED_SERVICE_FEE,
        registryRate,
        registryAmount,
        stampedTotal,
        stamps,
        interest,
        penalty,
        selladoNote: selladoCharges.selladoNote,
        totalText
      }),
      'Pedir cotizacion exacta por WhatsApp'
    );
  }

  vehicleInputs.forEach(input => {
    input.addEventListener('change', () => {
      setActiveOption(vehicleInputs);
      updateQuote();
    });
  });

  misionesInputs.forEach(input => {
    input.addEventListener('change', () => {
      setActiveOption(misionesInputs);
      updateQuote();
    });
  });

  buyerSignatureInputs.forEach(input => {
    input.addEventListener('change', () => {
      setActiveOption(buyerSignatureInputs);
      updateBuyerSignatureDateField();
      updateQuote();
    });
  });

  priceInput.addEventListener('input', updateQuote);
  ageSelect.addEventListener('change', updateQuote);
  buyerSignatureDateInput.addEventListener('input', () => {
    updateBuyerSignatureDateField();
    updateQuote();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    updateQuote();
  });

  setActiveOption(vehicleInputs);
  setActiveOption(misionesInputs);
  setActiveOption(buyerSignatureInputs);
  resetBreakdown();
  updateBuyerSignatureDateField();
  updateQuote();
});
