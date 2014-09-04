if(Meteor.isClient){
  Template.review.topicList = function(){
    var topics = [{name:'Javascript'}, {name: 'Spanish'}, {name:'Human Anatomy'}, {name:'Russian Literature'}];
    return topics;
  };
  var clickedTopic = {};

  Template.review.selectedTopics = function(name){
  };

  Template.review.card = function(arg){
    var cardData = {question: 'Who Shot Mr. Burns?', answer: 'Maggie'};
    if(arg === undefined){
      console.log(cardData.question);
      return cardData.question;
    }else{
      console.log(cardData.answer);
      return cardData.answer;
    }

  } ;

  Template.review.events({
    'click select option': function(){
      var name = this.name.toLowerCase().split(' ').join('');
      if(!clickedTopic[this.name]){
        clickedTopic[this.name] = name;
        $('.selectedTopics ul').append('<li id="+name+">'+this.name+'</li>');
      }else{
        $('#'+name).remove();
        delete clickedTopic[this.name];       

      }
    },
    'click .button': function(){
      Template.review.card(true);
    }
  });
}
