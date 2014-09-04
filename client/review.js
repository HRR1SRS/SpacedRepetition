if(Meteor.isClient){
  Template.review.helpers({
    //displays card question and answer
    card : function(arg){
      var cardData = {question: 'Who Shot Mr. Burns?', answer: 'Maggie'};
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
    var topics = [{name:'Javascript'}, {name: 'Spanish'}, {name:'Human Anatomy'}, {name:'Russian Literature'}];
    return topics;
    }

  });
    //click event that lists topics being reviewed
  var clickedTopic = {};
  Template.review.events({
    'click select option': function(){
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
      Template.review.cardQuestion(true);
    }
  });
}
