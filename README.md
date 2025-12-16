import asyncio
import aiosqlite
import random
import json
from datetime import datetime, timedelta
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage

# ТВОИ ДАННЫЕ
TOKEN = "7855859086:AAG6Pa6mNUiXk6PwrcyHpOsQVgPearSIqG0"
ADMIN_ID = 6945908987  # @official_supra
bot = Bot(TOKEN)
dp = Dispatcher(storage=MemoryStorage())
DB_FILE = "supra_bot.db"

class Forms(StatesGroup):
    transfer = State()
    promo = State()
    craft = State()
    work = State()
    car_service = State()

# ДАННЫЕ ИГРЫ
PICKAXES = {'Железная':5000, 'Золотая':50000, 'Алмазная':250000, 'Крипто':1000000, 'Легендарная':5000000}
FISHING_RODS = {'Простая':3000, 'Железная':15000, 'Золотая':75000, 'Легендарная':500000}
ORES = {'Железо':100, 'Золото':2500, 'Алмаз':50000, 'Крипто-руда':250000}
FISHES = {'Карп':800, 'Окунь':2500, 'Золотая':50000}
JOBS = {1:'Уборщик',5:'Курьер',10:'Повар',20:'Инженер',30:'Программист',50:'CEO'}
STATUSES = {'Новичок':0, 'VIP':25, 'Премиум':60, 'Legend':150, 'God':500}
PETS = {'Собака':10000, 'Дракон':1000000, 'Феникс':10000000}

async def init_db():
    async with aiosqlite.connect(DB_FILE) as db:
        await db.execute('''CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY, coins INTEGER DEFAULT 10000, btc REAL DEFAULT 0.01,
            level INTEGER DEFAULT 1, exp INTEGER DEFAULT 0, daily_claimed INTEGER DEFAULT 0,
            last_daily TEXT, status TEXT DEFAULT 'Новичок', battle_pass INTEGER DEFAULT 0,
            pickaxe TEXT DEFAULT 'Железная', fishing_rod TEXT DEFAULT 'Простая', pets TEXT DEFAULT '',
            house TEXT DEFAULT '', car TEXT DEFAULT '', snowballs INTEGER DEFAULT 0, event_cases INTEGER DEFAULT 0,
            event_weapon TEXT DEFAULT '', event_armor TEXT DEFAULT '', unique_id TEXT, referrals INTEGER DEFAULT 0,
            last_mine TEXT, last_fish TEXT, last_work TEXT, deposit INTEGER DEFAULT 0, gpu_count INTEGER DEFAULT 0,
            last_transfer TEXT
        )''')
        await db.execute('''CREATE TABLE IF NOT EXISTS market (id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER, item TEXT, price INTEGER)''')
        await db.execute('''CREATE TABLE IF NOT EXISTS promos (code TEXT PRIMARY KEY, reward INTEGER DEFAULT 10000, uses INTEGER DEFAULT 999)''')
        await db.commit()

async def get_user(user_id):
    async with aiosqlite.connect(DB_FILE) as db:
        async with db.execute("SELECT * FROM users WHERE user_id=?", (user_id,)) as cur:
            user = await cur.fetchone()
            if not user:
                uid = str(random.randint(10000000,99999999))
                await db.execute("INSERT INTO users (user_id, unique_id) VALUES (?,?)", (user_id, uid))
                await db.commit()
                return await get_user(user_id)
            return user

def main_menu():
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton("👑 Профиль", callback_data="profile")],
        [InlineKeyboardButton("⛏ Шахта", callback_data="mine"), InlineKeyboardButton("🎣 Рыбалка", callback_data="fish")],
        [InlineKeyboardButton("💼 Работа", callback_data="jobs"), InlineKeyboardButton("⚔ Боссы", callback_data="boss")],
        [InlineKeyboardButton("🎄 Ивент", callback_data="event"), InlineKeyboardButton("🛒 Магазин", callback_data="shop")],
        [InlineKeyboardButton("👑 Пропуск", callback_data="pass"), InlineKeyboardButton("🏦 Банк", callback_data="bank")],
        [InlineKeyboardButton("💎 Рынок", callback_data="market"), InlineKeyboardButton("💸 Перевод", callback_data="transfer")],
        [InlineKeyboardButton("🎁 Ежедневка", callback_data="daily"), InlineKeyboardButton("📊 Топы", callback_data="tops")]
    ])

