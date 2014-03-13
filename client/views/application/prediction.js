Template.prediction.created = function() {
	$(document.body).on('change.fixtureRadios', 'input:radio', function(e){
		if (Meteor.user()) {
			var radio = $(e.target);
			var prediction = {
				result : radio.val(),
				game: radio.attr('name'),
				event: Session.get('selectedCompetition').url
			};
			Meteor.call(
				'addPrediction',
				prediction,
				function(error, id) {
					if (error)
						Errors.throw(error.reason);
				}
			);
		}
		else {
			Errors.throw("Logi palun sisse");
		}
	});

	$(document.body).on('change.playoffCheckboxes', 'input:checkbox', function(e){
		if (Meteor.user()) {
			var checkbox = $(e.target);
			var checkboxLabel = checkbox.closest('label');
			var stageContainer = checkbox.closest('.btn-group');
			var countCheck = {
				5: 16,
				4: 8,
				3: 4,
				2: 2,
				1: 1
			};
			stage = stageContainer.attr('name');
			stage = stage[stage.length-1] - 1;

			var prediction = {
				stage: stage,
				key: checkbox.attr('name'),
				event: Session.get('selectedCompetition').url
			};
			if (!checkboxLabel.hasClass('active')) {
				var predictions = Predictions.find({stage: stage, event: Session.get('selectedCompetition').url});
				if (predictions.count() >= countCheck[stage]){
					console.log(checkboxLabel.attr('class'));
					checkboxLabel.removeClass('active');
					console.log(checkboxLabel.attr('class'));
					if (!stageContainer.hasClass("shake")) {
						stageContainer.addClass("shake");
					} else {
						stageContainer.css('animation-name', 'none');
						stageContainer.css('-moz-animation-name', 'none');
						stageContainer.css('-webkit-animation-name', 'none');

						setTimeout(function() {
							stageContainer.css('-webkit-animation-name', 'shake');
						}, 0);
					}
					return;
				}
				Meteor.call(
					'addPrediction',
					prediction,
					function(error, id) {
						if (error)
							Errors.throw(error.reason);
					}
				);
			}
			else {
				Meteor.call(
					'removePrediction',
					prediction,
					function(error, id) {
						if (error)
							Errors.throw(error.reason);
					}
				);
				while (prediction.stage >= 1){
					prediction.stage -= 1;
					Meteor.call(
						'removePrediction',
						prediction,
						function(error, id) {
							if (error)
								Errors.throw(error.reason);
						}
					);
				}
			}
		}
		else {
			Errors.throw("Logi palun sisse");
		}
	});
}

Template.prediction.destroyed = function(){
	$(document.body).off('.fixtureRadios');
}

Template.fixture.helpers({
	isSelected: function(key) {
		var prediction = Predictions.findOne({userId: Meteor.userId(), fixtureId: 'fixture_' + this.id, event: Session.get('selectedCompetition').url});
		var returnVal = '';
		if (prediction) {
			returnVal = key == prediction.prediction ? 'active': '';
		}

		return returnVal;
	},

	countPredictions: function(key) {
		var predictions = Predictions.find({fixtureId: 'fixture_' + this.id, event: Session.get('selectedCompetition').url, prediction: key});
		return predictions.count();
	}
});

Template.predictionPlayoffs.helpers({
	playoffStage: function(stage) {
		var teams = Predictions.find({userId: Meteor.userId(), stage: stage, event: Session.get('selectedCompetition').url});
		return teams;
	},
	isChecked: function(stage) {
		var prediction = Predictions.findOne({userId: Meteor.userId(), key: this.key, stage: stage, event: Session.get('selectedCompetition').url});
		if (prediction) {
			return 'active';
		}
		else {
			return '';
		}
	},
	setNumber: function(number) {
		remainingNumber = number;
	},
	numbers: function() {
		var result = new Array();
		for (var i=0; i < remainingNumber; i++) {
			result.push({
				value: remainingNumber - i
			});
		}
		return result;
	}
});
