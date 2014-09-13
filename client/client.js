Meteor.subscribe('userList');

Meteor.startup(function () {
  _.extend(Notifications.defaultOptions, {
      timeout: 1500
  });
});

Meteor.users.find({ 'status.online': true }).observe({
  //login action
  added: function(id) {
    console.log(id.emails[0].address, 'logged in!');
    Router.go('/dashboard');
    stopMonitor: true;
  },
  //logout action
  removed: function(id) {
    console.log(id.emails[0].address, 'logged out!');
    Router.go('/');
  }
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
Template.cards.events({
  'click #btnAddCard': function() {
    //show AddForm
    //UI.insert('cardItem', $('#dashboard').html(), $('#cardList'));
    $('#cardForm').removeClass('hidden').addClass('show');

    //Show #btnRemoveCard and hide #btnAddCard
    $('#btnHideCard').removeClass('hidden').addClass('show');
    $('#btnAddCard').removeClass('show').addClass('hidden');

    //hide the header
    $('.sub-header').removeClass('show').addClass('hidden');
  },

  'click #btnHideCard': function() {
    //hide AddForm
    $('#cardForm').removeClass('show').addClass('hidden');

    //Hide #btnRemoveCard and show #btnAddCard
    $('#btnAddCard').removeClass('hidden').addClass('show');
    $('#btnHideCard').removeClass('show').addClass('hidden');

    //hide the header
    $('.sub-header').removeClass('hidden').addClass('show');
  },
});

// Template._loginButtonsLoggedInDropdown.events({
//     'click #startBtn': function(event) {
//         event.stopPropagation();
//         Template._loginButtons.toggleDropdown();
//         console.log("hello");
//         //Router.go('profileEdit');
//     }
// });

Template.intro.events({
  
  'click #startBtn': function(event) {
        //Router.go('/dashboard');
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        console.log('logging in...')
      }
      else{
        //alert("Oops! Please login ➚");
        Session.set('sAlert', {condition: 'red', effect: 'stackslide', message: 'Oops! Please Login First', position: 'right-bottom', timeout: 10000});
      }
    }
    //Router.go('/dashboard');

  },

});


