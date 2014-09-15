Template.topicSidebar.helpers({
  topicList: function(){
    return Topics.find({}).fetch();
  },
  // add the selected class to the currently selected topic
  isSelected: function(id){
    // get the pathname
    var path = window.location.pathname;
    // get the id in the url
    path = path.replace(/(\/cards\/?)/, '');
    // compare the url to the id you have
    return path === id? 'selected': '';
  }
});
