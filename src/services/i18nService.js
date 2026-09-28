// Tiny reactive i18n layer for the interface chrome.
// Translates navigation, common actions, and safety-critical strings.
// Persisted per browser. Falls back to English for anything untranslated.

const STORAGE_KEY = 'HERE_LANG_V1';

export const LANGUAGES = [
  { code: 'EN', name: 'English', native: 'English' },
  { code: 'ES', name: 'Spanish', native: 'Español' },
  { code: 'FR', name: 'French', native: 'Français' },
  { code: 'ZH', name: 'Chinese', native: '中文' },
  { code: 'HI', name: 'Hindi', native: 'हिन्दी' },
];

const STRINGS = {
  EN: {
    'nav.home': 'Home',
    'nav.how': 'How it works',
    'nav.support': 'Support',
    'nav.journey': 'My Journey',
    'nav.appointments': 'Appointments',
    'nav.resources': 'Resources',
    'nav.stories': 'Stories',
    'nav.buddy': 'Quiet Buddy',
    'nav.signin': 'Sign in',
    'nav.signout': 'Sign out',
    'nav.start': 'Start privately',
    'nav.counsellor': 'Counsellor Portal',
    'nav.admin': 'Admin Cockpit',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.notifications': 'Notifications',
    'nav.search': 'Search',
    'nav.allread': 'All caught up',
    'nav.markall': 'Mark all read',
    'cta.anonymous': 'Share your story anonymously',
    'cta.crisis': 'In acute distress right now?',
    'cta.crisisBody': 'Free, confidential crisis guidance is open 24/7.',
    'cta.help': 'Get help now',
    'footer.privacy': 'Privacy & FERPA',
    'footer.crisis': 'Crisis Guidelines',
    'footer.about': 'About HERE',
    'footer.settings': 'Settings',
    'footer.buddy': 'Quiet Buddy',
  },
  ES: {
    'nav.home': 'Inicio',
    'nav.how': 'Cómo funciona',
    'nav.support': 'Apoyo',
    'nav.journey': 'Mi Trayectoria',
    'nav.appointments': 'Citas',
    'nav.resources': 'Recursos',
    'nav.stories': 'Historias',
    'nav.buddy': 'Compañero Silencioso',
    'nav.signin': 'Iniciar sesión',
    'nav.signout': 'Cerrar sesión',
    'nav.start': 'Empezar en privado',
    'nav.counsellor': 'Portal del Consejero',
    'nav.admin': 'Panel de Administración',
    'nav.profile': 'Perfil',
    'nav.settings': 'Ajustes',
    'nav.notifications': 'Notificaciones',
    'nav.search': 'Buscar',
    'nav.allread': 'Todo al día',
    'nav.markall': 'Marcar todo leído',
    'cta.anonymous': 'Comparte tu historia de forma anónima',
    'cta.crisis': '¿Estás en crisis aguda ahora?',
    'cta.crisisBody': 'La orientación gratuita y confidencial está abierta 24/7.',
    'cta.help': 'Buscar ayuda ahora',
    'footer.privacy': 'Privacidad y FERPA',
    'footer.crisis': 'Guías de crisis',
    'footer.about': 'Sobre HERE',
    'footer.settings': 'Ajustes',
  },
  FR: {
    'nav.home': 'Accueil',
    'nav.how': 'Comment ça marche',
    'nav.support': 'Soutien',
    'nav.journey': 'Mon parcours',
    'nav.appointments': 'Rendez-vous',
    'nav.resources': 'Ressources',
    'nav.stories': 'Témoignages',
    'nav.buddy': 'Compagnon',
    'nav.signin': 'Connexion',
    'nav.signout': 'Déconnexion',
    'nav.start': 'Commencer en privé',
    'nav.counsellor': 'Portail conseiller',
    'nav.admin': 'Pilote administratif',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.notifications': 'Notifications',
    'nav.search': 'Rechercher',
    'nav.allread': 'Tout est lu',
    'nav.markall': 'Tout marquer comme lu',
    'cta.anonymous': 'Partagez votre histoire anonymement',
    'cta.crisis': 'En détresse aiguë maintenant ?',
    'cta.crisisBody': 'Une aide gratuite et confidentielle est ouverte 24h/24.',
    'cta.help': "Obtenir de l'aide maintenant",
    'footer.privacy': 'Confidentialité et FERPA',
    'footer.crisis': 'Conseils de crise',
    'footer.about': 'À propos de HERE',
    'footer.settings': 'Paramètres',
  },
  ZH: {
    'nav.home': '首页',
    'nav.how': '使用方式',
    'nav.support': '支持服务',
    'nav.journey': '我的历程',
    'nav.appointments': '预约',
    'nav.resources': '资源',
    'nav.stories': '故事墙',
    'nav.buddy': '陪伴伙伴',
    'nav.signin': '登录',
    'nav.signout': '退出登录',
    'nav.start': '私密开始',
    'nav.counsellor': '咨询师门户',
    'nav.admin': '管理控制台',
    'nav.profile': '个人资料',
    'nav.settings': '设置',
    'nav.notifications': '通知',
    'nav.search': '搜索',
    'nav.allread': '全部已读',
    'nav.markall': '全部标为已读',
    'cta.anonymous': '匿名分享你的故事',
    'cta.crisis': '你现在正处于急性痛苦中吗？',
    'cta.crisisBody': '免费保密的危机援助全天候开放。',
    'cta.help': '立即寻求帮助',
    'footer.privacy': '隐私与 FERPA',
    'footer.crisis': '危机指引',
    'footer.about': '关于 HERE',
    'footer.settings': '设置',
  },
  HI: {
    'nav.home': 'होम',
    'nav.how': 'यह कैसे काम करता है',
    'nav.support': 'सहायता',
    'nav.journey': 'मेरी यात्रा',
    'nav.appointments': 'अपॉइंटमेंट',
    'nav.resources': 'संसाधन',
    'nav.stories': 'कहानियाँ',
    'nav.buddy': 'साथी',
    'nav.signin': 'साइन इन',
    'nav.signout': 'साइन आउट',
    'nav.start': 'गोपनीय रूप से शुरू करें',
    'nav.counsellor': 'काउंसलर पोर्टल',
    'nav.admin': 'एडमिन कॉकपिट',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.settings': 'सेटिंग्स',
    'nav.notifications': 'सूचनाएँ',
    'nav.search': 'खोजें',
    'nav.allread': 'सब पढ़ा गया',
    'nav.markall': 'सब पढ़ा हुआ चिह्नित करें',
    'cta.anonymous': 'अपनी कहानी गुमनाम रूप से साझा करें',
    'cta.crisis': 'क्या आप अभी तीव्र संकट में हैं?',
    'cta.crisisBody': 'मुफ़्त, गोपनीय संकट सहायता 24/7 उपलब्ध है।',
    'cta.help': 'अभी मदद लें',
    'footer.privacy': 'गोपनीयता और FERPA',
    'footer.crisis': 'संकट दिशानिर्देश',
    'footer.about': 'HERE के बारे में',
    'footer.settings': 'सेटिंग्स',
  },
};

let current = 'EN';
const listeners = new Set();

function readStored() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.some((l) => l.code === stored)) {
      current = stored;
    }
  } catch (e) {
    /* storage unavailable — keep default */
  }
  return current;
}

export function getLanguage() {
  if (current === 'EN') readStored();
  return current;
}

export function setLanguage(code) {
  if (!LANGUAGES.some((l) => l.code === code)) return;
  current = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (e) {
    /* non-fatal */
  }
  listeners.forEach((l) => {
    try {
      l(code);
    } catch (err) {
      console.error('Language listener error:', err);
    }
  });
}

export function subscribeLanguage(listener) {
  getLanguage();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Translate a key, falling back to English then to the key itself. */
export function t(key) {
  return STRINGS[current]?.[key] ?? STRINGS.EN[key] ?? key;
}
