const TRANSFERENCIA_WA_NUMBER = '543743668039';
const TRANSFERENCIA_RESULT_STORAGE_KEY = 'transferenciaQuoteResult';
const TRANSFERENCIA_RESULT_PAGE = 'cotizacion-transferencia-resultado';
const TRANSFERENCIA_QUOTE_API_ENDPOINT = '/api/transferencia/quote';
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

  const submitButton = document.getElementById('transferencia-submit-btn');
  const vehicleInputs = Array.from(form.querySelectorAll('input[name="vehicleType"]'));
  const misionesInputs = Array.from(form.querySelectorAll('input[name="misionesResidence"]'));
  const buyerSignatureSelect = document.getElementById('buyer-signature-range');
  const buyerSignatureInputs = Array.from(form.querySelectorAll('input[name="buyerSignatureRange"]'));
  const priceInput = document.getElementById('transfer-price');
  const clientWhatsappInput = document.getElementById('client-whatsapp');
  const ageSelect = document.getElementById('transfer-age');
  const buyerSignatureDateInput = document.getElementById('buyer-signature-date');
  const buyerSignatureDateGroup = document.getElementById('buyer-signature-date-group');
  const buyerSignatureDateHelp = document.getElementById('buyer-signature-date-help');
  const formStatus = document.getElementById('transferencia-form-status');

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

  const submitButtonDefaultLabel = submitButton ? submitButton.textContent.trim() : 'Cotizar transferencia';
  let isSubmitting = false;

  buyerSignatureDateInput.max = formatDateForInput(new Date());

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
    if (buyerSignatureSelect) return buyerSignatureSelect.value || '';
    return buyerSignatureInputs.find(input => input.checked)?.value || '';
  }

  function getClientWhatsapp() {
    return clientWhatsappInput ? clientWhatsappInput.value.trim() : '';
  }

  function normalizeWhatsappNumber(value) {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');
    if (!digits) return '';

    const withoutLeadingZeros = digits.replace(/^0+/, '');
    if (withoutLeadingZeros.startsWith('549')) return withoutLeadingZeros;
    if (withoutLeadingZeros.startsWith('54') && withoutLeadingZeros.length === 12) {
      return `549${withoutLeadingZeros.slice(2)}`;
    }
    if (withoutLeadingZeros.startsWith('9') && withoutLeadingZeros.length === 11) {
      return `54${withoutLeadingZeros}`;
    }
    if (withoutLeadingZeros.length === 10) return `549${withoutLeadingZeros}`;
    if (withoutLeadingZeros.startsWith('54')) return withoutLeadingZeros;

    return withoutLeadingZeros;
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
    if (value === 'no') return 'Otra provincia';
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

  function setSubmitLoadingState(isLoading) {
    if (!submitButton) return;
    submitButton.classList.toggle('is-loading', isLoading);
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Calculando y enviando' : submitButtonDefaultLabel;
  }

  function setFormStatus(message, isError = false) {
    if (!formStatus) return;
    formStatus.textContent = message || '';
    formStatus.classList.toggle('is-error', Boolean(isError));
  }

  function buildWhatsappLink(data) {
    const lines = [
      'Hola, te compartimos la cotizacion estimada de transferencia de Gestoria Sonia.',
      `Tipo: ${data.typeLabel}`,
      `Titular nuevo con domicilio en Misiones: ${data.misionesLabel}`,
      `Precio de compra informado: ${data.priceFormatted}`,
      `Firma del vendedor certificada hace: ${data.ageLabel}`,
      `Firma del comprador certificada hace: ${data.buyerSignatureLabel}`
    ];

    if (data.includeBreakdown) {
      lines.push(
        `Formulario + Escribania + Honorarios: ${data.serviceFeeFormatted}`,
        `Registro: ${data.registryAmountFormatted}`,
        `Sellado total: ${data.stampedTotalFormatted}`,
        `- Liquidacion de sellos: ${data.stampsFormatted}`,
        `- Intereses: ${data.interestFormatted}`,
        `- Multas: ${data.penaltyFormatted}`
      );

      if (data.selladoNote) {
        lines.push(data.selladoNote);
      }

      lines.push(
        `Total estimado web: ${data.totalFormatted}.`,
        'La cotizacion es orientativa y el valor exacto se confirma al revisar la documentacion.'
      );
    } else {
      lines.push('Como el titular nuevo no tiene domicilio en Misiones, necesitamos confirmar la cotizacion exacta revisando la documentacion.');
    }

    const targetNumber = normalizeWhatsappNumber(data.clientWhatsapp) || TRANSFERENCIA_WA_NUMBER;
    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  async function sendQuoteRequest(payload) {
    const response = await fetch(TRANSFERENCIA_QUOTE_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo guardar la cotizacion.');
    }

    return data;
  }

  function hasCompleteData(misionesResidence, price, sellerAgeKey, buyerSignatureRange, buyerSignatureDate, clientWhatsapp) {
    if (!misionesResidence) return false;
    if (!Number.isFinite(price) || price <= 0) return false;
    if (clientWhatsappInput && !clientWhatsapp) return false;
    if (!sellerAgeKey) return false;
    if (!buyerSignatureRange) return false;
    if (buyerSignatureRange === 'gt15' && !buyerSignatureDate) return false;
    return true;
  }

  function buildQuotePayload() {
    const vehicleType = getVehicleType();
    const typeLabel = TRANSFERENCIA_DATA[vehicleType].label;
    const misionesResidence = getMisionesResidence();
    const misionesLabel = getMisionesLabel(misionesResidence);
    const price = Number(priceInput.value);
    const clientWhatsapp = getClientWhatsapp();
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
      buyerSignatureDate,
      clientWhatsapp
    );

    if (!completeData) {
      return null;
    }

    const basePayload = {
      typeLabel,
      misionesLabel,
      price,
      priceFormatted: moneyFormatter.format(price),
      clientWhatsapp,
      ageLabel,
      buyerSignatureLabel,
      buyerSignatureRange,
      buyerSignatureDate
    };

    if (misionesResidence === 'no') {
      const registryRate = REGISTRY_RATE_BY_SELLER_SIGNATURE[sellerAgeKey] || REGISTRY_RATE_BY_SELLER_SIGNATURE.lt90;
      const payload = {
        ...basePayload,
        includeBreakdown: false,
        resultCopy: 'Como el titular nuevo no tiene domicilio en Misiones, la cotizacion exacta se confirma por WhatsApp.',
        disclaimer: 'La cotizacion exacta final se confirma por WhatsApp.',
        registryRateLabel: formatPercent(registryRate),
        serviceFeeFormatted: moneyFormatter.format(FIXED_SERVICE_FEE),
        registryAmountFormatted: moneyFormatter.format(ZERO_AMOUNT),
        stampedTotalFormatted: moneyFormatter.format(ZERO_AMOUNT),
        stampsFormatted: moneyFormatter.format(ZERO_AMOUNT),
        interestFormatted: moneyFormatter.format(ZERO_AMOUNT),
        penaltyFormatted: moneyFormatter.format(ZERO_AMOUNT),
        totalFormatted: '-',
        registryNote: '',
        selladoNote: ''
      };

      payload.whatsappHref = buildWhatsappLink(payload);
      return payload;
    }

    const registryRate = REGISTRY_RATE_BY_SELLER_SIGNATURE[sellerAgeKey] || REGISTRY_RATE_BY_SELLER_SIGNATURE.lt90;
    const registryAmount = roundCurrency(price * registryRate);
    const stamps = roundCurrency(price * STAMP_RATE);
    const selladoCharges = getSelladoCharges(stamps, buyerSignatureRange, buyerSignatureDate);
    const interest = selladoCharges.interest;
    const penalty = selladoCharges.penalty;
    const stampedTotal = selladoCharges.stampedTotal;
    const total = roundCurrency(FIXED_SERVICE_FEE + registryAmount + stampedTotal);

    const payload = {
      ...basePayload,
      includeBreakdown: true,
      resultCopy: 'Revisa el detalle y continua por WhatsApp si queres la cotizacion exacta.',
      disclaimer: 'Este detalle usa un fijo de honorarios y calcula registro y sellado sobre el valor informado. La cotizacion exacta final siempre se confirma por WhatsApp.',
      whatsappLabel: 'Enviar cotizacion al cliente por WhatsApp',
      registryRateLabel: formatPercent(registryRate),
      serviceFeeFormatted: moneyFormatter.format(FIXED_SERVICE_FEE),
      registryAmountFormatted: moneyFormatter.format(registryAmount),
      stampedTotalFormatted: moneyFormatter.format(stampedTotal),
      stampsFormatted: moneyFormatter.format(stamps),
      interestFormatted: moneyFormatter.format(interest),
      penaltyFormatted: moneyFormatter.format(penalty),
      totalFormatted: moneyFormatter.format(total),
      registryNote: `Base ${formatPercent(registryRate)} segun la firma del vendedor: ${ageLabel}.`,
      selladoNote: selladoCharges.selladoNote
    };

    payload.whatsappHref = buildWhatsappLink(payload);
    return payload;
  }

  vehicleInputs.forEach(input => {
    input.addEventListener('change', () => {
      setActiveOption(vehicleInputs);
    });
  });

  misionesInputs.forEach(input => {
    input.addEventListener('change', () => {
      setActiveOption(misionesInputs);
    });
  });

  if (buyerSignatureSelect) {
    buyerSignatureSelect.addEventListener('change', updateBuyerSignatureDateField);
  } else {
    buyerSignatureInputs.forEach(input => {
      input.addEventListener('change', () => {
        setActiveOption(buyerSignatureInputs);
        updateBuyerSignatureDateField();
      });
    });
  }

  buyerSignatureDateInput.addEventListener('input', updateBuyerSignatureDateField);

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (isSubmitting) return;

    updateBuyerSignatureDateField();

    if (!form.reportValidity()) {
      return;
    }

    const payload = buildQuotePayload();
    if (!payload) {
      return;
    }

    isSubmitting = true;
    setSubmitLoadingState(true);
    setFormStatus('Estamos calculando la cotizacion...');

    // Google Ads: Formulario enviado
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', { 'send_to': 'AW-18100857997/wTOLCMunu6AcEI3ZlLdD' });
    }

    sendQuoteRequest(payload)
      .catch(() => ({}))
      .then(() => {
        window.sessionStorage.setItem(TRANSFERENCIA_RESULT_STORAGE_KEY, JSON.stringify(payload));
        window.location.href = TRANSFERENCIA_RESULT_PAGE;
      });
  });

  setActiveOption(vehicleInputs);
  setActiveOption(misionesInputs);
  if (buyerSignatureInputs.length) setActiveOption(buyerSignatureInputs);
  updateBuyerSignatureDateField();
});
