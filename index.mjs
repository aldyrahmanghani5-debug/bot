import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import P from 'pino'
import qrcode from 'qrcode-terminal'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    auth: state,
    browser: ['Android', 'Chrome', '120.0.0'],
    syncFullHistory: false,
    markOnlineOnConnect: false
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update

    // 🔥 tampilkan QR besar di Railway logs
    if (qr) {
      console.log('\n========== SCAN QR ==========\n')
      qrcode.generate(qr, { small: false })
      console.log('\n=============================\n')
    }

    if (connection === 'open') {
      console.log('✅ BERHASIL TERHUBUNG KE WHATSAPP')
    }

    if (connection === 'close') {
      console.log('❌ Koneksi putus, ulang...')
      startBot()
    }
  })
}

startBot()
