const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// Minik web sunucusu (UptimeRobot'un uyandırması için)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Kanka bot zehir gibi ayakta!');
});

app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda dinlemede...`);
});

// Senin Telegram Bot Token'ın
const token = '7697933844:AAEkfjb0dYx0yvfiG75CnSLom9IMlvRGDyw';
const bot = new TelegramBot(token, { polling: true });

// Her türlü mesajı dinleyen ana fonksiyon
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text ? msg.text.toLowerCase() : ''; // Mesaj yoksa boş string dön

  // Tetikleyici kelimeler: döviz, altın, kur, dolar, euro veya /start
  const tetikleyiciler = ['döviz', 'altın', 'kur', 'dolar', 'euro', '/start'];

  const miAcaba = tetikleyiciler.some(kelime => text.includes(kelime));

  if (miAcaba) {
    bot.sendMessage(chatId, 'Kanka hemen bakıyorum piyasalara...');

    try {
      // Finans API isteği
      const response = await axios.get('https://finans.truncgil.com/v3/today.json');
      const veriler = response.data;

      const usd = veriler.USD.Selling;
      const eur = veriler.EUR.Selling;
      const gramAltin = veriler['gram-altin'].Selling;

      const sonucMesaji = `
📊 **Güncel Piyasalar**
💵 Dolar/TL: ${usd} ₺
💶 Euro/TL: ${eur} ₺
🥇 Gram Altın: ${gramAltin} ₺
      `;

      bot.sendMessage(chatId, sonucMesaji);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, 'Kanka kurları çekerken bir sorun çıktı, API yanıt vermiyor olabilir.');
    }
  }
});

console.log('Bot yeni nesil kelime yakalama sistemiyle aktif!');