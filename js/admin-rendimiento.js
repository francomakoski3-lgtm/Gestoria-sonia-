const STORAGE_KEYS = {
  language: 'admin_rendimiento_language'
};

const LOCALE_BY_LANGUAGE = {
  es: 'es-ES',
  en: 'en-US',
  ru: 'ru-RU',
  he: 'he-IL'
};

const RTL_LANGUAGES = new Set(['he']);

const SERVER_ERROR_KEYS = {
  'Completa usuario y contrasena.': 'serverMissingCredentials',
  'Usuario o contrasena incorrectos.': 'serverInvalidCredentials',
  'Necesitas iniciar sesion.': 'serverAuthRequired',
  'No se pudo completar la accion.': 'errorFallback'
};

const TRANSLATIONS = {
  es: {
    pageTitle: 'Panel administrativo | Rendimiento',
    metaDescription: 'Panel privado para revisar visitas, interacciones y actividad reciente del sitio.',
    languageLabel: 'Idioma',
    bootLabel: 'Carga del sistema',
    bootTitle: 'Inicializando panel de control',
    bootStatus1: 'Sincronizando interfaz...',
    bootStatus2: 'Validando acceso seguro...',
    bootStatus3: 'Preparando metricas de rendimiento...',
    bootFooter: 'panel_admin :: online',
    loginEyebrow: 'Panel privado',
    loginTitle: 'Monitorea el rendimiento del sitio en una sola vista.',
    loginCopy:
      'Este acceso te deja entrar al panel de movimientos para ver visitas, interacciones, paises, actividad reciente y el mapa de trafico del sitio.',
    loginPoint1: 'Login protegido con sesion.',
    loginPoint2: 'Panel exclusivo de rendimiento.',
    loginPoint3: 'Vista clara para seguir todos los movimientos.',
    loginHeading: 'Ingresar al panel',
    usernameLabel: 'Usuario',
    passwordLabel: 'Contrasena',
    loginButton: 'Entrar',
    loginHelper: 'Acceso reservado para la administracion del sitio.',
    dashboardEyebrow: 'Rendimiento',
    dashboardTitle: 'Panel de movimientos',
    dashboardDescription: 'Consulta visitas, clics, origen del trafico y actividad reciente del sitio.',
    analyticsPanelLabel: 'Panel de rendimiento',
    logoutButton: 'Cerrar sesion',
    analyticsHeaderTitle: '// sistema de monitoreo - panel_admin',
    statTotal: 'Visitas totales',
    stat30Days: 'Ultimos 30 dias',
    statUnique: 'Visitantes unicos',
    statUnique30Days: 'Unicos (30 dias)',
    pagesEyebrow: 'Paginas',
    pagesTitle: 'Mas visitadas',
    pageColumn: 'Pagina',
    visitsColumn: 'Visitas',
    interactionsEyebrow: 'Interacciones',
    interactionsTitle: 'Botones mas usados',
    actionColumn: 'Accion',
    elementColumn: 'Elemento',
    clicksColumn: 'Clics',
    originEyebrow: 'Origen',
    originTitle: 'Paises de los visitantes',
    countryColumn: 'Pais',
    activityEyebrow: 'Actividad',
    activityTitle: 'Visitas recientes',
    cityColumn: 'Ciudad',
    timeColumn: 'Hora',
    geoEyebrow: 'Geolocalizacion',
    geoTitle: 'Mapa de visitas',
    geoHint: 'Las nuevas visitas aparecen automaticamente en este mapa.',
    loadingCheckingSession: 'Revisando sesion...',
    loadingMetrics: 'Cargando metricas...',
    toastSessionStarted: 'Sesion iniciada correctamente.',
    toastSessionClosed: 'Sesion cerrada.',
    toastLoadMetricsError: 'No se pudieron cargar las metricas.',
    emptyNoData: 'Sin datos aun.',
    emptyNoClicks: 'Sin clics registrados aun.',
    emptyNoLocation: 'Sin datos de ubicacion aun.',
    emptyNoVisits: 'Sin visitas registradas.',
    unknown: 'Desconocido',
    mapFallback: 'Sin datos aun - punto base',
    timeNow: 'ahora',
    serverMissingCredentials: 'Completa usuario y contrasena.',
    serverInvalidCredentials: 'Usuario o contrasena incorrectos.',
    serverAuthRequired: 'Necesitas iniciar sesion.',
    errorFallback: 'No se pudo completar la accion.'
  },
  en: {
    pageTitle: 'Admin panel | Performance',
    metaDescription: 'Private panel to review visits, interactions and recent site activity.',
    languageLabel: 'Language',
    bootLabel: 'System load',
    bootTitle: 'Initializing control panel',
    bootStatus1: 'Syncing interface...',
    bootStatus2: 'Validating secure access...',
    bootStatus3: 'Preparing performance metrics...',
    bootFooter: 'admin_panel :: online',
    loginEyebrow: 'Private panel',
    loginTitle: 'Monitor the site performance in a single view.',
    loginCopy:
      'This access opens the activity panel so you can review visits, interactions, countries, recent activity and the site traffic map.',
    loginPoint1: 'Login protected with a session.',
    loginPoint2: 'Performance-only panel.',
    loginPoint3: 'Clear view to track all movement.',
    loginHeading: 'Sign in to the panel',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    loginButton: 'Enter',
    loginHelper: 'Access reserved for site administration.',
    dashboardEyebrow: 'Performance',
    dashboardTitle: 'Activity panel',
    dashboardDescription: 'Review visits, clicks, traffic origin and recent site activity.',
    analyticsPanelLabel: 'Performance panel',
    logoutButton: 'Log out',
    analyticsHeaderTitle: '// monitoring system - admin_panel',
    statTotal: 'Total visits',
    stat30Days: 'Last 30 days',
    statUnique: 'Unique visitors',
    statUnique30Days: 'Unique (30 days)',
    pagesEyebrow: 'Pages',
    pagesTitle: 'Most visited',
    pageColumn: 'Page',
    visitsColumn: 'Visits',
    interactionsEyebrow: 'Interactions',
    interactionsTitle: 'Most used buttons',
    actionColumn: 'Action',
    elementColumn: 'Element',
    clicksColumn: 'Clicks',
    originEyebrow: 'Origin',
    originTitle: 'Visitor countries',
    countryColumn: 'Country',
    activityEyebrow: 'Activity',
    activityTitle: 'Recent visits',
    cityColumn: 'City',
    timeColumn: 'Time',
    geoEyebrow: 'Geolocation',
    geoTitle: 'Visit map',
    geoHint: 'New visits appear on this map automatically.',
    loadingCheckingSession: 'Checking session...',
    loadingMetrics: 'Loading metrics...',
    toastSessionStarted: 'Session started successfully.',
    toastSessionClosed: 'Session closed.',
    toastLoadMetricsError: 'Could not load the metrics.',
    emptyNoData: 'No data yet.',
    emptyNoClicks: 'No clicks recorded yet.',
    emptyNoLocation: 'No location data yet.',
    emptyNoVisits: 'No visits recorded.',
    unknown: 'Unknown',
    mapFallback: 'No data yet - base point',
    timeNow: 'now',
    serverMissingCredentials: 'Fill in username and password.',
    serverInvalidCredentials: 'Incorrect username or password.',
    serverAuthRequired: 'You need to sign in.',
    errorFallback: 'Could not complete the action.'
  },
  ru: {
    pageTitle: 'Панель администратора | Производительность',
    metaDescription: 'Закрытая панель для просмотра визитов, взаимодействий и недавней активности сайта.',
    languageLabel: 'Язык',
    bootLabel: 'Загрузка системы',
    bootTitle: 'Инициализация панели управления',
    bootStatus1: 'Синхронизация интерфейса...',
    bootStatus2: 'Проверка безопасного доступа...',
    bootStatus3: 'Подготовка метрик производительности...',
    bootFooter: 'admin_panel :: online',
    loginEyebrow: 'Закрытая панель',
    loginTitle: 'Следите за производительностью сайта в одном окне.',
    loginCopy:
      'Этот доступ открывает панель активности, где можно смотреть визиты, взаимодействия, страны, недавнюю активность и карту трафика сайта.',
    loginPoint1: 'Вход защищен сессией.',
    loginPoint2: 'Панель только для производительности.',
    loginPoint3: 'Понятный обзор всех движений.',
    loginHeading: 'Войти в панель',
    usernameLabel: 'Пользователь',
    passwordLabel: 'Пароль',
    loginButton: 'Войти',
    loginHelper: 'Доступ только для администрирования сайта.',
    dashboardEyebrow: 'Производительность',
    dashboardTitle: 'Панель активности',
    dashboardDescription: 'Смотрите визиты, клики, источник трафика и недавнюю активность сайта.',
    analyticsPanelLabel: 'Панель производительности',
    logoutButton: 'Выйти',
    analyticsHeaderTitle: '// система мониторинга - admin_panel',
    statTotal: 'Всего визитов',
    stat30Days: 'Последние 30 дней',
    statUnique: 'Уникальные посетители',
    statUnique30Days: 'Уникальные (30 дней)',
    pagesEyebrow: 'Страницы',
    pagesTitle: 'Самые посещаемые',
    pageColumn: 'Страница',
    visitsColumn: 'Визиты',
    interactionsEyebrow: 'Взаимодействия',
    interactionsTitle: 'Самые используемые кнопки',
    actionColumn: 'Действие',
    elementColumn: 'Элемент',
    clicksColumn: 'Клики',
    originEyebrow: 'Источник',
    originTitle: 'Страны посетителей',
    countryColumn: 'Страна',
    activityEyebrow: 'Активность',
    activityTitle: 'Недавние визиты',
    cityColumn: 'Город',
    timeColumn: 'Время',
    geoEyebrow: 'Геолокация',
    geoTitle: 'Карта визитов',
    geoHint: 'Новые визиты автоматически появляются на этой карте.',
    loadingCheckingSession: 'Проверка сессии...',
    loadingMetrics: 'Загрузка метрик...',
    toastSessionStarted: 'Сессия успешно открыта.',
    toastSessionClosed: 'Сессия закрыта.',
    toastLoadMetricsError: 'Не удалось загрузить метрики.',
    emptyNoData: 'Данных пока нет.',
    emptyNoClicks: 'Клики пока не зарегистрированы.',
    emptyNoLocation: 'Данных о местоположении пока нет.',
    emptyNoVisits: 'Визиты пока не зарегистрированы.',
    unknown: 'Неизвестно',
    mapFallback: 'Данных пока нет - базовая точка',
    timeNow: 'сейчас',
    serverMissingCredentials: 'Заполните имя пользователя и пароль.',
    serverInvalidCredentials: 'Неверное имя пользователя или пароль.',
    serverAuthRequired: 'Нужно войти в систему.',
    errorFallback: 'Не удалось выполнить действие.'
  },
  he: {
    pageTitle: 'פאנל ניהול | ביצועים',
    metaDescription: 'פאנל פרטי לצפייה בביקורים, אינטראקציות ופעילות אחרונה באתר.',
    languageLabel: 'שפה',
    bootLabel: 'טעינת מערכת',
    bootTitle: 'מאתחל את פאנל הבקרה',
    bootStatus1: 'מסנכרן את הממשק...',
    bootStatus2: 'מאמת גישה מאובטחת...',
    bootStatus3: 'מכין מדדי ביצועים...',
    bootFooter: 'admin_panel :: online',
    loginEyebrow: 'פאנל פרטי',
    loginTitle: 'עקוב אחרי ביצועי האתר בתצוגה אחת.',
    loginCopy:
      'הגישה הזאת פותחת את פאנל הפעילות כדי לראות ביקורים, אינטראקציות, מדינות, פעילות אחרונה ומפת התנועה של האתר.',
    loginPoint1: 'התחברות מוגנת עם סשן.',
    loginPoint2: 'פאנל ייעודי לביצועים.',
    loginPoint3: 'תצוגה ברורה לכל התנועות.',
    loginHeading: 'כניסה לפאנל',
    usernameLabel: 'שם משתמש',
    passwordLabel: 'סיסמה',
    loginButton: 'כניסה',
    loginHelper: 'הגישה מיועדת לניהול האתר בלבד.',
    dashboardEyebrow: 'ביצועים',
    dashboardTitle: 'פאנל תנועות',
    dashboardDescription: 'צפה בביקורים, קליקים, מקור התנועה והפעילות האחרונה באתר.',
    analyticsPanelLabel: 'פאנל ביצועים',
    logoutButton: 'התנתקות',
    analyticsHeaderTitle: '// מערכת ניטור - admin_panel',
    statTotal: 'סה״כ ביקורים',
    stat30Days: '30 הימים האחרונים',
    statUnique: 'מבקרים ייחודיים',
    statUnique30Days: 'ייחודיים (30 ימים)',
    pagesEyebrow: 'עמודים',
    pagesTitle: 'העמודים הנצפים ביותר',
    pageColumn: 'עמוד',
    visitsColumn: 'ביקורים',
    interactionsEyebrow: 'אינטראקציות',
    interactionsTitle: 'הכפתורים הכי בשימוש',
    actionColumn: 'פעולה',
    elementColumn: 'אלמנט',
    clicksColumn: 'קליקים',
    originEyebrow: 'מקור',
    originTitle: 'מדינות המבקרים',
    countryColumn: 'מדינה',
    activityEyebrow: 'פעילות',
    activityTitle: 'ביקורים אחרונים',
    cityColumn: 'עיר',
    timeColumn: 'זמן',
    geoEyebrow: 'מיקום גיאוגרפי',
    geoTitle: 'מפת ביקורים',
    geoHint: 'ביקורים חדשים מופיעים במפה הזאת אוטומטית.',
    loadingCheckingSession: 'בודק סשן...',
    loadingMetrics: 'טוען מדדים...',
    toastSessionStarted: 'הסשן התחיל בהצלחה.',
    toastSessionClosed: 'הסשן נסגר.',
    toastLoadMetricsError: 'לא ניתן לטעון את המדדים.',
    emptyNoData: 'עדיין אין נתונים.',
    emptyNoClicks: 'עדיין לא נרשמו קליקים.',
    emptyNoLocation: 'עדיין אין נתוני מיקום.',
    emptyNoVisits: 'עדיין לא נרשמו ביקורים.',
    unknown: 'לא ידוע',
    mapFallback: 'עדיין אין נתונים - נקודת בסיס',
    timeNow: 'עכשיו',
    serverMissingCredentials: 'יש למלא שם משתמש וסיסמה.',
    serverInvalidCredentials: 'שם המשתמש או הסיסמה שגויים.',
    serverAuthRequired: 'צריך להתחבר.',
    errorFallback: 'לא ניתן להשלים את הפעולה.'
  }
};

