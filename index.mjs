import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import P from 'pino'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    auth: state,
    browser: ['Android', 'Chrome', '120.0.0']
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection } = update

    if (connection === 'open') {
      console.log('✅ BERHASIL TERHUBUNG KE WHATSAPP')
    }

    if (connection === 'close') {
      console.log('❌ Koneksi putus, ulang...')
      startBot()
    }
  })

  // 🔥 INI BAGIAN PENTING
  if (!sock.authState.creds.registered) {
    const nomor = '6282171608581' // GANTI NOMOR KAMU
    const code = await sock.requestPairingCode(nomor)
    console.log('\n📱 KODE PAIRING:\n', code)
  }
}

startBot()
