var currentCard = {};

Template.review.helpers({
  //displays card question and answer
  cardDisplayFunction: function(arg) {
    // var starMaker = function(){
    //   var star = '';
    //   var starType = 'glyphicon-star-empty';
    //   for( var i = 0; i < 6; i++){
    //     star+='<span class="glyphicon difficulty glyphicon-star-empty" style="font-size:32px; color: grey;"></span>';
    //   }
    //   return '<div display="inline">'+star+'<button class="response">submit</button></div>';
    // };
    $('.answer b').text(arg.answer);
    $('.button').remove();
    /*$('.card').append(
      '<div class="container ratingsBlock">'
      +'<h4>Click a rating below:</h4>'
      +'<p class="6">Perfect Response...Total Domination!</p>'
      +'<p class="5">Correct Response...A little tricky but still nailed it.</p>'
      +'<p class="4">Correct Response...Man, I had to work for that one.</p>'
      +'<p class="3">Incorrect Response...Aw snap, I should have known that.</p>'
      +'<p class="2">Incorrect Response, Oh yeah I kind of remember that now.</p>'
      +'<p class="1">Total blackout...Not in a million years.</p>'
      +'</div>');*/
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
    for ( var k in wholeList ){
      // if a card's review date is less than midnight,
      if ( wholeList[k].reviewDate < midnight ){
      // push cards from whole list to today's list
      reviewToday.push(wholeList[k]);
      }
    }
    if (reviewToday.length === 0){
      $('.question').html('Your Review List is empty!');
    }
    return reviewToday;
  },
  //shuffles current review list
  shuffleReviewTodayList: function(array) {
    // make copy of array
    var input = array.slice();
    // iterate over array
    for (var i = input.length-1; i >=0; i--){
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
  displayQuestion: function() {
    // initialize today's list
    var reviewToday = Template.review.createReviewTodayList();
    // if we have cards, shuffle them
    var shuffled = [];
    if (reviewToday.length){
      shuffled = Template.review.shuffleReviewTodayList(reviewToday);
    }
    // display them
    if (shuffled.length > 0){
      $('.question').html('');
      // grab the cardId from the first index
      var cardId = shuffled.shift();
      // query the card from the DB
      currentCard = Cards.find({_id: cardId._cardId}).fetch();
      // pull card out of array
      currentCard = currentCard[0];
      $('.question').append('<div style="display: none;" class="_id">'+cardId._cardId+'</div>');
      $('.question').append(currentCard.question);
    }
  },
  //displays lists of topics available from the topics collection
  topicList: function() {
    var topicsList = Topics.find().fetch();
    var userTopicsList = Template.review.userTopic();
    // Checks to see if the user has no selected review topics
    if (userTopicsList === undefined) {
      return topicsList;
    }
    // Checks to see if the user has selected topics
    topicsList.forEach(function(topic) {
      for (var i = 0; i < userTopicsList.length; i++) {
        // If they did assigns a true value to selected
        if (topic.name === userTopicsList[i].name) {
          topic.selected = true;
        }
      }
    });
    
    return topicsList;
  },
  // display User Topics
  userTopic: function() {
    user = Meteor.user();
    if(user){      
      var userTopicsObj = user.profile.topics;
      var userTopicArr = [];
      for (var k in userTopicsObj){
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
    var topicId = _id;
    // get current user
    var user = Meteor.user();
    // check for topics
    if (user.profile.topics){
      // create review list array first time
      if ( user.profile.reviewList === undefined ){
        // insert .profile.reviewList property onto user
        Meteor.users.update(
          Meteor.userId(),
          {
            $set: {
              'profile.reviewList': {} 
            } 
          },
          function(err, result) {
            if ( err ){
              console.log('oh no, .profile.reviewList was not created!');
            }else{
              var user = Meteor.users.find(Meteor.userId()).fetch();
              // execute callback on success
              callback(topicId, user && user.profile && user.profile.reviewList);
            }
          }
        );
      }else{
        // we have a list...execute callback
        callback(topicId);
      }
    }else{
      // there are no topics
      console.log('Nothing to review here...Move along!');
    }
  },
  // add cards to review list
  addCardsToReviewList: function(topicId) {
    // get current user
    var user = Meteor.user();
    // get the topic by id
    var topic = Topics.find({_id: topicId}).fetch();
    for (var i = 0; i < topic[0].cards.length; i++){
      // init cardId
      var cardId = topic[0].cards[i];
      // check if card has been added to review list yet
      if (user.profile.reviewList[cardId] === undefined){
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
      }else{
        console.log('Review card with id '+cardId+' already exists');
      }
    }
  },

  //algorithm for calculating easiness factor 
  setEasinessFactor: function(q, oldEF) {
    // calculate quality score from SM-2
    var qScore = (0.1-(5-q)*(0.08+(5-q)*0.02));
    var ef = oldEF+ qScore;
    // recalibrate EF if needed as perscribed by SM-2 algorithm
    if ( ef < 1.3 ){
      ef = 1.3;
    }
    return ef;
  },
  //updates next review date for user
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
    }else{
      // else if quality > 2 set new easiness factor based on SM-2 Alogorithm
      var ef = Template.review.setEasinessFactor(quality, oldEF);
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
  }
});

//click event that lists topics being reviewed
Template.review.events({
  //populates and removes review topics 
  'click #topics li': function() {
    var context = this;
    if(!context._id){
      var retrieveTopicId = Topics.find({name: context.name}).fetch();
      context = retrieveTopicId[0];
    }
    var setObject = {};
    setObject['profile.topics.'+context._id] = true;
    Meteor.users.update(Meteor.userId(),{$set:setObject});
    // add cards to review list
    Template.review.createReviewList(context._id, Template.review.addCardsToReviewList);
  },
  //button to reveal answer
  'click .front': function() {
    //workaround to async problems with database lookup
    //this condition disables answer button if review
    //session has been completed. Unable to remove the button
    //because answer array is populated asyncronously, would have
    //to write a lengthy callback chain to get it to work properly
    
    if($('.question').text() !== 'Your Review List is empty!') {
      Template.review.cardDisplayFunction(currentCard);
    }
  },
  //clicks on rating and submits card id for 
  'click .rating span': function(e) {
    var rating = e.currentTarget.classList[1];
    var cardId = $('._id').text();

    Template.review.updateCardReviewDate(rating, cardId);
    Template.review.displayQuestion();
    // Flips the card back over and removes the text from the helper div
    $('#card').removeClass('flipped');
    $('.help').animate({'left': 0}, 500);
    $('.help-div').fadeOut(10);
  },

  'click #card': function() {
    // Only allows clicks if a question is displayed
    if ($('.question').text() !== 'Your Review List is empty!') {
      // Animation for flipping card and confidence reveal
      $('#card').addClass('flipped');
      $('.help').animate({'left': 500}, 500);
      $('.help-div').fadeIn(1000);
    }
  },
  // Shows meaning of the star
  'mouseover .star': function(e) {
    var id = $(e.currentTarget).attr('id');
    $('.t' + id).css('visibility', 'visible');
    $('.t' + id).fadeIn(500);
  },
  // Removes meaning of star
  'mouseout .star': function(e) {
    var id = $(e.currentTarget).attr('id');
    $('.t' + id).css('visibility', 'hidden');
  },

  // Loads a question if there is nothing displayed
  'mouseover .container-fluid': function() {
    if ($('.question').text() === '') {
      Template.review.displayQuestion();
    }
  }

});
