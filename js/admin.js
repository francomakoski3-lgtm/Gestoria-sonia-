const state = {
  user: null,
  autos: [],
  properties: [],
  services: [],
  autoMedia: { cover: null, gallery: [] },
  propertyMedia: { cover: null, gallery: [] }
};

const elements = {};
const CUSTOM_OPTION = '__custom__';
// Ordered using 2025 Argentina brand-sales leadership and common local model visibility.
const AUTO_BRAND_CATALOG = [
  {
    brand: 'Toyota',
    models: ['Hilux', 'Yaris', 'Corolla Cross', 'Corolla', 'SW4']
  },
  {
    brand: 'Volkswagen',
    models: ['Amarok', 'Polo', 'Taos', 'Nivus', 'T-Cross']
  },
  {
    brand: 'Fiat',
    models: ['Cronos', 'Strada', 'Toro', 'Pulse', 'Fastback']
  },
  {
    brand: 'Renault',
    models: ['Kwid', 'Kardian', 'Sandero', 'Duster', 'Kangoo']
  },
  {
    brand: 'Peugeot',
    models: ['208', '2008', 'Partner', '408', '3008']
  }
];

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  initAutoCatalogControls();
  bindEvents();
  restoreSession();
  initRendimientoTab();
  initInfoTabControls();
  initContactRecipientControls();
});

function cacheElements() {
  elements.loginView = document.getElementById('login-view');
  elements.dashboardView = document.getElementById('dashboard-view');
  elements.loginForm = document.getElementById('login-form');
  elements.logoutButton = document.getElementById('logout-button');
  elements.currentUser = document.getElementById('current-user');
  elements.userDropdown = document.getElementById('user-dropdown');
  elements.openPasswordPanelButton = document.getElementById('open-password-panel');
  elements.toast = document.getElementById('toast');

  elements.statsAutos = document.getElementById('stats-autos');
  elements.statsInmuebles = document.getElementById('stats-inmuebles');
  elements.statsDestacados = document.getElementById('stats-destacados');

  elements.autoForm = document.getElementById('auto-form');
  elements.autoFormTitle = document.getElementById('auto-form-title');
  elements.autoList = document.getElementById('autos-list');
  elements.autoResetButton = document.getElementById('auto-reset-button');
  elements.autoNewButton = document.getElementById('auto-new-button');
  elements.autoCoverInput = document.getElementById('auto-cover-input');
  elements.autoGalleryInput = document.getElementById('auto-gallery-input');
  elements.autoCoverPreview = document.getElementById('auto-cover-preview');
  elements.autoGalleryPreview = document.getElementById('auto-gallery-preview');
  elements.autoClearCover = document.getElementById('auto-clear-cover');
  elements.autoBrandSelect = document.getElementById('auto-brand-select');
  elements.autoModelSelect = document.getElementById('auto-model-select');
  elements.autoColorSelect = document.getElementById('auto-color-select');
  elements.autoBrandCustomWrap = document.getElementById('auto-brand-custom-wrap');
  elements.autoModelCustomWrap = document.getElementById('auto-model-custom-wrap');
  elements.autoColorCustomWrap = document.getElementById('auto-color-custom-wrap');

  elements.propertyForm = document.getElementById('property-form');
  elements.propertyFormTitle = document.getElementById('property-form-title');
  elements.propertyList = document.getElementById('properties-list');
  elements.propertyResetButton = document.getElementById('property-reset-button');
  elements.propertyNewButton = document.getElementById('property-new-button');
  elements.propertyCoverInput = document.getElementById('property-cover-input');
  elements.propertyGalleryInput = document.getElementById('property-gallery-input');
  elements.propertyCoverPreview = document.getElementById('property-cover-preview');
  elements.propertyGalleryPreview = document.getElementById('property-gallery-preview');
  elements.propertyClearCover = document.getElementById('property-clear-cover');

  elements.serviceSettingsList = document.getElementById('service-settings-list');
  elements.serviceSettingsStatus = document.getElementById('service-settings-status');

  elements.passwordForm = document.getElementById('password-form');
  elements.tabButtons = Array.from(document.querySelectorAll('[data-tab-target]'));
  elements.tabPanels = Array.from(document.querySelectorAll('[data-tab-panel]'));
}

function initAutoCatalogControls() {
  elements.autoBrandSelect.innerHTML = [
    '<option value="">Seleccionar marca</option>',
    ...AUTO_BRAND_CATALOG.map(item => `<option value="${item.brand}">${item.brand}</option>`),
    `<option value="${CUSTOM_OPTION}">Completar manualmente</option>`
  ].join('');

  syncAutoBrandFields();
  syncAutoColorField();
}

