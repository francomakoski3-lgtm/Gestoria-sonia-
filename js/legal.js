document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('withdrawal-form');
  if (!form) return;

  const statusBox = document.getElementById('withdrawal-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const contractDateInput = document.getElementById('withdrawal-contract-date');
  const today = new Date();
  const todayIso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');

  if (contractDateInput) {
    contractDateInput.max = todayIso;
  }

  let isSubmitting = false;
  const defaultLabel = submitButton ? submitButton.textContent.trim() : 'Enviar solicitud';

  function setSubmittingState(nextState) {
    isSubmitting = nextState;
    if (!submitButton) return;
    submitButton.disabled = nextState;
    submitButton.textContent = nextState ? 'Enviando solicitud' : defaultLabel;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderStatus(kind, html) {
    if (!statusBox) return;
    statusBox.className = `legal-status is-visible is-${kind}`;
    statusBox.innerHTML = html;
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const payload = {
      fullName: formData.get('fullName'),
      contactEmail: formData.get('contactEmail'),
      contactPhone: formData.get('contactPhone'),
      serviceName: formData.get('serviceName'),
      contractDate: formData.get('contractDate'),
      details: formData.get('details'),
      acceptedPrivacy: formData.get('acceptedPrivacy') === 'on',
      originChannel: 'web',
      pageUrl: window.location.href
    };

    setSubmittingState(true);

    try {
      const response = await fetch('/api/consumer/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo registrar la solicitud.');
      }

      const code = escapeHtml(data.request?.code || 'ARREP');
      const serviceName = escapeHtml(data.request?.serviceName || payload.serviceName);

      renderStatus(
        'success',
        `
          <h3>Solicitud registrada</h3>
          <p>Tu pedido de arrepentimiento o revocacion ya fue recibido para <strong>${serviceName}</strong>.</p>
          <div class="legal-code">${code}</div>
          <p>Conserva este codigo. Si necesitas seguimiento, podes escribir por WhatsApp o correo electronico indicando este numero.</p>
        `
      );

      form.reset();
      if (contractDateInput) {
        contractDateInput.max = todayIso;
      }
    } catch (error) {
      renderStatus(
        'error',
        `
          <h3>No se pudo enviar la solicitud</h3>
          <p>${escapeHtml(error.message || 'Ocurrio un error inesperado.')}</p>
        `
      );
    } finally {
      setSubmittingState(false);
    }
  });
});
