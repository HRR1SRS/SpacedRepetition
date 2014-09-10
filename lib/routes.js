Router.map(function() {
  this.route('intro', {
    path: '/'
  });
  this.route('dashboard', {
    path: '/dashboard/',
    data: function() {
      return {
        card: Cards.find({}).fetch()
      };
    }
  });
  this.route('addCard');
  this.route('review');
  // this.route('usersList');
  this.route('dashboard', {
    path: '/dashboard/:_id',
    //template: 'cardsList',
    data: function() {
      var _id = this.params._id;
      console.log(_id);
      console.log(Cards.find({topic: _id}).fetch());
      return {
        card: Cards.find({topic: _id}).fetch()
      };
    }
  });
  this.route('contact');
});
