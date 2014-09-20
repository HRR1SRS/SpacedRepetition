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
  addCard('Math', '1 + 1 = ?', 2);
  addCard('Math', '1 + 2 = ?', 3);
  addCard('Math', '2 + 2 = ?', 4);
  addCard('Math', '5 * 3 = ?', 15);
  addCard('Math', 'abs(-4) = ?', 4);
  addCard('Reading', 'mans best friend', 'dog');
  addCard('Reading', 'evil feline', 'cat');
  addCard('Reading', 'annoying repeater', 'parrot');
  addCard('Reading', 'alarm clock', 'rooster');
  addCard('Science', 'h2o', 'water');
  addCard('Science', 'co2', 'carbon dioxide');
  addCard('Science', 'space', 'the final frontier');
  addCard('Science', 'moon landing', 'hoax');
  addCard('Science', '3rd rock from the sun', 'Earth');
  addCard('Science', 'demoted from planethood', 'Pluto');
}
