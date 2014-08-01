
module.exports = function(callback /* , step1, step2, ... stepN */) {
	if ('function' != typeof callback) {
		throw new Error('expected a callback function as first argument');
	}

	var tasks = Array.prototype.slice.call(arguments, 1);

	var index = 0;
	
	function next(err) {
		if (err) {
			return callback(err);
			// that's it. flow stops on first error.
		}
		
		//pick the step
		var step = tasks[index++];
		
		if (!step) {
			return callback.apply(null, arguments);
			// all steps are done!
		}

		var args = Array.prototype.slice.call(arguments);

		args[0] = next; // pass next as first argument
		
		
		// invoke it
		try {
			step.apply(null, args);
		} catch (err) {
			callback(err);
		}
	};
	

	// start the run
	next();
};



