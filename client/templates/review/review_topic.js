Template.reviewTopics.helpers({
  topic: function(){
    console.log('we are in reviewTopic helpers.topic');
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
  }
});