const state = {
  user: null,
  geoMap: null,
  heatLayer: null,
  analyticsData: null,
  geoPoints: [],
  language: 'es'
};

const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  initLanguage();
  bindEvents();
  startBootSequence();
});

function cacheElements() {
  elements.bootScreen = document.getElementById('boot-screen');
  elements.bootPercent = document.getElementById('boot-percent');
  elements.bootProgressFill = document.getElementById('boot-progress-fill');
  elements.metaDescription = document.querySelector('meta[name="description"]');
  elements.translatable = Array.from(document.querySelectorAll('[data-i18n]'));
  elements.analyticsPanel = document.querySelector('.analytics-panel');

  elements.languageSwitch = document.getElementById('language-switch');
  elements.languageButtons = Array.from(document.querySelectorAll('.language-option'));

  elements.loginView = document.getElementById('login-view');
  elements.dashboardView = document.getElementById('dashboard-view');
  elements.loginForm = document.getElementById('login-form');
  elements.logoutButton = document.getElementById('logout-button');
  elements.currentUser = document.getElementById('current-user');
  elements.toast = document.getElementById('toast');
}

function initLanguage() {
  const savedLanguage = window.localStorage.getItem(STORAGE_KEYS.language);
  const browserLanguage = (navigator.language || 'es').slice(0, 2).toLowerCase();
  const initialLanguage = TRANSLATIONS[savedLanguage] ? savedLanguage : TRANSLATIONS[browserLanguage] ? browserLanguage : 'es';
  setLanguage(initialLanguage, { persist: false, rerender: false });
}

