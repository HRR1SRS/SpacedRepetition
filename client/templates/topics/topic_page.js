Template.topicPage.helpers({
  cards: function() {
    console.log('we are in topicPage helpers');
    console.log(this);
    return Cards.find({topic: this._id});
  }
});
