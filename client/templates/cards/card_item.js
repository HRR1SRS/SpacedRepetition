// Template.cardItem.helpers({
//   card: function(){
//     return this;
//   }
// })

Template.cardItem.events({
  'submit': function(event, template) {
    var e = event;
    var t = template;
    e.preventDefault();
    var topic = t.find('#topics').value;
    var question = t.find('#question').value;
    var answer = t.find('#answer').value;

    // first create card
    var newCard = Cards.insert({
      question: question,
      answer: answer
    });

    var topicId = Topics.findOne({name: topic});
    if(topicId) {
      // update topic to have newCard
      Topics.update({_id: topicId._id}, {$push: {cards: newCard}});
      Cards.update({_id: newCard}, {$set: {topic: topicId._id}});

      //save was successful, so display growl and clear textfield
      //clear(t);

      t.find('#topics').value = '';
	  t.find('#question').value = '';
	  t.find('#answer').value = '';
    }
    // else it doesn't exist, so create it
    else {
      var newTopic = Topics.insert({name: topic, cards: [newCard]});
      // update newCard to have newTopic
      Cards.update({_id: newCard}, {$set: {topic: newTopic}});
    }

  }
});

// Template.cardItem.clear = function(template){
// 	var t = template;

// 	t.find('#topics').value = '';
// 	t.find('#question').value = '';
// 	t.find('#tanswer').value = '';
// }