function bindEvents() {
  elements.loginForm.addEventListener('submit', onLoginSubmit);
  elements.logoutButton.addEventListener('click', onLogoutClick);

  elements.languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
    });
  });
}

async function startBootSequence() {
  document.body.classList.add('is-booting');
  setLoadingState(t('loadingMetrics'));

  await Promise.all([
    animateBootProgress(3000),
    restoreSession()
  ]);

  finishBootSequence();
}

function animateBootProgress(durationMs) {
  return new Promise(resolve => {
    const start = performance.now();

    function frame(now) {
      const progress = Math.min(1, (now - start) / durationMs);
      const percent = Math.round(progress * 100);

      elements.bootPercent.textContent = `${percent}%`;
      elements.bootProgressFill.style.width = `${percent}%`;

      if (progress < 1) {
        window.requestAnimationFrame(frame);
        return;
      }

      resolve();
    }

    window.requestAnimationFrame(frame);
  });
}

function finishBootSequence() {
  elements.bootScreen.classList.add('is-hidden');
  document.body.classList.remove('is-booting');

  window.setTimeout(() => {
    elements.bootScreen.hidden = true;
  }, 500);
}

async function restoreSession() {
  setLoadingState(t('loadingCheckingSession'));

  try {
    const response = await api('/api/auth/me');
    if (!response.authenticated) {
      showLogin();
      return;
    }

    state.user = response.user;
    showDashboard();
    await loadAnalytics();
  } catch (error) {
    console.error(error);
    showLogin();
  }
}