function bindEvents() {
  elements.loginForm.addEventListener('submit', onLoginSubmit);
  elements.logoutButton.addEventListener('click', onLogoutClick);
  elements.currentUser.addEventListener('click', onUserMenuToggle);
  elements.openPasswordPanelButton.addEventListener('click', onOpenPasswordPanel);
  document.addEventListener('click', onDocumentClick);
  elements.autoForm.addEventListener('submit', onAutoSubmit);
  elements.propertyForm.addEventListener('submit', onPropertySubmit);
  elements.passwordForm.addEventListener('submit', onPasswordSubmit);

  elements.autoResetButton.addEventListener('click', resetAutoForm);
  elements.autoNewButton.addEventListener('click', () => activateTab('autos', true));
  elements.propertyResetButton.addEventListener('click', resetPropertyForm);
  elements.propertyNewButton.addEventListener('click', () => activateTab('inmuebles', true));

  elements.autoCoverInput.addEventListener('change', event => onCoverSelected(event, 'auto'));
  elements.autoGalleryInput.addEventListener('change', event => onGallerySelected(event, 'auto'));
  elements.propertyCoverInput.addEventListener('change', event => onCoverSelected(event, 'property'));
  elements.propertyGalleryInput.addEventListener('change', event => onGallerySelected(event, 'property'));

  elements.autoClearCover.addEventListener('click', () => {
    state.autoMedia.cover = null;
    renderMediaPreviews('auto');
  });
  elements.propertyClearCover.addEventListener('click', () => {
    state.propertyMedia.cover = null;
    renderMediaPreviews('property');
  });

  elements.autoCoverPreview.addEventListener('click', onPreviewAction);
  elements.autoGalleryPreview.addEventListener('click', onPreviewAction);
  elements.propertyCoverPreview.addEventListener('click', onPreviewAction);
  elements.propertyGalleryPreview.addEventListener('click', onPreviewAction);

  elements.autoList.addEventListener('click', onAutoListAction);
  elements.propertyList.addEventListener('click', onPropertyListAction);
  elements.serviceSettingsList?.addEventListener('change', onServiceSettingsChange);

  elements.tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      closeUserMenu();
      activateTab(button.dataset.tabTarget);
    });
  });

  elements.autoBrandSelect.addEventListener('change', () => syncAutoBrandFields(true));
  elements.autoModelSelect.addEventListener('change', () => syncAutoModelField(true));
  elements.autoColorSelect.addEventListener('change', () => syncAutoColorField(true));
}

function syncAutoBrandFields(resetModelSelection = false) {
  const form = elements.autoForm;
  const brandCustomInput = field(form, 'brandCustom');
  const nextModelValue = resetModelSelection ? '' : resolvePendingModelValue();
  const isCustomBrand = elements.autoBrandSelect.value === CUSTOM_OPTION;

  setInlineFieldVisibility(elements.autoBrandCustomWrap, brandCustomInput, isCustomBrand, resetModelSelection);
  brandCustomInput.required = isCustomBrand;
  if (!isCustomBrand) {
    brandCustomInput.value = '';
  }

  populateAutoModelSelect(elements.autoBrandSelect.value, nextModelValue);
  syncAutoModelField();
}

function populateAutoModelSelect(brandValue, selectedModel = '') {
  const modelSelect = elements.autoModelSelect;
  const modelCustomInput = field(elements.autoForm, 'modelCustom');

  if (!brandValue) {
    modelSelect.innerHTML = '<option value="">Seleccionar modelo</option>';
    modelSelect.value = '';
    modelSelect.disabled = true;
    modelCustomInput.value = '';
    return;
  }

  if (brandValue === CUSTOM_OPTION) {
    modelSelect.innerHTML = `<option value="${CUSTOM_OPTION}">Completar manualmente</option>`;
    modelSelect.value = CUSTOM_OPTION;
    modelSelect.disabled = false;
    modelCustomInput.value = selectedModel || '';
    return;
  }

  const brandEntry = AUTO_BRAND_CATALOG.find(item => item.brand === brandValue);
  const options = [
    '<option value="">Seleccionar modelo</option>',
    ...(brandEntry ? brandEntry.models.map(model => `<option value="${model}">${model}</option>`) : []),
    `<option value="${CUSTOM_OPTION}">Completar manualmente</option>`
  ];

  modelSelect.innerHTML = options.join('');
  modelSelect.disabled = false;

  if (selectedModel && brandEntry && brandEntry.models.includes(selectedModel)) {
    modelSelect.value = selectedModel;
    modelCustomInput.value = '';
    return;
  }

  if (selectedModel) {
    modelSelect.value = CUSTOM_OPTION;
    modelCustomInput.value = selectedModel;
    return;
  }

  modelSelect.value = '';
  modelCustomInput.value = '';
}

function syncAutoModelField(shouldFocus = false) {
  const modelCustomInput = field(elements.autoForm, 'modelCustom');
  const isCustomModel = elements.autoModelSelect.value === CUSTOM_OPTION;

  setInlineFieldVisibility(elements.autoModelCustomWrap, modelCustomInput, isCustomModel, shouldFocus);
  if (!isCustomModel) {
    modelCustomInput.value = '';
  }
}

function syncAutoColorField(shouldFocus = false) {
  const colorCustomInput = field(elements.autoForm, 'colorCustom');
  const isCustomColor = elements.autoColorSelect.value === 'Otro';

  setInlineFieldVisibility(elements.autoColorCustomWrap, colorCustomInput, isCustomColor, shouldFocus);
  if (!isCustomColor) {
    colorCustomInput.value = '';
  }
}

function setAutoBrandModelFields(brand, model) {
  const form = elements.autoForm;
  const brandCustomInput = field(form, 'brandCustom');

  if (AUTO_BRAND_CATALOG.some(item => item.brand === brand)) {
    elements.autoBrandSelect.value = brand;
    brandCustomInput.value = '';
    setInlineFieldVisibility(elements.autoBrandCustomWrap, brandCustomInput, false);
    populateAutoModelSelect(brand, model);
  } else if (brand) {
    elements.autoBrandSelect.value = CUSTOM_OPTION;
    brandCustomInput.value = brand;
    setInlineFieldVisibility(elements.autoBrandCustomWrap, brandCustomInput, true);
    populateAutoModelSelect(CUSTOM_OPTION, model);
  } else {
    elements.autoBrandSelect.value = '';
    brandCustomInput.value = '';
    populateAutoModelSelect('', '');
  }

  syncAutoModelField();
}

