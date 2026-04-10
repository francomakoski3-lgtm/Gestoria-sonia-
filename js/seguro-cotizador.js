const SEGURO_COTIZADOR_CONFIG = {
  auto: {
    label: 'Auto',
    planLabel: 'Plan RC',
    summaryLabel: 'Auto',
    note: 'Precio fijo para seguro RC segun si el auto lleva o no grua.',
    plans: [
      {
        id: 'auto-rc-sin-grua',
        label: 'RC sin grua',
        price: 30285.5,
        detail: 'Seguro RC para auto sin servicio de grua.'
      },
      {
        id: 'auto-rc-con-grua',
        label: 'RC con grua',
        price: 34458.88,
        detail: 'Seguro RC para auto con servicio de grua.'
      }
    ]
  },
  moto: {
    label: 'Moto',
    planLabel: 'Cobertura',
    summaryLabel: 'Moto',
    note: 'Valor fijo base para seguro de moto.',
    plans: [
      {
        id: 'moto-base',
        label: 'Moto',
        price: 12784.78,
        detail: 'Valor fijo base para seguro de moto.'
      }
    ]
  },
  camion: {
    label: 'Camion',
    planLabel: 'Tipo de camion',
    summaryLabel: 'Camion',
    note: 'El valor cambia segun si el camion trabaja en uso local o rutero.',
    plans: [
      {
        id: 'camion-local',
        label: 'Camion local',
        price: 45959.81,
        detail: 'Valor fijo para camion de uso local.'
      },
      {
        id: 'camion-rutero',
        label: 'Camion rutero',
        price: 95899.54,
        detail: 'Valor fijo para camion de uso rutero.'
      }
    ]
  },
  camioneta: {
    label: 'Camioneta',
    pickupLabel: 'Tipo de camioneta',
    planLabel: 'Cobertura',
    note: 'Las camionetas pueden variar segun el modelo y la pauta de la compania.',
    pickupTypes: {
      general: {
        label: 'Camioneta fuera de pauta',
        summaryLabel: 'Camioneta fuera de pauta',
        note: 'Este valor corresponde a camionetas fuera de pauta.',
        plans: [
          {
            id: 'camioneta-sin-grua',
            label: 'Sin grua',
            price: 33311.33,
            detail: 'Valor fijo para camioneta fuera de pauta sin grua.'
          },
          {
            id: 'camioneta-con-grua',
            label: 'Con grua',
            price: 37484.7,
            detail: 'Valor fijo para camioneta fuera de pauta con grua.'
          }
        ]
      },
      'hilux-ranger': {
        label: 'Hilux / Ranger',
        summaryLabel: 'Camioneta Hilux / Ranger',
        note: 'Hilux y Ranger suelen manejar el mismo precio que auto.',
        plans: [
          {
            id: 'hilux-ranger-sin-grua',
            label: 'Sin grua',
            price: 30285.5,
            detail: 'Para Hilux o Ranger el valor sin grua se toma igual que auto.'
          },
          {
            id: 'hilux-ranger-con-grua',
            label: 'Con grua',
            price: 34458.88,
            detail: 'Para Hilux o Ranger el valor con grua se toma igual que auto.'
          }
        ]
      },
      amarok: {
        label: 'Amarok',
        summaryLabel: 'Camioneta Amarok',
        note: 'La Amarok no tiene un valor fijo cargado porque puede cambiar.',
        plans: [
          {
            id: 'amarok-consultar',
            label: 'Cotizacion a confirmar',
            price: null,
            detail: 'La Amarok cambia de precio y se confirma de forma manual.'
          }
        ]
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('seguro-cotizador-form');
  if (!form) return;

  const vehicleInputs = Array.from(form.querySelectorAll('input[name="insuranceVehicleType"]'));
  const nameInput = document.getElementById('seguro-name');
  const phoneInput = document.getElementById('seguro-phone');
  const vehicleModelInput = document.getElementById('seguro-vehicle-model');
  const pickupGroup = document.getElementById('seguro-pickup-group');
  const pickupSelect = document.getElementById('seguro-pickup-type');
  const planLabel = document.getElementById('seguro-plan-label');
  const planSelect = document.getElementById('seguro-plan');

  const resultAmount = document.getElementById('seguro-quote-amount');
  const resultMeta = document.getElementById('seguro-quote-meta');
  const resultNote = document.getElementById('seguro-quote-note');
  const rateList = document.getElementById('seguro-rate-list');
  const summaryType = document.getElementById('seguro-summary-type');
  const summaryPlan = document.getElementById('seguro-summary-plan');
  const summaryVehicle = document.getElementById('seguro-summary-vehicle');
  const summaryName = document.getElementById('seguro-summary-name');
  const summaryPhone = document.getElementById('seguro-summary-phone');

  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function formatPrice(value) {
    if (typeof value !== 'number') return 'A confirmar';
    return formatter.format(value);
  }

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

  function getActiveConfig() {
    const vehicleType = getVehicleType();
    const baseConfig = SEGURO_COTIZADOR_CONFIG[vehicleType];

    if (vehicleType !== 'camioneta') {
      return {
        vehicleType,
        summaryLabel: baseConfig.summaryLabel || baseConfig.label,
        planLabelText: baseConfig.planLabel,
        note: baseConfig.note,
        plans: baseConfig.plans
      };
    }

    const pickupType = pickupSelect.value || 'general';
    const pickupConfig = baseConfig.pickupTypes[pickupType] || baseConfig.pickupTypes.general;

    return {
      vehicleType,
      summaryLabel: pickupConfig.summaryLabel,
      planLabelText: baseConfig.planLabel,
      note: pickupConfig.note || baseConfig.note,
      plans: pickupConfig.plans
    };
  }

  function populatePlanOptions() {
    const vehicleType = getVehicleType();
    const baseConfig = SEGURO_COTIZADOR_CONFIG[vehicleType];

    if (vehicleType === 'camioneta') {
      pickupGroup.hidden = false;
    } else {
      pickupGroup.hidden = true;
    }

    const activeConfig = getActiveConfig();
    planLabel.textContent = activeConfig.planLabelText;

    const previousValue = planSelect.value;
    planSelect.innerHTML = activeConfig.plans
      .map(plan => `<option value="${plan.id}">${plan.label}</option>`)
      .join('');

    if (activeConfig.plans.some(plan => plan.id === previousValue)) {
      planSelect.value = previousValue;
    }

    if (!planSelect.value && activeConfig.plans[0]) {
      planSelect.value = activeConfig.plans[0].id;
    }

    if (vehicleType === 'camioneta' && !pickupSelect.value) {
      pickupSelect.value = 'general';
    }

    if (baseConfig.pickupLabel && vehicleType === 'camioneta') {
      const pickupLabel = form.querySelector('label[for="seguro-pickup-type"]');
      if (pickupLabel) pickupLabel.textContent = baseConfig.pickupLabel;
    }
  }

  function getSelectedPlan() {
    const activeConfig = getActiveConfig();
    return activeConfig.plans.find(plan => plan.id === planSelect.value) || activeConfig.plans[0];
  }

  function renderRateList(activeConfig, selectedPlan) {
    rateList.innerHTML = activeConfig.plans
      .map(plan => `
        <div${plan.id === selectedPlan.id ? ' class="is-active"' : ''}>
          <span>${plan.label}</span>
          <strong>${formatPrice(plan.price)}</strong>
        </div>
      `)
      .join('');
  }

  function updateSummary(activeConfig, selectedPlan) {
    summaryType.textContent = activeConfig.summaryLabel || '-';
    summaryPlan.textContent = selectedPlan.label || '-';
    summaryVehicle.textContent = vehicleModelInput.value.trim() || '-';
    summaryName.textContent = nameInput.value.trim() || '-';
    summaryPhone.textContent = phoneInput.value.trim() || '-';
  }

  function updateQuote() {
    const activeConfig = getActiveConfig();
    const selectedPlan = getSelectedPlan();

    resultAmount.textContent = formatPrice(selectedPlan.price);
    resultMeta.textContent = selectedPlan.detail;
    resultNote.textContent = activeConfig.note;

    renderRateList(activeConfig, selectedPlan);
    updateSummary(activeConfig, selectedPlan);
  }

  vehicleInputs.forEach(input => {
    input.addEventListener('change', () => {
      setActiveVehicleOption();
      populatePlanOptions();
      updateQuote();
    });
  });

  pickupSelect.addEventListener('change', () => {
    populatePlanOptions();
    updateQuote();
  });

  planSelect.addEventListener('change', updateQuote);
  nameInput.addEventListener('input', updateQuote);
  phoneInput.addEventListener('input', updateQuote);
  vehicleModelInput.addEventListener('input', updateQuote);

  form.addEventListener('submit', event => {
    event.preventDefault();
    updateQuote();
  });

  setActiveVehicleOption();
  populatePlanOptions();
  updateQuote();
});
