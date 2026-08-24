/* ============================================================
   SUPRA MAGNATE — игровые данные
   ============================================================ */

/* --- БИЗНЕСЫ --------------------------------------------------
   cost      — цена 1-го уровня
   income    — доход в секунду на 1-м уровне
   costMult  — рост цены за уровень
   incMult   — рост дохода за уровень (сложный)
   unlock    — нужный уровень игрока
   mgr       — цена менеджера (авто-сбор + 25% дохода)
---------------------------------------------------------------- */
export const BUSINESSES = [
  { id:'shawarma',  name:'Шаурма-пойнт',      art:'kiosk',   cost:65,        income:1.4,      costMult:1.075, incMult:1.055, unlock:1,  mgr:900,        tag:'Старт',   desc:'Ларёк у метро. Пахнет на весь район.' },
  { id:'coffee',    name:'Кофейня',           art:'coffee',  cost:800,       income:9.5,      costMult:1.076, incMult:1.055, unlock:2,  mgr:11000,      tag:'Еда',     desc:'Латте на вынос и запах свежей выпечки.' },
  { id:'carwash',   name:'Автомойка',         art:'carwash', cost:4600,      income:44,       costMult:1.077, incMult:1.055, unlock:3,  mgr:52000,      tag:'Авто',    desc:'Пена, воск, 3 поста. Очередь на час.' },
  { id:'fastfood',  name:'Фастфуд',           art:'burger',  cost:26000,     income:215,      costMult:1.078, incMult:1.056, unlock:5,  mgr:310000,     tag:'Еда',     desc:'Бургеры, картошка и бесконечный поток.' },
  { id:'pizza',     name:'Пиццерия',          art:'pizza',   cost:145000,    income:920,      costMult:1.078, incMult:1.056, unlock:7,  mgr:1800000,    tag:'Еда',     desc:'Дровяная печь и доставка за 30 минут.' },
  { id:'gym',       name:'Фитнес-клуб',       art:'gym',     cost:820000,    income:4300,     costMult:1.079, incMult:1.056, unlock:9,  mgr:9500000,    tag:'Услуги',  desc:'Абонементы, протеин и зеркала до потолка.' },
  { id:'service',   name:'Автосервис',        art:'garage',  cost:4800000,   income:21000,    costMult:1.080, incMult:1.057, unlock:12, mgr:52000000,   tag:'Авто',    desc:'Подъёмники, тюнинг и детище механика.' },
  { id:'club',      name:'Ночной клуб',       art:'club',    cost:27000000,  income:98000,    costMult:1.081, incMult:1.057, unlock:15, mgr:290000000,  tag:'Развлечения', desc:'Неон, диджей и бар до утра.' },
  { id:'chain',     name:'Сеть кофеен',       art:'chain',   cost:150000000, income:520000,   costMult:1.082, incMult:1.058, unlock:18, mgr:1600000000, tag:'Сеть',    desc:'40 точек по городу, один бренд.' },
  { id:'mining',    name:'Крипто-ферма',      art:'rigs',    cost:900000000, income:2600000,  costMult:1.083, incMult:1.058, unlock:21, mgr:9500000000, tag:'Крипта',  desc:'Стойки GPU гудят и печатают монеты.' },
  { id:'it',        name:'IT-компания',       art:'office',  cost:5200000000,income:13000000, costMult:1.084, incMult:1.059, unlock:25, mgr:52000000000,tag:'Тех',     desc:'Стартап, раунды, единорог.' },
  { id:'hotel',     name:'Сеть отелей',       art:'hotel',   cost:32000000000,income:64000000,costMult:1.085, incMult:1.059, unlock:28, mgr:310000000000,tag:'Недвижимость', desc:'5 звёзд, спа и вид на море.' },
  { id:'mall',      name:'Торговый центр',    art:'mall',    cost:190000000000,income:310000000,costMult:1.086,incMult:1.060, unlock:32, mgr:1900000000000,tag:'Недвижимость', desc:'Эскалаторы, фудкорт, парковка на 2000 мест.' },
  { id:'factory',   name:'Завод электроники', art:'factory', cost:1200000000000,income:1700000000,costMult:1.087,incMult:1.060,unlock:36, mgr:12000000000000,tag:'Производство', desc:'Конвейеры не останавливаются никогда.' },
  { id:'studio',    name:'Киностудия',        art:'studio',  cost:8200000000000,income:9600000000,costMult:1.088,incMult:1.061,unlock:40,mgr:80000000000000,tag:'Медиа', desc:'Блокбастеры, права и стриминг.' },
  { id:'space',     name:'Космическая компания',art:'rocket',cost:62000000000000,income:58000000000,costMult:1.089,incMult:1.061,unlock:45,mgr:600000000000000,tag:'Мега', desc:'Ракеты, спутники и колонии на Марсе.' },
];

