/*
	Router configuration and routes
	*/

	Router.configure({
		layoutTemplate: 'layout'
	});

	Router.map( function () {
		this.route('group', {
			path: 'groups/:_id',
		onAfterAction: function() { // This function is called everytime something refreshes on current page. Replace with function that is run only the first time.


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
					if(s.tabId==this.params._id)
						alreadyExists = true;
				}
			}

			if(!alreadyExists) {
				// If we allow duplicates, Meteor's reactivity creates infinite loop.
				currentTabs.push( {tabId: this.params._id, tabName: groupName.toString()});
				Session.set('currentTabs',currentTabs);
			}

			$(".tabs .active").removeClass("active");
			var searchActiveTabString = "dd[data-id="+this.params._id+"]";
			console.log(searchActiveTabString);
			$(searchActiveTabString).addClass("active");

			// its too smooth, change or jquery for fade effect
			//var timeNow = new Date();
			//Groups.update({_id: Session.get('current_room')}, {$set: {last_used: timeNow.getTime()}});	
		}
	});
this.route('home', {
	path: '/',
	onRun: function() {
		Session.set('currentTitle',"Home");
	}

});
});