function setAutoColorField(color) {
  const colorCustomInput = field(elements.autoForm, 'colorCustom');
  const presetColors = Array.from(elements.autoColorSelect.options).map(option => option.value);

  if (color && presetColors.includes(color) && color !== 'Otro') {
    elements.autoColorSelect.value = color;
    colorCustomInput.value = '';
  } else if (color) {
    elements.autoColorSelect.value = 'Otro';
    colorCustomInput.value = color;
  } else {
    elements.autoColorSelect.value = '';
    colorCustomInput.value = '';
  }

  syncAutoColorField();
}

function resolvePendingModelValue() {
  if (elements.autoModelSelect.value && elements.autoModelSelect.value !== CUSTOM_OPTION) {
    return elements.autoModelSelect.value;
  }

  return field(elements.autoForm, 'modelCustom').value.trim();
}

function resolveAutoBrandValue() {
  return elements.autoBrandSelect.value === CUSTOM_OPTION
    ? field(elements.autoForm, 'brandCustom').value.trim()
    : elements.autoBrandSelect.value.trim();
}

function resolveAutoModelValue() {
  return elements.autoModelSelect.value === CUSTOM_OPTION
    ? field(elements.autoForm, 'modelCustom').value.trim()
    : elements.autoModelSelect.value.trim();
}

function resolveAutoColorValue() {
  return elements.autoColorSelect.value === 'Otro'
    ? field(elements.autoForm, 'colorCustom').value.trim()
    : elements.autoColorSelect.value.trim();
}

async function restoreSession() {
  try {
    const response = await api('/api/auth/me');
    if (!response.authenticated) {
      showLogin();
      return;
    }

    state.user = response.user;
    showDashboard();
    await refreshData();
  } catch (error) {
    console.error(error);
    showLogin();
  }
}

function showLogin() {
  elements.loginView.hidden = false;
  elements.dashboardView.hidden = true;
}

function showDashboard() {
  elements.loginView.hidden = true;
  elements.dashboardView.hidden = false;
  elements.currentUser.textContent = state.user ? state.user.username : '';
}

async function refreshData() {
  const [stats, autosResponse, propertiesResponse, servicesResponse] = await Promise.all([
    api('/api/admin/dashboard'),
    api('/api/autos'),
    api('/api/inmuebles'),
    api('/api/admin/services')
  ]);

  state.autos = autosResponse.items || [];
  state.properties = propertiesResponse.items || [];
  state.services = servicesResponse.items || [];

  elements.statsAutos.textContent = stats.autos;
  elements.statsInmuebles.textContent = stats.inmuebles;
  elements.statsDestacados.textContent = stats.destacados;

  renderAutoList();
  renderPropertyList();
  renderServiceSettings();
  resetAutoForm();
  resetPropertyForm();
  loadRecipients();
  loadContactRecipients();
}

async function onLoginSubmit(event) {
  event.preventDefault();

  const payload = {
    username: field(elements.loginForm, 'username').value.trim(),
    password: field(elements.loginForm, 'password').value
  };

  try {
    const response = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    state.user = response.user;
    elements.loginForm.reset();
    showDashboard();
    await refreshData();
    showToast('Sesion iniciada correctamente.');
  } catch (error) {
    showToast(error.message, true);
  }
}

async function onLogoutClick() {
  try {
    closeUserMenu();
    await api('/api/auth/logout', { method: 'POST' });
  } finally {
    state.user = null;
    showLogin();
  }
}

async function onAutoSubmit(event) {
  event.preventDefault();
  const form = elements.autoForm;
  const id = field(form, 'id').value;
  const payload = collectAutoPayload();

  try {
    await api(id ? `/api/autos/${id}` : '/api/autos', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });

    await refreshData();
    activateTab('autos');
    showToast(id ? 'Auto actualizado.' : 'Auto creado.');
  } catch (error) {
    showToast(error.message, true);
  }
}

async function onPropertySubmit(event) {
  event.preventDefault();
  const form = elements.propertyForm;
  const id = field(form, 'id').value;
  const payload = collectPropertyPayload();

  try {
    await api(id ? `/api/inmuebles/${id}` : '/api/inmuebles', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });

    await refreshData();
    activateTab('inmuebles');
    showToast(id ? 'Inmueble actualizado.' : 'Inmueble creado.');
  } catch (error) {
    showToast(error.message, true);
  }
}

function onUserMenuToggle(event) {
  event.stopPropagation();
  const isOpen = !elements.userDropdown.hidden;
  setUserMenuOpen(!isOpen);
}

function onOpenPasswordPanel(event) {
  event.stopPropagation();
  closeUserMenu();
  activateTab('cuenta');
}

function onDocumentClick(event) {
  const menu = elements.userDropdown;
  const button = elements.currentUser;
  if (!menu || menu.hidden) return;
  if (menu.contains(event.target) || button.contains(event.target)) return;
  closeUserMenu();
}

function setUserMenuOpen(open) {
  elements.userDropdown.hidden = !open;
  elements.currentUser.setAttribute('aria-expanded', String(open));
}

function closeUserMenu() {
  if (!elements.userDropdown) return;
  setUserMenuOpen(false);
}

