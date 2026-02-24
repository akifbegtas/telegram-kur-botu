const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// Minik web sunucusu ayarları
const app = express();
const port = process.env.PORT || 3000;

// UptimeRobot'un bota "Uyanık mısın?" diyeceği kapı burası
app.get('/', (req, res) => {
  res.send('Kanka bot zehir gibi ayakta!');
});

app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda dinlemede...`);
});

// Senin Telegram Bot ayarların
const token = '7697933844:AAEkfjb0dYx0yvfiG75CnSLom9IMlvRGDyw';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Kanka güncel piyasaları çekiyorum, bir saniye...');

  try {
    const response = await axios.get('https://finans.truncgil.com/v3/today.json');
    const veriler = response.data;

    const usd = veriler.USD.Selling;
    const eur = veriler.EUR.Selling;
    const gramAltin = veriler['gram-altin'].Selling;

    const mesaj = `
📊 **Güncel Piyasalar**
💵 Dolar/TL: ${usd} ₺
💶 Euro/TL: ${eur} ₺
🥇 Gram Altın: ${gramAltin} ₺
    `;

    bot.sendMessage(chatId, mesaj);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Kanka verileri çekerken bir sorun oluştu.');
  }
});

console.log('Telegram botu da bağlandı, mesajları bekliyor...');