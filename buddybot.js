var Botkit = require('botkit')
var token = process.env.SLACK_TOKEN
var request = require('request');

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
})

//gets real name from JSON returned from slack
function getUsername(userID, callback) {
  request({ 
      url: 'https://slack.com/api/users.info',
      method: 'POST',
      form: {
          token: token,
          user: userID
      }
    }, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        var username = JSON.parse(body).user.real_name;
        callback(username);
    }
  });
}

//responds whenever anyone says anything
controller.hears(['.*'], ['direct_message'], function(bot, message) {
  var username = getUsername(message.user, function (username) {
    var reply = "";

    if(username == "Gokul Gowri"){
      reply = "Stop being so cancerous, Gokul"
    }
    else{
      reply = "Good to know, " + "<@" + message.user + ">";
    }

    bot.reply(message, reply);
  });
});

//responds when it's name is mentioned in a channel
controller.on('direct_mention',function(bot,message) {
  reply = "Hi there! Don't mind me";
  bot.reply(message, reply);
});