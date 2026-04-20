export const countryOrder = [
  "mexico",
  "argentina",
  "brazil",
  "france",
  "germany",
  "spain",
  "england",
  "portugal",
  "uruguay",
  "netherlands",
  "italy",
  "japan",
];

export const scannerEnabledCountries = ["mexico", "argentina", "brazil"];

export const triviaData = {
  mexico: {
    id: "mexico",
    name: "México",
    flag: "🇲🇽",
    era: "2026",
    scannerEnabled: true,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "mex_2026_1",
        difficulty: "easy",
        theme: "road_to_2026",
        question: "¿Qué papel tendrá México en la Copa del Mundo 2026?",
        options: [
          "Solo participará como invitado",
          "Será uno de los países anfitriones",
          "No participará automáticamente",
          "Solo albergará un partido amistoso",
        ],
        correctIndex: 1,
        explanation:
          "México será uno de los tres países anfitriones del Mundial 2026 junto con Estados Unidos y Canadá.",
      },
      {
        id: "mex_2026_2",
        difficulty: "easy",
        theme: "sedes",
        question: "¿Cuántas ciudades sede tendrá México en el Mundial 2026?",
        options: ["2", "3", "4", "5"],
        correctIndex: 1,
        explanation:
          "México tendrá tres ciudades sede para la Copa del Mundo 2026.",
      },
      {
        id: "mex_2026_3",
        difficulty: "medium",
        theme: "historia",
        question: "Si México disputa el Mundial 2026, ¿qué logro histórico conseguiría como anfitrión?",
        options: [
          "Ser sede por segunda vez",
          "Ser la primera sede compartida",
          "Ser sede por tercera vez",
          "Ser la primera sede de CONCACAF",
        ],
        correctIndex: 2,
        explanation:
          "México sería el primer país en organizar tres Copas del Mundo: 1970, 1986 y 2026.",
      },
    ],
  },

  argentina: {
    id: "argentina",
    name: "Argentina",
    flag: "🇦🇷",
    era: "2026",
    scannerEnabled: true,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "arg_2026_1",
        difficulty: "easy",
        theme: "campeon_vigente",
        question: "¿Con qué estatus llega Argentina rumbo al Mundial 2026?",
        options: [
          "Como subcampeón vigente",
          "Como campeón vigente",
          "Como anfitrión",
          "Como invitado especial",
        ],
        correctIndex: 1,
        explanation:
          "Argentina llega rumbo a 2026 como campeona del mundo tras ganar Qatar 2022.",
      },
      {
        id: "arg_2026_2",
        difficulty: "medium",
        theme: "road_to_2026",
        question: "¿Qué selección buscará defender su título mundial en 2026?",
        options: ["Francia", "Brasil", "Argentina", "Alemania"],
        correctIndex: 2,
        explanation:
          "Argentina intentará defender el título conseguido en 2022.",
      },
      {
        id: "arg_2026_3",
        difficulty: "easy",
        theme: "figuras",
        question: "¿Qué jugador es la principal referencia reciente de Argentina rumbo a 2026?",
        options: [
          "Lautaro Martínez",
          "Ángel Di María",
          "Lionel Messi",
          "Paulo Dybala",
        ],
        correctIndex: 2,
        explanation:
          "Lionel Messi sigue siendo la referencia más reconocible de Argentina en esta etapa rumbo a 2026.",
      },
    ],
  },

  brazil: {
    id: "brazil",
    name: "Brasil",
    flag: "🇧🇷",
    era: "2026",
    scannerEnabled: true,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "bra_2026_1",
        difficulty: "easy",
        theme: "historia",
        question: "¿Qué selección llega rumbo a 2026 con más títulos mundiales en la historia?",
        options: ["Alemania", "Italia", "Brasil", "Argentina"],
        correctIndex: 2,
        explanation:
          "Brasil es la selección con más títulos mundiales: 5.",
      },
      {
        id: "bra_2026_2",
        difficulty: "medium",
        theme: "objetivo",
        question: "¿Qué buscará Brasil especialmente en el Mundial 2026?",
        options: [
          "Su primer título mundial",
          "Su sexto título mundial",
          "Su tercer subcampeonato",
          "Clasificar por primera vez",
        ],
        correctIndex: 1,
        explanation:
          "Brasil buscará conquistar su sexta Copa del Mundo.",
      },
      {
        id: "bra_2026_3",
        difficulty: "easy",
        theme: "figuras",
        question: "¿Qué tipo de expectativa suele acompañar a Brasil en cada Mundial rumbo a 2026?",
        options: [
          "Ser sorpresa menor",
          "Ser una de las favoritas",
          "Quedar fuera en grupos",
          "No clasificar",
        ],
        correctIndex: 1,
        explanation:
          "Brasil suele llegar a cada Mundial como una de las grandes favoritas.",
      },
    ],
  },

  france: {
    id: "france",
    name: "Francia",
    flag: "🇫🇷",
    era: "2026",
    scannerEnabled: false,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "fra_2026_1",
        difficulty: "easy",
        theme: "historia",
        question: "¿Qué selección fue finalista en Qatar 2022 y sigue siendo candidata rumbo a 2026?",
        options: ["Francia", "España", "Portugal", "Uruguay"],
        correctIndex: 0,
        explanation:
          "Francia fue finalista en 2022 y continúa siendo una potencia de cara a 2026.",
      },
      {
        id: "fra_2026_2",
        difficulty: "medium",
        theme: "figuras",
        question: "¿Qué delantero francés es una de las grandes figuras rumbo a 2026?",
        options: [
          "Antoine Griezmann",
          "Kylian Mbappé",
          "Olivier Giroud",
          "Kingsley Coman",
        ],
        correctIndex: 1,
        explanation:
          "Kylian Mbappé es una de las máximas figuras francesas rumbo a 2026.",
      },
      {
        id: "fra_2026_3",
        difficulty: "easy",
        theme: "titulos",
        question: "¿Cuántos títulos mundiales tiene Francia antes de 2026?",
        options: ["1", "2", "3", "4"],
        correctIndex: 1,
        explanation:
          "Francia ha ganado dos Copas del Mundo: 1998 y 2018.",
      },
    ],
  },

  germany: {
    id: "germany",
    name: "Alemania",
    flag: "🇩🇪",
    era: "2026",
    scannerEnabled: false,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "ger_2026_1",
        difficulty: "easy",
        theme: "historia",
        question: "¿Cuántos títulos mundiales tiene Alemania antes de 2026?",
        options: ["2", "3", "4", "5"],
        correctIndex: 2,
        explanation:
          "Alemania suma cuatro títulos mundiales en su historia.",
      },
      {
        id: "ger_2026_2",
        difficulty: "medium",
        theme: "objetivo",
        question: "Rumbo a 2026, ¿qué buscará recuperar Alemania?",
        options: [
          "Su estatus de potencia mundialista",
          "Su primer título",
          "Su pase a Eurocopa",
          "Su condición de anfitrión",
        ],
        correctIndex: 0,
        explanation:
          "Alemania buscará consolidarse otra vez como gran potencia en el Mundial 2026.",
      },
      {
        id: "ger_2026_3",
        difficulty: "easy",
        theme: "historia",
        question: "¿En qué Mundial consiguió Alemania su título más reciente?",
        options: ["2006", "2010", "2014", "2018"],
        correctIndex: 2,
        explanation:
          "Alemania ganó su título más reciente en Brasil 2014.",
      },
    ],
  },

  spain: {
    id: "spain",
    name: "España",
    flag: "🇪🇸",
    era: "2026",
    scannerEnabled: false,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "esp_2026_1",
        difficulty: "easy",
        theme: "historia",
        question: "¿Cuántos títulos mundiales tiene España antes de 2026?",
        options: ["0", "1", "2", "3"],
        correctIndex: 1,
        explanation:
          "España ganó su única Copa del Mundo en 2010.",
      },
      {
        id: "esp_2026_2",
        difficulty: "medium",
        theme: "road_to_2026",
        question: "¿Qué buscará consolidar España rumbo a 2026?",
        options: [
          "Una nueva generación competitiva",
          "Su cuarta sede mundialista",
          "Su primer pase a eliminatorias",
          "Un cambio de confederación",
        ],
        correctIndex: 0,
        explanation:
          "España llega rumbo a 2026 impulsando una nueva generación de jugadores talentosos.",
      },
      {
        id: "esp_2026_3",
        difficulty: "easy",
        theme: "historia",
        question: "¿Contra qué selección ganó España la final del Mundial 2010?",
        options: ["Alemania", "Italia", "Países Bajos", "Uruguay"],
        correctIndex: 2,
        explanation:
          "España venció a Países Bajos en la final de 2010.",
      },
    ],
  },

  england: {
    id: "england",
    name: "Inglaterra",
    flag: "🏴",
    era: "2026",
    scannerEnabled: false,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "eng_2026_1",
        difficulty: "easy",
        theme: "historia",
        question: "¿Cuántas Copas del Mundo ha ganado Inglaterra antes de 2026?",
        options: ["0", "1", "2", "3"],
        correctIndex: 1,
        explanation:
          "Inglaterra ha ganado una Copa del Mundo, en 1966.",
      },
      {
        id: "eng_2026_2",
        difficulty: "medium",
        theme: "road_to_2026",
        question: "Rumbo a 2026, Inglaterra suele llegar con qué tipo de expectativa?",
        options: [
          "Ser una de las favoritas",
          "No clasificar",
          "Ser anfitriona",
          "Jugar solo amistosos",
        ],
        correctIndex: 0,
        explanation:
          "Inglaterra suele llegar con altas expectativas y planteles competitivos.",
      },
      {
        id: "eng_2026_3",
        difficulty: "easy",
        theme: "figuras",
        question: "¿Qué posición histórica intentará mejorar Inglaterra en 2026?",
        options: [
          "Su primer tercer lugar",
          "Su segundo título mundial",
          "Su primera clasificación",
          "Su primer subcampeonato europeo",
        ],
        correctIndex: 1,
        explanation:
          "Inglaterra buscará conquistar su segundo título mundial.",
      },
    ],
  },

  portugal: {
    id: "portugal",
    name: "Portugal",
    flag: "🇵🇹",
    era: "2026",
    scannerEnabled: false,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "por_2026_1",
        difficulty: "easy",
        theme: "figuras",
        question: "¿Qué selección europea sigue asociándose fuertemente con Cristiano Ronaldo rumbo a 2026?",
        options: ["España", "Francia", "Portugal", "Italia"],
        correctIndex: 2,
        explanation:
          "Portugal sigue siendo la selección más asociada a Cristiano Ronaldo.",
      },
      {
        id: "por_2026_2",
        difficulty: "medium",
        theme: "historia",
        question: "¿Cuál ha sido el mejor resultado histórico de Portugal en una Copa del Mundo?",
        options: ["Campeón", "Subcampeón", "Tercer lugar", "Cuarto lugar"],
        correctIndex: 2,
        explanation:
          "Portugal logró el tercer lugar en 1966.",
      },
      {
        id: "por_2026_3",
        difficulty: "easy",
        theme: "road_to_2026",
        question: "¿Qué buscará Portugal en el Mundial 2026?",
        options: [
          "Su primer título mundial",
          "Su sexta Copa",
          "Su condición de anfitrión",
          "Volver a debutar",
        ],
        correctIndex: 0,
        explanation:
          "Portugal buscará conquistar su primera Copa del Mundo.",
      },
    ],
  },

  uruguay: {
    id: "uruguay",
    name: "Uruguay",
    flag: "🇺🇾",
    era: "2026",
    scannerEnabled: false,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "uru_2026_1",
        difficulty: "easy",
        theme: "titulos",
        question: "¿Cuántas Copas del Mundo ha ganado Uruguay antes de 2026?",
        options: ["1", "2", "3", "4"],
        correctIndex: 1,
        explanation:
          "Uruguay ganó las Copas del Mundo de 1930 y 1950.",
      },
      {
        id: "uru_2026_2",
        difficulty: "medium",
        theme: "historia",
        question: "¿Qué representa Uruguay rumbo a 2026 dentro de la historia del Mundial?",
        options: [
          "La primera sede y campeón inicial",
          "El país con más títulos",
          "El anfitrión de 2026",
          "El campeón vigente",
        ],
        correctIndex: 0,
        explanation:
          "Uruguay fue la primera sede y el primer campeón de la historia mundialista.",
      },
      {
        id: "uru_2026_3",
        difficulty: "easy",
        theme: "road_to_2026",
        question: "¿Qué suele caracterizar a Uruguay en torneos mundialistas?",
        options: [
          "Nunca competir",
          "Ser una selección históricamente competitiva",
          "No clasificar",
          "Solo jugar de local",
        ],
        correctIndex: 1,
        explanation:
          "Uruguay suele ser una selección muy competitiva en torneos grandes.",
      },
    ],
  },

  netherlands: {
    id: "netherlands",
    name: "Países Bajos",
    flag: "🇳🇱",
    era: "2026",
    scannerEnabled: false,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "ned_2026_1",
        difficulty: "easy",
        theme: "historia",
        question: "¿Cuántas finales de Copa del Mundo ha jugado Países Bajos antes de 2026?",
        options: ["1", "2", "3", "4"],
        correctIndex: 2,
        explanation:
          "Países Bajos ha jugado tres finales mundialistas.",
      },
      {
        id: "ned_2026_2",
        difficulty: "medium",
        theme: "road_to_2026",
        question: "¿Qué buscará conseguir Países Bajos en 2026 por primera vez?",
        options: [
          "Ser anfitrión",
          "Ganar una Copa del Mundo",
          "Clasificar a octavos",
          "Jugar una final",
        ],
        correctIndex: 1,
        explanation:
          "Países Bajos ha llegado a finales, pero todavía busca su primer título mundial.",
      },
      {
        id: "ned_2026_3",
        difficulty: "easy",
        theme: "historia",
        question: "¿Contra qué selección perdió Países Bajos la final de 2010?",
        options: ["Alemania", "Brasil", "España", "Argentina"],
        correctIndex: 2,
        explanation:
          "Países Bajos perdió la final de 2010 frente a España.",
      },
    ],
  },

  italy: {
    id: "italy",
    name: "Italia",
    flag: "🇮🇹",
    era: "2026",
    scannerEnabled: false,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "ita_2026_1",
        difficulty: "easy",
        theme: "titulos",
        question: "¿Cuántas Copas del Mundo ha ganado Italia antes de 2026?",
        options: ["2", "3", "4", "5"],
        correctIndex: 2,
        explanation:
          "Italia ha ganado cuatro Copas del Mundo.",
      },
      {
        id: "ita_2026_2",
        difficulty: "medium",
        theme: "road_to_2026",
        question: "¿Qué buscará recuperar Italia rumbo a 2026?",
        options: [
          "Presencia estable en la élite mundialista",
          "Su primer pase a una Euro",
          "Su rol de anfitrión",
          "Su cambio de confederación",
        ],
        correctIndex: 0,
        explanation:
          "Italia buscará recuperar regularidad y protagonismo en el escenario mundialista.",
      },
      {
        id: "ita_2026_3",
        difficulty: "easy",
        theme: "historia",
        question: "¿En qué Mundial consiguió Italia su título más reciente?",
        options: ["1998", "2002", "2006", "2010"],
        correctIndex: 2,
        explanation:
          "Italia fue campeona del mundo por última vez en 2006.",
      },
    ],
  },

  japan: {
    id: "japan",
    name: "Japón",
    flag: "🇯🇵",
    era: "2026",
    scannerEnabled: false,
    title: "Road to World Cup 2026",
    questions: [
      {
        id: "jpn_2026_1",
        difficulty: "easy",
        theme: "historia",
        question: "¿Qué selección asiática fue coanfitriona del Mundial 2002?",
        options: ["Corea del Sur", "Japón", "China", "Arabia Saudita"],
        correctIndex: 1,
        explanation:
          "Japón fue coanfitrión del Mundial 2002 junto con Corea del Sur.",
      },
      {
        id: "jpn_2026_2",
        difficulty: "medium",
        theme: "road_to_2026",
        question: "¿Qué representa Japón rumbo a 2026 dentro del fútbol asiático?",
        options: [
          "Una selección con crecimiento competitivo constante",
          "La campeona vigente del mundo",
          "La sede principal de 2026",
          "La selección con más mundiales ganados",
        ],
        correctIndex: 0,
        explanation:
          "Japón es una de las selecciones asiáticas con crecimiento más consistente.",
      },
      {
        id: "jpn_2026_3",
        difficulty: "easy",
        theme: "historia",
        question: "¿Cuál es la mejor fase que ha alcanzado Japón en una Copa del Mundo antes de 2026?",
        options: ["Semifinal", "Cuartos de final", "Octavos de final", "Final"],
        correctIndex: 2,
        explanation:
          "Japón ha alcanzado los octavos de final en varias ocasiones.",
      },
    ],
  },
};

export function getTriviaByCountry(countryId) {
  return triviaData[countryId] || null;
}