Meteor.subscribe('userList');

UI.registerHelper('card', function(){
    return Cards.find();
  }
);

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



//Template dashboard
Template.dashboard.events({
  'click #btnAddCard': function(){
    //show AddForm
    //UI.insert('cardItem', $('#dashboard').html(), $('#cardList'));
    $('#cardForm').removeClass('hidden').addClass('show');

    //Show #btnRemoveCard and hide #btnAddCard
    $('#btnHideCard').removeClass('hidden').addClass('show');
    $('#btnAddCard').removeClass('show').addClass('hidden');

    //hide the header
    $('.sub-header').removeClass('show').addClass('hidden');
  },

  'click #btnHideCard': function(){
    //hide AddForm
    $('#cardForm').removeClass('show').addClass('hidden');

    //Hide #btnRemoveCard and show #btnAddCard
    $('#btnAddCard').removeClass('hidden').addClass('show');
    $('#btnHideCard').removeClass('show').addClass('hidden');

    //hide the header
    $('.sub-header').removeClass('hidden').addClass('show');
  }
})
