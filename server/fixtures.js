// this file populates an empty database with some review cards

var addCard = function(topic, question, answer) {
  // first create a card
  var newCard = Cards.insert({
    question: question,
    answer: answer
  });

  // if we find the topic
  if(Topics.find({name: topic}).fetch().length) {
    // update topic to have newCard
    var topicId = Topics.findOne({name: topic});
    Topics.update({_id: topicId._id}, {$push: {cards: newCard}});
    Cards.update({_id: newCard}, {$set: {topic: topicId._id}});
  }
  // else the topic doesn't exist, so create a new topic
  else {
    var newTopic = Topics.insert({name: topic, cards: [newCard]});
    // update newCard to have newTopic
    Cards.update({_id: newCard}, {$set: {topic: newTopic}});
  }
};

// if the dabase is empty, then add the following cards
if(Cards.find().count() === 0 ) {
  addCard('math', '1 + 1 = ?', 2);
  addCard('math', '1 + 2 = ?', 3);
  addCard('math', '2 + 2 = ?', 4);
  addCard('math', '5 * 3 = ?', 15);
  addCard('math', 'abs(-4) = ?', 4);
  addCard('reading', 'mans best friend', 'dog');
  addCard('reading', 'evil feline', 'cat');
  addCard('reading', 'annoying repeater', 'parrot');
  addCard('reading', 'alarm clock', 'rooster');
  addCard('science', 'h2o', 'water');
  addCard('science', 'co2', 'carbon dioxide');
  addCard('science', 'space', 'the final frontier');
  addCard('science', 'moon landing', 'hoax');
  addCard('science', '3rd rock from the sun', 'Earth');
  addCard('science', 'demoted from planethood', 'Pluto');
}
