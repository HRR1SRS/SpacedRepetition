Template.userItem.helpers({
  topic: function(){
    console.log('we are in userItem helpers.topic');
    var topicNames = [];
    for (var k in this.profile.topics){
      var temp = Topics.find({_id: k}).fetch();
      topicNames.push(temp[0].name);
    }
    // console.log(topicNames);
    return topicNames;
  },

  reviewItem: function(){
    console.log('we are in userItem helpers.reviewItem');
    var reviewCards = [];
    var user = Meteor.user();
    for ( var k in this.profile.reviewList ) {
      reviewCards.push(this.profile.reviewList[k]);
    }
    // console.dir(reviewCards);
    return reviewCards;
  }
});
