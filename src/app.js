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

function render() {
  const pageMap = {
    splash: splashPage,
    onboarding: onboardingPage,
    create: createPage,
    home: homePage,
    "focus-hub": focusHubPage,
    focus: focusPage,
    "focus-done": focusDonePage,
    "focus-history": focusHistoryPage,
    music: musicPage,
    growth: growthPage,
    "ability-chat": abilityChatPage,
    records: recordsPage,
    world: worldPage,
    "more-practices": morePracticesPage,
    breathing: breathingPage,
    profile: profilePage,
    membership: membershipPage,
    "focus-stats": focusStatsPage,
    favorites: () => collectionPage("favorites"),
    downloads: () => collectionPage("downloads"),
    reminders: remindersPage,
  };
  const shouldAnimate = state.route !== lastRenderedRoute;
  lastRenderedRoute = state.route;
  app.innerHTML = `<div class="route-shell ${shouldAnimate ? "route-shell--enter" : ""}">${pageMap[state.route]()}</div>${menuPanel()}`;
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
let breathingTicker = null;
let podcastTicker = null;
let audio = null;

render();