if(Meteor.isClient){
  var clickedTopic = {};
  var currentCard;
  var currentList = [];
  Template.review.helpers({
    //displays card question and answer
    card : function(arg){
      $('.answerblock').append('<p class="answer"><b>'+arg.answer+'</b></p>');
      $('.answer').after('<br><p class="answer">rate your difficulty with the question</p><button class="difficulty">easy</button><button class="difficulty">hard</button>');
      $('.button').remove();
    },
    //pulls card from list and displays the question
    //sends card to back of the list
    displayQuestion : function(){
      if(currentList.length){
        $('.question').html('');
        var cardId = currentList.shift();
        currentCard = Cards.find({_id: cardId}).fetch();
        currentCard = currentCard[0];
        $('.question').append(currentCard.question);
        currentList.push(cardId);
      }
    },
    //creates an array of all topics under review and 
    //calls the display question function
    topicQueue : function(){
      currentList = [];
      for(var prop in clickedTopic){
        var cardList = Topics.find({name: prop}).fetch(); 
        cardList = cardList[0];  
        currentList = currentList.concat(cardList.cards);
      }

      Template.review.displayQuestion();
    },
    //displays lists of topics available from the topics collection
    topicList : function(){
    var topics = Topics.find().fetch();
    return topics;
    }
  });
  //click event that lists topics being reviewed
  Template.review.events({
    //click even that populates the list of topics being reviewed
    'click select option': function(){
      var name = this.name.toLowerCase().split(' ').join('');
      if(!clickedTopic[this.name]){
        clickedTopic[this.name] = name;
        $('.selectedTopics ul').append('<li id="'+name+'">'+this.name+'</li>');
        Template.review.topicQueue();
      }else{
        $('#'+name).remove();
        delete clickedTopic[this.name];
        Template.review.topicQueue();     
      }
    },
    //click event that registers the click on the difficulty buttons
    'click .difficulty': function(){
      //display the next question
      $('.question').html('');
      $('.answerblock').html('');
      Template.review.displayQuestion();
      $('.question').after('<button class="button">click to see answer</button>');
    },
    //button to reveal answer
    'click .button': function(){
      if(currentList.length){
        Template.review.card(currentCard);
      }
    }
  });
}
