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

  const tetikleyiciler = ['döviz', 'altın', 'kur', 'dolar', 'euro', '/start', 'fiyat', 'çeyrek'];
  const miAcaba = tetikleyiciler.some(kelime => text.includes(kelime));

  if (miAcaba) {
    bot.sendMessage(chatId, 'Kanka kuyumcuya bağlanıyorum, bekle...');

    try {
      const response = await axios.get('https://finans.truncgil.com/v3/today.json');
      const v = response.data;

      const mesaj = `
📊 **Güncel Piyasa Verileri**

💵 **Dolar/TL**
Alış: ${v.USD.Buying} ₺ | Satış: ${v.USD.Selling} ₺

💶 **Euro/TL**
Alış: ${v.EUR.Buying} ₺ | Satış: ${v.EUR.Selling} ₺

✨ **Altın Fiyatları (Alış/Satış)**
🥇 Gram: ${v['gram-altin'].Buying} / ${v['gram-altin'].Selling} ₺
🥈 Çeyrek: ${v['ceyrek-altin'].Buying} / ${v['ceyrek-altin'].Selling} ₺
🥉 Yarım: ${v['yarim-altin'].Buying} / ${v['yarim-altin'].Selling} ₺
🏆 Tam: ${v['tam-altin'].Buying} / ${v['tam-altin'].Selling} ₺
👑 Cumhuriyet: ${v['cumhuriyet-altini'].Buying} / ${v['cumhuriyet-altini'].Selling} ₺

*Veriler anlık çekilmiştir.*
      `;

      bot.sendMessage(chatId, mesaj);
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, 'Kanka veriler gelmedi, API biraz yavaşladı galiba.');
    }
  }
});

console.log('Bot altın arşiviyle güncellendi!');