@dp.message(Command("start"))
async def start(message: Message, state: FSMContext):
    await init_db()
    user = await get_user(message.from_user.id)
    
    # РЕФЕРАЛКА
    if len(message.text.split()) > 1:
        ref_id = int(message.text.split()[1])
        await asyncio.get_event_loop().run_in_executor(None, lambda: None)
    
    await message.answer(
        f"🔥 **SUPRA EMPIRE BOT** 🔥\n\n"
        f"🆔 **ID**: `{user[-7]}`\n"
        f"💰 **Монеты**: `{user[1]:,}`\n"
        f"₿ **BTC**: `{user[2]:.4f}`\n\n"
        f"🎮 Начинай зарабатывать!",
        reply_markup=main_menu(), parse_mode="Markdown"
    )

@dp.callback_query(F.data == "profile")
async def profile(callback: CallbackQuery):
    user = await get_user(callback.from_user.id)
    text = (
        f"👑 **ПРОФИЛЬ**\n\n"
        f"💰 `{user[1]:,}` монет\n"
        f"₿ `{user[2]:.4f}` BTC\n"
        f"⭐ Уровень `{user[3]}`\n"
        f"👑 Статус `{user[7]}`\n"
        f"⛏ `{user[9]}`\n"
        f"🏠 `{user[11] or 'нет'}`\n"
        f"❄ Снежков `{user[13]}`\n"
        f"🆔 `{user[-7]}`"
    )
    await callback.message.edit_text(text, reply_markup=InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton("🔙", callback_data="back")]
    ]), parse_mode="Markdown")

@dp.callback_query(F.data == "mine")
async def mine(callback: CallbackQuery):
    user = await get_user(callback.from_user.id)
    now = datetime.now().isoformat()
    
    if user[-4] and (datetime.now() - datetime.fromisoformat(user[-4])).seconds < 120:
        await callback.answer("⏳ 2 минуты CD!", show_alert=True)
        return
    
    mult = 1 if user[9]=='Железная' else 5
    ore = random.choice(list(ORES.keys()))
    coins = ORES[ore] * random.randint(1,5) * mult
    
    async with aiosqlite.connect(DB_FILE) as db:
        await db.execute("UPDATE users SET coins=coins+?, last_mine=? WHERE user_id=?", (coins, now, callback.from_user.id))
        await db.commit()
    
    await callback.message.edit_text(
        f"⛏ **ШАХТА**\n💎 `{ore}`\n💰 `+{coins:,}` монет\n⏰ CD 2мин",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton("🔙", callback_data="back")]]),
        parse_mode="Markdown"
    )

@dp.callback_query(F.data == "fish")
async def fish(callback: CallbackQuery):
    user = await get_user(callback.from_user.id)
    now = datetime.now().isoformat()
    
    if user[-3] and (datetime.now() - datetime.fromisoformat(user[-3])).seconds < 120:
        await callback.answer("⏳ 2 минуты CD!", show_alert=True)
        return
    
    fish = random.choice(list(FISHES.keys()))
    coins = FISHES[fish] * random.randint(1,3)
    
    async with aiosqlite.connect(DB_FILE) as db:
        await db.execute("UPDATE users SET coins=coins+?, last_fish=? WHERE user_id=?", (coins, now, callback.from_user.id))
        await db.commit()
    
    await callback.message.edit_text(
        f"🎣 **РЫБАЛКА**\n🐟 `{fish}`\n💰 `+{coins:,}` монет",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton("🔙", callback_data="back")]]),
        parse_mode="Markdown"
    )

@dp.callback_query(F.data == "daily")
async def daily(callback: CallbackQuery):
    user = await get_user(callback.from_user.id)
    if user[6] and (datetime.now() - datetime.fromisoformat(user[6])).days < 1:
        await callback.answer("⏰ Раз в 24ч!", show_alert=True)
        return
    
    reward = 15000 + (STATUSES[user[7]] * 100)
    async with aiosqlite.connect(DB_FILE) as db:
        await db.execute("UPDATE users SET coins=coins+?, last_daily=? WHERE user_id=?", 
                        (reward, datetime.now().isoformat(), callback.from_user.id))
        await db.commit()
    
    await callback.answer(f"🎁 **+{reward:,} монет!**", show_alert=True)

