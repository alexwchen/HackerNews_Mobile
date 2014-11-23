angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault(); // org.apache.cordova.statusbar required
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
    })

    .state('app.topstories', {
      url: "/topstories",
      views: {
        'menuContent' :{
          templateUrl: "templates/topstories.html",
          controller: "TopStoriesCtrl"
        }
      }
    })

    .state('app.read', {
      url: "/read",
      views: {
        'menuContent' :{
          templateUrl: "templates/read.html",
          controller:"ReadCtrl"
        }
      }
    });

  $urlRouterProvider.otherwise('/app/topstories');
});
