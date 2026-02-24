const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Kanka bot zehir gibi ayakta!');
});

app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda dinlemede...`);
});

const token = '7697933844:AAEkfjb0dYx0yvfiG75CnSLom9IMlvRGDyw';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text ? msg.text.toLowerCase() : '';

  const tetikleyiciler = ['döviz', 'altın', 'kur', 'dolar', 'euro', '/start', 'fiyat'];
  const miAcaba = tetikleyiciler.some(kelime => text.includes(kelime));

  if (miAcaba) {
    bot.sendMessage(chatId, 'Kanka alış-satış makasını hesaplıyorum, bekle geliyorum...');

    try {
      const response = await axios.get('https://finans.truncgil.com/v3/today.json');
      const veriler = response.data;

      // Verileri değişkenlere alış ve satış olarak atayalım
      const usdAlis = veriler.USD.Buying;
      const usdSatis = veriler.USD.Selling;

      const eurAlis = veriler.EUR.Buying;
      const eurSatis = veriler.EUR.Selling;

      const altinAlis = veriler['gram-altin'].Buying;
      const altinSatis = veriler['gram-altin'].Selling;

      const sonucMesaji = `
📊 **Güncel Piyasa Verileri**

💵 **Dolar/TL**
Alış: ${usdAlis} ₺
Satış: ${usdSatis} ₺

💶 **Euro/TL**
Alış: ${eurAlis} ₺
Satış: ${eurSatis} ₺

🥇 **Gram Altın**
Alış: ${altinAlis} ₺
Satış: ${altinSatis} ₺

*Veriler anlık çekilmiştir.*
      `;

      bot.sendMessage(chatId, sonucMesaji);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, 'Kanka verileri çekerken API tarafında bir takılma oldu.');
    }
  }
});

console.log('Bot alış-satış desteğiyle güncellendi!');