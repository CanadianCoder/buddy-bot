var Botkit = require('botkit')
var token = 'xoxb-43441349009-lCNZN4jNE2pEBVex4jE4oUwu';//process.env.SLACK_TOKEN
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

//gets channel id
function getChannelID(channelName, callback, _callback) {
  request({ 
      url: 'https://slack.com/api/channels.list',
      method: 'POST',
      form: {
          token: token
      }
    }, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        var channels = JSON.parse(body).channels;
        var id = "";
        for (var i = 0; i < channels.length; i++)
        {
	  if(channels[i].name == channelName){
            id = channels[i].id;
          }
        }

        if(id == "") {
          console.log("Error: unable to find channel name");
        }
        else {
          callback(id, _callback);
        }
    }
  });

}

//gets messages from channel
function getChannelMessages(channelToRetrieve, callback) {
  request({ 
      url: 'https://slack.com/api/channels.history',
      method: 'POST',
      form: {
          token: token,
          channel: channelToRetrieve,
          count: '1'
      }
    }, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        var messages = JSON.parse(body).messages;
        callback(messages);
    }
  });
}

//responds with most recent research when asked
controller.hears(['show me some research'], ['direct_message', 'ambient'], function(bot, message) {
  getChannelID("research", getChannelMessages, function(messages) {
    var reply = messages[0];
    bot.reply(message, reply);
  });
});

//responds whenever anyone says anything
controller.hears(['.*'], ['direct_message'], function(bot, message) {
  getUsername(message.user, function (username) {
    var reply = "";

    if(username == "Gokul Gowri"){
      reply = "Stop being so cancerous, Gokul"
    }
    else{
      reply = "I don't understand what you're trying to say, " + "<@" + message.user + ">. I'm going to assume you're just dumb.";
    }

    bot.reply(message, reply);
  });
});

//responds when it's name is mentioned in a channel
controller.on('direct_mention',function(bot,message) {
  reply = "Hi there! Don't mind me";
  bot.reply(message, reply);
});