import type { NPATGameState, NPATRound, NPATCategory, NPATAnswer } from '@shared/schema';

// Comprehensive word databases for validation
export const WORD_DATABASES = {
  names: [
    // Global Popular Names
    'MOHAMMED', 'MUHAMMAD', 'MOHAMED', 'MARIA', 'JOSE', 'WEI', 'AHMED', 'YAN', 'ALI', 'JOHN', 'DAVID',
    // Western Names
    'JAMES', 'MICHAEL', 'ROBERT', 'WILLIAM', 'MARY', 'PATRICIA', 'JENNIFER', 'LINDA', 'ELIZABETH', 'BARBARA',
    'RICHARD', 'SUSAN', 'JOSEPH', 'THOMAS', 'CHRISTOPHER', 'CHARLES', 'DANIEL', 'MATTHEW', 'ANTHONY', 'MARK',
    'DONALD', 'STEVEN', 'PAUL', 'ANDREW', 'JOSHUA', 'KENNETH', 'KEVIN', 'BRIAN', 'GEORGE', 'TIMOTHY',
    'RONALD', 'JASON', 'EDWARD', 'JEFFREY', 'RYAN', 'JACOB', 'GARY', 'NICHOLAS', 'ERIC', 'JONATHAN',
    'STEPHEN', 'LARRY', 'JUSTIN', 'SCOTT', 'BRANDON', 'BENJAMIN', 'SAMUEL', 'FRANK', 'GREGORY', 'RAYMOND',
    'ALEXANDER', 'PATRICK', 'JACK', 'DENNIS', 'JERRY', 'TYLER', 'AARON', 'HENRY', 'JOSE', 'DOUGLAS',
    'ADAM', 'PETER', 'ZACHARY', 'KYLE', 'WALTER', 'HAROLD', 'CARL', 'JEREMY', 'ARTHUR', 'LAWRENCE',
    // Popular Female Names
    'LISA', 'NANCY', 'KAREN', 'BETTY', 'HELEN', 'SANDRA', 'DONNA', 'CAROL', 'RUTH', 'SHARON',
    'MICHELLE', 'LAURA', 'SARAH', 'KIMBERLY', 'DEBORAH', 'JESSICA', 'SHIRLEY', 'CYNTHIA', 'ANGELA',
    'MELISSA', 'BRENDA', 'EMMA', 'OLIVIA', 'SOPHIA', 'AVA', 'ISABELLA', 'MIA', 'ABIGAIL', 'EMILY',
    'CHARLOTTE', 'HARPER', 'MADISON', 'AMELIA', 'ELIZABETH', 'SOFIA', 'EVELYN', 'AVERY', 'SCARLETT',
    // Indian Names - Hindu
    'ARJUN', 'KRISHNA', 'VISHNU', 'SHIVA', 'ROHIT', 'SACHIN', 'RAJIV', 'ADITYA', 'AJAY', 'ANISH',
    'RISHI', 'SIDDHARTHA', 'SURENDRA', 'KAMAL', 'MAHAVIR', 'NEELESH', 'NEERAJ', 'NISHITH', 'VED', 'VEDANT',
    'ADITI', 'PRIYA', 'KAVYA', 'MEERA', 'SITA', 'RADHA', 'LAKSHMI', 'ANANYA', 'AARADHYA', 'DIYA',
    'ISHITA', 'RIYA', 'SHREYA', 'POOJA', 'SNEHA', 'DEEPIKA', 'SWATI', 'NEHA', 'ANKITA', 'DIVYA',
    // Indian Names - Sikh
    'GURPREET', 'HARPREET', 'MANPREET', 'JASPREET', 'GURDEEP', 'HARDEEP', 'NAVDEEP', 'SUKHDEEP',
    'BALWINDER', 'JASWINDER', 'SUKHWINDER', 'PARMINDER', 'GURMEET', 'JAGJIT', 'MANJEET', 'INDERJIT',
    'SIMRAN', 'JASLEEN', 'KULDEEP', 'RAJDEEP', 'AMARDEEP', 'SANDEEP',
    // Indian Names - Muslim
    'AAMIR', 'ASAD', 'FAHAD', 'RASHID', 'TARIQ', 'ZAID', 'HASSAN', 'HUSSEIN', 'OMAR', 'YUSUF',
    'FATIMA', 'AISHA', 'KHADIJA', 'ZAINAB', 'MARYAM', 'HAFSA', 'NAYAB', 'NAZNEEN', 'RUKHSAR', 'SAADIYA',
    // More Global Names
    'CARLOS', 'DIEGO', 'LUIS', 'MIGUEL', 'JUAN', 'ANTONIO', 'FRANCISCO', 'RAFAEL', 'ALEJANDRO',
    'PIERRE', 'LOUIS', 'MARIE', 'CLAIRE', 'JEAN', 'MICHEL', 'PHILIPPE', 'CHRISTOPHE', 'NICOLAS',
    'HANS', 'KLAUS', 'WOLFGANG', 'HELMUT', 'WERNER', 'GRETA', 'INGRID', 'URSULA', 'BRIGITTE',
    'MARCO', 'GIUSEPPE', 'ANTONIO', 'FRANCESCA', 'GIULIA', 'ALESSANDRA', 'VALENTINA', 'CHIARA',
    'HASSAN', 'IBRAHIM', 'MUSTAFA', 'ABDULLAH', 'MAHMUD', 'NASSER', 'SALIM', 'KHALID', 'RASHID',
    // Chinese Names
    'LI', 'WANG', 'ZHANG', 'LIU', 'CHEN', 'YANG', 'HUANG', 'ZHAO', 'WU', 'ZHOU', 'XU', 'SUN', 'MA', 'ZHU',
    // Japanese Names
    'HIROSHI', 'TAKESHI', 'YUKI', 'AKIRA', 'KENJI', 'SATOSHI', 'YOKO', 'HIROKO', 'MICHIKO', 'NAOKO',
    // Korean Names
    'MINJUN', 'JIHO', 'SEOHA', 'YUJIN', 'JIWON', 'HYUN', 'SEOJUN', 'YOON', 'MINJI', 'CHAEYOUNG',
    // African Names
    'KWAME', 'KOFI', 'AMA', 'AKOSUA', 'BLESSING', 'GIFT', 'HOPE', 'FAITH', 'GRACE', 'JOY',
    // More contemporary names
    'NOAH', 'LIAM', 'ETHAN', 'LUCAS', 'MASON', 'LOGAN', 'JACOB', 'WILLIAM', 'JAMES', 'ALEXANDER',
    'CHLOE', 'ZARA', 'LEAH', 'GRACE', 'MAYA', 'ARIA', 'LUNA', 'LAYLA', 'HANNAH', 'NORA',
    // Classic names
    'ALBERT', 'ARTHUR', 'CHARLES', 'ERNEST', 'FREDERICK', 'GEORGE', 'HAROLD', 'HENRY', 'JACK', 'OSCAR',
    'ALICE', 'ANNA', 'CLARA', 'EDITH', 'FLORENCE', 'HELEN', 'MARGARET', 'MARTHA', 'RUTH', 'VIOLET'
  ],
  
  places: [
    // Major World Countries
    'AFGHANISTAN', 'ALBANIA', 'ALGERIA', 'ARGENTINA', 'ARMENIA', 'AUSTRALIA', 'AUSTRIA', 'AZERBAIJAN',
    'BAHRAIN', 'BANGLADESH', 'BELARUS', 'BELGIUM', 'BOLIVIA', 'BRAZIL', 'BULGARIA', 'CAMBODIA', 'CANADA', 
    'CHILE', 'CHINA', 'COLOMBIA', 'CROATIA', 'CUBA', 'CYPRUS', 'DENMARK', 'ECUADOR', 'EGYPT', 'ESTONIA',
    'ETHIOPIA', 'FINLAND', 'FRANCE', 'GEORGIA', 'GERMANY', 'GHANA', 'GREECE', 'GUATEMALA', 'HUNGARY',
    'ICELAND', 'INDIA', 'INDONESIA', 'IRAN', 'IRAQ', 'IRELAND', 'ISRAEL', 'ITALY', 'JAMAICA', 'JAPAN',
    'JORDAN', 'KAZAKHSTAN', 'KENYA', 'KUWAIT', 'LATVIA', 'LEBANON', 'LIBYA', 'LITHUANIA', 'LUXEMBOURG',
    'MALAYSIA', 'MEXICO', 'MOROCCO', 'NEPAL', 'NETHERLANDS', 'NORWAY', 'PAKISTAN', 'PANAMA', 'PERU',
    'PHILIPPINES', 'POLAND', 'PORTUGAL', 'QATAR', 'ROMANIA', 'RUSSIA', 'SINGAPORE', 'SLOVAKIA', 'SLOVENIA',
    'SPAIN', 'SWEDEN', 'SWITZERLAND', 'THAILAND', 'TURKEY', 'UKRAINE', 'URUGUAY', 'VENEZUELA', 'VIETNAM',
    
    // Major World Cities
    'TOKYO', 'DELHI', 'SHANGHAI', 'DHAKA', 'LONDON', 'PARIS', 'BEIJING', 'MUMBAI', 'OSAKA', 'CAIRO',
    'MEXICO', 'BANGKOK', 'DHAKA', 'LAGOS', 'SEOUL', 'TEHRAN', 'ISTANBUL', 'KARACHI', 'BOGOTA', 'LIMA',
    'MOSCOW', 'MADRID', 'RIYADH', 'BERLIN', 'ROME', 'MILAN', 'BARCELONA', 'VIENNA', 'HAMBURG', 'MUNICH',
    'AMSTERDAM', 'ROTTERDAM', 'COPENHAGEN', 'STOCKHOLM', 'HELSINKI', 'OSLO', 'DUBLIN', 'GLASGOW', 'MANCHESTER',
    'BIRMINGHAM', 'LIVERPOOL', 'BRISTOL', 'LEEDS', 'SHEFFIELD', 'CARDIFF', 'BELFAST', 'EDINBURGH',
    
    // US States and Major Cities
    'ALABAMA', 'ALASKA', 'ARIZONA', 'ARKANSAS', 'CALIFORNIA', 'COLORADO', 'CONNECTICUT', 'DELAWARE',
    'FLORIDA', 'GEORGIA', 'HAWAII', 'IDAHO', 'ILLINOIS', 'INDIANA', 'IOWA', 'KANSAS', 'KENTUCKY',
    'LOUISIANA', 'MAINE', 'MARYLAND', 'MASSACHUSETTS', 'MICHIGAN', 'MINNESOTA', 'MISSISSIPPI', 'MISSOURI',
    'MONTANA', 'NEBRASKA', 'NEVADA', 'NEWHAMPSHIRE', 'NEWJERSEY', 'NEWMEXICO', 'NEWYORK', 'NORTHCAROLINA',
    'NORTHDAKOTA', 'OHIO', 'OKLAHOMA', 'OREGON', 'PENNSYLVANIA', 'RHODEISLAND', 'SOUTHCAROLINA',
    'SOUTHDAKOTA', 'TENNESSEE', 'TEXAS', 'UTAH', 'VERMONT', 'VIRGINIA', 'WASHINGTON', 'WESTVIRGINIA',
    'WISCONSIN', 'WYOMING', 'NEWYORK', 'LOSANGELES', 'CHICAGO', 'HOUSTON', 'PHOENIX', 'PHILADELPHIA',
    'SANANTONIO', 'SANDIEGO', 'DALLAS', 'SANJOSE', 'AUSTIN', 'JACKSONVILLE', 'FORTWORTH', 'COLUMBUS',
    'CHARLOTTE', 'SANFRANCISCO', 'INDIANAPOLIS', 'SEATTLE', 'DENVER', 'WASHINGTON', 'BOSTON', 'ELPASO',
    'DETROIT', 'NASHVILLE', 'PORTLAND', 'MEMPHIS', 'OKLAHOMA', 'LASVEGAS', 'LOUISVILLE', 'BALTIMORE',
    'MILWAUKEE', 'ALBUQUERQUE', 'TUCSON', 'FRESNO', 'SACRAMENTO', 'KANSAS', 'MESA', 'ATLANTA', 'OMAHA',
    'COLORADO', 'RALEIGH', 'MIAMI', 'OAKLAND', 'TULSA', 'MINNEAPOLIS', 'CLEVELAND', 'WICHITA', 'ARLINGTON',
    
    // Indian Cities and States (Comprehensive)
    'MUMBAI', 'DELHI', 'BANGALORE', 'HYDERABAD', 'AHMEDABAD', 'CHENNAI', 'KOLKATA', 'SURAT', 'PUNE', 'JAIPUR',
    'LUCKNOW', 'KANPUR', 'NAGPUR', 'INDORE', 'THANE', 'BHOPAL', 'VISAKHAPATNAM', 'PIMPRI', 'PATNA', 'VADODARA',
    'GHAZIABAD', 'LUDHIANA', 'COIMBATORE', 'AGRA', 'MADURAI', 'NASHIK', 'FARIDABAD', 'MEERUT', 'RAJKOT',
    'KALYAN', 'VASAI', 'VARANASI', 'SRINAGAR', 'AURANGABAD', 'DHANBAD', 'AMRITSAR', 'NAVI', 'ALLAHABAD',
    'HOWRAH', 'RANCHI', 'GWALIOR', 'JABALPUR', 'COIMBATORE', 'VIJAYAWADA', 'JODHPUR', 'MADURAI', 'RAIPUR',
    'KOTA', 'CHANDIGARH', 'GUWAHATI', 'SOLAPUR', 'HUBLI', 'MYSORE', 'TIRUCHIRAPPALLI', 'BAREILLY', 'MORADABAD',
    'ANDHRA', 'ARUNACHAL', 'ASSAM', 'BIHAR', 'CHHATTISGARH', 'GOA', 'GUJARAT', 'HARYANA', 'HIMACHAL',
    'JHARKHAND', 'KARNATAKA', 'KERALA', 'MADHYA', 'MAHARASHTRA', 'MANIPUR', 'MEGHALAYA', 'MIZORAM',
    'NAGALAND', 'ODISHA', 'PUNJAB', 'RAJASTHAN', 'SIKKIM', 'TAMIL', 'TELANGANA', 'TRIPURA', 'UTTAR',
    'UTTARAKHAND', 'BENGAL', 'JAMMU', 'KASHMIR', 'LADAKH', 'PUDUCHERRY', 'LAKSHADWEEP', 'DAMAN', 'DIU',
    'DADRA', 'NAGAR', 'HAVELI', 'ANDAMAN', 'NICOBAR',
    
    // Canadian Cities
    'TORONTO', 'MONTREAL', 'VANCOUVER', 'CALGARY', 'EDMONTON', 'OTTAWA', 'WINNIPEG', 'QUEBEC', 'HAMILTON',
    'KITCHENER', 'LONDON', 'VICTORIA', 'HALIFAX', 'OSHAWA', 'WINDSOR', 'SASKATOON', 'REGINA', 'SHERBROOKE',
    
    // Australian Cities
    'SYDNEY', 'MELBOURNE', 'BRISBANE', 'PERTH', 'ADELAIDE', 'GOLDCOAST', 'NEWCASTLE', 'CANBERRA', 'SUNSHINE',
    'WOLLONGONG', 'HOBART', 'GEELONG', 'TOWNSVILLE', 'CAIRNS', 'TOOWOOMBA', 'DARWIN', 'LAUNCESTON',
    
    // African Cities
    'LAGOS', 'CAIRO', 'KINSHASA', 'LUANDA', 'NAIROBI', 'MOGADISHU', 'RABAT', 'ADDIS', 'CAPE', 'CASABLANCA',
    'ALGIERS', 'KANO', 'IBADAN', 'DAKAR', 'ACCRA', 'KAMPALA', 'BAMAKO', 'LUSAKA', 'MAPUTO', 'HARARE',
    'ABIDJAN', 'ALEXANDRIA', 'JOHANNESBURG', 'PRETORIA', 'DURBAN', 'PORT', 'BLOEMFONTEIN', 'SOWETO',
    
    // South American Cities
    'SAOPAULO', 'LIMA', 'BOGOTA', 'RIO', 'SANTIAGO', 'CARACAS', 'BUENOSAIRES', 'SALVADOR', 'BRASILIA',
    'FORTALEZA', 'RECIFE', 'BELO', 'HORIZONTE', 'MANAUS', 'CURITIBA', 'PORTO', 'ALEGRE', 'GOIANIA',
    'GUARULHOS', 'CAMPINAS', 'NOVA', 'IGUACU', 'SAO', 'BERNARDO', 'CAMPO', 'SANTO', 'ANDRE',
    
    // Geographic Features and Regions  
    'EVEREST', 'AMAZON', 'SAHARA', 'ANTARCTICA', 'ARCTIC', 'PACIFIC', 'ATLANTIC', 'INDIAN', 'MEDITERRANEAN',
    'CARIBBEAN', 'HIMALAYA', 'ALPS', 'ANDES', 'ROCKIES', 'APPALACHIAN', 'URALS', 'CAUCASUS', 'PYRENEES',
    'SCANDINAVIA', 'BALKANS', 'IBERIA', 'ANATOLIA', 'SIBERIA', 'MANCHURIA', 'TIBET', 'MONGOLIA', 'PATAGONIA',
    'GREENLAND', 'MADAGASCAR', 'BORNEO', 'SUMATRA', 'JAVA', 'MINDANAO', 'LUZON', 'HONSHU', 'KYUSHU',
    'SHIKOKU', 'HOKKAIDO', 'TAIWAN', 'PHILIPPINES', 'INDONESIA', 'MALAYSIA', 'BRUNEI', 'CAMBODIA', 'LAOS',
    'MYANMAR', 'BANGLADESH', 'MALDIVES', 'SRILANKA', 'BHUTAN', 'AFGHANISTAN', 'UZBEKISTAN', 'TAJIKISTAN',
    'KYRGYZSTAN', 'TURKMENISTAN', 'AZERBAIJAN', 'ARMENIA', 'SAUDI', 'YEMEN', 'OMAN', 'EMIRATES', 'BAHRAIN',
    'KUWAIT', 'SYRIA', 'LEBANON', 'PALESTINE', 'CYPRUS', 'MALTA', 'GIBRALTAR', 'MONACO', 'ANDORRA',
    'LUXEMBOURG', 'LIECHTENSTEIN', 'VATICAN', 'SANMARINO'
  ],
  
  animals: [
    'ANT', 'APE', 'AARDVARK', 'ALLIGATOR', 'ALBATROSS', 'ANTELOPE', 'ARMADILLO', 'ALPACA', 'ANCHOVY', 'ANACONDA',
    'BEAR', 'BEE', 'BAT', 'BIRD', 'BUTTERFLY', 'BUFFALO', 'BEAVER', 'BABOON', 'BEETLE', 'BARRACUDA',
    'CAT', 'COW', 'CHICKEN', 'CRAB', 'CROCODILE', 'CHEETAH', 'CHAMELEON', 'CHINCHILLA', 'CHIMPANZEE', 'COBRA',
    'DOG', 'DUCK', 'DEER', 'DOLPHIN', 'DONKEY', 'DRAGONFLY', 'DOVE', 'DINOSAUR', 'DINGO', 'DORMOUSE',
    'ELEPHANT', 'EAGLE', 'EEL', 'EMU', 'ELK', 'EARTHWORM', 'EGRET', 'ERMINE', 'ECHIDNA', 'ELAND',
    'FISH', 'FOX', 'FROG', 'FLY', 'FALCON', 'FLAMINGO', 'FERRET', 'FIREFLY', 'FLOUNDER', 'FINCH',
    'GOAT', 'GIRAFFE', 'GORILLA', 'GOOSE', 'GRASSHOPPER', 'GECKO', 'GOLDFISH', 'GUINEA', 'GAZELLE', 'GIBBON',
    'HORSE', 'HIPPO', 'HAMSTER', 'HAWK', 'HEDGEHOG', 'HERON', 'HYENA', 'HUMMINGBIRD', 'HERMIT', 'HALIBUT',
    'IGUANA', 'INSECT', 'IBIS', 'IMPALA', 'INCHWORM', 'ISOPOD', 'IBEX', 'ICHNEUMON', 'IGUANA', 'INDIAN',
    'JAGUAR', 'JELLYFISH', 'JACKAL', 'JAY', 'JACKRABBIT', 'JUNCO', 'JUMPING', 'JAGUARUNDI', 'JACANA', 'JERBOA',
    'KANGAROO', 'KOALA', 'KINGBIRD', 'KIWI', 'KITTEN', 'KILLER', 'KESTREL', 'KATYDID', 'KOMODO', 'KRILL',
    'LION', 'LAMB', 'LIZARD', 'LLAMA', 'LEOPARD', 'LOBSTER', 'LADYBUG', 'LYNX', 'LEMUR', 'LOCUST',
    'MONKEY', 'MOUSE', 'MOOSE', 'MOLE', 'MOSQUITO', 'MOTH', 'MANTA', 'MAGPIE', 'MANTIS', 'MARLIN',
    'NEWT', 'NIGHTINGALE', 'NARWHAL', 'NUMBAT', 'NUTRIA', 'NUTHATCH', 'NAUTILUS', 'NIGHTHAWK', 'NODDY', 'NURSE',
    'OWL', 'OCTOPUS', 'OTTER', 'OSTRICH', 'ORANGUTAN', 'OYSTER', 'OCELOT', 'OKAPI', 'ORIOLE', 'OPOSSUM',
    'PIG', 'PENGUIN', 'PANDA', 'PARROT', 'PELICAN', 'PORCUPINE', 'PANTHER', 'PEACOCK', 'PLATYPUS', 'PIRANHA',
    'QUAIL', 'QUETZAL', 'QUOKKA', 'QUEEN', 'QUOLL', 'QUELEA', 'QUAHOG', 'QUINZHEE', 'QUAGGA', 'QUILLIN',
    'RABBIT', 'RAT', 'ROBIN', 'RHINOCEROS', 'ROOSTER', 'RACCOON', 'RAVEN', 'REINDEER', 'RATTLESNAKE', 'RAY',
    'SHARK', 'SNAKE', 'SHEEP', 'SPIDER', 'SQUIRREL', 'SEAL', 'SWAN', 'STARFISH', 'SKUNK', 'SALAMANDER',
    'TIGER', 'TURTLE', 'TURKEY', 'TOAD', 'TOUCAN', 'TARANTULA', 'TERMITE', 'TROUT', 'TAPIR', 'TUNA',
    'UNICORN', 'URCHIN', 'UAKARI', 'UMBRELLABIRD', 'UNAU', 'URD', 'URUBU', 'UPUPA', 'URIAL', 'URUS',
    'VULTURE', 'VIPER', 'VICUNA', 'VAMPIRE', 'VOLE', 'VERVET', 'VINEGAROON', 'VIREO', 'VICEROY', 'VANGA',
    'WOLF', 'WHALE', 'WORM', 'WASP', 'WALRUS', 'WOODPECKER', 'WOMBAT', 'WEASEL', 'WILDCAT', 'WARTHOG',
    'XERUS', 'XENOPS', 'XEME', 'XANTUS', 'XINGU', 'XYLOCOPA', 'XIPHIAS', 'XENARTHRA', 'XANTUSIA', 'XEROMYS',
    'YAK', 'YELLOWHAMMER', 'YELLOWFIN', 'YABBY', 'YAPOK', 'YELLOWTAIL', 'YUNX', 'YELLOWBIRD', 'YUCATAN', 'YORKIE',
    'ZEBRA', 'ZEBU', 'ZORILLA', 'ZANDER', 'ZONURE', 'ZENAIDA', 'ZOKOR', 'ZOPHERUS', 'ZYGOPTERA', 'ZOSTEROPS'
  ],
  
  things: [
    // Common Objects A-Z
    'AIRPLANE', 'APPLE', 'ANCHOR', 'ARROW', 'AXLE', 'ALBUM', 'ATLAS', 'AMBULANCE', 'ANTENNA', 'APRON',
    'BALL', 'BOOK', 'BOTTLE', 'BICYCLE', 'BUTTON', 'BRIDGE', 'BUCKET', 'BLANKET', 'BALLOON', 'BANANA',
    'BELT', 'BOX', 'BREAD', 'BRUSH', 'BAG', 'BATTERY', 'BENCH', 'BOARD', 'BRICK', 'BRASS',
    'CAR', 'CHAIR', 'COMPUTER', 'CAMERA', 'CLOCK', 'CANDLE', 'CARPET', 'CABINET', 'CALCULATOR', 'CALENDAR',
    'CUP', 'COAT', 'COIN', 'CARD', 'CAGE', 'CHAIN', 'CHEST', 'CLOUD', 'CLOTH', 'COPPER',
    'DOOR', 'DESK', 'DIAMOND', 'DRUM', 'DICTIONARY', 'DOCUMENT', 'DEVICE', 'DOLL', 'DRILL', 'DISH',
    'ENGINE', 'ENVELOPE', 'EARPHONE', 'ERASER', 'ELEVATOR', 'EQUIPMENT', 'EGG', 'EARTH', 'ENERGY', 'ELEMENT',
    'FENCE', 'FLOWER', 'FORK', 'FIRE', 'FOOTBALL', 'FABRIC', 'FACTORY', 'FURNITURE', 'FOUNTAIN', 'FRAME',
    'GUITAR', 'GLASS', 'GLOVE', 'GARDEN', 'GARAGE', 'GLOBE', 'GADGET', 'GATE', 'GOLD', 'GUN',
    'HOUSE', 'HAMMER', 'HELMET', 'HEART', 'HOSPITAL', 'HOTEL', 'HELICOPTER', 'HIGHWAY', 'HILL', 'HORN',
    'ICE', 'INTERNET', 'IRON', 'ISLAND', 'INSTRUMENT', 'INK', 'IDEA', 'IMAGE', 'ITEM', 'IVORY',
    'JACKET', 'JEWEL', 'JUICE', 'JOURNAL', 'JIGSAW', 'JAR', 'JET', 'JUICE', 'JOKER', 'JOCKEY',
    'KITCHEN', 'KEYBOARD', 'KNIFE', 'KITE', 'KEY', 'KETTLE', 'KNEE', 'KNOB', 'KIOSK', 'KAYAK',
    'LAMP', 'LAPTOP', 'LETTER', 'LIBRARY', 'LADDER', 'LANGUAGE', 'LEATHER', 'LESSON', 'LIGHTHOUSE', 'LOCK',
    'MIRROR', 'MUSIC', 'MOUNTAIN', 'MACHINE', 'MAGAZINE', 'MEDICINE', 'MEMORY', 'MOTORCYCLE', 'MONUMENT', 'MAIL',
    'NEWSPAPER', 'NOTEBOOK', 'NEEDLE', 'NECKLACE', 'NETWORK', 'NAIL', 'NOSE', 'NECK', 'NIGHT', 'NOISE',
    'OCEAN', 'OFFICE', 'ORANGE', 'OVEN', 'OPERATION', 'ORGANIZATION', 'OXYGEN', 'ORCHESTRA', 'OIL', 'ORB',
    'PHONE', 'PENCIL', 'PAPER', 'PICTURE', 'PIANO', 'PIZZA', 'PALACE', 'PACKAGE', 'PAINTING', 'PASSPORT',
    'QUARTER', 'QUILT', 'QUESTION', 'QUALITY', 'QUANTITY', 'QUOTATION', 'QUIVER', 'QUEST', 'QUOTE', 'QUEEN',
    'RADIO', 'RING', 'RULER', 'REFRIGERATOR', 'ROCKET', 'RESTAURANT', 'RAINBOW', 'RECIPE', 'ROAD', 'ROCK',
    'SHOE', 'SHIRT', 'SCHOOL', 'SPOON', 'SWORD', 'STAR', 'SANDWICH', 'STADIUM', 'STATION', 'STONE',
    'TABLE', 'TELEVISION', 'TELEPHONE', 'TREE', 'TRAIN', 'TRUCK', 'THEATER', 'TECHNOLOGY', 'TELESCOPE', 'TOOL',
    'UMBRELLA', 'UNIVERSITY', 'UNIFORM', 'UNION', 'UNIVERSE', 'ULTRASOUND', 'UPGRADE', 'UTILITY', 'URN', 'UNIT',
    'VEHICLE', 'VIOLIN', 'VITAMIN', 'VALLEY', 'VACATION', 'VEGETABLE', 'VICTORY', 'VOLCANO', 'VILLAGE', 'VOICE',
    'WINDOW', 'WATER', 'WALLET', 'WATCH', 'WHEEL', 'WEAPON', 'WEATHER', 'WEDDING', 'WAREHOUSE', 'WALL',
    'XRAY', 'XYLOPHONE', 'XBOX', 'XEROX', 'XML', 'XENON', 'XEROSIS', 'XYLEM', 'XYLENE', 'XANTHAN',
    'YACHT', 'YARN', 'YELLOW', 'YOGURT', 'YOUTH', 'YEARBOOK', 'YARDSTICK', 'YARD', 'YOKE', 'YAM',
    'ZIPPER', 'ZONE', 'ZERO', 'ZOOM', 'ZUCCHINI', 'ZEPPELIN', 'ZIGZAG', 'ZODIAC', 'ZINC', 'ZOO',
    
    // Common Household Items
    'TOOTHBRUSH', 'TOOTHPASTE', 'TOWEL', 'TOILET', 'TISSUE', 'TELEVISION', 'TELEPHONE', 'THERMOMETER',
    'SCISSORS', 'SOAP', 'SHAMPOO', 'SHOWER', 'SINK', 'SPOON', 'STOVE', 'SWITCH', 'SUITCASE',
    'REFRIGERATOR', 'REMOTE', 'RUG', 'RAZOR', 'RADIO', 'PLATE', 'PILLOW', 'PEN', 'PERFUME',
    'MICROWAVE', 'MATTRESS', 'MASK', 'MAKEUP', 'LOTION', 'LAPTOP', 'IRON', 'HANGER',
    'GARBAGE', 'FORK', 'FLASHLIGHT', 'FAN', 'DETERGENT', 'DEODORANT', 'CURTAIN', 'CUSHION',
    'BRUSH', 'BROOM', 'BOWL', 'BOTTLE', 'BLANKET', 'BASKET', 'BATTERY', 'BANDAGE',
    
    // Clothing and Accessories
    'DRESS', 'JEANS', 'PANTS', 'SKIRT', 'BLOUSE', 'SWEATER', 'HOODIE', 'TSHIRT', 'UNDERWEAR',
    'SOCKS', 'SHOES', 'BOOTS', 'SANDALS', 'SNEAKERS', 'HAT', 'CAP', 'SCARF', 'GLOVES',
    'SUNGLASSES', 'JEWELRY', 'EARRINGS', 'BRACELET', 'NECKLACE', 'RING', 'WATCH', 'PURSE',
    'WALLET', 'BACKPACK', 'HANDBAG', 'BRIEFCASE', 'LUGGAGE', 'UMBRELLA',
    
    // Technology and Electronics
    'SMARTPHONE', 'TABLET', 'LAPTOP', 'COMPUTER', 'MONITOR', 'KEYBOARD', 'MOUSE', 'PRINTER',
    'SCANNER', 'CAMERA', 'HEADPHONES', 'SPEAKERS', 'MICROPHONE', 'CABLE', 'CHARGER', 'BATTERY',
    'TELEVISION', 'REMOTE', 'RADIO', 'STEREO', 'DVD', 'BLURAY', 'GAMEPAD', 'CONSOLE',
    'ROUTER', 'MODEM', 'SERVER', 'PROCESSOR', 'MEMORY', 'HARDDRIVE', 'SOFTWARE', 'APPLICATION',
    
    // Transportation and Vehicles
    'AUTOMOBILE', 'TRUCK', 'VAN', 'BUS', 'TAXI', 'MOTORCYCLE', 'BICYCLE', 'SCOOTER',
    'AIRPLANE', 'HELICOPTER', 'JET', 'ROCKET', 'SPACESHIP', 'BOAT', 'SHIP', 'YACHT',
    'SUBMARINE', 'TRAIN', 'SUBWAY', 'TRAM', 'TROLLEY', 'CART', 'WAGON', 'SLED',
    'TIRE', 'ENGINE', 'WHEEL', 'BRAKE', 'STEERING', 'WINDSHIELD', 'MIRROR', 'SEAT',
    
    // Food and Kitchen Items
    'BREAD', 'MILK', 'CHEESE', 'BUTTER', 'EGGS', 'MEAT', 'FISH', 'CHICKEN', 'BEEF',
    'RICE', 'PASTA', 'FLOUR', 'SUGAR', 'SALT', 'PEPPER', 'OIL', 'VINEGAR', 'SAUCE',
    'FRUIT', 'VEGETABLE', 'APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'STRAWBERRY', 'TOMATO',
    'POTATO', 'CARROT', 'LETTUCE', 'ONION', 'GARLIC', 'LEMON', 'LIME', 'CORN',
    'PAN', 'POT', 'KNIFE', 'FORK', 'SPOON', 'PLATE', 'BOWL', 'CUP', 'GLASS',
    'OVEN', 'STOVE', 'MICROWAVE', 'REFRIGERATOR', 'FREEZER', 'TOASTER', 'BLENDER',
    
    // Tools and Hardware
    'HAMMER', 'SCREWDRIVER', 'WRENCH', 'PLIERS', 'SAW', 'DRILL', 'NAIL', 'SCREW',
    'BOLT', 'NUT', 'WASHER', 'WIRE', 'ROPE', 'CHAIN', 'LOCK', 'KEY', 'HINGE',
    'LADDER', 'TOOLBOX', 'TAPE', 'GLUE', 'PAINT', 'BRUSH', 'ROLLER', 'SANDPAPER',
    
    // Office and School Supplies
    'PAPER', 'PEN', 'PENCIL', 'ERASER', 'RULER', 'STAPLER', 'CLIP', 'FOLDER',
    'BINDER', 'NOTEBOOK', 'BOOK', 'DICTIONARY', 'CALCULATOR', 'COMPUTER', 'PRINTER',
    'DESK', 'CHAIR', 'LAMP', 'CALENDAR', 'CLOCK', 'TELEPHONE', 'FAX', 'COPIER',
    
    // Sports and Recreation
    'BALL', 'BAT', 'RACKET', 'STICK', 'CLUB', 'NET', 'GOAL', 'HELMET', 'GLOVE',
    'UNIFORM', 'SHOES', 'EQUIPMENT', 'WEIGHTS', 'MACHINE', 'TREADMILL', 'BICYCLE',
    'SKATEBOARD', 'SURFBOARD', 'SKIS', 'SNOWBOARD', 'TENT', 'BACKPACK', 'COMPASS',
    
    // Musical Instruments
    'PIANO', 'GUITAR', 'VIOLIN', 'DRUM', 'TRUMPET', 'SAXOPHONE', 'FLUTE', 'CLARINET',
    'HARP', 'ORGAN', 'SYNTHESIZER', 'MICROPHONE', 'AMPLIFIER', 'SPEAKER', 'HEADPHONES',
    
    // Art and Craft Supplies
    'PAINT', 'BRUSH', 'CANVAS', 'EASEL', 'PENCIL', 'CHARCOAL', 'MARKER', 'CRAYON',
    'SCISSORS', 'GLUE', 'TAPE', 'PAPER', 'CARDBOARD', 'FABRIC', 'THREAD', 'NEEDLE',
    
    // Medical and Health
    'MEDICINE', 'PILL', 'TABLET', 'SYRINGE', 'BANDAGE', 'THERMOMETER', 'STETHOSCOPE',
    'XRAY', 'WHEELCHAIR', 'CRUTCH', 'GLASSES', 'CONTACTS', 'HEARING', 'PACEMAKER',
    
    // Nature and Environment
    'ROCK', 'STONE', 'SAND', 'DIRT', 'CLAY', 'WATER', 'ICE', 'SNOW', 'RAIN',
    'WIND', 'FIRE', 'LIGHTNING', 'THUNDER', 'EARTHQUAKE', 'VOLCANO', 'MOUNTAIN',
    'HILL', 'VALLEY', 'RIVER', 'LAKE', 'OCEAN', 'SEA', 'BEACH', 'ISLAND',
    'FOREST', 'TREE', 'LEAF', 'BRANCH', 'ROOT', 'FLOWER', 'GRASS', 'PLANT',
    
    // Building and Construction
    'BRICK', 'CONCRETE', 'STEEL', 'WOOD', 'GLASS', 'PLASTIC', 'METAL', 'ALUMINUM',
    'COPPER', 'IRON', 'GOLD', 'SILVER', 'DIAMOND', 'CRYSTAL', 'MARBLE', 'GRANITE',
    'TILE', 'CARPET', 'PAINT', 'WALLPAPER', 'CEILING', 'FLOOR', 'WALL', 'DOOR',
    'WINDOW', 'ROOF', 'FOUNDATION', 'BEAM', 'COLUMN', 'STAIR', 'ELEVATOR', 'ESCALATOR',
    
    // Miscellaneous Common Objects
    'CANDLE', 'MATCH', 'LIGHTER', 'CIGARETTE', 'PIPE', 'TOBACCO', 'ALCOHOL', 'WINE',
    'BEER', 'COFFEE', 'TEA', 'JUICE', 'SODA', 'BOTTLE', 'CAN', 'JAR', 'BOX',
    'BAG', 'CONTAINER', 'PACKAGE', 'ENVELOPE', 'STAMP', 'POSTCARD', 'LETTER',
    'CARD', 'MONEY', 'COIN', 'BILL', 'CHECK', 'RECEIPT', 'TICKET', 'PASSPORT',
    'LICENSE', 'CERTIFICATE', 'DIPLOMA', 'AWARD', 'TROPHY', 'MEDAL', 'RIBBON',
    'FLAG', 'BANNER', 'SIGN', 'POSTER', 'BILLBOARD', 'ADVERTISEMENT', 'MAGAZINE',
    'NEWSPAPER', 'JOURNAL', 'DIARY', 'CALENDAR', 'SCHEDULE', 'APPOINTMENT', 'MEETING'
  ]
};

