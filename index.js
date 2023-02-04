const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const { token } = require('./token');

const bot = new TelegramApi(token, { polling: true });

const guessNumber = {};

const startGame = async (chatId) => {
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8d7/6f1/8d76f159-6795-37fd-8c64-04e195af9c61/5.webp');
    await bot.sendMessage(chatId, 'You wanna play a game? Alright, alright. Now I will guess a number from 0 to 9 for you, and you have to guess it.')
    const randomNumber = Math.floor(Math.random() * 10);
    guessNumber[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess the number', gameOptions);
};

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Start the bot' },
        { command: '/info', description: 'Info about you' },
        { command: '/game', description: 'Let`s play a game?' },
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        switch (text) {
            case '/start':
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8d7/6f1/8d76f159-6795-37fd-8c64-04e195af9c61/1.webp');
                await bot.sendMessage(chatId, `Hello! Welcome to my bot project.`);
                return;
            case '/info':
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8d7/6f1/8d76f159-6795-37fd-8c64-04e195af9c61/12.webp');
                await bot.sendMessage(chatId, `Sup ${msg.from.first_name}. Take a seat and relax.`);
                return;
            case '/game':
                startGame(chatId);
                return;
            default:
                return bot.sendMessage(chatId, 'I don`t understand you. Try again.');
        };
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const currentGuessNumber = String(guessNumber[chatId]);

        if (data === '/again') {
            startGame(chatId);
            return;
        }
        
        if (data === currentGuessNumber) {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8d7/6f1/8d76f159-6795-37fd-8c64-04e195af9c61/11.webp');
            await bot.sendMessage(chatId, `Well done! You guess the number ${currentGuessNumber}.`, againOptions);
            return;
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8d7/6f1/8d76f159-6795-37fd-8c64-04e195af9c61/25.webp');
            await bot.sendMessage(chatId, `You wrong! You don't guess number ${currentGuessNumber}.`, againOptions);
            return;
        }
    })
}

start();