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
    $('.button').remove();
    $('.card').append(
      '<div class="container ratingsBlock">'
      +'<h4>Click a rating below:</h4>'
      +'<p class="6">Perfect Response...Total Domination!</p>'
      +'<p class="5">Correct Response...A little tricky but still nailed it.</p>'
      +'<p class="4">Correct Response...Man, I had to work for that one.</p>'
      +'<p class="3">Incorrect Response...Aw snap, I should have known that.</p>'
      +'<p class="2">Incorrect Response, Oh yeah I kind of remember that now.</p>'
      +'<p class="1">Total blackout...Not in a million years.</p>'
      +'</div>');
  },

  // get milisecond value at midnight for use
  // in calculating today's review cards
  getMidnight: function() {
    // get tomorrow by getting date now and
    // adding in days worth of miliseconds
    var tomorrow = Date.now()+86400000;
    // calculate difference between tomorrow and midnight
    var diff = tomorrow % 86400000;
    // subtract diff from tomorrow to get midinght in miliseconds
    var midnight = tomorrow - diff;
    // return diff to use as value in determinig today's review cards
    return midnight;
  },
  
  // construct today's review list
  createReviewTodayList: function() {
    // get current user
    var user = Meteor.user();
    // get midnight
    var midnight = Template.review.getMidnight();
    // get user's review list
    var wholeList = user.profile.reviewList;
    // init today's list
    var reviewToday = [];
    // iterate through wholeList
    for ( var k in wholeList ) {
      // if a card's review date is less than midnight,
      if ( wholeList[k].reviewDate < midnight ) {
      // push cards from whole list to today's list
      reviewToday.push(wholeList[k]);
      }
    }
    if(reviewToday.length === 0){
      $('.question').html('<h5>you\'ve completed your review session for all topics on your Review List</h5>');
    }
    return reviewToday;
  },

  shuffleReviewTodayList: function(array) {
    // make copy of array
    var input = array.slice();
    // iterate over array
    for (var i = input.length-1; i >=0; i--) {
      // get gandom index
      var randomIndex = Math.floor(Math.random()*(i+1)); 
      // store item at random index
      var itemAtIndex = input[randomIndex];
      // replace item at random index with item at current index
      input[randomIndex] = input[i];
      // replace item at current index with item from random index
      input[i] = itemAtIndex;
    }
    // return result
    return input;
},

  // display questions from today's review list
  displayQuestion : function(){
    // initialize today's list
    var reviewToday = Template.review.createReviewTodayList();
    // if we have cards, shuffle them
    var shuffled = [];
    if (reviewToday.length) {
      shuffled = Template.review.shuffleReviewTodayList(reviewToday);
    }
    // display them
    if(shuffled.length > 0){
      $('.question').html('');
      // grab the cardId from the first index
      var cardId = shuffled.shift();
      // query the card from the DB
      currentCard = Cards.find({_id: cardId._cardId}).fetch();
      // pull card out of array
      currentCard = currentCard[0];
      // console.log(currentCard);
      $('.question').append('<div style="visibility: hidden;" class="_id">'+cardId._cardId+'</div>');
      $('.question').append(currentCard.question);
      // shuffled.push(cardId);
    }
  },
  
  //displays lists of topics available from the topics collection
  topicList : function(){
    var topics = Topics.find().fetch();
    return topics;
  },

  // display User Topics
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
      // call displayQuestion to get today's cards
      Template.review.displayQuestion();
      return userTopicArr;
    }
  },

  // create a review list on user.profile
  createReviewList: function(_id, callback) {
    console.log(_id);
    var topicId = _id;
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
              // execute callback on success
              callback(topicId, user && user.profile && user.profile.reviewList);
            }
          }
        );
      } else {
        // we have a list...execute callback
        console.log('Review list found!');
        callback(topicId);
      }
    } else {
      // there are no topics
      console.log('Nothing to review here...Move along!');
    }
  },

  // add cards to review list
  addCardsToReviewList: function(topicId) {
    console.log(topicId);
    // get current user
    var user = Meteor.user();
    // get the topic by id
    var topic = Topics.find({_id: topicId}).fetch();
    for (var i = 0; i < topic[0].cards.length; i++) {
      // init cardId
      var cardId = topic[0].cards[i];
      // check if card has been added to review list yet
      if ( user.profile.reviewList[cardId] === undefined ) {
        console.log('Creating review card with id: '+ cardId);
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
        cardObject['profile.reviewList.'+cardId]._topicId = topicId;
        // set initial easiness factor to 2.5
        cardObject['profile.reviewList.'+cardId].easinessFactor = 2.5;
        // set initial card review interval to one day in miliseconds
        cardObject['profile.reviewList.'+cardId].reviewInterval = revInterval;
        // set inital review date to current date
        cardObject['profile.reviewList.'+cardId].reviewDate = revDate;
        // push card to review list
        Meteor.users.update(Meteor.userId(),{$set:cardObject});
      } else {
        console.log('Review card with id '+cardId+' already exists');
      }
    }
  },

  setEasinessFactor: function(q, oldEF) {
    console.log(q);
    // calculate quality score from SM-2
    var qScore = (0.1-(5-q)*(0.08+(5-q)*0.02));
    var ef = oldEF+ qScore;
    // recalibrate EF if needed as perscribed by SM-2 algorithm
    if ( ef < 1.3 ) {
      ef = 1.3;
    }
    return ef;
  },

  updateCardReviewDate: function(rating, _id) {
    // get current user
    var user = Meteor.user();
    // get card _id
    var cardId = _id;
    // get card rating
    var quality = rating - 1;
    // get user.profile.reviewList.cardId
    var currentUserCard = user.profile.reviewList[cardId];
    // get user.profile.reviewList[cardId].easinessFactor
    var oldEF = user.profile.reviewList[cardId].easinessFactor;
    console.log(currentUserCard);
    // initiaize $set object for db update
    var cardObjectSet = {};    
    // if quality <= 2
    if ( quality <= 2) {
      //  set interval to one day in miliseconds
      currentUserCard.reviewInterval = 86400000;
      // set next review date to one day later
      currentUserCard.reviewDate += currentUserCard.reviewInterval;
      // prep cardObject for db insert
      cardObjectSet['profile.reviewList.'+cardId] = currentUserCard;
      // update db based on rating
      Meteor.users.update(Meteor.userId(),{$set:cardObjectSet});
    }
    // else if quality > 2 set new easiness factor based on SM-2 Alogorithm
    else {
      var ef = Template.review.setEasinessFactor(quality, oldEF);
      console.log(ef);
      // set easiness factor on card
      currentUserCard.easinessFactor = ef;
      // update review interval based on new EF
      currentUserCard.reviewInterval = currentUserCard.reviewInterval * ef;
      // update new review date
      currentUserCard.reviewDate = currentUserCard.reviewDate + currentUserCard.reviewInterval;
      // prep cardObject for db insert
      cardObjectSet['profile.reviewList.'+cardId] = currentUserCard;
      // update db based on rating
      Meteor.users.update(Meteor.userId(),{$set:cardObjectSet});
    }

  },

  //handles adding and removing topics for review from two sources
  clickEventHandler : function(context){
    context.name = context.name || context.innerHTML;
    var name = context.name.toLowerCase().split(' ').join('');
    if(!context._id){
      var retrieveTopicId = Topics.find({name: context.name}).fetch();
      context = retrieveTopicId[0];
    }

    var setObject = {};
    setObject['profile.topics.'+context._id] = true;
    Meteor.users.update(Meteor.userId(),{$set:setObject});

    // add cards to review list
    Template.review.createReviewList(context._id, Template.review.addCardsToReviewList);
  }
});

