CurrentTabs = new Meteor.Collection(null);

addNewTag = function() {
	// TODO: Add more user friendly input
	var tag = prompt("Enter new group tag:", "New group tag");
	if(tag!=null) {
		Groups.update({'_id': Session.get('currentRoom')}, {$push: {'tags': tag}});
	}
}

// client code: ping heartbeat every second for immidiate effect in current users
Meteor.setInterval(function () {
	Meteor.call('keepalive', Session.get('currentUser'));
}, 1000);


var connectHandler = WebApp.connectHandlers; 

Meteor.startup(function() {
	if(Session.get('currentPage')==undefined)
		Session.setTemporary('currentPage',1);
	if(Session.get('currentTabs')==undefined) {
		var currentTabs = [];
		Session.set('currentTabs',currentTabs);
	}
	

	Meteor.subscribe('currentGroups');

	Meteor.subscribe('currentConnections', function() {
		if(Session.get('currentUser')==undefined) {
			if(Meteor.user()) {
				Session.set('currentUser', Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName);
			} else {
				var set = true;
				while(set)
				{
					var tmp = Math.floor(Math.random()*1000+1);
					if(Connections.find({"userId": tmp}).count()==0)
					{
						Session.set('currentUser',"Anonymous"+tmp);
						set = false;
					}
				}
			}
		}
	});
});
