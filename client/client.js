CurrentTabs = new Meteor.Collection(null);

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
		if(Session.get('currentUser')==undefined)
		{
			var set = true;
			while(set)
			{
				var tmp = Math.floor(Math.random()*1000+1);
				if(Connections.find({"userId": tmp}).count()==0)
				{
					Session.set('currentUser',tmp);
					set = false;
				}
			}

		}
	});
});