//click event that lists topics being reviewed
Template.review.events({
  //populates and removes review topics 
  'click #topics li': function(){
    Template.review.clickEventHandler(this);
  },

  //button to reveal answer
  'click .button': function(){
    //workaround to async problems with database lookup
    //this condition disables answer button if review
    //session has been completed. Unable to remove the button
    //because answer array is populated asyncronously, would have
    //to write a lengthy callback chain to get it to work properly
    if($('.question').has('h5').length === 0){
      Template.review.card(currentCard); 
    }
  },

  'click p.6': function(e) {
    console.log('rating list 6 clicked');
    var rating = 6;
    var cardId = $('._id').text();
    console.log(rating);
    console.log(cardId);
    // pass rated card to algorithm for next interval
    Template.review.updateCardReviewDate(rating, cardId);
    //display the next question
    $('.ratingsBlock').remove();
    Template.review.displayQuestion();
    $('.question').html('');
    $('.answerblock').html('');
    $('.answerblock').after('<button class="button">click to see answer</button>');
  },

  'click p.5': function(e) {
    console.log('rating list 5 clicked');
    var rating = 5;
    var cardId = $('._id').text();
    console.log(rating);
    console.log(cardId);
    // pass rated card to algorithm for next interval
    Template.review.updateCardReviewDate(rating, cardId);
    //display the next question
    $('.ratingsBlock').remove();
    Template.review.displayQuestion();
    $('.question').html('');
    $('.answerblock').html('');
    $('.answerblock').after('<button class="button">click to see answer</button>');
  },

    'click p.4': function(e) {
    console.log('rating list 4 clicked');
    var rating = 4;
    var cardId = $('._id').text();
    console.log(rating);
    console.log(cardId);
    // pass rated card to algorithm for next interval
    Template.review.updateCardReviewDate(rating, cardId);
    //display the next question
    $('.ratingsBlock').remove();
    Template.review.displayQuestion();
    $('.question').html('');
    $('.answerblock').html('');
    $('.answerblock').after('<button class="button">click to see answer</button>');
  },

    'click p.3': function(e) {
    console.log('rating list 3 clicked');
    var rating = 3;
    var cardId = $('._id').text();
    console.log(rating);
    console.log(cardId);
    // pass rated card to algorithm for next interval
    Template.review.updateCardReviewDate(rating, cardId);
    //display the next question
    $('.ratingsBlock').remove();
    Template.review.displayQuestion();
    $('.question').html('');
    $('.answerblock').html('');
    $('.answerblock').after('<button class="button">click to see answer</button>');
  },

    'click p.2': function(e) {
    console.log('rating list 2 clicked');
    var rating = 2;
    var cardId = $('._id').text();
    console.log(rating);
    console.log(cardId);
    // pass rated card to algorithm for next interval
    Template.review.updateCardReviewDate(rating, cardId);
    //display the next question
    $('.ratingsBlock').remove();
    Template.review.displayQuestion();
    $('.question').html('');
    $('.answerblock').html('');
    $('.answerblock').after('<button class="button">click to see answer</button>');
  },

    'click p.1': function(e) {
    console.log('rating list 1 clicked');
    var rating = 1;
    var cardId = $('._id').text();
    console.log(rating);
    console.log(cardId);
    // pass rated card to algorithm for next interval
    Template.review.updateCardReviewDate(rating, cardId);
    //display the next question
    $('.ratingsBlock').remove();
    Template.review.displayQuestion();
    $('.question').html('');
    $('.answerblock').html('');
    $('.answerblock').after('<button class="button">click to see answer</button>');
  },

  'mouseover p.6': function(e) {
    $(e.currentTarget).css({'color':'YellowGreen', 'font-weight': 'bold' });
  },

  'mouseout p.6': function(e) {
    $(e.currentTarget).removeAttr('style');
  },

  'mouseover p.5': function(e) {
    $(e.currentTarget).css({'color':'YellowGreen', 'font-weight': 'bold' });
  },

  'mouseout p.5': function(e) {
    $(e.currentTarget).removeAttr('style');
  },

  'mouseover p.4': function(e) {
    $(e.currentTarget).css({'color':'YellowGreen', 'font-weight': 'bold' });
  },

  'mouseout p.4': function(e) {
    $(e.currentTarget).removeAttr('style');
  },

  'mouseover p.3': function(e) {
    $(e.currentTarget).css({'color':'YellowGreen', 'font-weight': 'bold' });
  },

  'mouseout p.3': function(e) {
    $(e.currentTarget).removeAttr('style');
  },

  'mouseover p.2': function(e) {
    $(e.currentTarget).css({'color':'YellowGreen', 'font-weight': 'bold' });
  },

  'mouseout p.2': function(e) {
    $(e.currentTarget).removeAttr('style');
  },

   'mouseover p.1': function(e) {
    $(e.currentTarget).css({'color':'YellowGreen', 'font-weight': 'bold' });
  },

  'mouseout p.1': function(e) {
    $(e.currentTarget).removeAttr('style');
  },

});
