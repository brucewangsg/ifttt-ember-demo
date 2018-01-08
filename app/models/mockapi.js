export default {
  get : function (path, data, callback) {
    if (callback == undefined && typeof data == "function") {
      callback = data;
    }
    
    if (path == "/api/triggerServices") {
      callback([{
        id : 1,
        title : "Twitter",
        img : "/img/icon.twitter.svg",
        description : "Twitter Applets can help you manage and save tweets, keep an eye on #hashtags, and much more."
      }, {
        id : 2,
        title : "Date & Time",
        img : "/img/icon.date.svg",
        description : "Find the best date and time for your scheduled task."
      }, {
        id : 3,
        title : "RSS Feed",
        img : "/img/icon.rss.svg",
        description : "This service deal with Really Simple Syndicate."
      }, {
        id : 4,
        title : "SMS",
        img : "/img/icon.sms.svg",
        description : "Get important notifications on your phone via SMS."
      }, {
        id : 5,
        title : "Email",
        img : "/img/icon.email.svg",
        description : "Respond to inbound emails for any smtp server."
      }, {
        id : 6,
        title : "Weather",
        img : "/img/icon.weather.svg",
        description : "Today's weather report."
      }, {
        id : 7,
        title : "Phone Call",
        img : "/img/icon.phone.svg",
        description : "This service can trigger Applets when you leave a voicemail at the IFTTT number."
      }, {
        id : 8,
        title : "Delicious",
        img : "/img/icon.delicious.svg",
        description : "Delicious is a social bookmarking web service for storing, sharing, and discovering web bookmarks."
      }, {
        id : 9,
        title : "Facebook",
        img : "/img/icon.facebook.svg",
        description : "Manage your profile, posting, photos and more with Facebook Applets that work with the world's largest social networking site."
      }, {
        id : 10,
        title : "Tumblr",
        img : "/img/icon.tumblr.svg",
        description : "Tumblr is a blogging platform that allows users to post text, images, videos, links, quotes, and audio."
      }]);
    } else if (path == "/api/triggers") {

      if (data && data.trigger_service_id == 3) { // RSS
        callback([{
          id : 1,
          title : "New Feed Item",
          description : "When new feed appeared in RSS feed"
        }, {
          id : 2,
          title : "New Feed Item Matches",
          description : "When new feed matches specification"
        }]);
      } else {
        callback([]);
      }

    } else if (path == "/api/actionServices") {

      if (data && data.trigger_service_id == 3) { // RSS
        callback([{
          id : 1,
          title : "Twitter",
          img : "/img/icon.twitter.svg",
          description : "Twitter Applets can help you manage and save tweets, keep an eye on #hashtags, and much more."
        }, {
          id : 2,
          title : "Date & Time",
          img : "/img/icon.date.svg",
          description : "Find the best date and time for your scheduled task."
        }, {
          id : 3,
          title : "RSS Feed",
          img : "/img/icon.rss.svg",
          description : "This service deal with Really Simple Syndicate."
        }, {
          id : 4,
          title : "SMS",
          img : "/img/icon.sms.svg",
          description : "Get important notifications on your phone via SMS."
        }, {
          id : 5,
          title : "Email",
          img : "/img/icon.email.svg",
          description : "Respond to inbound emails for any smtp server."
        }, {
          id : 6,
          title : "Weather",
          img : "/img/icon.weather.svg",
          description : "Today's weather report."
        }, {
          id : 7,
          title : "Phone Call",
          img : "/img/icon.phone.svg",
          description : "This service can trigger Applets when you leave a voicemail at the IFTTT number."
        }, {
          id : 8,
          title : "Delicious",
          img : "/img/icon.delicious.svg",
          description : "Delicious is a social bookmarking web service for storing, sharing, and discovering web bookmarks."
        }, {
          id : 9,
          title : "Facebook",
          img : "/img/icon.facebook.svg",
          description : "Manage your profile, posting, photos and more with Facebook Applets that work with the world's largest social networking site."
        }, {
          id : 10,
          title : "Tumblr",
          img : "/img/icon.tumblr.svg",
          description : "Tumblr is a blogging platform that allows users to post text, images, videos, links, quotes, and audio."
        }]);
      } else {
        callback([]);
      }

    } else if (path == "/api/actions") {

      if (data && data.action_service_id == 5) { // Email
        callback([{
          id : 1,
          title : "Send Email To Someone",
          description : "e.g. send to yourself"
        }, {
          id : 2,
          title : "Remind me through email later",
          description : "set a schedule and remind me later"
        }]);
      } else {
        callback([]);
      }

    }

  }
}