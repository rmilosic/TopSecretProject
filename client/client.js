// client code: ping heartbeat every second for immidiate effect in current users
Meteor.setInterval(function () {
	Meteor.call('keepalive', Session.get('current_user'));
}, 1000);


var connectHandler = WebApp.connectHandlers; 

Meteor.startup(function() {
	if(Session.get('current_page')==undefined)
		Session.setTemporary('current_page',1);
	
	Meteor.subscribe('current_groups');
	Meteor.subscribe('current_connections', function() {
		if(Session.get('current_user')==undefined)
		{
			var set=1;
			while(set)
			{
				var tmp = Math.floor(Math.random()*1000+1);
				if(Connections.find({"user_id": tmp}).count()==0)
				{
					Session.set('current_user',tmp)
					set=0;
				}
			}

		}
	});
});
