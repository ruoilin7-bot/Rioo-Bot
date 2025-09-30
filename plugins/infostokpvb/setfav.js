const handler = async (m, { args }) => {
if (!global.db.favstock) global.db.favstock = {}
let chatId = m.chat
if (!global.db.favstock[chatId]) global.db.favstock[chatId] = []

if (!args || args.length === 0) return m.reply("⚡ Contoh: .setfav Sunflower, Pumpkin")

let newFavs = args.join(" ").split(",").map(v => v.trim()).filter(v => v)

for (let fav of newFavs) {
if (!global.db.favstock[chatId].includes(fav)) {
global.db.favstock[chatId].push(fav)
}
}

m.reply(`✅ Favorit berhasil ditambahkan:\n${newFavs.join(", ")}`)
}

handler.command = ["setfav"]
handler.owner = true
module.exports = handler