/* --- АВТОМОБИЛИ (бонус к доходу + тапу) ------------------------ */
export const CARS = [
  { id:'c_hatch',  name:'Lada Vibe 1.6',      sub:'Хэтчбек · 106 л.с.',   img:'car_hatch',  price:24000,        tap:0.05, income:0.04, xp:60 },
  { id:'c_suv',    name:'Grand Cruiser X',    sub:'Внедорожник · 380 л.с.',img:'car_suv',   price:480000,       tap:0.10, income:0.08, xp:220 },
  { id:'c_classic',name:'Muscle GT 1969',     sub:'Классика · 420 л.с.',  img:'car_classic',price:2400000,      tap:0.18, income:0.12, xp:600 },
  { id:'c_sport',  name:'Veloce R8 Spider',   sub:'Суперкар · 640 л.с.',  img:'car_sport',  price:18000000,     tap:0.30, income:0.20, xp:2200 },
  { id:'c_hyper',  name:'Nocturne Venom',     sub:'Гиперкар · 1500 л.с.', img:'car_hyper',  price:260000000,    tap:0.55, income:0.35, xp:12000 },
];

/* --- НЕДВИЖИМОСТЬ ---------------------------------------------- */
export const HOUSES = [
  { id:'h_apt',   name:'Студия в центре',  sub:'32 м² · 8 этаж',    img:'house_apt',     price:90000,       tap:0.04, income:0.05, offline:2,  xp:80 },
  { id:'h_sub',   name:'Дом в пригороде',  sub:'180 м² · 2 этажа',  img:'house_suburb',  price:1600000,     tap:0.10, income:0.10, offline:4,  xp:400 },
  { id:'h_villa', name:'Вилла у моря',     sub:'420 м² · бассейн',  img:'house_villa',   price:34000000,    tap:0.22, income:0.18, offline:8,  xp:3000 },
  { id:'h_pent',  name:'Пентхаус',         sub:'600 м² · 52 этаж',  art:'house_penthouse', price:420000000,  tap:0.40, income:0.30, offline:12, xp:16000 },
  { id:'h_man',   name:'Особняк Magnate',  sub:'2400 м² · 3 этажа', art:'house_mansion', price:6500000000, tap:0.80, income:0.50, offline:24, xp:60000 },
];

/* --- ПРЕДМЕТЫ РОСКОШИ ------------------------------------------ */
export const LUXURY = [
  { id:'l_watch', name:'Часы Aurum Royale', sub:'Золото · лимитка 12 шт.', art:'watch',  price:1500000,   tap:0.15, income:0.08, xp:300 },
  { id:'l_yacht', name:'Яхта SUPRA ONE',    sub:'42 метра · вертолётная площадка', img:'yacht', price:85000000, tap:0.35, income:0.22, xp:5000 },
  { id:'l_jet',   name:'Частный джет',      sub:'Дальность 11 000 км', img:'jet',      price:1200000000,tap:0.60, income:0.40, xp:40000 },
  { id:'l_island',name:'Частный остров',    sub:'18 га · свой риф',   art:'island',   price:24000000000,tap:1.00,income:0.70, xp:180000 },
  { id:'l_team',  name:'ФК «Супра»',        sub:'Чемпион лиги',       art:'stadium',  price:60000000000,tap:1.60,income:1.10, xp:500000 },
];

/* --- КРИПТОВАЛЮТЫ ---------------------------------------------- */
export const COINS = [
  { id:'BTC',  name:'Bitcoin',   color:'#f7931a', price:67250,   vol:0.026, drift:0.00016, fee:0.008, dec:2 },
  { id:'ETH',  name:'Ethereum',  color:'#7d9bff', price:3420,    vol:0.034, drift:0.00018, fee:0.008, dec:2 },
  { id:'SUPRA',name:'Supra Coin',color:'#ffcb47', price:1.24,    vol:0.075, drift:0.00030, fee:0.010, dec:4 },
  { id:'MEME', name:'MemeDoge',  color:'#4fe08f', price:0.0842,  vol:0.130, drift:0.00010, fee:0.015, dec:6 },
  { id:'USDX', name:'Dollar X',  color:'#9aa7c7', price:1.0,     vol:0.0015,drift:0,       fee:0.002, dec:4 },
];

