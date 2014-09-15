/**
Server code
**/

Meteor.publish('currentConnections', function publishConnections() {
  return Connections.find({});
});

Meteor.publish('currentGroups', function publishGroups() {
  return Groups.find({});
});

Meteor.methods({
  keepalive: function (userId) {
    if (Connections.find({'userId': userId}).count()==0)
      Connections.insert({'userId': userId, 'lastSeen': (new Date()).getTime()});
    else
    	Connections.update({'userId': userId}, {$set: {'lastSeen': (new Date()).getTime()}}, {upsert: false});
  }
});

Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  Connections.remove({'lastSeen': {$lt: (now - 1 * 5000)}});
}, 1000);

Accounts.config({
  sendVerificationEmail: true,
});