@dp.callback_query(F.data == "event")
async def event(callback: CallbackQuery):
    user = await get_user(callback.from_user.id)
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton("❄ Собрать снежки", callback_data="collect_snow")],
        [InlineKeyboardButton("🎁 Кейс (500❄)", callback_data="craft_case")],
        [InlineKeyboardButton("🛒 Магазин ивента", callback_data="event_shop")],
        [InlineKeyboardButton("⚔ Боссы ивента", callback_data="event_boss")]
    ])
    await callback.message.edit_text(
        f"🎄 **НОВОГОДНИЙ ИВЕНТ**\n❄ Снежков: `{user[13]}`\n🎁 Кейсов: `{user[14]}`",
        reply_markup=kb, parse_mode="Markdown"
    )

@dp.callback_query(F.data == "collect_snow")
async def collect_snow(callback: CallbackQuery):
    user = await get_user(callback.from_user.id)
    if user[7] and (datetime.now() - datetime.fromisoformat(user[7])).hours < 2:
        await callback.answer("⏳ 2 часа CD!", show_alert=True)
        return
    
    snow = random.randint(20,50)
    if random.random() < 0.1: snow = 200
    
    async with aiosqlite.connect(DB_FILE) as db:
        await db.execute("UPDATE users SET snowballs=snowballs+?, last_snow_time=? WHERE user_id=?", 
                        (snow, datetime.now().isoformat(), callback.from_user.id))
        await db.commit()
    
    await callback.answer(f"❄ **+{snow} снежков!**", show_alert=True)

@dp.callback_query(F.data == "craft_case")
async def craft_case(callback: CallbackQuery):
    user = await get_user(callback.from_user.id)
    if user[13] < 500:
        await callback.answer("❗ Нужно 500 снежков!", show_alert=True)
        return
    
    async with aiosqlite.connect(DB_FILE) as db:
        await db.execute("UPDATE users SET snowballs=snowballs-500, event_cases=event_cases+1 WHERE user_id=?", 
                        (callback.from_user.id,))
        await db.commit()
    
    await callback.answer("🎁 **КЕЙС СОЗДАН!**", show_alert=True)

@dp.callback_query(F.data == "transfer")
async def transfer_start(callback: CallbackQuery, state: FSMContext):
    await state.set_state(Forms.transfer)
    await callback.message.reply("💸 **ПЕРЕВОД**\n`ID сумма`\nПример: `12345678 5000`")

@dp.message(Forms.transfer)
async def do_transfer(message: Message, state: FSMContext):
    try:
        target_id, amount = map(int, message.text.split())
        sender = await get_user(message.from_user.id)
        if sender[1] < amount or amount > 10000000:
            await message.reply("❌ Лимит 10kk или недостаточно!")
            return
        
        async with aiosqlite.connect(DB_FILE) as db:
            await db.execute("UPDATE users SET coins=coins-? WHERE user_id=?", (amount, message.from_user.id))
            await db.execute("UPDATE users SET coins=coins+? WHERE user_id=?", (amount, target_id))
            await db.commit()
        
        await message.reply(f"✅ **+{amount:,}** ID `{target_id}`")
    except: await message.reply("❌ Формат: `ID сумма`")
    await state.clear()

@dp.callback_query(F.data == "back")
async def back(callback: CallbackQuery):
    await callback.message.edit_text("🏠 **SUPRA BOT**", reply_markup=main_menu())

# АДМИН
@dp.callback_query(F.data == "admin", lambda c: c.from_user.id == ADMIN_ID)
async def admin_panel(callback: CallbackQuery):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton("📢 Рассылка", callback_data="admin_broadcast")],
        [InlineKeyboardButton("🎁 Промокод", callback_data="admin_promo")],
        [InlineKeyboardButton("🔙", callback_data="back")]
    ])
    await callback.message.edit_text("🔧 **АДМИН ПАНЕЛЬ**", reply_markup=kb)

async def main():
    await init_db()
    print("🚀 SUPRA BOT ОНЛАЙН!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
