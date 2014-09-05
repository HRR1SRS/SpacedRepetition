Template.userItem.helpers({
  topic: function(){
    console.log('we are in userItem helpers.topic');
    var topicIds = [];
    var topicNames = [];
    for (var k in this.profile.topics){
      console.log('line 7: '+k);
      var temp = Topics.find({_id: k}).fetch();
      console.log(temp[0].name);

      topicNames.push(temp[0].name);
    }
    
    // console.log(topicNames);
    return topicNames;
  },

  // reviewList: function(){
  //   console.log('we are in userItem helpers.reviewList');
  //   for (var k in this.profile.topics){
  //     console.log(k);
  //     var topic = Topics.find({_id: k}).fetch();
  //     console.log(topic[0].cards.length);
  //     for (var i = 0; i < topic[0].cards.length; i++) {
  //       var card = topic[0].cards[i];
        // console.log(card);
        // var cardObject = {};
        // cardObject['profile.reviewList.'+topic[0].cards[i]] = true;
        // cardObject[card] = true;
        // cardObject.reviewDate = 1;
        // console.log(cardObject);
    // //     // Meteor.users.update(Meteor.userId(), {$set:cardObject});
        // Meteor.users.update(Meteor.userId(), {$push: {'profile.reviewList': cardObject} });

    //   }
    // }
    // console.log(this.profile.reviewList);
    // return this.profile.reviewList;
  // }
});
