angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('menu.app', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/app.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('menu.categorie', {
    url: '/page2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/categorie.html',
        controller: 'categorieCtrl'
      }
    }
  })

//  .state('menu.conversations', {
//    url: '/page3',
//    views: {
//      'side-menu21': {
//        templateUrl: 'templates/index.html',
//        controller: 'ChatCtrl'
//      }
//    }
//  })

  .state('menu.pageTheme', {
    url: '/page4',
    views: {
      'side-menu21': {
        templateUrl: 'templates/pageTheme.html',
        controller: 'pageThemeCtrl'
      }
    }
  })


  .state('menu.tab', {
    url: '/tab',
    views: {
      'side-menu21': {
        templateUrl: 'templates/templates-chat/tabs.html',
      }
    }
  })



  .state('menu.tab.chats', {
    url: '/chats/{username}',
    params: { username: { value: null } },
    views: {
      'tab-chats': {
        templateUrl: 'templates/templates-chat/tab-chats.html',
        controller: 'ChatCtrl'
      }
    }
  })

  .state('menu.tab.users', {
      url: '/users',
      views: {
        'tab-users': {
          templateUrl: 'templates/templates-chat/tab-users.html',
        }
      }
    })

  .state('menu.tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/templates-chat/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });




  //routes du app-chat

//  .state('tab', {
//    url: '/tab',
//    abstract: true,
//    templateUrl: 'templates/templates-chat/tabs.html'
//  })

  // Each tab has its own nav history stack:

//  .state('tab.chats', {
//    url: '/chats/{username}',
//    params: { username: { value: null } },
//    views: {
//      'tab-chats': {
//        templateUrl: 'templates/templates-chat/tab-chats.html',
//        controller: 'ChatCtrl'
//      }
//    }
//  })
//
//  .state('tab.users', {
//      url: '/users',
//      views: {
//        'tab-users': {
//          templateUrl: 'templates/templates-chat/tab-users.html',
//        }
//      }
//    })
//
//  .state('tab.account', {
//    url: '/account',
//    views: {
//      'tab-account': {
//        templateUrl: 'templates/templates-chat/tab-account.html',
//        controller: 'AccountCtrl'
//      }
//    }
//  });

$urlRouterProvider.otherwise('/side-menu21/page1')

  

});