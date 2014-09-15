Template.loginMenu.helpers({
  isSelected: function(id){
    var path = window.location.pathname;
    path = path.replace(/^\/([^\/]*).*$/, '$1');
    console.log(path, id);
    return path === id? 'selected': '';
  }
});
Template.loginMenu.events({
  'click a.nav-item': function(event) {
    $('.nav-item').removeClass('selected');
    $(event.target).addClass('selected');
  }
});