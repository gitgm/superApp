
angular.module('app.services', [])

.factory('Socket', function(socketFactory){
  var myIoSocket = io.connect('http://localhost:8100');
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  return mySocket;
})

.factory('Users', function(){
    var usernames = [];
    usernames.numUsers = 0;

    return {
      getUsers: function(){
        return usernames;
      },
      addUsername: function(username){
        usernames.push(username);
      },
      deleteUsername: function(username){
        var index = usernames.indexOf(username);
        if(index != -1){
          usernames.splice(index, 1);
        }
      },
      setNumUsers: function(data){
        usernames.numUsers = data.numUsers;
      }
  };
})

.factory('Chat', function($ionicScrollDelegate, Socket, Users){

  var username;
  var users = {};
  users.numUsers = 0;

  var messages = [];
  var TYPING_MSG = '. . .';

  var Notification = function(username,message){
    var notification          = {};
    notification.username     = username;
    notification.message      = message;
    notification.notification = true;
    return notification;
  };

  Socket.on('login', function (data) {
    Users.setNumUsers(data);
  });

  Socket.on('new message', function(msg){
      addMessage(msg);
  });

  Socket.on('typing', function (data) {
    var typingMsg = {
      username: data.username,
      message: TYPING_MSG
    };
    addMessage(typingMsg);
  });

  Socket.on('stop typing', function (data) {
    removeTypingMessage(data.username);
  });

  Socket.on('user joined', function (data) {
    var msg = data.username + ' joined';
    var notification = new Notification(data.username,msg);
    addMessage(notification);
    Users.setNumUsers(data);
    Users.addUsername(data.username);
  });

  Socket.on('user left', function (data) {
    var msg = data.username + ' left';
    var notification = new Notification(data.username,msg);
    addMessage(notification);
    Users.setNumUsers(data);
    Users.deleteUsername(data.username);
  });

  var scrollBottom = function(){
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom(true);
  };

  var addMessage = function(msg){
    msg.notification = msg.notification || false;
    messages.push(msg);
    scrollBottom();
  };

  var removeTypingMessage = function(usr){
    for (var i = messages.length - 1; i >= 0; i--) {
      if(messages[i].username === usr && messages[i].message.indexOf(TYPING_MSG) > -1){
        messages.splice(i, 1);
        scrollBottom();
        break;
      }
    }
  };

  return {
    getUsername: function(){
      return username;
    },
    setUsername: function(usr){
      username = usr;
    },
    getMessages: function() {
      return messages;
    },
    sendMessage: function(msg){
      messages.push({
        username: username,
        message: msg
      });
      scrollBottom();
      Socket.emit('new message', msg);
    },
    scrollBottom: function(){
      scrollBottom();
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.factory('TwittSrv', function( $q, $timeout ){
  'use strict';


  var twitterKey = 'STORAGE.TWITTER.KEY';
  var clientId = '0HqOGPzoIhMMX4C9c6wMgFKf2';
  var clientSecret = 'oAntqaCC2CarUSjglfqccOuW4g3YpXFIEOdBWeFMWWGdivTmq7';

  function storeUserToken(data) {
    window.localStorage.setItem(twitterKey, JSON.stringify(data));
  }

  function getStoredToken() {
    return window.localStorage.getItem(twitterKey);
  }


  var twitts = [
    {user: {id: 'IIMParis', name: 'IIM', avatar: 'https://pbs.twimg.com/profile_images/3225820577/caa93a85f082a27c8aab9a1bc7c784b3_400x400.png'}, content: 'La @LivingJoconde était de nouveau à @futur_en_seine cette année !', url: 'https://twitter.com/IIMparis'},
    {user: {id: 'hetic', name: 'HETIC', avatar: 'https://pbs.twimg.com/profile_images/684039694733209602/AZtB1fkC_400x400.png'}, content: 'Réactions des Héticiens face aux sujets du #BacPhilo 2015 https://www.instagram.com/p/4CTEaBCH38/   #BAC2016 #Philo2016 #philo #tb', url: 'https://twitter.com/hetic'},
    {user: {id: 'ESILVparis', name: 'ESILV', avatar: 'https://pbs.twimg.com/profile_images/2928019109/6f31a6034ed9c3e56723ec2bb5982808_400x400.jpeg'}, content: 'Zoom sur un projet de 5ème année, réalisé avec l @EMLVparis et en partenariat avec @HEINEKENFrance', url: 'https://twitter.com/ESILVparis/status/741184607396192256'},
    {user: {id: 'EMLVParis', name: 'EMLV', avatar: 'https://pbs.twimg.com/profile_images/616226384701206528/RidfBtCB_400x400.jpg'}, content: 'Theres a hot new trend that could change the face of investing #FinTech #BigData', url: 'https://twitter.com/EMLVparis'},

  {user: {id: 'HECParis', name: 'HEC', avatar: 'https://pbs.twimg.com/profile_images/666885423310966784/IepFD4tn_400x400.png'}, content: 'Traditional Learning vs. #elearning: "It all depends on what the participant is trying to achieve" #emba http://www.topmba.com/why-mba/faculty-voices/debate-traditional-learning-vs-distance-learning … @TopMBA', url: 'https://twitter.com/HECParis'},
  {user: {id: 'Dauphine', name: 'Dauphines', avatar: 'https://pbs.twimg.com/profile_images/676802105101930497/WMK1KwwD_400x400.jpg'}, content: 'La société est-elle en avance sur ses élites concernant l #economiecollaborative? par Henri Isaac de @Paris_Dauphine', url: 'https://twitter.com/Paris_Dauphine'},
  {user: {id: 'Fablab', name: 'Fablab Devinci', avatar: 'https://pbs.twimg.com/profile_images/529286149043281921/L7dI_dCV_400x400.jpeg'}, content: '6 solutions ont été primées ! http://msfr.so/WLPSnh  cc @esilvparis @iimparis @devincifablab @joriquier', url: 'https://twitter.com/DEVINCIFabLab'},
  {user: {id: 'Shell eco', name: 'Shell Eco-marathon', avatar: 'https://pbs.twimg.com/profile_images/479364697544593410/SyDUGjk2_400x400.jpeg'}, content: 'In just 2 weeks you ll be on site for #SEM2016 at #makethefuture London. How s everyone shaping up? #LondonCalling', url: 'https://twitter.com/shell_ecomar'},
  {user: {id: '42', name: '42', avatar: 'https://pbs.twimg.com/profile_images/719463883904315392/gNpb0Xqn_400x400.jpg'}, content: 'Become a superstar developer at @42born2codeUS and @42born2code  !', url: 'https://twitter.com/42born2code'},

	{user: {id: 'HECParis', name: 'HEC', avatar: 'https://pbs.twimg.com/profile_images/666885423310966784/IepFD4tn_400x400.png'}, content: 'Traditional Learning vs. #elearning: "It all depends on what the participant is trying to achieve" #emba http://www.topmba.com/why-mba/faculty-voices/debate-traditional-learning-vs-distance-learning … @TopMBA', url: 'https://twitter.com/HECParis'},
	{user: {id: 'Dauphine', name: 'Dauphines', avatar: 'https://pbs.twimg.com/profile_images/676802105101930497/WMK1KwwD_400x400.jpg'}, content: 'La société est-elle en avance sur ses élites concernant l #economiecollaborative? par Henri Isaac de @Paris_Dauphine', url: 'https://twitter.com/Paris_Dauphine'},
	{user: {id: 'Fablab', name: 'Fablab Devinci', avatar: 'https://pbs.twimg.com/profile_images/529286149043281921/L7dI_dCV_400x400.jpeg'}, content: '6 solutions ont été primées ! http://msfr.so/WLPSnh  cc @esilvparis @iimparis @devincifablab @joriquier', url: 'https://twitter.com/DEVINCIFabLab'},
	{user: {id: 'Shell eco', name: 'Shell Eco-marathon', avatar: 'https://pbs.twimg.com/profile_images/479364697544593410/SyDUGjk2_400x400.jpeg'}, content: 'In just 2 weeks you ll be on site for #SEM2016 at #makethefuture London. How s everyone shaping up? #LondonCalling', url: 'https://twitter.com/shell_ecomar'},
	{user: {id: '42', name: '42', avatar: 'https://pbs.twimg.com/profile_images/719463883904315392/gNpb0Xqn_400x400.jpg'}, content: 'Become a superstar developer at @42born2codeUS and @42born2code  !', url: 'https://twitter.com/42born2code'},

  ];

  var service = {
    getTwitts: getTwitts,
    getNewTwitts: getNewTwitts,
    getMoreTwitts: getMoreTwitts
  };

  function getTwitts(){
    return $q.when(angular.copy(twitts));
  }

  function getNewTwitts(){
    var defer = $q.defer();
    $timeout(function(){
      var newTwitt = angular.copy(twitts[Math.floor(Math.random()*twitts.length)]);
      defer.resolve([newTwitt]);
    }, 500);
    return defer.promise;
  }

  function getMoreTwitts(){
    var defer = $q.defer();
    $timeout(function(){
      var newTwitts = [];
      for(var i=0; i<5; i++){
        newTwitts.push(angular.copy(twitts[Math.floor(Math.random()*twitts.length)]));
      }
      defer.resolve(newTwitts);
    }, 500);
    return defer.promise;
  }

  return service;
});


