Router.map(function() {
  this.route('addCard');
  this.route('dashboard');
  this.route('review');
  this.route('addToReviewList');
  this.route('cardsList');
  this.route('usersList');
  this.route('cardsForTopic', {
  	path: '/dashboard/:_id',
  	//template: 'cardsList',
  	data: function() { return Cards.find({topic: this.params._id}).fetch(); }
  });
  this.route('intro', {
    path: '/'
  });
});
