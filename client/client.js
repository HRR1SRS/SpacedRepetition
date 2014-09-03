Meteor.subscribe('userList');

Template.cardItem.events({
  'click div.topic': function() {
    var cardId = this._id;
    var cardTopic = this.topic;
    Session.set('selectedCard', cardId);
    Session.set('selectedTopic', cardTopic);

    var selectedCard = Session.get('selectedCard');
    var selectedTopic = Session.get('selectedTopic');
    console.log(selectedCard);
    console.log(selectedTopic);
  }
});

Template.addToReviewList.events({
  'submit form': function(theEvent, thetemplate) {
    theEvent.preventDefault();
    var selectedTopic = Session.get('selectedTopic');
    var currentUserId = Meteor.userId();
    // Meteor.call('addTopicToReview', selectedTopic);
    console.log(currentUserId);
    Meteor.users.update({_id:Meteor.user()._id}, {$push: {"profile.topics": selectedTopic}});
    console.log(Meteor.user());
  }
});

Template.addToReviewList.showSelectedCard = function() {
  var selectedTopic = Session.get('selectedTopic');
  return selectedTopic;
};