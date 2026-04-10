const TRANSFERENCIA_WA_NUMBER = '543743668039';
const ESTIMATE_MIN_RATE = 0.03;
const ESTIMATE_MAX_RATE = 0.05;

const TRANSFERENCIA_DATA = {
  auto: {
    label: 'Auto',
    brands: {
      Toyota: ['Corolla', 'Hilux', 'Etios', 'Yaris', 'SW4'],
      Volkswagen: ['Gol', 'Polo', 'Amarok', 'Taos', 'T-Cross'],
      Ford: ['Fiesta', 'Focus', 'Ranger', 'EcoSport', 'Ka'],
      Chevrolet: ['Onix', 'Cruze', 'Tracker', 'S10', 'Prisma'],
      Renault: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Kangoo'],
      Fiat: ['Cronos', 'Argo', 'Toro', 'Strada', 'Mobi'],
      Peugeot: ['208', '2008', '308', 'Partner', '3008'],
      Nissan: ['Versa', 'Sentra', 'Frontier', 'Kicks', 'March']
    }
  },
  moto: {
    label: 'Moto',
    brands: {
      Honda: ['Wave 110', 'CG Titan', 'XR 150', 'CB 125F', 'Biz 125'],
      Yamaha: ['Crypton', 'FZ-S', 'YBR 125', 'XTZ 125', 'MT-03'],
      Motomel: ['B110', 'S2 150', 'Skua 150', 'Blitz', 'CX 150'],
      Corven: ['Energy 110', 'Triax 150', 'Hunter 150', 'Mirage 110', 'Terrain 250'],
      Zanella: ['ZB 110', 'RX 150', 'ZR 150', 'Patagonian Eagle', 'Due 110'],
      Gilera: ['Smash', 'VC 150', 'Sahel 150', 'AC1', 'VC 200'],
      Keller: ['Crono Classic', 'KN 110-8', 'Miracle', 'MX 260', 'Crono 110']
    }
  }
};

