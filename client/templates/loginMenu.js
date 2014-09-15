Template.loginMenu.helpers({
  // add a selected class to the correct nav item on page load
  isSelected: function(id){
    var path = window.location.pathname;
    path = path.replace(/^\/([^\/]*).*$/, '$1');
    console.log(path, id);
    return path === id? 'selected': '';
  }
});
Template.loginMenu.events({
  // change the selected class to the correct nav item on click
  'click a.nav-item': function(event) {
    $('.nav-item').removeClass('selected');
    $(event.target).addClass('selected');
  }
});