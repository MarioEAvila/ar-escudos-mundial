export const highlightedSelections = [
  {
    id: "mexico",
    name: "México",
    flag: "🇲🇽",
    rank: "N° 15 FIFA",
    color: "var(--mexico)",
  },
  {
    id: "argentina",
    name: "Argentina",
    flag: "🇦🇷",
    rank: "N° 1 FIFA",
    color: "var(--argentina)",
  },
  {
    id: "brasil",
    name: "Brasil",
    flag: "🇧🇷",
    rank: "N° 3 FIFA",
    color: "var(--brasil)",
  },
  {
    id: "francia",
    name: "Francia",
    flag: "🇫🇷",
    rank: "N° 2 FIFA",
    color: "var(--francia)",
  },
  {
    id: "espana",
    name: "España",
    flag: "🇪🇸",
    rank: "N° 8 FIFA",
    color: "var(--espana)",
  },
];

export const quickStats = [
  { team: "México", stat1: "125 PJ", stat2: "210 Goles", stat3: "78 Victorias", flag: "🇲🇽" },
  { team: "Argentina", stat1: "128 PJ", stat2: "269 Goles", stat3: "89 Victorias", flag: "🇦🇷" },
  { team: "Brasil", stat1: "127 PJ", stat2: "247 Goles", stat3: "85 Victorias", flag: "🇧🇷" },
];

export const upcomingMatches = [
  { id: 1, home: "México", away: "Estados Unidos", date: "11 JUN 2026", time: "20:00", homeFlag: "🇲🇽", awayFlag: "🇺🇸" },
  { id: 2, home: "Argentina", away: "Brasil", date: "12 JUN 2026", time: "18:00", homeFlag: "🇦🇷", awayFlag: "🇧🇷" },
  { id: 3, home: "Francia", away: "Alemania", date: "12 JUN 2026", time: "21:00", homeFlag: "🇫🇷", awayFlag: "🇩🇪" },
];

export const trends = [
  { id: 1, tag: "#Mundial2026", posts: "21.3K publicaciones" },
  { id: 2, tag: "#VamosMéxico", posts: "18.7K publicaciones" },
  { id: 3, tag: "#ArgentinaCampeón", posts: "12.5K publicaciones" },
];

export const initialFeedPosts = [
  {
    id: "news-1",
    type: "news",
    author: "MundoFutbol",
    username: "@mundofutbol",
    verified: true,
    time: "Hace 30 min",
    text: "¡OFICIAL! Así se jugará la Fase de Grupos del Mundial 2026. Conoce todos los detalles aquí.",
    image:
      "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1200&q=80",
    likes: 24,
    comments: 5,
    shares: 3,
    favorite: false,
  },
  {
    id: "post-1",
    type: "post",
    author: "Fanatico10",
    username: "@fanatico10",
    verified: false,
    time: "Hace 2 min",
    text: "¡Qué partidazo de México! El equipo se ve increíble, este mundial es nuestro. 🇲🇽💚",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    likes: 31,
    comments: 8,
    shares: 2,
    favorite: true,
  },
  {
    id: "news-2",
    type: "news",
    author: "Portal2026",
    username: "@portal2026",
    verified: true,
    time: "Hace 1 h",
    text: "Japón presenta nueva preparación rumbo al torneo con un estilo de juego más agresivo y veloz.",
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
    likes: 15,
    comments: 4,
    shares: 6,
    favorite: false,
  },
];