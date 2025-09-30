const fetch = require("node-fetch")

let lastMessageId = null

// Mapping emoji per item
const ITEM_EMOJI = {
//emoji seeds
"cactus": "🌵",
"strawberry": "🍓",
"pumpkin": "🎃",
"sunflower": "🌻",
"dragon fruit": "🐉",
"eggplant": "🍆",
"watermelon": "🍉",
"grape": "🍇",
"cocotank": "🥥",
"carnivorous plant": "🥩",
"mr carrot": "🥕",
"tomatrio": "🍅",
"shroombino": "🍄",
//emoji gear
"water bucket": "💧",
"frost grenade": "🧊",
"banana gun": "🍌",
"frost blower": "❄",
"carrot launcher": "🔫"
}

// Parsing embed description
function parseEmbedDescription(desc) {
let lines = desc.split("\n")
let stokMap = { seeds: [], gear: [] }
let currentCategory = null

for (let line of lines) {
if (!line) continue

if (line.startsWith("**Seeds**")) {
currentCategory = "seeds"
continue
} else if (line.startsWith("**Gear**")) {
currentCategory = "gear"
continue
}

let match = line.match(/(.+?)\s*x\s*(\d+)/i)
if (!match || !currentCategory) continue

let nama = match[1].trim()
let stok = parseInt(match[2]) || 0
let emoji = ITEM_EMOJI[nama.toLowerCase()] || "🌱"

stokMap[currentCategory].push({ nama, stok, emoji })
}

return stokMap
}

// Mengecek stok
async function checkStock(conn) {
  try {
    let res = await fetch("https://plantsvsbrainrots.com/api/latest-message")

    // Cek content-type
    let contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      let text = await res.text()
      console.error("❌ Response bukan JSON:", text.slice(0, 200))
      return
    }

    let data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return

    let latest = data[0]
    if (latest.id === lastMessageId) return
    lastMessageId = latest.id

    let embed = latest.embeds?.[0]
    if (!embed || !embed.description) return

    let waktu = new Date(latest.createdAt).toLocaleString("id-ID", { 
      timeZone: "Asia/Jakarta", 
      hour12: false 
    })

    let stokMap = parseEmbedDescription(embed.description)

    // Pesan umum
    let teks = ""

    // Seeds
    if (stokMap.seeds.length > 0) {
      teks += "🌻 *Seeds Stock*\n"
      stokMap.seeds.sort((a,b)=> a.nama.localeCompare(b.nama))
      for (let item of stokMap.seeds) {
        teks += `- ${item.emoji} ${item.nama} Seed x${item.stok}\n`
      }
      teks += `\n`
    }

    // Gear
    if (stokMap.gear.length > 0) {
      teks += "🔫 *Gears Stock*\n"
      stokMap.gear.sort((a,b)=> a.nama.localeCompare(b.nama))
      for (let item of stokMap.gear) {
        let displayName = item.nama
        if (displayName.toLowerCase() === "water bucket") displayName = "Water Bucket"
        teks += `- ${item.emoji} ${displayName} x${item.stok}\n`
      }
      teks += `\n`
    }

    teks += "`Copyright By Rioo`"

    if (global.db.autostock) {
      for (let chatId of Object.keys(global.db.autostock)) {
        if (!global.db.autostock[chatId]) continue

        await conn.sendMessage(chatId, { text: teks })

        // Kirim stok favorit
        if (global.db.favstock && global.db.favstock[chatId]) {
          let favList = global.db.favstock[chatId].map(v => v.toLowerCase())
          let hitFav = []

          for (let cat of ["seeds", "gear"]) {
            hitFav.push(...stokMap[cat].filter(item => favList.includes(item.nama.toLowerCase())))
          }

          if (hitFav.length > 0) {
            let metadata = await conn.groupMetadata(chatId).catch(() => null)
            let participants = metadata ? metadata.participants.map(p => p.id) : []

            let favText = hitFav.map(item => `${item.emoji} ${item.nama} Stock`).join("\n")

            await conn.sendMessage(chatId, {
              text: `${favText}\n\n> Segera Ambil Sebelum Ke Reset !!!\n> Bot Whatsapp By Rioo 📢`,
              mentions: participants
            })
          }
        }
      }
    }

  } catch (e) {
    console.error("Gagal cek stock:", e)
  }
}

// ===== Plugin utama stokauto =====
const handler = async (m, { args }) => {
if (!global.db.autostock) global.db.autostock = {}
let chatId = m.chat
let option = (args[0] || "").toLowerCase()

if (option === "on") {
if (global.db.autostock[chatId]) return m.reply("✅ Auto stock sudah aktif di chat ini.")
global.db.autostock[chatId] = true
m.reply("✅ Auto stock berhasil diaktifkan di chat ini.")
} else if (option === "off") {
if (!global.db.autostock[chatId]) return m.reply("❌ Auto stock belum aktif di chat ini.")
delete global.db.autostock[chatId]
m.reply("❌ Auto stock dimatikan di chat ini.")
} else {
m.reply("⚡ Contoh: .stokauto on / off")
}
}

handler.command = ["stokauto"]
handler.category = "info"

handler.description = "Menambahkan item favorit (spasi & beberapa pakai koma)"
handler.owner = true

// Interval 30 detik
handler.before = (m, { conn }) => {
if (!global.stockWatcher) {
global.stockWatcher = true
setInterval(() => checkStock(conn), 10 * 1000)
}
}

module.exports = handler