async function onPasswordSubmit(event) {
  event.preventDefault();

  const payload = {
    currentPassword: field(elements.passwordForm, 'currentPassword').value,
    nextPassword: field(elements.passwordForm, 'nextPassword').value
  };

  try {
    await api('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    elements.passwordForm.reset();
    showToast('Contrasena actualizada.');
  } catch (error) {
    showToast(error.message, true);
  }
}

function collectAutoPayload() {
  const form = elements.autoForm;
  return {
    title: field(form, 'title').value.trim(),
    price: field(form, 'price').value.trim(),
    brand: resolveAutoBrandValue(),
    model: resolveAutoModelValue(),
    version: field(form, 'version').value.trim(),
    currency: field(form, 'currency').value.trim(),
    year: field(form, 'year').value.trim(),
    km: field(form, 'km').value.trim(),
    vehicleType: field(form, 'vehicleType').value.trim(),
    status: field(form, 'status').value.trim(),
    fuel: field(form, 'fuel').value.trim(),
    transmission: field(form, 'transmission').value.trim(),
    color: resolveAutoColorValue(),
    doors: field(form, 'doors').value.trim(),
    engine: field(form, 'engine').value.trim(),
    steering: field(form, 'steering').value.trim(),
    traction: field(form, 'traction').value.trim(),
    cabin: field(form, 'cabin').value.trim(),
    location: field(form, 'location').value.trim(),
    description: field(form, 'description').value.trim(),
    highlights: textAreaLines(field(form, 'highlights').value),
    featured: field(form, 'featured').checked,
    coverImage: state.autoMedia.cover,
    galleryImages: state.autoMedia.gallery
  };
}

function collectPropertyPayload() {
  const form = elements.propertyForm;
  return {
    title: field(form, 'title').value.trim(),
    price: field(form, 'price').value.trim(),
    currency: field(form, 'currency').value.trim(),
    operation: field(form, 'operation').value.trim(),
    status: field(form, 'status').value.trim(),
    propertyType: field(form, 'propertyType').value.trim(),
    location: field(form, 'location').value.trim(),
    bedrooms: field(form, 'bedrooms').value.trim(),
    bathrooms: field(form, 'bathrooms').value.trim(),
    areaM2: field(form, 'areaM2').value.trim(),
    landAreaM2: field(form, 'landAreaM2').value.trim(),
    dimensions: field(form, 'dimensions').value.trim(),
    access: field(form, 'access').value.trim(),
    infrastructure: field(form, 'infrastructure').value.trim(),
    mapUrl: field(form, 'mapUrl').value.trim(),
    description: field(form, 'description').value.trim(),
    highlights: textAreaLines(field(form, 'highlights').value),
    corner: field(form, 'corner').checked,
    featured: field(form, 'featured').checked,
    coverImage: state.propertyMedia.cover,
    galleryImages: state.propertyMedia.gallery
  };
}

async function onCoverSelected(event, type) {
  const [file] = Array.from(event.target.files || []);
  if (!file) return;
  const upload = await fileToUpload(file);
  getMediaState(type).cover = upload;
  renderMediaPreviews(type);
  event.target.value = '';
}

async function onGallerySelected(event, type) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const uploads = await Promise.all(files.map(fileToUpload));
  getMediaState(type).gallery.push(...uploads);
  renderMediaPreviews(type);
  event.target.value = '';
}

function onPreviewAction(event) {
  const button = event.target.closest('[data-remove-media]');
  if (!button) return;
  const type = button.dataset.type;
  const media = button.dataset.media;
  const index = Number.parseInt(button.dataset.index || '', 10);
  const stateRef = getMediaState(type);

  if (media === 'cover') {
    stateRef.cover = null;
  } else if (Number.isInteger(index)) {
    stateRef.gallery.splice(index, 1);
  }

  renderMediaPreviews(type);
}

function onAutoListAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const autoId = Number.parseInt(button.dataset.id, 10);
  const auto = state.autos.find(item => item.id === autoId);
  if (!auto) return;

  if (button.dataset.action === 'edit') {
    fillAutoForm(auto);
    activateTab('autos');
    return;
  }

  if (button.dataset.action === 'delete') {
    confirmDelete(`/api/autos/${autoId}`, `Se elimino "${auto.title}".`);
  }
}

function onPropertyListAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const propertyId = Number.parseInt(button.dataset.id, 10);
  const property = state.properties.find(item => item.id === propertyId);
  if (!property) return;

  if (button.dataset.action === 'edit') {
    fillPropertyForm(property);
    activateTab('inmuebles');
    return;
  }

  if (button.dataset.action === 'delete') {
    confirmDelete(`/api/inmuebles/${propertyId}`, `Se elimino "${property.title}".`);
  }
}

async function confirmDelete(url, successMessage) {
  if (!window.confirm('Esta accion eliminara la publicacion. Deseas continuar?')) {
    return;
  }

  try {
    await api(url, { method: 'DELETE' });
    await refreshData();
    showToast(successMessage);
  } catch (error) {
    showToast(error.message, true);
  }
}

