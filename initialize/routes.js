Router.map(function() {
  // render template 'intro' when at path '/'
  this.route('intro', {
    path: '/'
  });

  // render template 'dashboard' with ALL cards when at path '/dashboard'
  this.route('dashboard', {
  path: '/dashboard/',
  onBeforeAction: function () {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        Router.go('/dashboard');
      }
      else{
        //testing
        Router.go('/contact');
      }
    }
  }
});


  this.route('cards', {
    path: '/cards/',
      onBeforeAction: function () {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        Router.go('/cards');
      }
      else{
        //testing
         Router.go('/contact');
        
      }
    }
  },
    data: function() {
      return {
        card: Cards.find({}).fetch()
      };
    }
  });

  // render template 'dashboard' with only cards for selected topic
  // when at path '/dashboard/:_id' where _id is topicId
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
        //testing
         Router.go('/contact');
      }
    }
  },
  });

  // uncomment the following line to help debug while developing
  // this.route('usersList');

  // render template 'contact' when at path '/contact'
  this.route('contact');
});
