var clickedTopic = {};
var currentCard;
var currentList = [];

Template.review.helpers({
  //displays card question and answer
  card : function(arg){
    var starMaker = function(){
      var star = '';
      for( var i = 0; i < 5; i++){
        star+='<span class="glyphicon glyphicon-star difficulty" style="font-size:32px; color: grey;"></span>';
      }
      return '<div display="inline">'+star+'</div>';
    };
    $('.answerblock').append('<p class="answer"><b>'+arg.answer+'</b></p>');
    $('.answer').after('<br><p class="answer">rate your difficulty with the question. 1 star means no difficulty, 5 means you forgot the answer</p>'+ starMaker());
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
      var cardList = Topics.find({_id: prop}).fetch(); 
      cardList = cardList[0];
      if(cardList){
        currentList = currentList.concat(cardList.cards);
      }  
    }

    Template.review.displayQuestion();
  },
  //displays lists of topics available from the topics collection
  topicList : function(){
    var topics = Topics.find().fetch();
    return topics;
  },

  userTopic: function(){
    user = Meteor.user();
    if(user){      
      var userTopicsObj = user.profile.topics;
      var userTopicArr = [];
      clickedTopic = {};
      for (var k in userTopicsObj){
        clickedTopic[k] = k;
        var results = Topics.find({_id: k}).fetch();
        userTopicArr.push(results[0]);
      }
      Template.review.topicQueue();
      if(Object.keys(clickedTopic).length === 0){
        $('.question').html('');
      }
      return userTopicArr;
    }
  },


  createReviewList: function(callback) {
    // get current user
    var user = Meteor.user();
    // check for topics
    if (user.profile.topics) {
      console.log('We have some topics, time to create a review list.');
      // create review list array first time
      if ( user.profile.reviewList === undefined ) {
        console.log('There is no review list yet!');
        // insert .profile.reviewList proerty onto user
        Meteor.users.update(
          Meteor.userId(),
          {
            $set: {
              'profile.reviewList': {} 
            } 
          },
          function(err, result) {
            if ( err ) {
              console.log('oh no, .profile.reviewList was not created!');
            } else {
              var user = Meteor.users.find(Meteor.userId()).fetch();
              // execute callback on success
              callback(user && user.profile && user.profile.reviewList);
            }
          }
        );
      } else {
        // we have a list...execute callback
        console.log('Review list found!');
        callback();
      }
    } else {
      // there are no topics
      console.log('Nothing to review here...Move along!');
    }
  },

  addCardsToReviewList: function(callback) {
    var user = Meteor.user();
    // for each topic add cards to review list
    for (var k in user.profile.topics){
      // get the topic by id
      var topic = Topics.find({_id: k}).fetch();
      for (var i = 0; i < topic[0].cards.length; i++) {
        // init cardId
        var cardId = topic[0].cards[i];
        // check if card has been added to review list yet
        if ( !user.profile.reviewList.cardId) {
          // if not:
          // init cardObject
          var cardObject = {};
          var revInterval = 86400000;
          var revDate = Date.now()+revInterval;
          // set card_id as key
          cardObject['profile.reviewList.'+cardId] = {};
          // add card fields
          // set card id
          cardObject['profile.reviewList.'+cardId]._cardId = cardId;
          // set topic id
          cardObject['profile.reviewList.'+cardId]._topicId = k;
          // init card review interval to one day in miliseconds
          cardObject['profile.reviewList.'+cardId].reviewInterval = revInterval;
          // set inital review date to one day from date created
          cardObject['profile.reviewList.'+cardId].reviewDate = revDate;
          // push card to review list
          Meteor.users.update(Meteor.userId(),{$set:cardObject});
        }
      }
    }
  },

  //handles adding and removing topics for review from two sources
  clickEventHandler : function(context){
    context.name = context.name || context.innerHTML;
    var name = context.name.toLowerCase().split(' ').join('');
    if(!context._id){
      var retrieveTopicId = Topics.find({name: context.name}).fetch();
      context = retrieveTopicId[0];
      console.log(context);
    }

    var setObject = {};
    setObject['profile.topics.'+context._id] = true;
    Meteor.users.update(Meteor.userId(),{$set:setObject});

    // add cards to review list
    Template.review.createReviewList(Template.review.addCardsToReviewList);
 

    var currentUser = Meteor.user();
    // if(!clickedTopic[context.name]){
    //   clickedTopic[context.name] = name;
    //   $('.selectedTopics').append('<li id="'+name+'"><a href="#">'+context.name+'</a></li>');
    // }else{
    //   $('#'+name).remove();
    //   delete clickedTopic[context.name];
    //   if(Object.keys(clickedTopic).length === 0){
    //     $('.question').html('');
    //   }
    // }
    //Template.review.topicQueue();
  }
});
//click event that lists topics being reviewed
Template.review.events({
  //populates and removes review topics 
  'click #topics li': function(){
    Template.review.clickEventHandler(this);
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
    if(currentList.length > 0){
      Template.review.card(currentCard);
    }
  },
  //deselects topics for review
  'click .selectedTopics li': function(e){
    Template.review.clickEventHandler(e.currentTarget.children[0]);
  },
  'mouseover .difficulty': function(e){
    $(e.currentTarget).css('color', 'gold');
    var recurse = function(elem){
      $(elem).css('color', 'gold');
      if(elem !== null){
        recurse(elem.previousSibling);
      }
    };
    recurse(e.currentTarget.previousSibling);
  },
  'mouseout .difficulty': function(e){
    $(e.currentTarget).css('color', 'grey');
    var recurse = function(elem){
      $(elem).css('color', 'grey');
      if(elem !== null){
        recurse(elem.previousSibling);
      }
    };
    recurse(e.currentTarget.previousSibling);
  }
});