function fillAutoForm(auto) {
  const form = elements.autoForm;
  field(form, 'id').value = auto.id;
  field(form, 'title').value = auto.title || '';
  field(form, 'price').value = auto.price || '';
  field(form, 'version').value = auto.version || '';
  field(form, 'currency').value = auto.currency || 'ARS';
  field(form, 'year').value = auto.year || '';
  field(form, 'km').value = auto.km || '';
  field(form, 'vehicleType').value = auto.vehicleType || '';
  field(form, 'status').value = auto.status || 'venta';
  field(form, 'fuel').value = auto.fuel || '';
  field(form, 'transmission').value = auto.transmission || '';
  field(form, 'doors').value = auto.doors || '';
  field(form, 'engine').value = auto.engine || '';
  field(form, 'steering').value = auto.steering || '';
  field(form, 'traction').value = auto.traction || '';
  field(form, 'cabin').value = auto.cabin || '';
  field(form, 'location').value = auto.location || '';
  field(form, 'description').value = auto.description || '';
  field(form, 'highlights').value = (auto.highlights || []).join('\n');
  field(form, 'featured').checked = Boolean(auto.featured);
  setAutoBrandModelFields(auto.brand || '', auto.model || '');
  setAutoColorField(auto.color || '');
  state.autoMedia.cover = mediaFromUrl(auto.coverImage);
  state.autoMedia.gallery = (auto.galleryImages || []).map(mediaFromUrl);
  elements.autoFormTitle.textContent = `Editar auto #${auto.id}`;
  renderMediaPreviews('auto');
}

function fillPropertyForm(property) {
  const form = elements.propertyForm;
  field(form, 'id').value = property.id;
  field(form, 'title').value = property.title || '';
  field(form, 'price').value = property.price || '';
  field(form, 'currency').value = property.currency || 'USD';
  field(form, 'operation').value = property.operation || 'venta';
  field(form, 'status').value = property.status || 'venta';
  field(form, 'propertyType').value = property.propertyType || '';
  field(form, 'location').value = property.location || '';
  field(form, 'bedrooms').value = property.bedrooms || '';
  field(form, 'bathrooms').value = property.bathrooms || '';
  field(form, 'areaM2').value = property.areaM2 || '';
  field(form, 'landAreaM2').value = property.landAreaM2 || '';
  field(form, 'dimensions').value = property.dimensions || '';
  field(form, 'access').value = property.access || '';
  field(form, 'infrastructure').value = property.infrastructure || '';
  field(form, 'mapUrl').value = property.mapUrl || '';
  field(form, 'description').value = property.description || '';
  field(form, 'highlights').value = (property.highlights || []).join('\n');
  field(form, 'corner').checked = Boolean(property.corner);
  field(form, 'featured').checked = Boolean(property.featured);
  state.propertyMedia.cover = mediaFromUrl(property.coverImage);
  state.propertyMedia.gallery = (property.galleryImages || []).map(mediaFromUrl);
  elements.propertyFormTitle.textContent = `Editar inmueble #${property.id}`;
  renderMediaPreviews('property');
}

function resetAutoForm() {
  elements.autoForm.reset();
  field(elements.autoForm, 'currency').value = 'ARS';
  field(elements.autoForm, 'status').value = 'venta';
  field(elements.autoForm, 'id').value = '';
  field(elements.autoForm, 'fuel').value = '';
  field(elements.autoForm, 'transmission').value = '';
  field(elements.autoForm, 'traction').value = '';
  elements.autoFormTitle.textContent = 'Nuevo auto';
  state.autoMedia = { cover: null, gallery: [] };
  field(elements.autoForm, 'brandCustom').value = '';
  field(elements.autoForm, 'modelCustom').value = '';
  field(elements.autoForm, 'colorCustom').value = '';
  elements.autoBrandSelect.value = '';
  syncAutoBrandFields();
  elements.autoColorSelect.value = '';
  syncAutoColorField();
  renderMediaPreviews('auto');
}

function resetPropertyForm() {
  elements.propertyForm.reset();
  field(elements.propertyForm, 'currency').value = 'USD';
  field(elements.propertyForm, 'operation').value = 'venta';
  field(elements.propertyForm, 'status').value = 'venta';
  field(elements.propertyForm, 'id').value = '';
  elements.propertyFormTitle.textContent = 'Nuevo inmueble';
  state.propertyMedia = { cover: null, gallery: [] };
  renderMediaPreviews('property');
}

function renderAutoList() {
  elements.autoList.innerHTML = state.autos.length
    ? state.autos.map(renderAutoCard).join('')
    : '<p class="empty-state">No hay autos cargados todavia.</p>';
}

function renderPropertyList() {
  elements.propertyList.innerHTML = state.properties.length
    ? state.properties.map(renderPropertyCard).join('')
    : '<p class="empty-state">No hay inmuebles cargados todavia.</p>';
}

function renderServiceSettings() {
  if (!elements.serviceSettingsList) return;

  const groups = [
    { id: 'automotor', title: 'Gestoria del automotor' },
    { id: 'inmobiliaria', title: 'Gestoria inmobiliaria' },
    { id: 'paginas', title: 'Paginas principales' }
  ];

  const enabledCount = state.services.filter(service => service.enabled).length;
  if (elements.serviceSettingsStatus) {
    elements.serviceSettingsStatus.innerHTML = `
      <span class="recipients-badge recipients-badge--ok">${enabledCount} visible${enabledCount !== 1 ? 's' : ''}</span>
      <span class="services-admin-note">Los cambios se aplican en la web al recargar la pagina.</span>
    `;
  }

  elements.serviceSettingsList.innerHTML = groups.map(group => {
    const services = state.services.filter(service => service.category === group.id);
    const rows = services.length
      ? services.map(renderServiceSettingRow).join('')
      : '<p class="recipients-empty">No hay servicios cargados en esta categoria.</p>';

    return `
      <section class="services-admin-group">
        <div class="services-admin-group-head">
          <h3>${escapeHtml(group.title)}</h3>
          <span>${services.length} servicio${services.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="services-admin-rows">
          ${rows}
        </div>
      </section>
    `;
  }).join('');
}

