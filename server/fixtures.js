// function copied/pasted from addCard.js
function addCard(topic, question, answer) {
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

if (Cards.find().count() === 0 ) {
  addCard('math', '1 + 1 = ?', 2);
  addCard('math', '1 + 2 = ?', 3);
  addCard('math', '2 + 2 = ?', 4);
  addCard('reading', 'mans best friend', 'dog');
  addCard('reading', 'evil feline', 'cat');
  addCard('reading', 'annoying repeater', 'parrot');
  addCard('reading', 'alarm clock', 'rooster');
}