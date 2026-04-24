const TRANSFERENCIA_RESULT_STORAGE_KEY = 'transferenciaQuoteResult';

document.addEventListener('DOMContentLoaded', () => {
  const resultCopy = document.getElementById('transferencia-result-copy');
  const summaryType = document.getElementById('summary-type');
  const summaryMisiones = document.getElementById('summary-misiones');
  const summaryPrice = document.getElementById('summary-price');
  const summaryClientWhatsapp = document.getElementById('summary-client-whatsapp');
  const summaryAge = document.getElementById('summary-age');
  const summaryBuyerSignature = document.getElementById('summary-buyer-signature');
  const breakdown = document.getElementById('transferencia-breakdown');
  const breakdownServiceFee = document.getElementById('breakdown-service-fee');
  const breakdownRegistry = document.getElementById('breakdown-registry');
  const breakdownRegistryNote = document.getElementById('breakdown-registry-note');
  const breakdownStampedTotal = document.getElementById('breakdown-stamped-total');
  const breakdownStamps = document.getElementById('breakdown-stamps');
  const breakdownInterest = document.getElementById('breakdown-interest');
  const breakdownPenalty = document.getElementById('breakdown-penalty');
  const breakdownTotal = document.getElementById('breakdown-total');
  const disclaimer = document.getElementById('transferencia-disclaimer');
  const whatsappButton = document.getElementById('transferencia-whatsapp');
  const resetLink = document.getElementById('transferencia-reset-link');

  function setWhatsappState(enabled, href = '', label = 'Enviar cotizacion al cliente por WhatsApp') {
    whatsappButton.classList.toggle('is-disabled', !enabled);
    whatsappButton.setAttribute('aria-disabled', String(!enabled));
    whatsappButton.textContent = label;

    if (enabled) {
      whatsappButton.href = href;
    } else {
      whatsappButton.removeAttribute('href');
    }
  }

  function renderEmptyState() {
    resultCopy.textContent = 'No hay una cotizacion cargada en esta sesion.';
    summaryType.textContent = '-';
    summaryMisiones.textContent = '-';
    summaryPrice.textContent = '-';
    if (summaryClientWhatsapp) summaryClientWhatsapp.textContent = '-';
    summaryAge.textContent = '-';
    summaryBuyerSignature.textContent = '-';
    breakdown.hidden = true;
    disclaimer.textContent = 'Volve al formulario para hacer otra cotizacion.';
    setWhatsappState(false);
  }

  function renderQuote(payload) {
    resultCopy.textContent = payload.resultCopy || 'Revisa el detalle de la cotizacion.';
    summaryType.textContent = payload.typeLabel || '-';
    summaryMisiones.textContent = payload.misionesLabel || '-';
    summaryPrice.textContent = payload.priceFormatted || '-';
    if (summaryClientWhatsapp) summaryClientWhatsapp.textContent = payload.clientWhatsapp || '-';
    summaryAge.textContent = payload.ageLabel || '-';
    summaryBuyerSignature.textContent = payload.buyerSignatureLabel || '-';
    disclaimer.textContent = payload.disclaimer || '';

    if (payload.includeBreakdown) {
      breakdown.hidden = false;
      breakdownServiceFee.textContent = payload.serviceFeeFormatted || '-';
      breakdownRegistry.textContent = payload.registryAmountFormatted || '-';
      breakdownRegistryNote.textContent = payload.registryNote || '-';
      breakdownStampedTotal.textContent = payload.stampedTotalFormatted || '-';
      breakdownStamps.textContent = payload.stampsFormatted || '-';
      breakdownInterest.textContent = payload.interestFormatted || '-';
      breakdownPenalty.textContent = payload.penaltyFormatted || '-';
      breakdownTotal.textContent = payload.totalFormatted || '-';
    } else {
      breakdown.hidden = true;
    }

    setWhatsappState(true, payload.whatsappHref || '', payload.whatsappLabel || 'Enviar cotizacion al cliente por WhatsApp');
  }

  if (resetLink) {
    resetLink.addEventListener('click', () => {
      window.sessionStorage.removeItem(TRANSFERENCIA_RESULT_STORAGE_KEY);
    });
  }

  const rawPayload = window.sessionStorage.getItem(TRANSFERENCIA_RESULT_STORAGE_KEY);
  if (!rawPayload) {
    renderEmptyState();
    return;
  }

  try {
    const payload = JSON.parse(rawPayload);
    renderQuote(payload);
  } catch (error) {
    renderEmptyState();
  }
});
