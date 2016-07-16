String.prototype.format = function () {
	var args = arguments;
	return this.replace(/\{(\d+)\}/g, function (match, number) {
		if (typeof args[number] != 'undefined') {
			return args[number];
		}
		else {
			return match;
		}
	});
};

function letter_cominations(s) {
	var r = [];
	_(s).each(function(a) {
		_(r).each(function(b) {
			r.push(a + b);
		});
		r.push(a);
	});
	r.push('');
	return r;
}

var one_matrix = (function() {
	return _.range(1, 6).map(function(r) {
		return _.range(1, 6).map(function(c) {
			return 1;
		});
	})
})();

var xor_matrix = function(m1, m2) {
	return _.range(0, 5).map(function(r) {
		return _.range(0, 5).map(function(c) {
			return m1[r][c] ^ m2[r][c];
		});
	});
};

var zero_matrix = xor_matrix(one_matrix, one_matrix);

var get_matrix_state = function() {
	return _.range(1, 6).map(function(r) {
		return _.range(1, 6).map(function(c) {
			return +$('#r{0} .c{1}'.format(r, c)).is(':checked');
		});
	})
};

$(function() {
	$('#reset').on('click', function() {
		location.reload(false);
	});
	$('#matrix td').on('click', function(e) {
		// make toggling checkboxes easier by making the enitre cell clickable
		var $checkbox = $(this).find('[type=checkbox]');
		if (!$(e.target).is($checkbox)) {
			$checkbox.click();
		}
		$('#matrix').removeClass('error');
	});
	
	var data = {};
	var steps = [];
	var next = function() {
		steps.shift()();
	};
	_(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'current']).each(function(k) {
		steps.push(function() {
			if (k == 'current') {
				$('#prompt').text("Which lights are currently on?");
			}
			else {
				$('#prompt').text("Which lights does {0} affect?".format(k));
			}
			steps.unshift(function() {
				data[k] = get_matrix_state();
				$('#matrix [type=checkbox]').prop('checked', false);
				next();
			});
		});
	});
	steps.push(function() {
		var solution = _(letter_cominations('ABCDEFGH')).find(function(letters) {
			var m = data['current'];
			_(letters).each(function(l) {
				m = xor_matrix(m, data[l]);
			});
			return _.isEqual(m, one_matrix);
		});
		
		if (_.isUndefined(solution)) {
			$('#prompt').text("No solution found, try again.");
		}
		else {
			$('#prompt').text("Click the following letters just once: {0}.".format(solution));
		}
		
		$('#next').prop('disabled', true);
		$('#matrix [type=checkbox]').prop('checked', false);
		$('#matrix [type=checkbox]').prop('disabled', true);
	});
	next();
	$('#next').on('click', function() {
		if (_.isEqual(get_matrix_state(), zero_matrix)) {
			$('#matrix').addClass('error');
			return;
		}
		next();
	});
});
