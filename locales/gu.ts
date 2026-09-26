import type { Dictionary } from "./en";

/** Gujarati UI strings. Typed against the English dictionary so no key can be missed. */
export const gu: Dictionary = {
  meta: {
    title: "FarmInfo — ગુજરાત માર્કેટ યાર્ડ ભાવ",
    description: "FarmInfo પર ગુજરાતના માર્કેટ યાર્ડમાં કૃષિ પાકના ભાવ જાણો.",
    pricesTitle: "બજાર ભાવ",
    pricesFilteredTitle: (parts: string[]) => `${parts.join(" — ")} ભાવ — બજાર ભાવ`,
    pricesDescription: (crop?: string, market?: string) =>
      `${market ? `${market}માં ` : "ગુજરાતના માર્કેટ યાર્ડમાં "}${
        crop ? `${crop}ના` : "કૃષિ પાકના"
      } ભાવ જાણો — લઘુત્તમ, મહત્તમ અને મોડલ ભાવ સાથે ૭ દિવસનો ટ્રેન્ડ.`,
    aboutTitle: "FarmInfo વિશે",
    aboutDescription:
      "FarmInfo ગુજરાતના માર્કેટ યાર્ડના કૃષિ ભાવની માહિતી શોધવી અને સમજવી સરળ બનાવે છે.",
  },

  common: {
    tagline: "ગુજરાતના પાકના ભાવ — એક જ જગ્યાએ.",
    skipToContent: "મુખ્ય સામગ્રી પર જાઓ",
    demoData: "ડેમો ડેટા",
    demoDataTitle: "દર્શાવવા માટેના નમૂનારૂપ ભાવ — વાસ્તવિક બજાર ભાવ નથી",
    today: "આજે",
    yesterday: "ગઈકાલે",
    quintal: "ક્વિન્ટલ",
    perQuintal: "/ ક્વિન્ટલ",
    perQtl: "/ ક્વિ.",
    quintalLong: "ક્વિન્ટલ (૧૦૦ કિલો)",
    changeUp: (pct: string) => `ગઈકાલ કરતાં ${pct} વધારો`,
    changeDown: (pct: string) => `ગઈકાલ કરતાં ${pct} ઘટાડો`,
    unchanged: "ગઈકાલ જેટલો જ ભાવ",
    noPrevious: "સરખામણી માટે અગાઉનો ભાવ નથી",
    viewSource: "સ્રોત જુઓ",
    learnMore: "વધુ જાણો",
    backHome: "હોમ પર પાછા જાઓ",
    tryAgain: "ફરી પ્રયાસ કરો",
  },

  language: {
    label: "ભાષા",
    english: "English",
    gujarati: "ગુજરાતી",
  },

  nav: {
    home: "હોમ",
    prices: "માર્કેટ ભાવ",
    about: "અમારા વિશે",
    todayBhav: "આજના ભાવ",
    checkTodayBhav: "આજના ભાવ જુઓ",
    primary: "મુખ્ય",
    mobile: "મોબાઇલ",
    footer: "ફૂટર",
    openMenu: "મેનુ ખોલો",
    closeMenu: "મેનુ બંધ કરો",
    logoAria: "FarmInfo હોમ",
  },

  hero: {
    eyebrow: "ગુજરાત કૃષિ બજાર",
    titleLine1: "ગુજરાતના પાકના ભાવ,",
    titleLine2: "હવે એક જ જગ્યાએ.",
    description:
      "ગુજરાતના માર્કેટ યાર્ડમાં કૃષિ પાકના તાજા ભાવ જાણો — સરળ, ઝડપી અને સહેલું.",
    primaryCta: "આજના ભાવ જુઓ",
    secondaryCta: "માર્કેટ યાર્ડ શોધો",
    imageAlt: "સૂર્યોદય સમયે ધુમ્મસથી ઢંકાયેલાં ખેતરો અને પાછળ ટેકરીઓ",
    todaysMarket: "આજનું બજાર",
    cardAria: (crop: string, market: string) => `આજનું બજાર: ${market}માં ${crop}`,
    range: (min: string, max: string) => `ભાવ ${min} – ${max}`,
    tickerSample: "નમૂના ભાવ",
    tickerLatest: "તાજા ભાવ",
  },

  stats: {
    aria: "વ્યાપ",
    marketsLabel: "ગુજરાતના માર્કેટ યાર્ડ",
    marketsHint: "હાલના ડેટાસેટમાંના APMC યાર્ડ",
    categoriesLabel: "પાકની શ્રેણીઓ",
    categoriesHint: (n: number) => `અનાજ, કઠોળ, તેલીબિયાં સહિત ${n} પાક`,
    entriesLabel: "દૈનિક ભાવ નોંધો",
    entriesHint: (date: string) => `${date}ની નોંધો`,
    districtsLabel: "આવરી લીધેલા જિલ્લા",
    districtsHint: "સૌરાષ્ટ્ર, કચ્છ, ઉત્તર, મધ્ય અને દક્ષિણ",
    noteDemo:
      "આ આંકડા FarmInfo ડેમો ડેટાસેટ પરથી ગણાયા છે; લાઇવ સ્રોત જોડાયા પછી વાસ્તવિક વ્યાપ દર્શાવશે.",
    noteLive: (source: string) => `આ આંકડા ${source} પરથી ગણાયા છે.`,
  },

  snapshot: {
    eyebrow: "બજારની ઝલક",
    titleA: "આજના",
    titleB: "બજાર ભાવ",
    description: "મુખ્ય કૃષિ બજારોમાં શું ચાલી રહ્યું છે તે ઝડપથી જાણો.",
    allPrices: "બધા ભાવ",
    viewAll: "બધા બજાર ભાવ જુઓ",
    empty: "હાલમાં કોઈ ભાવ ઉપલબ્ધ નથી. થોડી વાર પછી ફરી જુઓ.",
  },

  how: {
    eyebrow: "કેવી રીતે કામ કરે છે",
    title: "ફક્ત ત્રણ સરળ પગલાંમાં તમારા ભાવ.",
    description:
      "કોઈ સાઇન-અપ નહીં, કોઈ ગૂંચવણ નહીં. FarmInfo એક જ સવાલનો ઝડપી જવાબ આપે છે: આજે મારા પાકનો ભાવ શું છે?",
    steps: [
      {
        title: "તમારું માર્કેટ પસંદ કરો",
        body: "તમારું ગુજરાતનું માર્કેટ યાર્ડ પસંદ કરો — રાજકોટ, ગોંડલ, ઊંઝા કે કોઈ પણ APMC.",
      },
      {
        title: "તમારો પાક પસંદ કરો",
        body: "ઘઉં, ચોખા, બાજરી, મગફળી, કપાસ, જીરું અને વધુ પસંદ કરો — અથવા સીધું શોધો.",
      },
      {
        title: "આજના ભાવ જુઓ",
        body: "લઘુત્તમ, મહત્તમ અને મોડલ ભાવ સાથે ૭ દિવસની ભાવ ચાલ જુઓ.",
      },
    ],
  },

  feature: {
    eyebrow: "ખેડૂતો અને વેપારીઓ માટે",
    titleA: "ગુજરાતને ઉગાડનારા",
    titleB: "લોકો માટે બનાવેલું.",
    body: "માર્કેટ યાર્ડના ભાવ ઘણી વાર નોટિસ બોર્ડ, ફોન કૉલ અને અઘરા પોર્ટલમાં વેરવિખેર હોય છે. FarmInfo તેમને એક શાંત, સરળ જગ્યાએ લાવે છે — જેથી તમે બજારોની સરખામણી કરી ક્યાં અને ક્યારે વેચવું તે વધુ વિશ્વાસથી નક્કી કરી શકો.",
    quote: "“દરેક મોસમની મહેનતને યોગ્ય ભાવ મળવો જોઈએ.”",
    imageAlt: "ડાંગરના રોપાના પૂળા લઈને ખેતરના પાળા પર ચાલતા ખેડૂત",
    harvestAlt: "સાંજના પ્રકાશમાં પાકેલા ઘઉંના ડૂંડાનું નજીકનું દૃશ્ય",
    items: [
      "માર્કેટ પ્રમાણે ભાવ",
      "પાક પ્રમાણે ફિલ્ટર",
      "ગુજરાત કેન્દ્રિત ડેટા",
      "સરળ ભાવ સરખામણી",
      "મોબાઇલ માટે અનુકૂળ",
      "ઝડપી ઉપયોગ",
    ],
  },

  marketGrid: {
    eyebrow: "માર્કેટ યાર્ડ",
    title: "સમગ્ર ગુજરાતના બજારો",
    description:
      "સૌરાષ્ટ્રના મગફળી અને કપાસના કેન્દ્રોથી ઊંઝાના મસાલા યાર્ડ સુધી — દરેક બજારના ભાવ જુઓ.",
    viewAll: (n: number) => `બધા ${n} યાર્ડ જુઓ`,
    cropsListed: (n: number) => `${n} પાક નોંધાયેલા`,
    noteDemo: "પાકની સંખ્યા ડેમો ડેટાસેટની તાજી તારીખ મુજબ છે.",
    noteLive: "પાકની સંખ્યા ડેટા સ્રોતની તાજી તારીખ મુજબ છે.",
  },

  finalCta: {
    eyebrow: "FarmInfo",
    titleA: "તમારું બજાર જાણો.",
    titleB: "તમારો ભાવ જાણો.",
    description: "ગુજરાતના કૃષિ બજાર ભાવની વધુ સ્પષ્ટ ઝલક મેળવો.",
    button: "બજાર ભાવ જુઓ",
  },

  footer: {
    blurb: "ગુજરાતના માર્કેટ યાર્ડના કૃષિ ભાવ જાણવાની સરળ રીત.",
    explore: "જુઓ",
    data: "ડેટા",
    dataSource: "ડેટા સ્રોત",
    dataDisclaimer: "ડેટા અસ્વીકરણ",
    currentSource: "હાલનો સ્રોત",
    demoNote: "ચકાસાયેલ લાઇવ સ્રોત જોડાય ત્યાં સુધી દર્શાવેલ ભાવ નમૂનારૂપ ડેટા છે.",
    rights: "© 2026 FarmInfo. સર્વ હક્ક સુરક્ષિત.",
    indicative: "ભાવ માત્ર સૂચક છે. વેચાણ પહેલાં તમારા માર્કેટ યાર્ડમાં ખાતરી કરો.",
  },

  prices: {
    eyebrow: "બજાર ડેશબોર્ડ",
    title: "બજાર ભાવ",
    subtitle: "ગુજરાતના માર્કેટ યાર્ડમાં કૃષિ પાકના ભાવ જાણો.",
    latestPrices: "તાજા ભાવ · ",
    showingFor: "આ તારીખના ભાવ: ",
    samplePrices: "નમૂના ભાવ —",
    loading: "બજાર ભાવ લોડ થઈ રહ્યા છે…",
  },

  filters: {
    aria: "બજાર ભાવ ફિલ્ટર કરો",
    market: "માર્કેટ યાર્ડ",
    allMarkets: "બધા માર્કેટ",
    marketPlaceholder: "માર્કેટ કે જિલ્લો શોધો…",
    crop: "પાક",
    allCrops: "બધા પાક",
    cropPlaceholder: "પાક શોધો…",
    date: "તારીખ",
    search: "શોધો",
    searchPlaceholder: "ઘઉં, રાજકોટ, મગફળી…",
    reset: "રીસેટ",
    clearSearch: "શોધ સાફ કરો",
    searchIn: (label: string) => `${label} શોધો`,
    noMatches: (q: string) => `“${q}” માટે કંઈ મળ્યું નથી`,
  },

  summary: {
    aria: "સારાંશ",
    selectedMarket: "પસંદ કરેલ માર્કેટ",
    allMarkets: "બધા માર્કેટ",
    yardsInView: (n: number) => `${n} યાર્ડ દર્શાવેલ`,
    lastUpdated: "છેલ્લે અપડેટ",
    numberOfCrops: "પાકની સંખ્યા",
    entries: (n: number) => `${n} ભાવ નોંધ`,
    dataSource: "ડેટા સ્રોત",
  },

  table: {
    caption: "રૂપિયા પ્રતિ ક્વિન્ટલમાં બજાર ભાવ. વિગતો અને ૭ દિવસનો ટ્રેન્ડ જોવા પાક પસંદ કરો.",
    crop: "પાક",
    market: "માર્કેટ",
    variety: "જાત",
    min: "લઘુત્તમ",
    max: "મહત્તમ",
    modal: "મોડલ",
    unit: "એકમ",
    change: "ફેરફાર",
    updated: "અપડેટ",
    sortBy: "આ મુજબ ગોઠવો: ",
    viewDetails: " — વિગતો જુઓ",
  },

  results: {
    loading: "ભાવ લોડ થઈ રહ્યા છે…",
    found: (n: number) => `${n} ભાવ નોંધ મળી`,
    emptyTitle: "કોઈ ભાવ મળ્યા નથી",
    emptyBody: (q?: string) =>
      `આ પસંદગી${q ? ` (“${q}”)` : ""} માટે ભાવ મળ્યા નથી. બીજું માર્કેટ, પાક કે તારીખ અજમાવો — અથવા ફિલ્ટર સાફ કરો.`,
    resetFilters: "ફિલ્ટર રીસેટ કરો",
    sortLabel: "ગોઠવો",
    sort: {
      cropAsc: "પાક (અ–જ્ઞ)",
      marketAsc: "માર્કેટ (અ–જ્ઞ)",
      modalDesc: "ભાવ: વધુથી ઓછો",
      modalAsc: "ભાવ: ઓછાથી વધુ",
      changeDesc: "સૌથી વધુ વધારો",
      changeAsc: "સૌથી વધુ ઘટાડો",
    },
    showMore: "વધુ જુઓ",
    showing: (shown: number, total: number) => `${total}માંથી ${shown} દર્શાવેલ`,
  },

  card: {
    modal: "મોડલ",
    min: "લઘુત્તમ",
    max: "મહત્તમ",
    updated: (when: string) => `અપડેટ: ${when}`,
    details: "વિગતો",
    aria: (crop: string, market: string, variety: string, price: string) =>
      `${crop}, ${market}, ${variety}: મોડલ ભાવ ${price} પ્રતિ ક્વિન્ટલ. વિગતો જુઓ`,
  },

  details: {
    close: "વિગતો બંધ કરો",
    modalAverage: "મોડલ / સરેરાશ ભાવ",
    vsPrevious: "ગઈકાલની સરખામણીએ",
    minimum: "લઘુત્તમ ભાવ",
    maximum: "મહત્તમ ભાવ",
    variety: "જાત",
    unit: "એકમ",
    date: "તારીખ",
    lastUpdated: "છેલ્લે અપડેટ",
    trendTitle: (n: number) => `ભાવ ટ્રેન્ડ · ${n} દિવસ`,
    week: "અઠવાડિયું",
    low: "નીચો",
    average: "સરેરાશ",
    high: "ઊંચો",
    source: "સ્રોત",
    compare: (crop: string) => `બધા માર્કેટમાં ${crop}ના ભાવ સરખાવો`,
  },

  chart: {
    caption: (crop: string, n: number) => `${crop}નો મોડલ ભાવ, છેલ્લા ${n} દિવસ`,
    aria: (crop: string, n: number, from: string, to: string) =>
      `${n} દિવસમાં ${crop}ના મોડલ ભાવનો લાઇન ચાર્ટ, ${from} થી ${to}`,
    notEnough: "આ નોંધ માટે ટ્રેન્ડ બતાવવા પૂરતો ઇતિહાસ હજી ઉપલબ્ધ નથી.",
    tableCaption: (crop: string) => `${crop}નો દૈનિક મોડલ ભાવ`,
    colDate: "તારીખ",
    colModal: "મોડલ ભાવ (₹/ક્વિન્ટલ)",
  },

  errors: {
    pricesTitle: "બજાર ભાવ લોડ થઈ શક્યા નથી",
    pricesBody:
      "ભાવ સ્રોતે અપેક્ષા મુજબ જવાબ આપ્યો નથી. આ સામાન્ય રીતે થોડા સમય માટે હોય છે — થોડી વાર પછી ફરી પ્રયાસ કરો.",
    reference: "સંદર્ભ",
    rootTitle: "કંઈક ખોટું થયું",
    rootBody: "આ પેજ લોડ થઈ શક્યું નથી. થોડી વાર પછી ફરી પ્રયાસ કરો.",
    notFoundTitle: "આ ખેતર ખાલી છે.",
    notFoundBody: "તમે શોધતા હતા તે પેજ અસ્તિત્વમાં નથી અથવા ખસેડાયું છે.",
  },

  about: {
    heroEyebrow: "FarmInfo વિશે",
    heroTitleA: "બજારની માહિતી",
    heroTitleB: "હવે વધુ સરળતાથી.",
    heroBody:
      "FarmInfo કૃષિ બજારની માહિતી શોધવી અને સમજવી સરળ બનાવવા માટે બનાવાયું છે — ખેડૂતો, વેપારીઓ અને ગુજરાતના માર્કેટ યાર્ડને અનુસરતા દરેક માટે.",
    heroAlt: "દૂર ટેકરીઓ સુધી ફેલાયેલાં લીલાં ડાંગરનાં ખેતરોનું હવાઈ દૃશ્ય",
    purposeEyebrow: "અમારો હેતુ",
    purposeTitle: "ભાવ શોધવા અઘરા ન હોવા જોઈએ.",
    purposeP1:
      "કૃષિ ભાવ ઘણી વાર અલગ અલગ સ્રોતોમાં વેરવિખેર હોય છે — સરકારી પોર્ટલ, યાર્ડના નોટિસ બોર્ડ, અખબારો, ફોન પર ફોરવર્ડ થતા સંદેશા. દરેક પોતાની રીતે થોડી જ માહિતી આપે છે.",
    purposeP2:
      "FarmInfo બજાર ભાવ જોવાની વધુ સ્વચ્છ રીત આપે છે: માર્કેટ અને પાક મુજબ ગોઠવાયેલા લઘુત્તમ, મહત્તમ અને મોડલ ભાવ — કોઈ પણ ફોન પર સહેલાઈથી વંચાય તેવા.",
    marketAlt: "મસાલાની ભરેલી ગૂણો સાથે બજારની દુકાને ઊભેલા વેપારી",
    quote: "“આજે મારા પાકનો ભાવ શું છે — અને ક્યાં?”",
    quoteSub: "FarmInfo આ જ એક સવાલનો જવાબ આપવા બનાવાયું છે.",
    capEyebrow: "તમે શું કરી શકો",
    capTitle: "બજાર સમજવા માટે જરૂરી બધું.",
    capDescription: "છ સરળ સાધનો, એક સ્વચ્છ ઇન્ટરફેસ.",
    capabilities: [
      { title: "માર્કેટ પ્રમાણે ભાવ", body: "ગુજરાતનું કોઈ પણ APMC ખોલો અને તે દિવસના બધા પાક જુઓ." },
      { title: "પાક પ્રમાણે ભાવ", body: "એક પાક — જીરું, કપાસ, મગફળી — બધા યાર્ડમાં જુઓ." },
      { title: "ભાવ સરખામણી", body: "લઘુત્તમ, મહત્તમ અને મોડલ ભાવ બાજુબાજુમાં, ગોઠવી શકાય તેવા." },
      { title: "બજાર શોધ", body: "સૌરાષ્ટ્ર, કચ્છ, ઉત્તર, મધ્ય અને દક્ષિણ ગુજરાતના યાર્ડ શોધો." },
      { title: "ભાવ ટ્રેન્ડ", body: "દરેક નોંધ માટે ૭ દિવસનો ચાર્ટ બતાવે છે કે ભાવ કઈ દિશામાં જાય છે." },
      { title: "મોબાઇલ પર ઉપયોગ", body: "પહેલા ફોન માટે બનાવેલું — સાંકડાં ટેબલને બદલે કાર્ડ." },
    ],
    gujaratEyebrow: "ગુજરાત માટે બનાવેલું",
    gujaratTitleA: "કચ્છથી નવસારી સુધી,",
    gujaratTitleB: "એક જ નજરે.",
    gujaratBody:
      "ગુજરાતના દરેક યાર્ડની પોતાની ઓળખ છે — સૌરાષ્ટ્રમાં મગફળી અને કપાસ, ઊંઝામાં જીરું અને વરિયાળી, ડીસામાં બટાકા, ગોંડલમાં લસણ. FarmInfo આ ભૂગોળ મુજબ ગોઠવાયેલું છે, અને શોધમાં ગુજરાતી પાકનાં નામ પણ ચાલે છે.",
    marketYards: "માર્કેટ યાર્ડ",
    districts: "જિલ્લા",
    crops: "પાક",
    countsDemo: "આંકડા હાલના ડેમો ડેટાસેટ મુજબ છે.",
    dataEyebrow: "ડેટા પારદર્શિતા",
    dataTitle: "આ આંકડા ક્યાંથી આવે છે.",
    dataDescription: "વિશ્વાસની શરૂઆત સ્રોત, સમય અને મર્યાદાઓ અંગે સ્પષ્ટતાથી થાય છે.",
    disclaimer:
      "FarmInfo ઉપલબ્ધ કૃષિ ડેટા પ્રદાતાઓ પાસેથી મળેલી બજાર માહિતી દર્શાવે છે. ડેટાની ઉપલબ્ધતા, અપડેટની આવર્તન અને ચોકસાઈ સ્રોત મુજબ બદલાઈ શકે છે.",
    indicative:
      "ભાવ માત્ર સૂચક છે અને ખરીદ-વેચાણની ઓફર નથી. વેપાર પહેલાં તમારા APMC કે કમિશન એજન્ટ પાસેથી તાજા ભાવની ખાતરી કરો.",
    demoStrong:
      "FarmInfo હાલમાં બનાવેલા ડેમો ડેટા પર ચાલે છે — દર્શાવેલ ભાવ નમૂનારૂપ છે, વાસ્તવિક બજાર ભાવ નથી.",
    lastUpdated: "છેલ્લે અપડેટ",
    unavailable: "હાલમાં ઉપલબ્ધ નથી",
    dataSource: "ડેટા સ્રોત",
    sourceLink: "સ્રોત લિંક",
    agmarknetLink: "data.gov.in પર AGMARKNET ડેટાસેટ",
    openSource: "ડેટા સ્રોત ખોલો",
    officialNote: "FarmInfo જે સત્તાવાર ઓપન ડેટાસેટ સાથે જોડાવા માટે બનાવાયું છે.",
    ready: "આજના ભાવ જોવા તૈયાર છો?",
    viewPrices: "બજાર ભાવ જુઓ",
  },

  map: {
    title: (n: number, list: string) => `${n} માર્કેટ યાર્ડ દર્શાવતો ગુજરાતનો નકશો, જેમાં ${list} સામેલ છે`,
    regions: { kutch: "કચ્છ", saurashtra: "સૌરાષ્ટ્ર", north: "ઉત્તર" },
    major: "મુખ્ય માર્કેટ યાર્ડ",
    other: "અન્ય યાર્ડ",
    boundary: "સરહદ:",
  },

  sources: {
    demo: {
      name: "FarmInfo ડેમો ડેટાસેટ",
      description:
        "ડિઝાઇન અને વિકાસ માટે બનાવેલા નમૂનારૂપ ભાવ. આ વાસ્તવિક બજાર ભાવ નથી.",
      updateFrequency: "દરરોજ નવેસરથી બને છે (નમૂના ડેટા)",
    },
    agmarknet: {
      name: "data.gov.in દ્વારા AGMARKNET (ભારત સરકાર)",
      description:
        "માર્કેટિંગ અને નિરીક્ષણ નિયામકાલય દ્વારા પ્રકાશિત અને ઓપન ગવર્નમેન્ટ ડેટા (OGD) પ્લેટફોર્મ ઇન્ડિયા દ્વારા ઉપલબ્ધ દૈનિક મંડી (માર્કેટ યાર્ડ) ભાવ.",
      updateFrequency: "દરરોજ, દરેક બજારે પ્રકાશિત કર્યા મુજબ",
    },
  },

  format: {
    marketName: (city: string) => `${city} માર્કેટ યાર્ડ`,
    district: (district: string) => `${district} જિલ્લો`,
  },

  crops: {
    wheat: "ઘઉં",
    rice: "ચોખા",
    bajra: "બાજરી",
    maize: "મકાઈ",
    groundnut: "મગફળી",
    cotton: "કપાસ",
    castor: "એરંડા",
    cumin: "જીરું",
    sesame: "તલ",
    mustard: "રાયડો",
    chana: "ચણા",
    tur: "તુવેર",
    moong: "મગ",
    urad: "અડદ",
    onion: "ડુંગળી",
    potato: "બટાકા",
    garlic: "લસણ",
    coriander: "ધાણા",
    fennel: "વરિયાળી",
  },

  cities: {
    rajkot: "રાજકોટ",
    gondal: "ગોંડલ",
    jamnagar: "જામનગર",
    ahmedabad: "અમદાવાદ",
    unjha: "ઊંઝા",
    morbi: "મોરબી",
    surendranagar: "સુરેન્દ્રનગર",
    junagadh: "જૂનાગઢ",
    mehsana: "મહેસાણા",
    bhavnagar: "ભાવનગર",
    jetpur: "જેતપુર",
    dhoraji: "ધોરાજી",
    veraval: "વેરાવળ",
    porbandar: "પોરબંદર",
    mahuva: "મહુવા",
    amreli: "અમરેલી",
    botad: "બોટાદ",
    visnagar: "વિસનગર",
    palanpur: "પાલનપુર",
    deesa: "ડીસા",
    patan: "પાટણ",
    himmatnagar: "હિંમતનગર",
    bhuj: "ભુજ",
    anand: "આણંદ",
    nadiad: "નડિયાદ",
    vadodara: "વડોદરા",
    godhra: "ગોધરા",
    surat: "સુરત",
    bharuch: "ભરૂચ",
    navsari: "નવસારી",
  },

  /** Keyed by the English district name used in the data */
  districts: {
    Rajkot: "રાજકોટ",
    Jamnagar: "જામનગર",
    Ahmedabad: "અમદાવાદ",
    Mehsana: "મહેસાણા",
    Morbi: "મોરબી",
    Surendranagar: "સુરેન્દ્રનગર",
    Junagadh: "જૂનાગઢ",
    Bhavnagar: "ભાવનગર",
    "Gir Somnath": "ગીર સોમનાથ",
    Porbandar: "પોરબંદર",
    Amreli: "અમરેલી",
    Botad: "બોટાદ",
    Banaskantha: "બનાસકાંઠા",
    Patan: "પાટણ",
    Sabarkantha: "સાબરકાંઠા",
    Kutch: "કચ્છ",
    Anand: "આણંદ",
    Kheda: "ખેડા",
    Vadodara: "વડોદરા",
    Panchmahal: "પંચમહાલ",
    Surat: "સુરત",
    Bharuch: "ભરૂચ",
    Navsari: "નવસારી",
  },

  categories: {
    Cereals: "અનાજ",
    Pulses: "કઠોળ",
    Oilseeds: "તેલીબિયાં",
    Spices: "મસાલા",
    Fibre: "રેસાવાળા પાક",
    Vegetables: "શાકભાજી",
    Other: "અન્ય",
  },
};
