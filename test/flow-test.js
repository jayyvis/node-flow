
var flow = require('../lib/flow');
var assert = require('assert');


describe('flow()', function() {
	it('runs all steps exactly once', function(done) {
		var count = {'one':0, 'two':0, 'three': 0};
		
		flow(callback,
			function one(next) {
				count['one']++;
				next();
			},
			function two(next) {
				count['two']++;
				
				setTimeout(function() {
					next();
				}, 0);
			},
			function three(next) {
				count['three']++;
				next();
			}
		);
		
		function callback(err) {
			assert(!err, '[error]'+err);
			for (k in count) assert.equal(count[k], 1);
			done();
		}
	});
	
	it('passes arguments to subsequent steps', function(done) {
		flow(callback,
			function one(next) {
				next(null, 'cool');
			},
			function two(next,  msg) {
				assert.equal(msg, 'cool');
				next(null, 'it', 'passes', 'all', 'args');
			},
			function three(next, arg1, arg2, arg3, arg4) {
				assert.equal(arg1, 'it');
				assert.equal(arg2, 'passes');
				assert.equal(arg3, 'all');
				assert.equal(arg4, 'args');
				
				next(null, 'wow');
			}
		);
		
		function callback(err, result) {
			assert(!err, '[error]'+err);
			assert.equal(result, 'wow', 'wrong result');
			done();
		}
	});
	
	it('stops running further steps on error', function(done) {
		flow(callback,
			function one(next) {
				next();
			},
			function two(next,  msg) {
				next('error in step2');
			},
			function three(next) {
				assert.fail('reaching step3 when there is an error in step2');
			}
		);
		
		function callback(err) {
			assert.equal(err, 'error in step2', 'wrong error message');
			done();
		}
	});

	
	it('handles thrown out error', function(done) {
		flow(callback,
			function one(next) {
				next();
			},
			function two(next,  msg) {
				throw 'error in step2';
			},
			function three(next) {
				assert.fail('reaching step3 when there is an error in step2');
			}
		);
		
		function callback(err) {
			assert.equal(err, 'error in step2', 'wrong error message');
			done();
		}
	});
	
	it('gets out when there are no steps', function(done) {
		flow(callback);
		
		function callback(err) {
			assert(!err, '[error]'+err);
			done();
		}
	});

	it('errors when there is no callback given', function() {
		assert.throws(function() {
			flow();
		})
	});
	
});




