
export interface Country {
  name: string;
  code: string;
  cities: string[];
}

export const COUNTRIES_AND_CITIES: Country[] = [
  {
    name: "Afghanistan",
    code: "AF",
    cities: ["Kabul", "Kandahar", "Herat", "Mazar-i-Sharif", "Jalalabad", "Kunduz", "Ghazni", "Balkh"]
  },
  {
    name: "Albania",
    code: "AL",
    cities: ["Tirana", "Durrës", "Vlorë", "Elbasan", "Shkodër", "Korçë", "Fier", "Berat"]
  },
  {
    name: "Algeria",
    code: "DZ",
    cities: ["Algiers", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Djelfa", "Sétif"]
  },
  {
    name: "Argentina",
    code: "AR",
    cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Tucumán", "Mar del Plata", "Salta"]
  },
  {
    name: "Armenia",
    code: "AM",
    cities: ["Yerevan", "Gyumri", "Vanadzor", "Vagharshapat", "Hrazdan", "Abovyan", "Kapan", "Armavir"]
  },
  {
    name: "Australia",
    code: "AU",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra", "Sunshine Coast", "Wollongong", "Logan City", "Geelong", "Hobart", "Townsville", "Cairns", "Darwin", "Toowoomba", "Ballarat", "Bendigo", "Albury", "Launceston", "Mackay", "Rockhampton", "Bunbury", "Bundaberg", "Coffs Harbour", "Wagga Wagga", "Hervey Bay", "Mildura", "Shepparton"]
  },
  {
    name: "Austria",
    code: "AT",
    cities: ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", "Wels"]
  },
  {
    name: "Azerbaijan",
    code: "AZ",
    cities: ["Baku", "Ganja", "Sumqayit", "Mingachevir", "Qaradag", "Shirvan", "Nakhchivan", "Lankaran"]
  },
  {
    name: "Bangladesh",
    code: "BD",
    cities: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"]
  },
  {
    name: "Belarus",
    code: "BY",
    cities: ["Minsk", "Gomel", "Mogilev", "Vitebsk", "Grodno", "Brest", "Bobruisk", "Baranovichi"]
  },
  {
    name: "Belgium",
    code: "BE",
    cities: ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur", "Leuven"]
  },
  {
    name: "Brazil",
    code: "BR",
    cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia", "Belém", "Porto Alegre", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Nova Iguaçu", "Teresina", "Natal", "Campo Grande", "São Bernardo do Campo", "João Pessoa", "Santo André", "Osasco", "Jaboatão dos Guararapes", "São José dos Campos", "Ribeirão Preto", "Uberlândia"]
  },
  {
    name: "Bulgaria",
    code: "BG",
    cities: ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven"]
  },
  {
    name: "Cambodia",
    code: "KH",
    cities: ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Poipet", "Kampong Cham", "Pursat", "Kampong Speu"]
  },
  {
    name: "Canada",
    code: "CA",
    cities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", "Halifax", "Oshawa", "Windsor", "Saskatoon", "St. Catharines", "Regina", "Sherbrooke", "St. John's", "Barrie", "Kelowna", "Abbotsford", "Kingston", "Sudbury", "Saguenay", "Trois-Rivières", "Guelph", "Cambridge", "Whitby"]
  },
  {
    name: "Chile",
    code: "CL",
    cities: ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco", "Rancagua", "Talca"]
  },
  {
    name: "China",
    code: "CN",
    cities: ["Shanghai", "Beijing", "Chongqing", "Tianjin", "Guangzhou", "Shenzhen", "Wuhan", "Dongguan", "Chengdu", "Nanjing", "Foshan", "Shenyang", "Hangzhou", "Xi'an", "Harbin", "Qingdao", "Zhengzhou", "Changchun", "Dalian", "Kunming", "Jinan", "Changsha", "Taiyuan", "Xiamen", "Hefei", "Shijiazhuang", "Urumqi", "Fuzhou", "Wuxi", "Zhongshan"]
  },
  {
    name: "Colombia",
    code: "CO",
    cities: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira"]
  },
  {
    name: "Croatia",
    code: "HR",
    cities: ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Slavonski Brod", "Pula", "Karlovac"]
  },
  {
    name: "Czech Republic",
    code: "CZ",
    cities: ["Prague", "Brno", "Ostrava", "Plzen", "Liberec", "Olomouc", "České Budějovice", "Hradec Králové"]
  },
  {
    name: "Denmark",
    code: "DK",
    cities: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens"]
  },
  {
    name: "Egypt",
    code: "EG",
    cities: ["Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", "Suez", "Luxor", "Mansoura"]
  },
  {
    name: "Estonia",
    code: "EE",
    cities: ["Tallinn", "Tartu", "Narva", "Pärnu", "Kohtla-Järve", "Viljandi", "Rakvere", "Maardu"]
  },
  {
    name: "Finland",
    code: "FI",
    cities: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Lahti"]
  },
  {
    name: "France",
    code: "FR",
    cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille", "Rennes", "Reims", "Saint-Étienne", "Le Havre", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Saint-Denis", "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest", "Limoges", "Tours", "Amiens", "Perpignan", "Metz"]
  },
  {
    name: "Georgia",
    code: "GE",
    cities: ["Tbilisi", "Batumi", "Kutaisi", "Rustavi", "Gori", "Zugdidi", "Poti", "Kobuleti"]
  },
  {
    name: "Germany",
    code: "DE",
    cities: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden", "Mönchengladbach", "Gelsenkirchen", "Aachen", "Braunschweig", "Chemnitz", "Kiel"]
  },
  {
    name: "Ghana",
    code: "GH",
    cities: ["Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast", "Sunyani", "Koforidua", "Ho"]
  },
  {
    name: "Greece",
    code: "GR",
    cities: ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos", "Rhodes", "Ioannina"]
  },
  {
    name: "Hungary",
    code: "HU",
    cities: ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr", "Nyíregyháza", "Kecskemét"]
  },
  {
    name: "Iceland",
    code: "IS",
    cities: ["Reykjavík", "Kópavogur", "Hafnarfjörður", "Akureyri", "Reykjanesbær", "Garðabær", "Mosfellsbær", "Árborg"]
  },
  {
    name: "India",
    code: "IN",
    cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi"]
  },
  {
    name: "Indonesia",
    code: "ID",
    cities: ["Jakarta", "Surabaya", "Bandung", "Bekasi", "Medan", "Tangerang", "Depok", "Semarang"]
  },
  {
    name: "Iran",
    code: "IR",
    cities: ["Tehran", "Mashhad", "Isfahan", "Karaj", "Shiraz", "Tabriz", "Qom", "Ahvaz"]
  },
  {
    name: "Iraq",
    code: "IQ",
    cities: ["Baghdad", "Basra", "Mosul", "Erbil", "Sulaymaniyah", "Najaf", "Karbala", "Kirkuk"]
  },
  {
    name: "Ireland",
    code: "IE",
    cities: ["Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Dundalk", "Bray"]
  },
  {
    name: "Israel",
    code: "IL",
    cities: ["Jerusalem", "Tel Aviv", "Haifa", "Rishon LeZion", "Petah Tikva", "Ashdod", "Netanya", "Beer Sheva"]
  },
  {
    name: "Italy",
    code: "IT",
    cities: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence"]
  },
  {
    name: "Japan",
    code: "JP",
    cities: ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kawasaki", "Kyoto", "Saitama", "Hiroshima", "Sendai", "Kitakyushu", "Chiba", "Sakai", "Niigata", "Hamamatsu", "Okayama", "Sagamihara", "Shizuoka", "Kumamoto", "Kagoshima", "Matsuyama", "Kanazawa", "Utsunomiya", "Matsudo", "Kawaguchi", "Himeji", "Fujisawa", "Toyama"]
  },
  {
    name: "Jordan",
    code: "JO",
    cities: ["Amman", "Zarqa", "Irbid", "Russeifa", "Wadi as-Sir", "Aqaba", "Madaba", "As-Salt"]
  },
  {
    name: "Kazakhstan",
    code: "KZ",
    cities: ["Almaty", "Nur-Sultan", "Shymkent", "Aktobe", "Taraz", "Pavlodar", "Ust-Kamenogorsk", "Karaganda"]
  },
  {
    name: "Kenya",
    code: "KE",
    cities: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Kehancha", "Kitale", "Garissa"]
  },
  {
    name: "Kuwait",
    code: "KW",
    cities: ["Kuwait City", "Al Ahmadi", "Hawalli", "As Salimiyah", "Sabah as Salim", "Al Farwaniyah", "Al Fahahil", "Ar Riqqah"]
  },
  {
    name: "Latvia",
    code: "LV",
    cities: ["Riga", "Daugavpils", "Liepāja", "Jelgava", "Jūrmala", "Ventspils", "Rēzekne", "Valmiera"]
  },
  {
    name: "Lebanon",
    code: "LB",
    cities: ["Beirut", "Tripoli", "Sidon", "Tyre", "Nabatieh", "Jounieh", "Zahle", "Baalbek"]
  },
  {
    name: "Lithuania",
    code: "LT",
    cities: ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys", "Alytus", "Marijampolė", "Mažeikiai"]
  },
  {
    name: "Luxembourg",
    code: "LU",
    cities: ["Luxembourg City", "Esch-sur-Alzette", "Dudelange", "Schifflange", "Bettembourg", "Petange", "Ettelbruck", "Diekirch"]
  },
  {
    name: "Malaysia",
    code: "MY",
    cities: ["Kuala Lumpur", "George Town", "Ipoh", "Shah Alam", "Petaling Jaya", "Johor Bahru", "Seremban", "Kuching"]
  },
  {
    name: "Mexico",
    code: "MX",
    cities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez", "Zapopan"]
  },
  {
    name: "Morocco",
    code: "MA",
    cities: ["Casablanca", "Rabat", "Marrakech", "Fez", "Tangier", "Salé", "Meknes", "Oujda"]
  },
  {
    name: "Netherlands",
    code: "NL",
    cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen", "Almere"]
  },
  {
    name: "New Zealand",
    code: "NZ",
    cities: ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Napier-Hastings", "Dunedin", "Palmerston North"]
  },
  {
    name: "Nigeria",
    code: "NG",
    cities: ["Lagos", "Kano", "Ibadan", "Abuja", "Port Harcourt", "Benin City", "Maiduguri", "Zaria"]
  },
  {
    name: "Norway",
    code: "NO",
    cities: ["Oslo", "Bergen", "Stavanger", "Trondheim", "Drammen", "Fredrikstad", "Kristiansand", "Sandnes"]
  },
  {
    name: "Pakistan",
    code: "PK",
    cities: ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Hyderabad", "Gujranwala", "Peshawar"]
  },
  {
    name: "Peru",
    code: "PE",
    cities: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Huancayo", "Piura", "Iquitos", "Cusco"]
  },
  {
    name: "Philippines",
    code: "PH",
    cities: ["Manila", "Quezon City", "Caloocan", "Las Piñas", "Makati", "Pasig", "Taguig", "Marikina"]
  },
  {
    name: "Poland",
    code: "PL",
    cities: ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz"]
  },
  {
    name: "Portugal",
    code: "PT",
    cities: ["Lisbon", "Porto", "Vila Nova de Gaia", "Amadora", "Braga", "Funchal", "Coimbra", "Setúbal"]
  },
  {
    name: "Qatar",
    code: "QA",
    cities: ["Doha", "Al Rayyan", "Umm Salal Muhammad", "Al Wakrah", "Al Khor", "Madinat ash Shamal", "Al Daayen", "Musay'id"]
  },
  {
    name: "Romania",
    code: "RO",
    cities: ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova", "Brașov", "Galați"]
  },
  {
    name: "Russia",
    code: "RU",
    cities: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Nizhny Novgorod", "Kazan", "Chelyabinsk", "Omsk"]
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    cities: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Tabuk", "Buraidah"]
  },
  {
    name: "Serbia",
    code: "RS",
    cities: ["Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica", "Zrenjanin", "Pančevo", "Čačak"]
  },
  {
    name: "Singapore",
    code: "SG",
    cities: ["Singapore"]
  },
  {
    name: "Slovakia",
    code: "SK",
    cities: ["Bratislava", "Košice", "Prešov", "Žilina", "Banská Bystrica", "Nitra", "Trnava", "Martin"]
  },
  {
    name: "Slovenia",
    code: "SI",
    cities: ["Ljubljana", "Maribor", "Celje", "Kranj", "Velenje", "Koper", "Novo Mesto", "Ptuj"]
  },
  {
    name: "South Africa",
    code: "ZA",
    cities: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Pietermaritzburg", "Benoni", "Tembisa"]
  },
  {
    name: "South Korea",
    code: "KR",
    cities: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan"]
  },
  {
    name: "Spain",
    code: "ES",
    cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma"]
  },
  {
    name: "Sri Lanka",
    code: "LK",
    cities: ["Colombo", "Dehiwala-Mount Lavinia", "Moratuwa", "Sri Jayawardenepura Kotte", "Negombo", "Kandy", "Kalmunai", "Trincomalee"]
  },
  {
    name: "Sweden",
    code: "SE",
    cities: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Sollentuna", "Västerås", "Örebro", "Linköping"]
  },
  {
    name: "Switzerland",
    code: "CH",
    cities: ["Zurich", "Geneva", "Basel", "Lausanne", "Bern", "Winterthur", "Lucerne", "St. Gallen"]
  },
  {
    name: "Thailand",
    code: "TH",
    cities: ["Bangkok", "Nonthaburi", "Pak Kret", "Hat Yai", "Chon Buri", "Lampang", "Udon Thani", "Nakhon Ratchasima"]
  },
  {
    name: "Turkey",
    code: "TR",
    cities: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya", "Şanlıurfa"]
  },
  {
    name: "Ukraine",
    code: "UA",
    cities: ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Donetsk", "Zaporizhzhia", "Lviv", "Kryvyi Rih"]
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"]
  },
  {
    name: "United Kingdom",
    code: "GB",
    cities: ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Leeds", "Sheffield", "Edinburgh", "Bristol", "Cardiff", "Leicester", "Coventry", "Bradford", "Belfast", "Nottingham", "Kingston upon Hull", "Newcastle upon Tyne", "Stoke-on-Trent", "Southampton", "Derby", "Portsmouth", "Brighton", "Plymouth", "Northampton", "Reading", "Luton", "Wolverhampton", "Bolton", "Bournemouth", "Norwich"]
  },
  {
    name: "United States",
    code: "US",
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington DC", "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Mesa", "Sacramento", "Atlanta", "Kansas City", "Colorado Springs", "Miami", "Raleigh", "Omaha", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans"]
  },
  {
    name: "Uruguay",
    code: "UY",
    cities: ["Montevideo", "Salto", "Paysandú", "Las Piedras", "Rivera", "Maldonado", "Tacuarembó", "Melo"]
  },
  {
    name: "Venezuela",
    code: "VE",
    cities: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana", "San Cristóbal", "Maturín"]
  },
  {
    name: "Vietnam",
    code: "VN",
    cities: ["Ho Chi Minh City", "Hanoi", "Haiphong", "Da Nang", "Can Tho", "Bien Hoa", "Hue", "Nha Trang"]
  }
];

export const getAllCountries = (): string[] => {
  return COUNTRIES_AND_CITIES.map(country => country.name);
};

export const getCitiesForCountry = (countryName: string): string[] => {
  const country = COUNTRIES_AND_CITIES.find(c => c.name === countryName);
  return country ? country.cities : [];
};
