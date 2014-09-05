Template.topicItem.helpers({
  card: function() {
    return Cards.find({topic: this._id});
  },

  cardsCount: function() {
    return Cards.find({topic: this._id}).count();
  }
});
