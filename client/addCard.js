Template.dashboard.events({
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
    }
    // else it doesn't exist, so create it
    else {
      var newTopic = Topics.insert({name: topic, cards: [newCard]});
      // update newCard to have newTopic
    }
  }
});

// Topics.update({})

// Meteor.users.update({_id:Meteor.user()._id}, {$push: {'profile.topics': selectedTopic}});
