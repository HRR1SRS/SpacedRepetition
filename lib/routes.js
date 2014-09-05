Router.map(function() {
  this.route('addCard');
  this.route('dashboard');
  this.route('review');
  this.route('addToReviewList');
  this.route('cardsList');
  this.route('usersList');
  this.route('intro', {
    path: '/'
  });
});