function setLanguage(language, options = {}) {
  const { persist = true, rerender = true } = options;
  if (!TRANSLATIONS[language]) return;

  state.language = language;

  document.documentElement.lang = language;
  document.documentElement.dir = RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr';
  document.body.dataset.language = language;

  elements.languageSwitch.dataset.lang = language;
  elements.languageButtons.forEach(button => {
    button.classList.toggle('is-active', button.dataset.lang === language);
  });

  if (persist) {
    window.localStorage.setItem(STORAGE_KEYS.language, language);
  }

  applyTranslations();

  if (rerender && state.analyticsData) {
    renderAnalytics(state.analyticsData);
  }

  if (rerender && !elements.dashboardView.hidden && (state.geoMap || state.geoPoints.length > 0)) {
    initGeoMap(state.geoPoints);
  }
}

function applyTranslations() {
  document.title = t('pageTitle');
  if (elements.metaDescription) {
    elements.metaDescription.setAttribute('content', t('metaDescription'));
  }
  if (elements.analyticsPanel) {
    elements.analyticsPanel.setAttribute('aria-label', t('analyticsPanelLabel'));
  }
  elements.languageSwitch.setAttribute('aria-label', t('languageLabel'));

  elements.translatable.forEach(node => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });
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

async function onLoginSubmit(event) {
  event.preventDefault();

  const submitButton = elements.loginForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const payload = {
      username: field(elements.loginForm, 'username').value.trim(),
      password: field(elements.loginForm, 'password').value
    };

    const response = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    state.user = response.user;
    elements.loginForm.reset();
    showDashboard();
    await loadAnalytics();
    showToast(t('toastSessionStarted'));
  } catch (error) {
    showToast(error.message, true);
  } finally {
    submitButton.disabled = false;
  }
}

