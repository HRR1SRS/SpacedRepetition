Template.userItem.helpers({
  topic: function(){
    console.log('we are in userItem helpers.topic');
    var topicNames = [];
    for (var k in this.profile.topics){
      var temp = Topics.find({_id: k}).fetch();
      topicNames.push(temp[0].name);
    }
    console.log(topicNames);
    return topicNames;
  },

  reviewItem: function(){
    console.log('we are in userItem helpers.reviewItem');
    if (this.profile.topics) {
      console.log('We have some topics, time to create a review list.');
      if ( this.profile.reviewList === undefined ) {
        console.log('There is no a review list yet!');
        Meteor.users.update(Meteor.userId(),
                            {$set:{'profile.reviewList': []}});
        // ,
        //                     // [],
        //                     function(err, result){
        //                       if (err){
        //                         console.log('oh no!');
        //                       } else {
        //                       console.log('Result acheived: '+this.profile.reviewList);
        //                       }
        //                     });
        // console.log(this.profile.reviewList);
      } else {
        console.log('Review list found!');
      }
      for (var k in this.profile.topics){
        console.log(k);
        var topic = Topics.find({_id: k}).fetch();
        console.log(topic[0].cards.length);
        for (var i = 0; i < topic[0].cards.length; i++) {
          var cardId = topic[0].cards[i];
          console.log(cardId);
          var cardObject = {};
          cardObject.card = cardId;
          cardObject.reviewDate = Date.now()+86400000;
      //     console.log(cardObject);
          Meteor.users.update(Meteor.userId(), {$push: {'profile.reviewList': cardObject} });
        }
      }
      console.log(this.profile.reviewList);
      return this.profile.reviewList;
    } else {
      console.log('Nothing to review here...Move along!');
    }
  }
});
