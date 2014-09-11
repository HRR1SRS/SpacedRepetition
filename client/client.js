Meteor.subscribe('userList');

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
