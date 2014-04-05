Template.messagesList.events({
	'click #submitMessage': function(e) {
		e.preventDefault();

		if (Meteor.user()) {
			var message = {
				message: $('.messageForm').find('[name=message]').val(),
				competition: Session.get('selectedCompetition')
			}
			Meteor.call(
				'addMessage',
				message,
				function(error, id) {
					if (error)
						Errors.throw(error.reason);
				}
			);
			$('.messageForm').find('[name=message]').val('');
		}
		else {
			Errors.throw("Logi palun sisse");
		}
	}
});

Template.messagesList.helpers({
	sortMessages: function(messages) {
		if (messages){
			messages = _.sortBy(messages, function(message){
				return message.timestamp;
			});
			return messages.reverse();
		}
	}
});