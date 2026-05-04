const app = document.querySelector("#app");

const routes = new Set([
  "splash",
  "onboarding",
  "create",
  "home",
  "focus-hub",
  "focus",
  "focus-done",
  "focus-history",
  "music",
  "growth",
  "ability-chat",
  "records",
  "world",
  "more-practices",
  "breathing",
  "profile",
  "membership",
  "focus-stats",
  "favorites",
  "downloads",
  "reminders",
]);

const STORAGE_KEY = "momo.prototype.data.v2";
const MAX_FOCUS_SECONDS = 23 * 60 * 60 + 59 * 60 + 59;
const todayKey = () => new Date().toISOString().slice(0, 10);

function loadData() {
  const defaults = { profile: { name: "Momo", shape: "blue", trait: "warm" }, focus: { durationSeconds: 25 * 60, mode: "study", customModeName: "自由专注", active: null, lastCompleted: null, selectedMusicId: null }, sessions: [], records: [], practiceCompletions: [], podcastBatch: 0, selectedPodcastId: null, podcastPlaying: false, podcastProgress: 0, podcastSpeed: 1, favorites: [], downloads: [], reminders: [], abilityAgents: {}, weather: { status: "idle", label: "暂未获取天气", temp: "--", detail: "点击获取" } };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return parsed ? { ...defaults, ...parsed, profile: { ...defaults.profile, ...(parsed.profile || {}) }, focus: { ...defaults.focus, ...(parsed.focus || {}) }, weather: { ...defaults.weather, ...(parsed.weather || {}) } } : defaults;
  } catch {
    return defaults;
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getInitialRoute() {
  const hashRoute = window.location.hash.replace("#", "");
  return routes.has(hashRoute) ? hashRoute : "splash";
}

function navigate(route, previous = state.route) {
  if (!routes.has(route)) return;
  state.previousRoute = previous;
  state.menuOpen = false;
  state.musicPanelOpen = false;
  if (window.location.hash.replace("#", "") !== route) {
    window.location.hash = route;
  } else {
    state.route = route;
    render();
  }
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function showToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 1500);
}

function splashPage() {
  return `<main class="phone-screen phone-screen--center"><section class="splash"><div class="splash__visual" style="font-size: 80px;">🌙</div><div class="splash__copy"><h1>陪你慢慢变好</h1></div><button class="primary-button" type="button" data-route="create"><span>开始</span></button></section></main>`;
}

function createPage() {
  return `<main class="phone-screen"><header class="topbar"><button class="icon-button" type="button" data-route="splash">←</button><div class="topbar__title"><h1>创建陪伴体</h1></div></header><section class="glass-card"><label for="companionName">给它取个名字</label><div class="input-wrap"><input id="companionName" maxlength="10" value="${escapeHtml(data.profile.name)}" placeholder="输入名字" /></div></section><button class="primary-button primary-button--wide" type="button" data-route="home"><span>完成</span></button></main>`;
}

function homePage() {
  return `<main class="phone-screen phone-screen--with-nav page-home"><header class="home-header"><h1>早上好，${escapeHtml(data.profile.name)}</h1><p>新的一天，一起慢慢前进吧</p></header><section class="glass-card focus-card"><h2>开始专注</h2><button class="primary-button primary-button--compact" type="button" data-action="start-focus">开始专注</button></section><nav class="bottom-nav"><button class="bottom-nav__item is-active" type="button" data-route="home">首页</button><button class="bottom-nav__item" type="button" data-route="growth">成长</button><button class="bottom-nav__item" type="button" data-route="records">记录</button><button class="bottom-nav__item" type="button" data-route="world">世界</button><button class="bottom-nav__item" type="button" data-route="profile">我的</button></nav></main>`;
}

function growthPage() {
  return `<main class="phone-screen phone-screen--with-nav"><header class="section-header"><h1>成长</h1></header><nav class="bottom-nav"><button class="bottom-nav__item" type="button" data-route="home">首页</button><button class="bottom-nav__item is-active" type="button" data-route="growth">成长</button><button class="bottom-nav__item" type="button" data-route="records">记录</button><button class="bottom-nav__item" type="button" data-route="world">世界</button><button class="bottom-nav__item" type="button" data-route="profile">我的</button></nav></main>`;
}

