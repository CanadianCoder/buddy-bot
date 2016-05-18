var Botkit = require('botkit')
var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
    retry: Infinity,
    debug: false
});

var bot = controller.spawn({
    token: token
}).startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error(err)
  }

  console.log('Connected to Slack')
});

controller.hears(['.*']
	, ['direct_message'], function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, );
    });
});