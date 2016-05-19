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

controller.hears(['.*'], ['direct_message'], function(bot, message) {
  var reply = "";
  if(message.user == "gokul_gowri"){
    reply = "Stop being so cancerous, Gokul"
  }
  else{
    reply = "Thank you for sharing that information with me, " + "<@" + "message.user" + ">";
  }

  bot.reply(message, reply);
});