Router.map(function() {
  // render template 'intro' when at path '/'
  this.route('intro', {
    path: '/'
  });

  this.route('dashboard', {
  path: '/dashboard/',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        Router.go('/dashboard');
      }
      else{
        Router.go('/contact');
        Session.set('sAlert', {condition: 'red', effect: 'jelly', message: 'Oops! Please Login First', position: 'right-top', timeout: 3000});
      }
    }
  }
});


  // render template 'cards' with ALL cards when at path '/cards'
  this.route('cards', {
    path: '/cards/',
      onBeforeAction: function () {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        Router.go('/cards');
      }
      else{
         Router.go('/intro');
         Session.set('sAlert', {condition: 'red', effect: 'jelly', message: 'Oops! Please Login First', position: 'right-top', timeout: 3000});
        
      }
    }
  },
    data: function() {
      return {
        card: Cards.find({}).fetch()
      };
    }
  });

  // render template 'cards' with only cards for selected topic
  // when at path '/cards/:_id' where _id is topicId
  this.route('cards', {
    path: '/cards/:_id',
    data: function() {
      var _id = this.params._id;
      return {
        card: Cards.find({topic: _id}).fetch()
      };
    }
  });
 

  // render template 'review' when at path '/review'
  this.route('review', {
    onBeforeAction: function () {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        Router.go('/review');
      }
      else{
         Router.go('/intro');
         Session.set('sAlert', {condition: 'red', effect: 'jelly', message: 'Oops! Please Login First', position: 'right-top', timeout: 3000});
      }
    }
  },
  });

  // uncomment the following line to help debug while developing
  // this.route('usersList');

  // render template 'contact' when at path '/contact'
  this.route('contact');
});
