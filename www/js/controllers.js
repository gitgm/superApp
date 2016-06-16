angular.module('app.controllers', [])
  
.controller('accueilCtrl', function($scope) {

})
   
.controller('categorieCtrl', function($scope) {

})
   
.controller('conversationsCtrl', function($scope) {
console.log('test');
})
      
.controller('pageThemeCtrl', function($scope) {

})

.controller('AppCtrl', function($scope, TwittSrv){
  'use strict';
  TwittSrv.getTwitts().then(function(twitts){
    $scope.twitts = twitts;
  });

  $scope.doRefresh = function(){
    TwittSrv.getNewTwitts().then(function(newTwitts){
      $scope.twitts = newTwitts.concat($scope.twitts);
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMore = function(){
    TwittSrv.getMoreTwitts().then(function(olderTwitts){
      $scope.twitts = $scope.twitts.concat(olderTwitts);
    }).finally(function() {
      // Stop the ion-infinite-scroll from spinning
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }


})



//Nous, changement de controller
.controller('ChatCtrl', function($scope, $stateParams, $ionicPopup, $timeout, Socket, Chat) {
  console.log('test');
    $scope.data = {};
    $scope.data.message = "";
    $scope.messages = Chat.getMessages();
    var typing = false;
    var lastTypingTime;
    var TYPING_TIMER_LENGTH = 250;
  
    Socket.on('connect',function(){
  
      if(!$scope.data.username){
        var nicknamePopup = $ionicPopup.show({
        template: '<input id="usr-input" type="text" ng-model="data.username" autofocus>',
        title: 'What\'s your nickname?',
        scope: $scope,
        buttons: [{
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.username) {
                e.preventDefault();
              } else {
                return $scope.data.username;
              }
            }
          }]
        });
        nicknamePopup.then(function(username) {
          Socket.emit('add user',username);
          Chat.setUsername(username);
        });
      }
  
    });
  
    Chat.scrollBottom();
  
    if($stateParams.username){
      $scope.data.message = "@" + $stateParams.username;
      document.getElementById("msg-input").focus();
    } 

  var sendUpdateTyping = function(){
    if (!typing) {
      typing = true;
      Socket.emit('typing');
    }
    lastTypingTime = (new Date()).getTime();
    $timeout(function () {
      var typingTimer = (new Date()).getTime();
      var timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        Socket.emit('stop typing');
        typing = false;
      }
    }, TYPING_TIMER_LENGTH);
  };

  $scope.updateTyping = function(){
    sendUpdateTyping();
  };

  $scope.messageIsMine = function(username){
    return $scope.data.username === username;
  };

  $scope.getBubbleClass = function(username){
    var classname = 'from-them';
    if($scope.messageIsMine(username)){
      classname = 'from-me';
    }
    return classname;
  };

  $scope.sendMessage = function(msg){
    Chat.sendMessage(msg);
    $scope.data.message = "";
  }
})


  .controller('PeopleCtrl', function($scope, Users) {
    $scope.data = Users.getUsers();
  })
  
  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })
  
  .controller('AccountCtrl', function($scope, Chat) {
    $scope.username = Chat.getUsername();  
  }, true)


