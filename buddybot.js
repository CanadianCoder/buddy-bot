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
          count: '100'
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
controller.hears(['show me some research'], ['direct_mention', 'mention', 'direct_message'], function(bot, message) {
  getChannelID("send-to-trello", getChannelMessages, function(messages) {
    var numToSelect = Math.floor(Math.random() * (messages.length - 1));
    
    while(messages[numToSelect].text.indexOf("http") < 0) {
      numToSelect = Math.floor(Math.random() * (messages.length - 1));
    }
    var reply = "Here's some random research from the #send-to-trello:\n" + messages[numToSelect].text;

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