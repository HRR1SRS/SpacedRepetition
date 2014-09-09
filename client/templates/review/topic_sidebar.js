Template.topicSidebar.helpers({
	topicList: function(){
		return Topics.find({}).fetch();
	}
});

Template.topicSidebar.events({
	'click li a': function(){
		console.log(Cards.find({topic: this._id}).fetch());
	}
})