function renderServiceSettingRow(service) {
  const status = service.enabled ? 'Visible en la web' : 'Oculto en la web';

  return `
    <label class="service-toggle-row">
      <span class="service-toggle-copy">
        <strong>${escapeHtml(service.title)}</strong>
        <small>${status}</small>
      </span>
      <input type="checkbox" data-service-toggle data-service-id="${escapeHtml(service.id)}" ${service.enabled ? 'checked' : ''}>
      <span class="service-switch" aria-hidden="true"></span>
    </label>
  `;
}

async function onServiceSettingsChange(event) {
  const input = event.target.closest('[data-service-toggle]');
  if (!input) return;

  const previousChecked = !input.checked;
  const serviceId = input.dataset.serviceId;
  const current = state.services.find(service => service.id === serviceId);
  if (current) current.enabled = input.checked;
  input.disabled = true;
  renderServiceSettings();

  try {
    const response = await api('/api/admin/services', {
      method: 'PUT',
      body: JSON.stringify({
        items: [
          {
            id: serviceId,
            enabled: Boolean(current?.enabled)
          }
        ]
      })
    });

    state.services = response.items || [];
    renderServiceSettings();
    showToast('Servicios actualizados.');
  } catch (error) {
    if (current) current.enabled = previousChecked;
    renderServiceSettings();
    showToast(error.message, true);
  }
}

function renderAutoCard(auto) {
  return renderRecordCard({
    id: auto.id,
    cover: auto.coverImage,
    title: auto.title,
    meta: [auto.price, auto.year, auto.vehicleType, auto.location].filter(Boolean).join(' · '),
    badges: [auto.status, auto.featured ? 'destacado' : ''].filter(Boolean)
  });
}

function renderPropertyCard(property) {
  return renderRecordCard({
    id: property.id,
    cover: property.coverImage,
    title: property.title,
    meta: [property.price, property.operation, property.propertyType, property.location]
      .filter(Boolean)
      .join(' · '),
    badges: [property.status, property.corner ? 'esquina' : '', property.featured ? 'destacado' : '']
      .filter(Boolean)
  });
}

function renderRecordCard({ id, cover, title, meta, badges }) {
  return `
    <article class="record-item">
      <img class="record-cover" src="${escapeHtml(cover || 'img/services/autos-cover.jpg')}" alt="${escapeHtml(title)}">
      <div class="record-body">
        <h3>${escapeHtml(title)}</h3>
        <p class="record-meta">${escapeHtml(meta)}</p>
        <div class="record-badges">
          ${badges.map(badge => `<span class="badge ${badge === 'destacado' ? 'badge-green' : 'badge-accent'}">${escapeHtml(badge)}</span>`).join('')}
        </div>
        <div class="record-actions">
          <button type="button" class="btn btn-secondary" data-action="edit" data-id="${id}">Editar</button>
          <button type="button" class="btn btn-ghost" data-action="delete" data-id="${id}">Eliminar</button>
        </div>
      </div>
    </article>
  `;
}

function renderMediaPreviews(type) {
  const media = getMediaState(type);
  const coverPreview = type === 'auto' ? elements.autoCoverPreview : elements.propertyCoverPreview;
  const galleryPreview = type === 'auto' ? elements.autoGalleryPreview : elements.propertyGalleryPreview;

  coverPreview.innerHTML = media.cover
    ? renderPreviewItem(media.cover, type, 'cover')
    : '<div class="empty-state">Sin portada.</div>';

  galleryPreview.innerHTML = media.gallery.length
    ? media.gallery.map((item, index) => renderPreviewItem(item, type, 'gallery', index)).join('')
    : '<div class="empty-state">Sin imagenes cargadas.</div>';
}

function renderPreviewItem(item, type, media, index = '') {
  return `
    <div class="preview-item">
      <img src="${escapeHtml(item.url || item.dataUrl)}" alt="Vista previa">
      <button type="button" data-remove-media="true" data-type="${type}" data-media="${media}" data-index="${index}">×</button>
    </div>
  `;
}

function activateTab(tabName, reset = false) {
  elements.tabButtons.forEach(button => {
    button.classList.toggle('is-active', button.dataset.tabTarget === tabName);
  });
  elements.tabPanels.forEach(panel => {
    panel.classList.toggle('is-active', panel.dataset.tabPanel === tabName);
  });

  document.body.classList.toggle('cp-mode', tabName === 'rendimiento');

  if (reset && tabName === 'autos') resetAutoForm();
  if (reset && tabName === 'inmuebles') resetPropertyForm();
}

function getMediaState(type) {
  return type === 'auto' ? state.autoMedia : state.propertyMedia;
}

function setInlineFieldVisibility(wrapper, input, visible, shouldFocus = false) {
  wrapper.classList.toggle('is-visible', visible);
  wrapper.setAttribute('aria-hidden', String(!visible));
  input.tabIndex = visible ? 0 : -1;
  if (visible && shouldFocus) {
    window.requestAnimationFrame(() => input.focus());
  }
}

function field(form, name) {
  return form.elements.namedItem(name);
}

function mediaFromUrl(url) {
  return url ? { kind: 'existing', url } : null;
}

function textAreaLines(value) {
  return value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fileToUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ kind: 'upload', name: file.name, dataUrl: reader.result });
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
    reader.readAsDataURL(file);
  });
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'same-origin',
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      state.user = null;
      showLogin();
    }
    throw new Error(payload.error || 'No se pudo completar la accion.');
  }

  return payload;
}

function showToast(message, isError = false) {
  elements.toast.hidden = false;
  elements.toast.className = `toast${isError ? ' error' : ''}`;
  elements.toast.textContent = message;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 3600);
}

