var clickedTopic = {};
var currentCard;
var currentList = [];

Template.review.helpers({
  //displays card question and answer
  card : function(arg){
    var starMaker = function(){
      var star = '';
      var starType = 'glyphicon-star-empty';
      for( var i = 0; i < 6; i++){
        star+='<span class="glyphicon difficulty glyphicon-star-empty" style="font-size:32px; color: grey;"></span>';
      }
      return '<div display="inline">'+star+'<button class="response">submit</button></div>';
    };
    $('.answerblock').append('<p class="answer"><b>'+arg.answer+'</b></p>');
    $('.answer').after('<br><p class="answer">Please rate your answer according to the scale provided.</p>'+ starMaker());
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
    // get current user

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
  // add topics to user
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
        // insert .profile.reviewList property onto user
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
              console.log(result);
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
    // get current user
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
          var revDate = Date.now();
          // set card_id as key
          cardObject['profile.reviewList.'+cardId] = {};
          // add card fields:
          // set card id
          cardObject['profile.reviewList.'+cardId]._cardId = cardId;
          // set topic id
          cardObject['profile.reviewList.'+cardId]._topicId = k;
          // set initial easiness factor to 2.5
          cardObject['profile.reviewList.'+cardId].easinessFactor = 2.5;
          // set initial card review interval to one day in miliseconds
          cardObject['profile.reviewList.'+cardId].reviewInterval = revInterval;
          // set inital review date to current date
          cardObject['profile.reviewList.'+cardId].reviewDate = revDate;
          // push card to review list
          Meteor.users.update(Meteor.userId(),{$set:cardObject});
        }
      }
    }
  },

  updateReviewDate: function() {
    // get current user
    var user = Meteor.user();
    // get card _id
    // var cardId = card._id;
    // get card rating
    // var quality = rating;
    // get user.profile.reviewList.cardId
    // var currentUserCard = user.profile.reviewList.cardId;
    // if quality <= 2 set interval to one day in miliseconds
    // currenUserCard.reviewInterval = 86400000;
      // set next review date to one day later
      // currentUserCard.reviewDate += currenUserCard.reviewInterval;
    // else if quality > 2 set new easiness factor based on SM-2 Alogorithm
    // currentUserCard.easinessFactor = currentUserCard.easinessFactor+
      //(0.1-(5-q)*(0.08+(5-q)*0.02));
    // recalibrate EF if needed as perscribed by SM-2 algorithm
    // if currentUserCard.easinessFactor < 1.3
      // set currentUserCard.easinessFactor = 1.3
    // update review interval based on new EF
    // currentUserCard.reviewInterval = currentUserCard.reviewInterval * currentUserCard.easinessFactor;
    // update new review date
    // currentUserCard.reviewDate = currentUserCard.reviewDate + currentUserCard.reviewInterval;

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
  }
});
//click event that lists topics being reviewed
Template.review.events({
  //populates and removes review topics 
  'click #topics li': function(){
    Template.review.clickEventHandler(this);
  },
  'click .difficulty': function(e){
    $(e.currentTarget)
      .removeClass('difficulty')
      .addClass('clickedStar');
    var recurse = function(elem){
      if($(elem).hasClass('difficulty')){
        $(elem)
        .removeClass('difficulty')
        .addClass('clickedStar');
      }
      if(elem !== null){
        recurse(elem.previousSibling);
      }
    };
    recurse(e.currentTarget.previousSibling);
  },
  //changes class of star before submission
  'click .clickedStar': function(e){
    $(e.currentTarget)
      .css('color', 'lime');
    var recurse = function(elem){
      $(elem)
        .removeClass('clickedStar')
        .addClass('difficulty')
        .removeClass('glyphicon-star')
        .addClass('glyphicon-star-empty')
        .css('color', 'grey');
      var $sibling = $(elem.nextSibling) ; 
      if($sibling.hasClass('response') === false && $sibling.hasClass('clickedStar') ){
        recurse(elem.nextSibling);
      }
    };
    if($(e.currentTarget.nextSibling).hasClass('clickedStar')){
      recurse(e.currentTarget.nextSibling);
    }
  },
  //button to reveal answer
  'click .button': function(){
    if(currentList.length > 0){
      Template.review.card(currentCard);
    }
  },
  //click event that registers the click on the difficulty stars
  //submits rating for algorithm
  'click .response': function(e){
    var rating = 0;
    var recurse = function(elem){
      if($(elem).hasClass('clickedStar')){
        rating++;
      }
      if(elem !== null){
        recurse(elem.previousSibling);
      }
    };
    recurse(e.currentTarget.previousSibling);
    if(rating === 0){
      alert('please rate the question 1-6 stars');
    }else{
//*******************algorithm plugs in here******************
      //display the next question
      $('.question').html('');
      $('.answerblock').html('');
      Template.review.displayQuestion();
      $('.question').after('<button class="button">click to see answer</button>');
    }
  },
  //deselects topics for review
  'click .selectedTopics li': function(e){
    Template.review.clickEventHandler(e.currentTarget.children[0]);
  },
  // mouse events for rating stars
  'mouseover .difficulty': function(e){
    $(e.currentTarget).removeClass('glyphicon-star-empty')
      .addClass('glyphicon-star')
      .css('color', 'lime');
    var recurse = function(elem){
      if($(elem).hasClass('difficulty')){
        $(elem).removeClass('glyphicon-star-empty')
          .addClass('glyphicon-star')
          .css('color', 'limeGreen');
        if(elem !== null){
          recurse(elem.previousSibling);
        }
      }else{
        $(elem).css('color', 'limeGreen');
      }
    };
      recurse(e.currentTarget.previousSibling);
  },
  // mouse events for rating stars
  'mouseout .difficulty': function(e){
    $(e.currentTarget).removeClass('glyphicon-star')
      .addClass('glyphicon-star-empty')
      .css('color', 'grey');
    var recurse = function(elem){
      if($(elem).hasClass('difficulty')){
        $(elem).removeClass('glyphicon-star')
          .addClass('glyphicon-star-empty')
          .css('color', 'grey');
        if(elem !== null){
          recurse(elem.previousSibling);
        }
      }else{
        $(elem).css('color', 'lime');
      }
    };
    recurse(e.currentTarget.previousSibling);
  }
});

