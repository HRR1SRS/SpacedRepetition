Template.topicsList.helpers({
  topic: function(){
    // console.log('we are in topic helpers');
    return Topics.find();
  }
});
