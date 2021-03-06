/*
* Templates
*/

Template.login.events = {
	'submit #loginForm': function(event, template) {
		event.preventDefault();
		var email  = template.find('#emailLogin').value;
		var password = template.find('#passwordLogin').value;
		Meteor.loginWithPassword(email, password, function(error) {
			if(error) {
				console.log("login failed");
			} else {
				Session.set('currentUser', Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName);
				Router.go('home');
			}
		});
	},

	'submit #signupForm': function(event, template) {
		event.preventDefault();
		var email  = template.find('#emailSignup').value;
		var password = template.find('#passwordSignup').value;
		var password2 = template.find('#passwordSignup2').value;
		var firstName = template.find('#firstNameSignup').value;
		var lastName = template.find('#lastNameSignup').value;

		if(password==password2) {
			Accounts.createUser({
				email:    email,
				password: password,
				profile: {
					firstName: firstName,
					lastName: lastName
				}}, function(error) {
					if(error) {
						console.log("login failed");
					} else {
						Session.set('currentUser', firstName + " " + lastName);
						Router.go('home');
					}
				});
		} else {
			console.log("Passwords do not match, signup failed!");
		}
	}
}

Template.tagsTemplate.events = {
	'click ': function(event) {
		data = $(event.target).attr('data-id');
		$(".tagsTemplate .label.round.tag-active").removeClass("tag-active");
		$(event.target).addClass("tag-active");
		Session.set('activeTag',data);
	}
}

Template.tagsTemplate.tags = function() {
	var tags = Groups.findOne({_id: Session.get('currentRoom')}, {tags: true});
	return tags ? tags.tags : [];
}

Template.layout.getActiveTag = function() {
	return Session.get('activeTag');
}

Template.layout.isActiveTag = function() {
	return Session.get('activeTag') != null ? true : false;
}


Template.layout.getTitle = function() {
	return Session.get('currentTitle');
}
Template.layout.getGroup = function() {
	var tmp = Groups.findOne(Session.get('currentRoom'));
	return tmp;
}

Template.layout.isGroupView = function() {
	return Router.current().path.lastIndexOf('/groups', 0) == 0? true : false;
}

Template.layout.isNotHomeView = function() {
	return Router.current().path != '/' ? true : false;
}

Template.layout.rendered = function() {
        // Assuming you're using jQuery 
        $('body').on('keydown',function(event) { 
        	if(event.shiftKey==true && event.keyCode=='9') {
        		event.preventDefault();

        		var currentTab=-1;
        		var currentOpenTabs = Session.get('currentTabs');
        		var len = currentOpenTabs.length;
        		for (var i=0; i<len; ++i) {
        			if (i in currentOpenTabs) {
        				var s = currentOpenTabs[i];
        				if(s.tabId == Router.current().path.substring(Router.current().path.indexOf("groups")+7, Router.current().path.length)) {
        					currentTab = i;
        				}
        			}
        		}
        		if(currentTab!=-1) {
        			if(currentTab==len-1)
        				Router.go('group',{_id: currentOpenTabs[0].tabId});
        			else
        				Router.go('group',{_id: currentOpenTabs[currentTab+1].tabId});
        		}

        	}
        }); 
    }

    Template.layout.events = {

    	'click #logout': function() {
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
    		Meteor.logout();
    	},


	// Catching clicks outside createNewGroupDiv, used to hide new group input. Function must be last in layout.events so it doesn't override other clicks.
	'click #closeActiveTag': function() {
		$(".tagsTemplate .label.round.tag-active").removeClass("tag-active");
		Session.set('activeTag',null);
	},

	/*'click': function(e) {
	
		var container = $(".createNewGroupDiv");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			var createNewGroupLabel = $(".groupInputLabel");
			createNewGroupLabel.removeClass("hidden");

			var createNewGroupInput = $(".groupInputTextBox");
			createNewGroupInput.addClass("hidden");
		}

	}*/

	'click #topbar .left': function() {
		if( $('#largeNav').hasClass('show-for-medium-up') )
		{
			$('#largeNav').removeClass('show-for-medium-up');
		}
		else {
			$('#largeNav').addClass('show-for-medium-up');
		}

		if( $('#chatinfo').hasClass('show-for-large-up') )
		{
			
		}
		else {
			$('#chatinfo').addClass('show-for-large-up');
		}

	},

	'click #topbar .right': function() {
		if( $('#chatinfo').hasClass('show-for-large-up') )
		{
			$('#chatinfo').removeClass('show-for-large-up');
		}
		else {
			$('#chatinfo').addClass('show-for-large-up');
		}
	},

	'click #largeNav .close-button-nav': function() {
		$('#largeNav').addClass('show-for-medium-up');
	},

	'click #largeNav #myGroups li a': function() {
		$('#largeNav').addClass('show-for-medium-up');
	},

	

	
}


Template.list.messages = function() {
	var pages = Session.get('currentPage');
	var cursor = Groups.find({_id: Session.get('currentRoom')});
	var count = 0;
	var messages = 0;
	cursor.forEach(function(first){
		count = first.numberOfMsgs;
		messages = first.groupMsgs;
	});
	var filteredMessages = [];
	var j=0;

	// Filter untagged on serverside and refactor to more generic code.
	if(Session.get('activeTag')) {
		var arrayLength = messages.length;
		for (var i = 0; i < arrayLength; i++) {
			console.log(messages[i].tag + " " + Session.get('activeTag'));
			if(messages[i].tag==Session.get('activeTag')) {
				filteredMessages[j]=messages[i];
				j++;
			}
		}
		return filteredMessages;
	}

	//	$('.msgBox').scrollTop($('.msgBox').prop('scrollHeight'));

	if(count<=pages*50)
		return messages;	
	else
	{
		return messages.slice(count-(50*pages),count);
	}	
	//return Groups.find({}, { skip:count-(50*pages), limit:50*pages });

}

