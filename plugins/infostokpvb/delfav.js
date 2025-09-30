const handler = async (m, { args }) => {
if (!global.db.favstock) global.db.favstock = {}
let chatId = m.chat
if (!global.db.favstock[chatId]) return m.reply("❌ Belum ada favorit di chat ini.")

if (!args || args.length === 0) return m.reply("⚡ Contoh: .delfav Sunflower, Pumpkin")

let delFavs = args.join(" ").split(",").map(v => v.trim()).filter(v => v)

global.db.favstock[chatId] = global.db.favstock[chatId].filter(fav => !delFavs.includes(fav))

m.reply(`✅ Favorit berhasil dihapus:\n${delFavs.join(", ")}`)
}

handler.command = ["delfav"]
handler.owner = true
module.exports = handler