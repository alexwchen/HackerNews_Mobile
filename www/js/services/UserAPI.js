angular.module('starter.services')

.factory('UserAPI', ['$rootScope', '$firebase', '$firebaseAuth', function($rootScope, $firebase, $firebaseAuth) {

  var ref = new Firebase("https://hackernews-hack.firebaseio.com");

  return {
    isUserLogin : function(){
      if($rootScope.user){
        return true;
      }else{
        return false;
      }
    },

    isUserExist : function(email){
      var fireuser = $firebase(ref.startAt(email).endAt(email)).$asObject();
      return fireuser.$loaded();
    },

    getUserFirebaseID : function(firebaseObj){
      var user_firebase_id = "";
      for (var key in firebaseObj){
        if(key.length>10){
          user_firebase_id = key;
          break;
        }
      }
      return user_firebase_id;
    },

    loadUserReadingList : function(UserFirebaseID){
      var ReadingList = $firebase(ref.child(UserFirebaseID).child('readlist')).$asArray();
      return ReadingList.$loaded();
    },

    loadSingleUser : function(UserFirebaseID) {
      var SingleUser = $firebase(ref.child(UserFirebaseID)).$asObject();
      return SingleUser.$loaded();
    },

    create_new_user : function(email, name, uid){
      var fireusers = $firebase(ref).$asArray();
      // save new email obj
      var new_email_obj = {};
      fireusers.$loaded().then(function() {
        new_email_obj.email = email;
        new_email_obj.name = name;
        new_email_obj.uid = uid;
        new_email_obj.$priority = email;

        // set email priority, so later on I can query
        fireusers.$add(new_email_obj).then(function(ref) {
           var id = ref.key();
           console.log("added record with id " + id);
        });
      });
    }

  };
}]);
