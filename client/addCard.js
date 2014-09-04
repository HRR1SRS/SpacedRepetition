Template.addCard.events({
  'submit': function(event, template) {
    var e = event;
    var t = template;
    e.preventDefault();
    var topic = t.find('#topic').value;
    var question = t.find('#question').value;
    var answer = t.find('#answer').value;

    // first create card
    var newCard = Cards.insert({
      question: question,
      answer: answer
    });
    console.log('newCard: ' + newCard);

    // if we find the topic
    if(Topics.find({name: topic}).fetch().length) {
      // update topic to have newCard
      console.log('FOUND TOPIC: ' + topic);
      var topicId = Topics.findOne({name: topic});
      console.log('topicId: ' + topicId);
      Topics.update({_id: topicId._id}, {$push: {cards: newCard}});
      Cards.update({_id: newCard}, {$set: {topic: topicId._id}});
    }
    // else it doesn't exist, so create it
    else {
      console.log('DID NOT FIND TOPIC: ' + topic);
      var newTopic = Topics.insert({name: topic, cards: [newCard]});
      // update newCard to have newTopic
      Cards.update({_id: newCard}, {$set: {topic: newTopic}});
    }
  }
});
