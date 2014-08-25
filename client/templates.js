/*
* Templates
*/

Template.layout.getTitle = function() {
	return Session.get('current_title');
}
Template.layout.getGroup = function() {
	var tmp = Groups.findOne(Session.get('current_room'));
	return tmp;
}

Template.layout.getHome = function() {
	return "Home";
}

Template.layout.isHomeView = function() {
	Router.current().path == '/' ? true : false;
}

Template.layout.events = {
	'click': function(e) {
		var container = $(".createNewGroupDiv");
    	if (!container.is(e.target) && container.has(e.target).length === 0) {
    		var createNewGroupLabel = $(".groupInputLabel");
			createNewGroupLabel.removeClass("hidden");

			var createNewGroupInput = $(".groupInputTextBox");
			createNewGroupInput.addClass("hidden");
    	}
	}
}

Template.list.messages = function() {
	var pages = Session.get('current_page');
	var cursor = Groups.find({_id: Session.get('current_room')});
	var count = 0;
	var groupsArray = 0;
	cursor.forEach(function(first){
		count = first.numberOfMsgs;
		groupsArray = first.groupMsgs;
	});

	//if(count<=20)
	//	$('.msgBox').scrollTop($('.msgBox').prop('scrollHeight'));

	if(count<=pages*50)
		return groupsArray;	
	else
	{
		return groupsArray.slice(count-(50*pages),count);
	}	
	//return Groups.find({}, { skip:count-(50*pages), limit:50*pages });

}

Template.msg.rendered = function() {

	var scrollBar = $('.msgBox').scrollTop();
	var scrollHeight = $('.msgBox').prop('scrollHeight');
	var el = $('.msgBox').height();
	var cursor = Groups.find({_id: Session.get('current_room')});
	var count = 0;
	cursor.forEach(function(first){
		count = first.numberOfMsgs;
	});
	
	// Implement proper scroll behaviour on initial group enter, group change, load more messages, type new message, page refersh.
	// if((scrollBar>=(scrollHeight-el)*0.8) || count<30)
	$('.msgBox').scrollTop($('.msgBox').prop('scrollHeight'));
}

Template.loadMore.haveMore = function() {
	var cursor = Groups.find({_id: Session.get('current_room')});
	var count = 0;
	cursor.forEach(function(first){
		count = first.numberOfMsgs;
	});
	if((count-(Session.get('current_page')*50)<=0) || count == undefined)
		return false;
	else
		return true;
}

Template.loadMore.count = function() {
	var cursor = Groups.find({_id: Session.get('current_room')});
	var count = 0;
	cursor.forEach(function(first){
		count = first.numberOfMsgs;
	});
	return (count-(Session.get('current_page')*50));
}

Template.loadMore.rendered = function() {
	$('.msgBox').scrollTop($('.msgBox').prop('scrollHeight'));
}

Template.loadMore.events = {
	'click': function(event) {
		var tmp = Session.get('current_page')+1;
		Session.setTemporary('current_page',tmp);

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

Template.groupsNavigation.groups = function() {
	return Groups.find({}, {sort: {last_used: -1}}); 
}

Template.groupsNavigation.isCreateNewGroupFalse = function() {
	return Session.get('create_new_group') ? false : true; 
}

Template.groupsNavigation.users = function() {
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
					groupMsgs: []
				});

				document.getElementById('groupInput').value= '';
				groupInput.value = '';	
			}
		}
	},
	'click .createNewGroupDiv' : function (event) {
		//Session.setTemporary('create_new_group', true);
		var createNewGroupLabel = $(".groupInputLabel");
		createNewGroupLabel.addClass("hidden");

		var createNewGroupInput = $(".groupInputTextBox");
		createNewGroupInput.removeClass("hidden");

	}
}

Template.input.events = {
	'keydown input#message' : function (event) {

		if(event.which == 13) {

			var anonUser=0;

			if(Meteor.user())
				var name = Meteor.user().profile.name;
			else
			{
				var name= 'Anonymous' + Session.get('current_user');
				anonUser=1;
			}
			var message = document.getElementById('message');

			var timeNow = new Date();
			var hours   = timeNow.getHours();
			var minutes = timeNow.getMinutes();
			var seconds = timeNow.getSeconds();
			var timeString = "" +  hours;
			timeString  += ((minutes < 10) ? ":0" : ":") + minutes;
			timeString  += ((seconds < 10) ? ":0" : ":") + seconds;
			//timeString  += (hours >= 12) ? " p.m." : " a.m.";

			if(message.value != '') {
				Groups.update({_id: Session.get('current_room')} , { $push: {groupMsgs: {name: name, message: message.value, time: timeString }}, $inc: { numberOfMsgs: 1} });
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