/* --- МАЙНИНГ ---------------------------------------------------- */
export const RIG = { baseCost:60000, costMult:1.27, btcPerSec:0.000062, upkeep:0 };

/* --- БАНК ------------------------------------------------------- */
export const BANK = {
  depositRate:0.00018,   // за минуту (≈1%/час)
  loanRate:0.00045,      // за минуту
  loanMaxPart:0.4,       // до 40% активов
};

/* --- РАБОТА ----------------------------------------------------- */
export const JOBS = [
  { id:'j1', name:'Курьер',        icon:'job_box',   unlock:1,  time:12, pay:260,      desc:'Развезти 8 заказов' },
  { id:'j2', name:'Бариста',       icon:'job_cup',   unlock:4,  time:16, pay:3200,     desc:'Смена в кофейне' },
  { id:'j3', name:'Таксист',       icon:'job_car',   unlock:8,  time:20, pay:41000,    desc:'Ночной город' },
  { id:'j4', name:'Трейдер',       icon:'job_chart', unlock:14, time:24, pay:520000,   desc:'Скальпинг на открытии' },
  { id:'j5', name:'Инвест-банкир', icon:'job_bank',  unlock:22, time:28, pay:7400000,  desc:'Сделка года' },
  { id:'j6', name:'CEO корпорации',icon:'job_crown', unlock:32, time:32, pay:98000000, desc:'Совет директоров' },
];

/* --- СТАТУСЫ ---------------------------------------------------- */
export const STATUS = [
  { lv:1,  name:'Новичок' },        { lv:4,  name:'Челнок' },
  { lv:8,  name:'Предприниматель' },{ lv:14, name:'Бизнесмен' },
  { lv:20, name:'Коммерсант' },     { lv:28, name:'Владелец сети' },
  { lv:36, name:'Олигарх' },        { lv:46, name:'Магнат' },
  { lv:60, name:'Легенда' },        { lv:80, name:'Бог капитала' },
];

/* --- ДОСТИЖЕНИЯ ------------------------------------------------- */
export const ACHIEVEMENTS = [
  { id:'a_tap100',   name:'Разминка',        desc:'100 нажатий',                 icon:'tap',    check:s=>s.stats.taps>=100,      reward:5000 },
  { id:'a_tap2k',    name:'Палец-молот',     desc:'2 000 нажатий',               icon:'tap',    check:s=>s.stats.taps>=2000,     reward:250000 },
  { id:'a_biz5',     name:'Портфель',        desc:'5 разных бизнесов',           icon:'biz',    check:s=>Object.values(s.biz).filter(b=>b.level>0).length>=5, reward:120000 },
  { id:'a_biz_all',  name:'Империя',         desc:'Все 16 бизнесов куплены',     icon:'crown',  check:s=>Object.values(s.biz).filter(b=>b.level>0).length>=16, reward:5e9 },
  { id:'a_lvl100',   name:'Сотка',           desc:'Бизнес 100-го уровня',        icon:'star',   check:s=>Object.values(s.biz).some(b=>b.level>=100), reward:2e8 },
  { id:'a_car1',     name:'Первая тачка',    desc:'Купи автомобиль',             icon:'car',    check:s=>Object.keys(s.owned.cars).length>=1, reward:60000 },
  { id:'a_car_all',  name:'Автопарк',        desc:'Весь гараж собран',           icon:'car',    check:s=>Object.keys(s.owned.cars).length>=CARS.length, reward:1e9 },
  { id:'a_house1',   name:'Своё жильё',      desc:'Купи недвижимость',           icon:'home',   check:s=>Object.keys(s.owned.houses).length>=1, reward:150000 },
  { id:'a_net1m',    name:'Миллионер',       desc:'Активы $1M',                  icon:'money',  check:s=>s.stats.peak>=1e6,      reward:1e6 },
  { id:'a_net1b',    name:'Миллиардер',      desc:'Активы $1B',                  icon:'money',  check:s=>s.stats.peak>=1e9,      reward:1e8 },
  { id:'a_net1t',    name:'Триллионер',      desc:'Активы $1T',                  icon:'money',  check:s=>s.stats.peak>=1e12,     reward:1e11 },
  { id:'a_btc1',     name:'Ходлер',          desc:'Накопи 1 BTC',                icon:'btc',    check:s=>(s.crypto.hold.BTC||0)>=1, reward:5e7 },
  { id:'a_trade20',  name:'Спекулянт',       desc:'20 сделок на бирже',          icon:'chart',  check:s=>s.stats.trades>=20,     reward:5e6 },
  { id:'a_rig10',    name:'Ферма',           desc:'10 майнинг-ригов',            icon:'rig',    check:s=>s.rigs>=10,             reward:4e7 },
  { id:'a_prestige', name:'Перерождение',    desc:'Первый престиж',              icon:'gem',    check:s=>s.prestige.resets>=1,   reward:0 },
  { id:'a_daily7',   name:'Неделя силы',     desc:'7 дней подряд заходил',       icon:'gift',   check:s=>s.daily.streak>=7,      reward:5e8 },
];