async function onLogoutClick() {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error(error);
  } finally {
    state.user = null;
    state.analyticsData = null;
    state.geoPoints = [];
    showLogin();
    setLoadingState(t('loadingMetrics'));
    showToast(t('toastSessionClosed'));
  }
}

async function loadAnalytics() {
  setLoadingState(t('loadingMetrics'));

  try {
    const [data, geoData] = await Promise.all([
      api('/api/admin/analytics'),
      api('/api/admin/geo-points')
    ]);

    state.analyticsData = data;
    state.geoPoints = Array.isArray(geoData.points) ? geoData.points : [];

    renderAnalytics(state.analyticsData);
    initGeoMap(state.geoPoints);

    window.setTimeout(() => {
      state.geoMap?.invalidateSize();
    }, 50);
  } catch (error) {
    console.error(error);
    showToast(t('toastLoadMetricsError'), true);
  }
}

function setLoadingState(message) {
  const loadingText = `<tr><td colspan="2" class="analytics-empty">${escapeHtml(message)}</td></tr>`;
  const loadingTextWide = `<tr><td colspan="3" class="analytics-empty">${escapeHtml(message)}</td></tr>`;
  const loadingTextRecent = `<tr><td colspan="4" class="analytics-empty">${escapeHtml(message)}</td></tr>`;

  updateTableBody('an-top-pages', loadingText);
  updateTableBody('an-top-events', loadingTextWide);
  updateTableBody('an-top-countries', loadingText);
  updateTableBody('an-recent', loadingTextRecent);
}

