Template.usersList.helpers({
  user: function(){
    // console.log('userList helpers is firing');
    // console.log(Meteor.users.find().fetch());
    return Meteor.users.find();
  }
});
