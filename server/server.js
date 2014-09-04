Meteor.publish("userList", function () {
  return Meteor.users.find({});
});

Meteor.methods({
  'addTopicToReview': function(selectedTopic) {
    var currentUserId = Meteor.userId();
  }
})