Template.topicSidebar.helpers({
  topicList: function(){
    return Topics.find({}).fetch();
  },
  isSelected: function(id){
    var path = window.location.pathname;
    path = path.replace(/(\/cards\/?)/, '');
    return path === id? 'selected': '';
  }
});
