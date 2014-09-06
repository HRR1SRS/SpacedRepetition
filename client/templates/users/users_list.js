Template.usersList.helpers({
  user: function(){
    return Meteor.users.find();
  }
});
