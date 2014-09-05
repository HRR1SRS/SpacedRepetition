if(Meteor.isClient){
  var clickedTopic = {};
  Template.review.helpers({
    //displays card question and answer
    card : function(arg){
      var cardData = {question: 'Who Shot Mr. Burns?', answer: 'Maggie'};
      for(var prop in clickedTopic){
      }
      if(arg === undefined){
        return cardData.question;
      }else{
        $('.card p').after('<p class="answer"><b>'+cardData.answer+'</b></p>');
        $('.answer').after('<br><p>rate your difficulty with the question</p><button>easy</button><button>hard</button>');
        $('.button').remove();
      }
    },
    //displays lists of topics available
    topicList : function(){
    var topics = Topics.find().fetch();
      console.log(Topics.find({name: "math"}).fetch() );
    return topics;
    }

  });
    //click event that lists topics being reviewed
  Template.review.events({
    'click select option': function(){
    console.log(Topics.find().fetch());
    console.log(Cards.find().fetch());
      var name = this.name.toLowerCase().split(' ').join('');
      if(!clickedTopic[this.name]){
        clickedTopic[this.name] = name;
        $('.selectedTopics ul').append('<li id="'+name+'">'+this.name+'</li>');
      }else{
        $('#'+name).remove();
        delete clickedTopic[this.name];       
      }
    },
    //button to reveal topic
    'click .button': function(){
      Template.review.card(true);
    }
  });
}