// ── Analytics / Rendimiento ────────────────────────────────
let analyticsLoaded = false;
let geoMap = null;
let heatLayer = null;

function initRendimientoTab() {
  const rendimientoBtn = document.querySelector('[data-tab-target="rendimiento"]');
  if (!rendimientoBtn) return;
  rendimientoBtn.addEventListener('click', () => {
    if (!analyticsLoaded) loadAnalytics();
    // Leaflet necesita que el contenedor sea visible antes de invalidar tamaño
    setTimeout(() => geoMap?.invalidateSize(), 50);
  });
}

async function loadAnalytics() {
  try {
    const [data, geoData] = await Promise.all([
      api('/api/admin/analytics'),
      api('/api/admin/geo-points')
    ]);
    analyticsLoaded = true;
    renderAnalytics(data);
    initGeoMap(geoData.points || []);
  } catch {
    showToast('No se pudieron cargar las métricas.', true);
  }
}

function initGeoMap(points) {
  const mapEl = document.getElementById('geo-map');
  if (!mapEl || !window.L) return;

  if (!geoMap) {
    geoMap = L.map('geo-map', { zoomControl: true, scrollWheelZoom: false }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(geoMap);
  }

  if (heatLayer) heatLayer.remove();

  if (points.length === 0) {
    // Sin datos aún — muestra marcador en Argentina
    L.circleMarker([-27, -55], {
      radius: 6, color: '#00ff9d', fillColor: '#00ff9d', fillOpacity: 0.6, weight: 1
    }).bindTooltip('Jardín América, Misiones', { permanent: false }).addTo(geoMap);
    return;
  }

  const maxWeight = Math.max(...points.map(p => p.weight), 1);
  const heatPoints = points.map(p => [p.lat, p.lon, p.weight / maxWeight]);

  heatLayer = L.heatLayer(heatPoints, {
    radius: 35,
    blur: 25,
    maxZoom: 17,
    gradient: { 0.2: '#00d4ff', 0.5: '#00ff9d', 0.8: '#bf5af2', 1.0: '#ff3b3b' }
  }).addTo(geoMap);

  // Ajusta vista para mostrar todos los puntos
  const bounds = L.latLngBounds(points.map(p => [p.lat, p.lon]));
  geoMap.fitBounds(bounds.pad(0.3));
}

function renderAnalytics(data) {
  const { summary, topPages, topEvents, topCountries, recentViews } = data;

  // Resumen
  document.getElementById('an-total').textContent = summary.totalViews.toLocaleString('es-AR');
  document.getElementById('an-30d').textContent = summary.views30Days.toLocaleString('es-AR');
  document.getElementById('an-unique').textContent = summary.uniqueIps.toLocaleString('es-AR');
  document.getElementById('an-unique-30d').textContent = summary.uniqueIps30Days.toLocaleString('es-AR');

  // Páginas más visitadas
  const maxPage = topPages[0]?.visits || 1;
  renderTable('an-top-pages', topPages, row => `
    <td>
      <div class="analytics-bar-wrap">
        <div class="analytics-bar" style="width:${Math.round((row.visits / maxPage) * 120)}px"></div>
        <span>${escapeHtml(row.page)}</span>
      </div>
    </td>
    <td class="analytics-count">${row.visits}</td>
  `, 'Sin datos aún.');

  // Botones más clickeados
  const maxEvent = topEvents[0]?.total || 1;
  renderTable('an-top-events', topEvents, row => `
    <td><span class="analytics-tag">${escapeHtml(row.event_name)}</span></td>
    <td>${escapeHtml(row.element || '—')}</td>
    <td class="analytics-count">${row.total}</td>
  `, 'Sin clics registrados aún.');

  // Países
  const maxCountry = topCountries[0]?.visits || 1;
  renderTable('an-top-countries', topCountries, row => `
    <td>
      <div class="analytics-bar-wrap">
        <div class="analytics-bar" style="width:${Math.round((row.visits / maxCountry) * 100)}px"></div>
        <span>${escapeHtml(row.country || 'Desconocido')}</span>
      </div>
    </td>
    <td class="analytics-count">${row.visits}</td>
  `, 'Sin datos de ubicación aún.');

  // Actividad reciente
  renderTable('an-recent', recentViews, row => `
    <td>${escapeHtml(row.page)}</td>
    <td>${escapeHtml(row.country || '—')}</td>
    <td>${escapeHtml(row.city || '—')}</td>
    <td style="white-space:nowrap;font-size:12px;color:#999">${formatRelativeTime(row.created_at)}</td>
  `, 'Sin visitas registradas.');
}

function renderTable(id, rows, rowFn, emptyMsg) {
  const table = document.getElementById(id);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  if (!rows || rows.length === 0) {
    const cols = table.querySelector('thead tr')?.children.length || 2;
    tbody.innerHTML = `<tr><td colspan="${cols}" class="analytics-empty">${emptyMsg}</td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map(row => `<tr>${rowFn(row)}</tr>`).join('');
}

function formatRelativeTime(isoString) {
  if (!isoString) return '—';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  return `hace ${Math.floor(hrs / 24)} d`;
}

/* ═══════════════════════════════════════════
   PESTAÑA INFORMACIÓN — lógica UI
   ═══════════════════════════════════════════ */
function initInfoTabControls() {
  const addBtn = document.getElementById('recipient-add-btn');
  const emailInput = document.getElementById('recipient-email');
  const labelInput = document.getElementById('recipient-label');
  const errorEl = document.getElementById('recipients-error');

  if (!addBtn) return;

  addBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const label = labelInput.value.trim();
    if (!email) { showRecipientsError('Ingresa un correo electronico.'); return; }

    addBtn.disabled = true;
    addBtn.textContent = 'Guardando...';
    hideRecipientsError();

    try {
      const res = await fetch('/api/admin/email-recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, label })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al agregar.');
      emailInput.value = '';
      labelInput.value = '';
      await loadRecipients();
      showToast('Correo agregado.');
    } catch (err) {
      showRecipientsError(err.message);
    } finally {
      addBtn.disabled = false;
      addBtn.textContent = '+ Agregar';
    }
  });

  emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });

  function showRecipientsError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }
  function hideRecipientsError() {
    errorEl.hidden = true;
  }
}

async function loadRecipients() {
  const listEl = document.getElementById('recipients-list');
  const statusEl = document.getElementById('recipients-status');
  if (!listEl) return;

  try {
    const res = await fetch('/api/admin/email-recipients');
    const data = await res.json();
    const items = data.items || [];

    if (items.length === 0) {
      listEl.innerHTML = '<p class="recipients-empty">No hay destinatarios configurados todavia.</p>';
      if (statusEl) statusEl.innerHTML = '<span class="recipients-badge recipients-badge--none">Sin destinatarios</span>';
      return;
    }

    if (statusEl) statusEl.innerHTML = `<span class="recipients-badge recipients-badge--ok">${items.length} destinatario${items.length !== 1 ? 's' : ''}</span>`;

    listEl.innerHTML = items.map(item => `
      <div class="recipient-row" data-id="${item.id}">
        <div class="recipient-info">
          <span class="recipient-email">${item.email}</span>
          ${item.label ? `<span class="recipient-label-tag">${item.label}</span>` : ''}
        </div>
        <button type="button" class="recipient-delete-btn" data-id="${item.id}" title="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `).join('');

    listEl.querySelectorAll('.recipient-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const row = listEl.querySelector(`.recipient-row[data-id="${id}"]`);
        const emailText = row?.querySelector('.recipient-email')?.textContent || 'este correo';
        if (!confirm(`¿Eliminar ${emailText} de los destinatarios?`)) return;
        btn.disabled = true;
        try {
          const res = await fetch(`/api/admin/email-recipients/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('No se pudo eliminar.');
          await loadRecipients();
          showToast('Correo eliminado.');
        } catch (err) {
          showToast(err.message);
          btn.disabled = false;
        }
      });
    });
  } catch {
    listEl.innerHTML = '<p class="recipients-empty">Error al cargar los destinatarios.</p>';
  }
}

function initContactRecipientControls() {
  const addBtn = document.getElementById('contact-recipient-add-btn');
  const emailInput = document.getElementById('contact-recipient-email');
  const labelInput = document.getElementById('contact-recipient-label');
  const errorEl = document.getElementById('contact-recipients-error');

  if (!addBtn) return;

  addBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const label = labelInput.value.trim();
    if (!email) { showContactRecipientsError('Ingresa un correo electronico.'); return; }

    addBtn.disabled = true;
    addBtn.textContent = 'Guardando...';
    hideContactRecipientsError();

    try {
      const res = await fetch('/api/admin/contact-email-recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, label })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al agregar.');
      emailInput.value = '';
      labelInput.value = '';
      await loadContactRecipients();
      showToast('Correo agregado.');
    } catch (err) {
      showContactRecipientsError(err.message);
    } finally {
      addBtn.disabled = false;
      addBtn.textContent = '+ Agregar';
    }
  });

  emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });

  function showContactRecipientsError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }
  function hideContactRecipientsError() {
    errorEl.hidden = true;
  }
}

async function loadContactRecipients() {
  const listEl = document.getElementById('contact-recipients-list');
  const statusEl = document.getElementById('contact-recipients-status');
  if (!listEl) return;

  try {
    const res = await fetch('/api/admin/contact-email-recipients');
    const data = await res.json();
    const items = data.items || [];

    if (items.length === 0) {
      listEl.innerHTML = '<p class="recipients-empty">No hay destinatarios configurados todavia.</p>';
      if (statusEl) statusEl.innerHTML = '<span class="recipients-badge recipients-badge--none">Sin destinatarios</span>';
      return;
    }

    if (statusEl) statusEl.innerHTML = `<span class="recipients-badge recipients-badge--ok">${items.length} destinatario${items.length !== 1 ? 's' : ''}</span>`;

    listEl.innerHTML = items.map(item => `
      <div class="recipient-row" data-id="${item.id}">
        <div class="recipient-info">
          <span class="recipient-email">${item.email}</span>
          ${item.label ? `<span class="recipient-label-tag">${item.label}</span>` : ''}
        </div>
        <button type="button" class="recipient-delete-btn" data-id="${item.id}" title="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `).join('');

    listEl.querySelectorAll('.recipient-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const row = listEl.querySelector(`.recipient-row[data-id="${id}"]`);
        const emailText = row?.querySelector('.recipient-email')?.textContent || 'este correo';
        if (!confirm(`Eliminar ${emailText} de los destinatarios?`)) return;
        btn.disabled = true;
        try {
          const res = await fetch(`/api/admin/contact-email-recipients/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('No se pudo eliminar.');
          await loadContactRecipients();
          showToast('Correo eliminado.');
        } catch (err) {
          showToast(err.message);
          btn.disabled = false;
        }
      });
    });
  } catch {
    listEl.innerHTML = '<p class="recipients-empty">Error al cargar los destinatarios.</p>';
  }
}