Template.msg.rendered = function() {

	var scrollBar = $('.msgBox').scrollTop();
	var scrollHeight = $('.msgBox').prop('scrollHeight');
	var el = $('.msgBox').height();
	var cursor = Groups.find({_id: Session.get('currentRoom')});
	var count = 0;
	cursor.forEach(function(first){
		count = first.numberOfMsgs;
	});
	
	// Implement proper scroll behaviour on initial group enter, group change, load more messages, type new message, page refersh.
	// if((scrollBar>=(scrollHeight-el)*0.8) || count<30)
	$('.msgBox').scrollTop($('.msgBox').prop('scrollHeight'));
}

Template.loadMore.haveMore = function() {
	var cursor = Groups.find({_id: Session.get('currentRoom')});
	var count = 0;
	cursor.forEach(function(first){
		count = first.numberOfMsgs;
	});
	if((count-(Session.get('currentPage')*50)<=0) || count == undefined || count == NaN)
		return false;
	else
		return true;
}

Template.loadMore.count = function() {
	var cursor = Groups.find({_id: Session.get('currentRoom')});
	var count = 0;
	cursor.forEach(function(first){
		count = first.numberOfMsgs;
	});
	return (count-(Session.get('currentPage')*50));
}

Template.loadMore.rendered = function() {
	$('.msgBox').scrollTop($('.msgBox').prop('scrollHeight'));
}

Template.loadMore.events = {
	'click': function(event) {
		var tmp = Session.get('currentPage')+1;
		Session.setTemporary('currentRoom',tmp);

		/*var scrollBar = $('.msgBox').scrollTop();
		var scrollHeight = $('.msgBox').prop('scrollHeight');
		var el = $('.msgBox').height();
		var count = Groups.find({}).count();
		*/

		//$('.msgBox').scrollTop(57*20);
		// $('.msgBox').scrollTop(0);

		event.preventDefault();
	}
}

Template.layout.tabs = function () {
	return Session.get('currentTabs');
}

Template.groupsNavigation.groups = function() {
	return Groups.find({}, {sort: {last_used: -1}}); 
}

Template.layout.users = function() {
	return Connections.find({});
}

Template.groupsNavigation.events = {
	'keydown input#groupInput' : function (event) {
		if(event.which == 13)
		{
			var groupInput = document.getElementById('groupInput');
			if(groupInput.value != '') {
				// test if group with this value already exsists
				Groups.insert({
					groupName: groupInput.value,
					last_used: new Date().getTime(),
					tags: [],
					groupMsgs: []
				});

				document.getElementById('groupInput').value= '';
				groupInput.value = '';	
			}
		}
	},
	'click .createNewGroupDiv' : function (event) {
		var createNewGroupLabel = $(".groupInputLabel");
		createNewGroupLabel.addClass("hidden");

		var createNewGroupInput = $(".groupInputTextBox");
		createNewGroupInput.removeClass("hidden");

	}
}


Template.closeButton.events = {
	'click' : function(event) {
		var removedTab = -1;
		var currentTabs = Session.get('currentTabs');
		var len = currentTabs.length;
		for (var i=0; i<len; ++i) {
			if (i in currentTabs) {
				var s = currentTabs[i];
				if(s.tabId == $(event.target).parent().parent().parent().attr('data-id')) {
					currentTabs.splice(i,1);
					removedTab = i;
				}
			}
		}
		Session.set('currentTabs',currentTabs);
		if(currentTabs.length==0) {
			Router.go('home');
		}
		else if(removedTab==currentTabs.length) {
			Router.go('group',{_id: currentTabs[removedTab-1].tabId});
		}
		else if($(event.target).parent().parent().parent().attr('data-id') == Session.get('currentRoom')) {
			if(removedTab!=-1) {
				Router.go('group',{_id: currentTabs[removedTab].tabId});
			}
		}
		event.preventDefault();
	}
}

Template.input.events = {
	'keydown input#message' : function (event) {

		if(event.which == 13) {

			var name = Session.get('currentUser');

			var message = document.getElementById('message');
			var tag = Session.get("activeTag");

			var timeNow = new Date();
			var hours   = timeNow.getHours();
			var minutes = timeNow.getMinutes();
			var seconds = timeNow.getSeconds();
			var timeString = "" +  hours;
			timeString  += ((minutes < 10) ? ":0" : ":") + minutes;
			timeString  += ((seconds < 10) ? ":0" : ":") + seconds;
			//timeString  += (hours >= 12) ? " p.m." : " a.m.";

			if(message.value != '') {
				Groups.update({_id: Session.get('currentRoom')}, { $push: {groupMsgs: {name: name, message: message.value, time: timeString, tag: tag }}, $inc: { numberOfMsgs: 1} });
				document.getElementById('message').value= '';
				message.value = '';	
			} 
		} 
	}
}

	/*'click button' : function (event) {
		var groupInput = document.getElementById('groupInput');
			if(groupInput.value != '') {
				// test if group with this value already exsists
				Groups.insert({
					groupName: groupInput.value,
					last_used: new Date().getTime(),
					groupMsgs: [],
					numberOfMsgs: 0
				});

				document.getElementById('groupInput').value= '';
				groupInput.value = '';	
			}
		}
	*/