function recordsPage() {
  return `<main class="phone-screen phone-screen--with-nav"><header class="section-header"><h1>记录</h1></header><nav class="bottom-nav"><button class="bottom-nav__item" type="button" data-route="home">首页</button><button class="bottom-nav__item" type="button" data-route="growth">成长</button><button class="bottom-nav__item is-active" type="button" data-route="records">记录</button><button class="bottom-nav__item" type="button" data-route="world">世界</button><button class="bottom-nav__item" type="button" data-route="profile">我的</button></nav></main>`;
}

function worldPage() {
  return `<main class="phone-screen phone-screen--with-nav"><header class="section-header"><h1>世界</h1></header><nav class="bottom-nav"><button class="bottom-nav__item" type="button" data-route="home">首页</button><button class="bottom-nav__item" type="button" data-route="growth">成长</button><button class="bottom-nav__item" type="button" data-route="records">记录</button><button class="bottom-nav__item is-active" type="button" data-route="world">世界</button><button class="bottom-nav__item" type="button" data-route="profile">我的</button></nav></main>`;
}

function profilePage() {
  return `<main class="phone-screen phone-screen--with-nav"><header class="section-header"><h1>我的</h1></header><nav class="bottom-nav"><button class="bottom-nav__item" type="button" data-route="home">首页</button><button class="bottom-nav__item" type="button" data-route="growth">成长</button><button class="bottom-nav__item" type="button" data-route="records">记录</button><button class="bottom-nav__item" type="button" data-route="world">世界</button><button class="bottom-nav__item is-active" type="button" data-route="profile">我的</button></nav></main>`;
}

function focusPage() {
  return `<main class="phone-screen"><header class="topbar"><button class="icon-button" type="button" data-action="cancel-focus">←</button><div class="topbar__title"><h1>专注中</h1></div></header><section style="text-align: center; padding: 40px;"><p>专注计时进行中...</p><button class="primary-button" type="button" data-action="finish-focus">完成</button></section></main>`;
}

function toast() {
  return state.toast ? `<div class="toast" role="status">${escapeHtml(state.toast)}</div>` : "";
}

function render() {
  const pageMap = {
    splash: splashPage,
    create: createPage,
    home: homePage,
    "focus-hub": growthPage,
    focus: focusPage,
    "focus-done": homePage,
    "focus-history": homePage,
    music: homePage,
    growth: growthPage,
    "ability-chat": homePage,
    records: recordsPage,
    world: worldPage,
    "more-practices": homePage,
    breathing: homePage,
    profile: profilePage,
    membership: homePage,
    "focus-stats": homePage,
    favorites: homePage,
    downloads: homePage,
    reminders: homePage,
  };
  const shouldAnimate = state.route !== lastRenderedRoute;
  lastRenderedRoute = state.route;
  app.innerHTML = `<div class="route-shell ${shouldAnimate ? "route-shell--enter" : ""}">${pageMap[state.route]()}</div>${toast()}`;
}

let data = loadData();
const state = {
  route: getInitialRoute(),
  previousRoute: "home",
  selectedRecordTab: "全部",
  selectedMood: "很棒",
  menuOpen: false,
  customModeOpen: false,
  musicPanelOpen: false,
  abilityId: "emotion",
  breathingRunning: false,
  breathingRemaining: 5 * 60,
  breathingPhaseElapsed: 0,
  toast: "",
};

let lastRenderedRoute = null;
let focusTicker = null;

window.addEventListener("hashchange", () => {
  const nextRoute = getInitialRoute();
  if (nextRoute !== state.route) {
    state.previousRoute = state.route;
    state.route = nextRoute;
    state.menuOpen = false;
    render();
  }
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-route],[data-action]");
  if (!trigger) return;

  if (trigger.dataset.route) {
    navigate(trigger.dataset.route);
    return;
  }

  if (trigger.dataset.action === "start-focus") {
    data.focus.active = { startedAt: new Date().toISOString(), durationSeconds: data.focus.durationSeconds, mode: "学习", running: true };
    saveData();
    navigate("focus");
    return;
  }

  if (trigger.dataset.action === "finish-focus" || trigger.dataset.action === "cancel-focus") {
    data.focus.active = null;
    saveData();
    navigate("home");
    return;
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "companionName") {
    data.profile.name = event.target.value.slice(0, 10);
    saveData();
  }
});

render();