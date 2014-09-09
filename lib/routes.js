Router.map(function() {
  this.route('intro', {
    path: '/'
  });
  this.route('dashboard');
  this.route('addCard');
  this.route('review');
  this.route('usersList');
  this.route('cardsForTopic', {
    path: '/dashboard/:_id',
    //template: 'cardsList',
    data: function() { return Cards.find({topic: this.params._id}).fetch(); }
  });
  this.route('contact');
});
