angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('HackerNewsAPI', ['$firebase', '$q', function($firebase,$q) {

  return {
    get_all_top_stories_indexes: function() {
      // loading 100 top stories id from hackernews
      var fireHack_ = new Firebase("https://hacker-news.firebaseio.com/v0/").child('topstories');
      return $firebase(fireHack_).$asArray();

    },

    convert_index_to_promises: function(indexes) {
      // using the 100 top story indexes and form promises to load each stories indivisually
      var promiseArray = new Array(indexes.length);
      var i;
      for (i=0;i<indexes.length;i++){
        var id = indexes[i].$value;
        var fireItem_ = new Firebase("https://hacker-news.firebaseio.com/v0/").child('item').child(id);
        var fireItem = $firebase(fireItem_).$asObject();
        // storing all the promises, so we can later use q_all
        promiseArray[i] = fireItem.$loaded();
      }
      return promiseArray;
    },

    get_all_stories_data: function(promieses){
      // sync all the loading for 100 story
      return $q.all(promieses);
    },

    get_single_story: function(idx) {
      var fireItem_ = new Firebase("https://hacker-news.firebaseio.com/v0/").child('item').child(idx);
      return $firebase(fireItem_).$asObject();
    }
  };
}]);
