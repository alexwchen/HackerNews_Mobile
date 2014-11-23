angular.module('starter.controllers', [])

.controller('ReadCtrl', ['$scope', '$rootScope', '$firebase', '$firebaseAuth', '$window', 'HackerNewsAPI', 'UserAPI', function($scope, $rootScope, $firebase, $firebaseAuth, $window, HackerNewsAPI, UserAPI) {

  var ref = new Firebase("https://hackernews-hack.firebaseio.com");
  $scope.authObj = $firebaseAuth(ref);  // started as not loged in

  $scope.isUserLogin = UserAPI.isUserLogin;

  $scope.facebookLogin = function(){
    // alert('proof that alert is working');
    // $scope.authObj.$authWithOAuthPopup("facebook").then(function(authData) {
    //   alert('win');
    //   console.log("Logged in as:", authData.uid);
    // }).catch(function(error) {
    //   alert('lose');
    //   console.error("Authentication failed:", error);
    // });
    $scope.authObj.$authWithOAuthPopup("facebook").then(function(authData) {
      console.log("Logged in as:", authData.uid);
      // alert('win');
      $rootScope.user = authData;
      $scope.loadList(authData.facebook.email, authData.facebook.displayName, authData.uid);

    }).catch(function(error) {
      // alert('fail');
      console.error("Authentication failed:", error);
    });
  };

  $scope.open_inapp_browser = function(url, id){
    $window.open(url, '_blank', 'location=no,EnableViewPortScale=yes');
  };

  $scope.loadList = function(email, name, uid){
    // see if user exist in db, if so, loadlist
    ref.startAt(email).endAt(email).once('value', function(snap) {
      if(snap.val()){

        UserAPI.isUserExist()
        .then(UserAPI.getUserFirebaseID)
        .then(UserAPI.loadUserReadingList)
        .then(function(readinglist_data){
          // once we get all readlist indexes, load it from HN api
          var promises = HackerNewsAPI.convert_index_to_promises(readinglist_data);
          var all_stories = HackerNewsAPI.get_all_stories_data(promises);
          all_stories.then(function(stories){
            $scope.HackerNews = stories.reverse();
            console.log('success');
          });
        });
      }else{
        UserAPI.create_new_user(email, name, uid);
        console.log('fail');
      }
    });
  };

  if($scope.isUserLogin()){
    var email = $rootScope.user.facebook.email;
    var name = $rootScope.user.facebook.displayName;
    var uid = $rootScope.user.uid;
    $scope.loadList(email,name,uid);
  }

}])



.controller('TopStoriesCtrl', function($scope, $rootScope, $firebase, $window, HackerNewsAPI, UserAPI) {

  var indexes = HackerNewsAPI.get_all_top_stories_indexes();
  indexes.$loaded(function(data){
    var promises = HackerNewsAPI.convert_index_to_promises(data);
    var all_stories = HackerNewsAPI.get_all_stories_data(promises);
    all_stories.then(function(stories){
      $scope.HackerNews = stories;
      // console.log(stories);
    });
  });

  $scope.open_inapp_browser = function(url, id){
    $window.open(url, '_blank', 'location=no,EnableViewPortScale=yes');

    // track what user is reading
    if($rootScope.user){
      UserAPI.isUserExist()
      .then(UserAPI.getUserFirebaseID)
      .then(UserAPI.loadSingleUser)
      .then(function(firebaseUserObj){
        if(firebaseUserObj.readlist){
          firebaseUserObj.readlist.push(id);
        }else{
          firebaseUserObj.readlist = [id];
        }
        firebaseUserObj.$save().then(function(){
          console.log('track reading saved successfully');
        });
      });
    }
  };
});
