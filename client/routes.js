/*
	Router configuration and routes
	*/

	Router.configure({
		layoutTemplate: 'layout'
	});

	Router.map( function () {
		this.route('group', {
			path: 'groups/:_id',
		/*waitOn: function() {
			Meteor.subscribe('current_groups');
		},
		data: function() {
			return Groups.findOne(this.params._id);
		},*/
		onRun: function() {

			Session.set('current_room',this.params._id);

			var groupCursor = Groups.find(this.params._id);
			var groupName = groupCursor.map(function(p) { return p.groupName });
			Session.set('current_title',groupName);

			// its too smooth, change or jquery for fade effect
			//var timeNow = new Date();
			//Groups.update({_id: Session.get('current_room')}, {$set: {last_used: timeNow.getTime()}});	
		}
	});
		this.route('home', {
			path: '/',
			onRun: function() {
				Session.set('current_title',"Home");
			}
		
		});
	});