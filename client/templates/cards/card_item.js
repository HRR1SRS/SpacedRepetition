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

    var newCard = null;

    //test for successful save
    var isSave = false;

    //only create card if fields are not blank
    if ( question && answer ){
      //console.log(question + ': '+answer);
      // first create card
      newCard = Cards.insert({
        question: question,
        answer: answer
      });
    }else{
      //console.log('fields r blank');
      isSave = false;
    }

    if ( newCard ) {
      //only create topic if field is not blank
      var topicId = topic !== null ? Topics.findOne({name: topic}) : null;

      if( topicId ) {
        // update topic to have newCard
        Topics.update({_id: topicId._id}, {$push: {cards: newCard}});
        Cards.update({_id: newCard}, {$set: {topic: topicId._id}});
      }
      // else it doesn't exist, so create it
      else {
        var newTopic = Topics.insert({name: topic, cards: [newCard]});
        // update newCard to have newTopic
        Cards.update({_id: newCard}, {$set: {topic: newTopic}});
      }

      isSave = true;
    }
    

    if (isSave){
      //save was successful, so display growl and clear textfield
      //clear(t);
      t.find('#topics').value = '';
      t.find('#question').value = '';
      t.find('#answer').value = '';

      //display notification
      Notifications.info('Save Successful', 'Successfully added Question: '+question);
    }
    else {
      //display notification
      Notifications.error('Save Unsuccessful', 'Could not save Question: '+question);
    }

  }
});


Template.cardTableRowItem.helpers({
  showTopic: function(){
    return Topics.findOne({_id: this.topic}).name;
  }
})
// Template.cardItem.clear = function(template){
// 	var t = template;

// 	t.find('#topics').value = '';
// 	t.find('#question').value = '';
// 	t.find('#tanswer').value = '';
// }
