/**
Server code
**/


Meteor.publish('current_connections', function publishConnections() {
  return Connections.find({});
});

Meteor.publish('current_groups', function publishGroups() {
  return Groups.find({});
});

Meteor.methods({
  keepalive: function (userId) {
    if (Connections.find({'user_id': userId}).count()==0)
      Connections.insert({'user_id': userId, 'last_seen': (new Date()).getTime()});
    else
    	Connections.update({'user_id': userId}, {$set: {'last_seen': (new Date()).getTime()}}, {upsert: false});
  }
});

Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  Connections.remove({last_seen: {$lt: (now - 1 * 1000)}});
}, 1000);