const TRANSFERENCIA_AGE_OPTIONS = {
  lt3: 'Menos de 3 meses',
  '3m1y': 'Entre 3 meses y 1 ano',
  '1y5y': 'Entre 1 ano y 5 anos',
  gt5: 'Mas de 5 anos'
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('transferencia-form');
  if (!form) return;

  const vehicleInputs = Array.from(form.querySelectorAll('input[name="vehicleType"]'));
  const provinceSelect = document.getElementById('transfer-province');
  const brandSelect = document.getElementById('transfer-brand');
  const modelSelect = document.getElementById('transfer-model');
  const priceInput = document.getElementById('transfer-price');
  const ageSelect = document.getElementById('transfer-age');
  const resultAmount = document.getElementById('quote-estimate-amount');
  const resultMeta = document.getElementById('quote-estimate-meta');
  const whatsappButton = document.getElementById('transferencia-whatsapp');
  const summaryType = document.getElementById('summary-type');
  const summaryProvince = document.getElementById('summary-province');
  const summaryBrand = document.getElementById('summary-brand');
  const summaryModel = document.getElementById('summary-model');
  const summaryPrice = document.getElementById('summary-price');
  const summaryAge = document.getElementById('summary-age');

  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  });

  function getVehicleType() {
    return vehicleInputs.find(input => input.checked)?.value || 'auto';
  }

  function setActiveVehicleOption() {
    vehicleInputs.forEach(input => {
      const option = input.closest('.vehicle-type-option');
      if (!option) return;
      option.classList.toggle('is-active', input.checked);
    });
  }

  function resetSelect(select, placeholder) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
  }

  function populateBrands() {
    const vehicleType = getVehicleType();
    const brands = Object.keys(TRANSFERENCIA_DATA[vehicleType].brands);

    resetSelect(brandSelect, 'Seleccionar marca');
    resetSelect(modelSelect, 'Seleccionar modelo del vehiculo');
    modelSelect.disabled = true;

    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  }

  function populateModels() {
    const vehicleType = getVehicleType();
    const brand = brandSelect.value;

    resetSelect(modelSelect, 'Seleccionar modelo del vehiculo');
    modelSelect.disabled = !brand;

    if (!brand) return;

    TRANSFERENCIA_DATA[vehicleType].brands[brand].forEach(model => {
      const option = document.createElement('option');
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  }

  function getAgeLabel(key) {
    return TRANSFERENCIA_AGE_OPTIONS[key] || '-';
  }

  function setSummary(data) {
    summaryType.textContent = data.typeLabel || '-';
    summaryProvince.textContent = data.province || '-';
    summaryBrand.textContent = data.brand || '-';
    summaryModel.textContent = data.model || '-';
    summaryPrice.textContent = data.price ? formatter.format(data.price) : '-';
    summaryAge.textContent = data.ageLabel || '-';
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
      `Provincia: ${data.province}`,
      `Marca: ${data.brand}`,
      `Modelo del vehiculo: ${data.model}`,
      `Precio de compra informado: ${formatter.format(data.price)}`,
      `Antiguedad de la compra: ${data.ageLabel}`,
      data.rangeText
    ];

    return `https://wa.me/${TRANSFERENCIA_WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  function hasCompleteData(province, brand, model, price, ageKey) {
    return Boolean(province && brand && model && Number.isFinite(price) && price > 0 && ageKey);
  }

  function updateQuote() {
    const vehicleType = getVehicleType();
    const typeLabel = TRANSFERENCIA_DATA[vehicleType].label;
    const province = provinceSelect.value;
    const brand = brandSelect.value;
    const model = modelSelect.value;
    const price = Number(priceInput.value);
    const ageKey = ageSelect.value;
    const ageLabel = getAgeLabel(ageKey);
    const completeData = hasCompleteData(province, brand, model, price, ageKey);

    setSummary({
      typeLabel,
      province,
      brand,
      model,
      price: Number.isFinite(price) && price > 0 ? price : null,
      ageLabel: ageKey ? ageLabel : ''
    });

    if (!province && !brand && !model && !Number.isFinite(price) && !ageKey) {
      resultAmount.textContent = 'Completa los datos';
      resultMeta.textContent = 'Elegi provincia, tipo de vehiculo, marca, modelo del vehiculo, valor y antiguedad para calcular.';
      setWhatsappState(false);
      return;
    }

    if (province && province !== 'Misiones') {
      resultAmount.textContent = 'Cotizacion exacta por WhatsApp';
      resultMeta.textContent = 'El estimador automatico funciona solo para Misiones. Si queres seguir, completamos la cotizacion exacta por WhatsApp.';

      if (!completeData) {
        setWhatsappState(false, '', 'Cotizacion exacta por WhatsApp');
        return;
      }

      setWhatsappState(
        true,
        buildWhatsappLink({
          typeLabel,
          province,
          brand,
          model,
          price,
          ageLabel,
          rangeText: 'Provincia fuera de Misiones. Solicito cotizacion exacta por WhatsApp.'
        }),
        'Cotizacion exacta por WhatsApp'
      );
      return;
    }

    if (!completeData) {
      resultAmount.textContent = 'Completa los datos';
      resultMeta.textContent = 'Elegi provincia, tipo de vehiculo, marca, modelo del vehiculo, valor y antiguedad para calcular.';
      setWhatsappState(false);
      return;
    }

    const minEstimate = Math.round(price * ESTIMATE_MIN_RATE);
    const maxEstimate = Math.round(price * ESTIMATE_MAX_RATE);
    const rangeText = `Rango orientativo web en Misiones: entre ${formatter.format(maxEstimate)} y ${formatter.format(minEstimate)}.`;

    resultAmount.textContent = `Entre ${formatter.format(maxEstimate)} y ${formatter.format(minEstimate)}`;
    resultMeta.textContent = `Rango orientativo para ${typeLabel.toLowerCase()} en Misiones sobre ${formatter.format(price)}. La cotizacion exacta se confirma por WhatsApp.`;

    setWhatsappState(
      true,
      buildWhatsappLink({
        typeLabel,
        province,
        brand,
        model,
        price,
        ageLabel,
        rangeText
      }),
      'Pedir cotizacion exacta por WhatsApp'
    );
  }

  vehicleInputs.forEach(input => {
    input.addEventListener('change', () => {
      setActiveVehicleOption();
      populateBrands();
      updateQuote();
    });
  });

  provinceSelect.addEventListener('change', updateQuote);
  brandSelect.addEventListener('change', () => {
    populateModels();
    updateQuote();
  });
  modelSelect.addEventListener('change', updateQuote);
  priceInput.addEventListener('input', updateQuote);
  ageSelect.addEventListener('change', updateQuote);

  form.addEventListener('submit', event => {
    event.preventDefault();
    updateQuote();
  });

  populateBrands();
  setActiveVehicleOption();
  updateQuote();
});
