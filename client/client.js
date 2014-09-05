Meteor.subscribe('userList');

UI.registerHelper('card', function(){
    return Cards.find();
  }
);

Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 1500
    });
});

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
    var currentUser = Meteor.user();
    var setObject = {};
    setObject['profile.topics.'+selectedTopic] = true;
    console.log('current user is: '+currentUser);
    console.log('current user topics are: '+currentUser.profile.topics);
    Meteor.users.update(Meteor.userId(), {$set:setObject});
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
});
