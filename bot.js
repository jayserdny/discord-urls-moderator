const Discord = require("discord.js");
const logger = require('winston');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const client = new Discord.Client();

// List of the channels that will be used for moderation
const channels = ['400609947660058636'];

// List of the blocked urls
const blockedUrls = ['https://steemit', 'www.steemit', 'http://steemit', 
                    'steemit.com', 'https://busy'];

// List of users to exclude from moderation
const excludedUsers = ['400608746507862017']

// Id of the bot
const botId = '400608746507862017';

client.on('ready', function (evt) {
    logger.info('Connected');
});

client.on('message', message => {

    var sender = message.author;
    var msg = message.content.toUpperCase();

    // Check if the sender id is in the excluded list
    if (sender.id.indexOf(excludedUsers) > -1) {
        return; // return to avoid deleting the messages of allowed users
    }

    // Check if the current message is in the managed channels.
    if (channels.some(moderatedChannel => message.channel.id.includes(moderatedChannel))) {

        // Check if the user contains one of the black listed words
        if (blockedUrls.some(spam => message.content.includes(spam))) {

            logger.info('Steemit link detected');
            message.delete();
            logger.info("Message deleted");
            message.author.send(sender + ", This kind of url is not allowed here. Instead, use Utopian links. Thanks 🙃");
            logger.warn("Author was informed");
        }
    }

});

// Do not forget to add the AUTH_TOKEN variable to your environment
client.login(process.env.AUTH_TOKEN);