// Letters with difficulty progression
export const DIFFICULTY_LETTERS = {
  easy: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W'],
  medium: ['Q', 'X', 'Y', 'Z'],
  hard: ['Q', 'X', 'Z']
};

export class NPATGameEngine {
  private generateGameId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getRandomLetter(usedLetters: string[], difficulty: 'easy' | 'medium' | 'hard' = 'easy'): string {
    const availableLetters = DIFFICULTY_LETTERS[difficulty].filter(letter => !usedLetters.includes(letter));
    
    if (availableLetters.length === 0) {
      // If all letters used, start with easy again
      return DIFFICULTY_LETTERS.easy[Math.floor(Math.random() * DIFFICULTY_LETTERS.easy.length)];
    }
    
    return availableLetters[Math.floor(Math.random() * availableLetters.length)];
  }

  private getDifficultyForRound(round: number): 'easy' | 'medium' | 'hard' {
    if (round <= 3) return 'easy';
    if (round <= 6) return 'medium';
    return 'hard';
  }

  public initializeGame(isMultiplayer: boolean = false, timeLimit: number = 30, totalRounds: number = 5): NPATGameState {
    return {
      gameId: this.generateGameId(),
      isMultiplayer,
      currentRound: 0,
      totalRounds,
      timeLimit,
      rounds: [],
      totalScore: 0,
      usedLetters: [],
      usedAnswers: {
        name: [],
        place: [],
        animal: [],
        thing: []
      },
      isGameComplete: false,
      currentLetter: null,
      startTime: Date.now()
    };
  }

