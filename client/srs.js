'use strict';

// "snooze" each card
// get it right? long snooze! :)
// get it wrong? short snooze. :(

// this creates our app
// this might be overstepping the boundaries
//   of a library

var app = function() {
  // I have decks!
  // I have users!
};

// app has many decks
// decks represent topics?
// deck has many cards
// cards belong to many decks
// queues hold many cards from many decks
//   each queue tracks priority of each card
// each user has their own queues


/*
var deck1 = new Deck();
var deck2 = new Deck();

var card1 = new Card(optionallyListDeckNames);
var card2 = new Card({
  question: 'haha',
  answer: 'hahaha',
  name: 'cardName',
  deck: []
});

deck1.addCard(card1);

addCard function(card) {
  var deckCardStorage = this._cards;
  deckCardStorage.push(card);

  var deckName = this.getName();
  card.addDeck(deckName);
}

deck2.addCard(card1);
*/


// deck 1 and deck 2 both have card 1
// card 1 belongs to both deck 1 and deck 2


var Topic = function(topicName) {
  var decks = [];
  for(var i = 1; i < arguments.length; i++) {
    decks.push(arguments[i]);
  }

  return {
    _decks: decks,
    name: topicName || '',

    // precondition: pass in new instance of Deck
    // postcondition: if Topic doesn't have Deck, add it.
    //   otherwise, don't add it.
    addDeck: function(deck) {
      if(this.isDeck(deck.getName())) {
        return null;
      } else {
        this._decks.push(deck);
      }
    },

    removeDeck: function(deckName) {
      for(var i = 0; i < this._decks.length; i++) {
        if(this._decks[i].getName() === deckName) {
          this._decks.splice(i, 1);
        }
      }
    },

    getDeck: function(deckName) {
      for(var i = 0; i < this._decks.length; i++) {
        if(this._decks[i].getName() === deckName) {
          this._decks.splice(i, 1);
        }
      }
    },

    isDeck: function(deckName) {
      for(var i = 0; i < this._decks.length; i++) {
        if(this._decks[i].getName() === deckName) {
          return true;
        }
      }
      return false;
    },

    setName: function(topicName) {
      this.name = topicName;
    },

    getName: function() {
      return this.name;
    },

    isName: function(topicName){
      return this.getName() === topicName;
    }
  };
};


var Deck = function() {
  // I have Cards!
  return {
    _cards: [],
    name: '',
    topics: [],
    author: '', // what if deck has multiple contributors?

    addCard: function(){},
    removeCard: function(){},
    getCard: function(){},

    setName: function(){},
    getName: function(){},

    getAuthor: function(){},
    setAuthor: function(){},
    editAuthor: function(){}
  };
};


var Card = function() {
  // I have questions and answers!

  /*
  set up constructor to take an obj as an argument
  {
    question: 'blah',
    answer: 'blah',
    name: 'blah',
    deck: [deck1, deck2, deck3]
  }
  */

  // JS    <-> Underscore <-> Specific question
  // Topic <-> Deck <-> Card
  // Topics can belong to Topics
  return {
    question: '',
    answer: '',
    name: '',
    decks: [],
    author: '',
    nextReviewTime: {/*idk yet*/},
    // consider including topic?

    setName: function(){},
    getName: function(){},

    addQuestion: function() {},
    editQuestion: function(){},
    addAnswer: function() {},
    editAnswer: function() {},

    getDeck: function(){},
    setDeck: function(){},
    removeDeck: function(){},

    getAuthor: function(){},
    setAuthor: function(){},
    editAuthor: function(){}
  };
};


// orders the cards randomly
var Queue = function() {
  // I have Cards (in rand order)!
  // Pulls cards from multiple decks
  // (User gets to specify what they want)

  // this is our star algorithm
  var prioritize = function(param) {

  };
};


// each User has their own Queue
// maybe each User has multiple Queues
var User = function() {
  /*
  We need to track progress for each user
  Each User has multiple Queues
  queue1 = new Queue('jquery', 'underscore')
  queue2 = new Queue('Backbone.js', 'Angular')
  queue1 = {
    has references to the decks
    which have references to cards
    and we store 'priority' number for each card

    OR

    has references to cards
    and we store 'priority' number for each card
  }
  */


  /*
  where do we store the information about
  how to prioritize cards for a specific user?
  do we store that information on the card?

  (the higher the number,
  the more urgently we need to review)

  card1.priority = {
    user1: 100,
    user2: 200,
    user3: 94
  }
  probably not. we should store this informatoin
  with the user.
  user.priority = {
    card1: 100,
    card2: 200,
    card3: 94
  }
  this means user needs to review card2, card1, and card3.
  is this necessary? (y/n)
  is this efficient? (y/n)

  what happens when a user hasn't logged in for so long
  that every card needs to be "urgently reviewed"?
  how do we prioritize between all cards?
  once we answer the cards, the prioritize function
  will properly set the next interval.
  some of the cards will reappear next week while others
  that we have mastered will show up in 2 yrs.

  Do we need to include a "difficulty" level on each
  card?
  >> user votes on difficulty
  >> author sets difficulty
  >> overall % of people that get it correct
  */
};