function renderAnalytics(data) {
  const summary = data.summary || {};
  const topPages = Array.isArray(data.topPages) ? data.topPages : [];
  const topEvents = Array.isArray(data.topEvents) ? data.topEvents : [];
  const topCountries = Array.isArray(data.topCountries) ? data.topCountries : [];
  const recentViews = Array.isArray(data.recentViews) ? data.recentViews : [];

  document.getElementById('an-total').textContent = formatNumber(summary.totalViews);
  document.getElementById('an-30d').textContent = formatNumber(summary.views30Days);
  document.getElementById('an-unique').textContent = formatNumber(summary.uniqueIps);
  document.getElementById('an-unique-30d').textContent = formatNumber(summary.uniqueIps30Days);

  const maxPage = topPages[0]?.visits || 1;
  renderTable(
    'an-top-pages',
    topPages,
    row => `
      <td>
        <div class="analytics-bar-wrap">
          <div class="analytics-bar" style="width:${Math.max(4, Math.round((row.visits / maxPage) * 120))}px"></div>
          <span>${escapeHtml(row.page)}</span>
        </div>
      </td>
      <td class="analytics-count">${formatNumber(row.visits)}</td>
    `,
    t('emptyNoData')
  );

  renderTable(
    'an-top-events',
    topEvents,
    row => `
      <td><span class="analytics-tag">${escapeHtml(row.event_name)}</span></td>
      <td>${escapeHtml(row.element || '-')}</td>
      <td class="analytics-count">${formatNumber(row.total)}</td>
    `,
    t('emptyNoClicks')
  );

  const maxCountry = topCountries[0]?.visits || 1;
  renderTable(
    'an-top-countries',
    topCountries,
    row => `
      <td>
        <div class="analytics-bar-wrap">
          <div class="analytics-bar" style="width:${Math.max(4, Math.round((row.visits / maxCountry) * 100))}px"></div>
          <span>${escapeHtml(row.country || t('unknown'))}</span>
        </div>
      </td>
      <td class="analytics-count">${formatNumber(row.visits)}</td>
    `,
    t('emptyNoLocation')
  );

  renderTable(
    'an-recent',
    recentViews,
    row => `
      <td>${escapeHtml(row.page)}</td>
      <td>${escapeHtml(row.country || '-')}</td>
      <td>${escapeHtml(row.city || '-')}</td>
      <td style="white-space:nowrap;font-size:12px;color:#93a59a">${escapeHtml(formatRelativeTime(row.created_at))}</td>
    `,
    t('emptyNoVisits')
  );
}

