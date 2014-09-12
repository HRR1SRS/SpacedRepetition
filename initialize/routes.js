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

  this.route('cards');

 

  // render template 'review' when at path '/review'
  this.route('review');

  // uncomment the following line to help debug while developing
  // this.route('usersList');

  // render template 'contact' when at path '/contact'
  this.route('contact');
});