  public startNextRound(gameState: NPATGameState): { newGameState: NPATGameState; letter: string } {
    const newGameState = { ...gameState };
    newGameState.currentRound++;
    
    const difficulty = this.getDifficultyForRound(newGameState.currentRound);
    const letter = this.getRandomLetter(newGameState.usedLetters, difficulty);
    
    newGameState.currentLetter = letter;
    newGameState.usedLetters.push(letter);
    
    const newRound: NPATRound = {
      roundNumber: newGameState.currentRound,
      letter,
      answers: {
        name: { category: 'name', value: '', isValid: false, points: 0, isDuplicate: false },
        place: { category: 'place', value: '', isValid: false, points: 0, isDuplicate: false },
        animal: { category: 'animal', value: '', isValid: false, points: 0, isDuplicate: false },
        thing: { category: 'thing', value: '', isValid: false, points: 0, isDuplicate: false }
      },
      score: 0,
      isComplete: false,
      timeRemaining: newGameState.timeLimit,
      isPerfectRound: false
    };
    
    newGameState.rounds.push(newRound);
    
    return { newGameState, letter };
  }

  private validateAnswer(category: NPATCategory, answer: string, letter: string, usedAnswers: string[]): { isValid: boolean; isDuplicate: boolean } {
    const upperAnswer = answer.toUpperCase().trim();
    
    if (!upperAnswer || upperAnswer[0] !== letter) {
      return { isValid: false, isDuplicate: false };
    }
    
    const isDuplicate = usedAnswers.includes(upperAnswer);
    const database = WORD_DATABASES[category === 'name' ? 'names' : category === 'place' ? 'places' : category === 'animal' ? 'animals' : 'things'];
    const isValid = database.includes(upperAnswer);
    
    return { isValid, isDuplicate };
  }

