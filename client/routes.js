/*
	Router configuration and routes
	*/

	Router.configure({
		layoutTemplate: 'layout'
	});

	Router.map( function () {
		this.route('group', {
			path: 'groups/:_id',
			onBeforeAction: function() {
				console.log("onBeforeAction:");
			},
			onRun: function() {
				console.log("onRun:");
			},
			onAfterAction: function() {
				console.log("onAfterAction:");
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
					currentTabs.push( {tabId: this.params._id, tabName: groupName.toString()});
					Session.set('currentTabs',currentTabs);
				}
				
				var that = this;
				setTimeout(function(){
					$('.tabs .active').removeClass('active');
					var searchActiveTabString = "dd[data-id="+that.params._id+"]";
					$(searchActiveTabString).addClass('active');
				},50);

				// its too smooth, change or jquery for fade effect
				//var timeNow = new Date();
				//Groups.update({_id: Session.get('current_room')}, {$set: {last_used: timeNow.getTime()}});	
			}
		});
				this.route('home', {
					path: '/'
				});
			});