/* --- ЕЖЕДНЕВНЫЕ НАГРАДЫ (7 дней) ------------------------------- */
export const DAILY = [
  { cash:25000,  gems:0 },
  { cash:120000, gems:0 },
  { cash:600000, gems:1 },
  { cash:3000000,gems:1 },
  { cash:15000000,gems:2 },
  { cash:90000000,gems:2 },
  { cash:0,      gems:5, boost:120 },
];

/* --- ЗАДАНИЯ (генерируются ежедневно) --------------------------- */
export const QUEST_POOL = [
  { id:'q_tap',   name:'Нажми {n} раз',            gen:()=>200+Math.floor(Math.random()*400),  metric:s=>s.q.taps,    rew:s=>12000+Math.random()*40000 },
  { id:'q_biz',   name:'Купи {n} уровней бизнеса', gen:()=>8+Math.floor(Math.random()*14),     metric:s=>s.q.levels,  rew:s=>30000+Math.random()*90000 },
  { id:'q_earn',  name:'Заработай {n}',            gen:()=>[50000,400000,2500000][Math.floor(Math.random()*3)], metric:s=>s.q.earned, rew:s=>25000+Math.random()*120000 },
  { id:'q_trade', name:'Сделай {n} сделок',        gen:()=>2+Math.floor(Math.random()*4),      metric:s=>s.q.trades,  rew:s=>40000+Math.random()*100000 },
  { id:'q_work',  name:'Отработай {n} смен',       gen:()=>2+Math.floor(Math.random()*3),      metric:s=>s.q.works,   rew:s=>20000+Math.random()*80000 },
  { id:'q_tap2',  name:'Заработай тапами {n}',     gen:()=>[8000,60000,300000][Math.floor(Math.random()*3)], metric:s=>s.q.tapCash, rew:s=>30000+Math.random()*90000 },
];

/* --- НОВОСТИ КРИПТОРЫНКА --------------------------------------- */
export const NEWS = [
  { t:'SEC одобрила спот-ETF. Рынок в зелёной зоне.', up:1 },
  { t:'Крупный кошелёк перевёл 5 000 BTC на биржу.', up:-1 },
  { t:'Сеть обновили: комиссии упали в 4 раза.', up:1 },
  { t:'Хакеры вывели средства из протокола.', up:-1 },
  { t:'Крупный банк добавил поддержку крипты.', up:1 },
  { t:'Фермы в Китае снова включили.', up:-1 },
  { t:'Мемкоин завирусился в соцсетях.', up:1 },
  { t:'Киты фиксируют прибыль.', up:-1 },
  { t:'Институционалы закупаются на просадке.', up:1 },
  { t:'Регулятор ужесточил требования к биржам.', up:-1 },
];

/* --- РУЛЕТКА (за алмазы) --------------------------------------- */
export const WHEEL = [
  { w:26, kind:'cash', label:'Кэш x30 сек дохода' },
  { w:20, kind:'cash2',label:'Кэш x180 сек дохода' },
  { w:16, kind:'boost',label:'Буст x2 · 60 сек' },
  { w:12, kind:'btc',  label:'0.005 BTC' },
  { w:12, kind:'cash3',label:'Кэш x900 сек дохода' },
  { w:8,  kind:'gems', label:'2 алмаза' },
  { w:4,  kind:'jack', label:'ДЖЕКПОТ · кэш x7200 сек' },
];
