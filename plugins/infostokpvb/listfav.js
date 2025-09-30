const handler = async (m) => {
if (!global.db.favstock) global.db.favstock = {}
let chatId = m.chat
let favs = global.db.favstock[chatId] || []

if (favs.length === 0) return m.reply("⚠️ Tidak ada favorit di chat ini.")

let teks = "🌱 *Daftar Favorit*\n\n"
favs.forEach(fav => {
teks += `• ${fav}\n`
})

m.reply(teks)
}

handler.command = ["listfav"]
handler.owner = true
module.exports = handler