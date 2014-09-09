Template.topicSidebar.helpers({
	topicList: function(){
		return Topics.find({}).fetch();
	}
});