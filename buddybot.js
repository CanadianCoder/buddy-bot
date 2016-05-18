var Botkit = require('botkit')
var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: token
}).startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error(err)
  }
});

controller.hears(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
	, 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, 'lol');
    });
});