function renderTable(id, rows, rowFn, emptyMessage) {
  const table = document.getElementById(id);
  if (!table) return;

  const cols = table.querySelector('thead tr')?.children.length || 2;
  if (!rows || rows.length === 0) {
    updateTableBody(id, `<tr><td colspan="${cols}" class="analytics-empty">${escapeHtml(emptyMessage)}</td></tr>`);
    return;
  }

  updateTableBody(id, rows.map(row => `<tr>${rowFn(row)}</tr>`).join(''));
}

function updateTableBody(id, html) {
  const table = document.getElementById(id);
  if (!table) return;

  const tbody = table.querySelector('tbody');
  if (tbody) {
    tbody.innerHTML = html;
  }
}

function initGeoMap(points) {
  const mapEl = document.getElementById('geo-map');
  if (!mapEl || !window.L) return;

  if (!state.geoMap) {
    state.geoMap = L.map('geo-map', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(state.geoMap);
  }

  state.geoMap.eachLayer(layer => {
    if (!(layer instanceof L.TileLayer)) {
      state.geoMap.removeLayer(layer);
    }
  });

  if (state.heatLayer) {
    state.heatLayer.remove();
    state.heatLayer = null;
  }

  if (!points || points.length === 0) {
    L.circleMarker([-27, -55], {
      radius: 6,
      color: '#00ff9d',
      fillColor: '#00ff9d',
      fillOpacity: 0.6,
      weight: 1
    }).bindTooltip(t('mapFallback')).addTo(state.geoMap);

    state.geoMap.setView([20, 0], 2);
    return;
  }

  const maxWeight = Math.max(...points.map(point => point.weight), 1);
  const heatPoints = points.map(point => [point.lat, point.lon, point.weight / maxWeight]);

  state.heatLayer = L.heatLayer(heatPoints, {
    radius: 35,
    blur: 25,
    maxZoom: 17,
    gradient: {
      0.2: '#00d4ff',
      0.5: '#00ff9d',
      0.8: '#bf5af2',
      1.0: '#ff5252'
    }
  }).addTo(state.geoMap);

  const bounds = L.latLngBounds(points.map(point => [point.lat, point.lon]));
  state.geoMap.fitBounds(bounds.pad(0.3));
}

async function api(url, options = {}) {
  const requestOptions = { ...options };
  const headers = { ...(options.headers || {}) };

  if (requestOptions.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  requestOptions.headers = headers;
  requestOptions.credentials = 'same-origin';

  const response = await fetch(url, requestOptions);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      state.user = null;
      showLogin();
    }

    throw new Error(translateServerError(payload.error));
  }

  return payload;
}

function translateServerError(message) {
  if (!message) return t('errorFallback');

  const translationKey = SERVER_ERROR_KEYS[message];
  if (translationKey) {
    return t(translationKey);
  }

  return message;
}

function field(form, name) {
  return form.elements.namedItem(name);
}

function currentLocale() {
  return LOCALE_BY_LANGUAGE[state.language] || LOCALE_BY_LANGUAGE.es;
}

function formatNumber(value) {
  const numericValue = Number.isFinite(value) ? value : Number(value || 0);
  return numericValue.toLocaleString(currentLocale());
}

function formatRelativeTime(isoString) {
  if (!isoString) return '-';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '-';

  const diffMs = date.getTime() - Date.now();
  const formatter = new Intl.RelativeTimeFormat(currentLocale(), {
    numeric: 'auto',
    style: 'short'
  });

  const diffMinutes = Math.round(diffMs / 60000);
  if (Math.abs(diffMinutes) < 1) {
    return t('timeNow');
  }

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMs / 3600000);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffMs / 86400000);
  return formatter.format(diffDays, 'day');
}

function t(key) {
  return TRANSLATIONS[state.language]?.[key] || TRANSLATIONS.es[key] || key;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function showToast(message, isError = false) {
  elements.toast.hidden = false;
  elements.toast.className = `toast${isError ? ' error' : ''}`;
  elements.toast.textContent = message;

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 3500);
}
