import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'
import log from "#lib/logger.js"

// Nomor pairing (untuk scan QR/Pairing code)
global.PAIRING_NUMBER = 6285295680804

// Nomor owner utama + cadangan
global.ownerNumber = [
'62821244599198',
'6285295680804'
]

// Mode bot: 
// false= self mode (hanya owner)
// true = public (semua user)
global.pubelik = true

// Pesan default untuk respon bot
global.mess = {
wait: 'Harap tunggu sebentar...',
owner: 'Fitur ini hanya bisa digunakan oleh Owner.',
group: 'Fitur ini hanya bisa digunakan dalam Group.',
admin: 'Fitur ini hanya bisa digunakan oleh Admin Group.',
botAdmin: 'Bot harus menjadi Admin terlebih dahulu.',
private: 'Fitur ini hanya bisa digunakan di chat pribadi.'
}

// Default watermark untuk stiker
global.stickpack = 'Created By'
global.stickauth = 'RIOO ROAD TO 500 TESTI'

global.title = "Rioo Road To 500 Testi"
global.body = "Rioo"
global.thumbnailUrl = "https://files.catbox.moe/i28vi9.jpg"

// Hot reload config.js ketika ada perubahan
const file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
log.info("berhasil relooad file config.")
import(`${file}?update=${Date.now()}`)
})