  public submitRound(
    gameState: NPATGameState, 
    answers: Record<NPATCategory, string>
  ): { newGameState: NPATGameState; roundScore: number; isPerfectRound: boolean } {
    const newGameState = { ...gameState };
    const currentRound = newGameState.rounds[newGameState.currentRound - 1];
    
    if (!currentRound || !newGameState.currentLetter) {
      return { newGameState, roundScore: 0, isPerfectRound: false };
    }
    
    let roundScore = 0;
    let validAnswers = 0;
    
    // Validate each answer
    Object.entries(answers).forEach(([category, answer]) => {
      const cat = category as NPATCategory;
      const validation = this.validateAnswer(cat, answer, newGameState.currentLetter!, newGameState.usedAnswers[cat]);
      
      const answerObj: NPATAnswer = {
        category: cat,
        value: answer.toUpperCase().trim(),
        isValid: validation.isValid && !validation.isDuplicate,
        points: validation.isValid && !validation.isDuplicate ? 10 : 0,
        isDuplicate: validation.isDuplicate
      };
      
      currentRound.answers[cat] = answerObj;
      
      if (answerObj.isValid) {
        validAnswers++;
        roundScore += 10;
        newGameState.usedAnswers[cat].push(answerObj.value);
      }
    });
    
    // Perfect round bonus
    const isPerfectRound = validAnswers === 4;
    if (isPerfectRound) {
      roundScore += 10; // Perfect round bonus
    }
    
    currentRound.score = roundScore;
    currentRound.isComplete = true;
    currentRound.isPerfectRound = isPerfectRound;
    
    newGameState.totalScore += roundScore;
    
    // Check if game is complete
    if (newGameState.currentRound >= newGameState.totalRounds) {
      newGameState.isGameComplete = true;
    }
    
    return { newGameState, roundScore, isPerfectRound };
  }

  public getGameStats(gameState: NPATGameState) {
    const completedRounds = gameState.rounds.filter(r => r.isComplete);
    const perfectRounds = completedRounds.filter(r => r.isPerfectRound).length;
    const averageScore = completedRounds.length > 0 ? Math.round(gameState.totalScore / completedRounds.length) : 0;
    const timeElapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    
    return {
      totalScore: gameState.totalScore,
      completedRounds: completedRounds.length,
      perfectRounds,
      averageScore,
      timeElapsed,
      efficiency: completedRounds.length > 0 ? Math.round((gameState.totalScore / (completedRounds.length * 50)) * 100) : 0 // 50 is max possible per round
    };
  }
}