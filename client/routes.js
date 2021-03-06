/*
	Router configuration and routes
	*/

	Router.configure({
		layoutTemplate: 'layout'
	});

	Router.map(function () {
		this.route('group', {
			path: 'groups/:_id',
			onBeforeAction: function() {

			},
			onRun: function() {
				Session.set('activeTag',null);
			},
			onAfterAction: function() {
				// TODO: Replace Session with local storage to avoid multiple reload.
				var groupCursor = Groups.find(this.params._id);
				var groupName = groupCursor.map(function(p) { return p.groupName });
				Session.set('currentRoom',this.params._id);
				Session.set('currentTitle',groupName);

				var currentTabs = Session.get('currentTabs');

				// Check if the tab already exists.
				var alreadyExists = false;
				var len = currentTabs.length;
				for (var i=0; i<len; ++i) {
					if (i in currentTabs) {
						var s = currentTabs[i];
						if(s.tabId==this.	params._id)
							alreadyExists = true;
					}
				}

				if(!alreadyExists) {
					currentTabs.push( {tabId: this.params._id, tabName: groupName.toString()});
					Session.set('currentTabs',currentTabs);
				}
				
				// TODO: Session reactivity is too slow and is rendered after onAfterAction which results in wrong active tab set. FIX IT!
				var that = this;
				setTimeout(function(){
					$('.tabs .active').removeClass('active');
					var searchActiveTabString = "dd[data-id="+that.params._id+"]";
					$(searchActiveTabString).addClass('active');
				},0);

				// its too smooth, change or jquery for fade effect
				//var timeNow = new Date();
				//Groups.update({_id: Session.get('current_room')}, {$set: {last_used: timeNow.getTime()}});	
			}
		}),
		this.route('home', {
			path: '/',
			onBeforeAction: function() {
				Session.set('currentTitle','Home');
			}
		}),
		this.route('login', {
			path: 'login',
			onBeforeAction: function() {
				Session.set('currentTitle', 'Login or signup');
			}
		})
});