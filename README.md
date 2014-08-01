# node-flow

Node.js utility to execute a sequence of asynchronous functions without getting into callback hell. 

It has the good parts of [async.waterfall](https://github.com/caolan/async#waterfall) and [step](https://github.com/creationix/step) put together !


### good parts from step

- catches error thrown out by a step


### good parts from async.waterfall

- keeps 'next' as explicit argument (not using ```this```)
- receives an explicit error callback (no more ```if (err) return callback(err)``` in every step)
- halts the execution of remaining steps on error

### installation
```
npm install node-flow 
```

### example

```
var flow = require('node-flow');

function getThisDone(callback) {
	flow(callback,
		function one(next) {
			console.log('step one');
			next(null, 'cool');
		},
		function two(next,  msg) {
			console.log('step two: ', msg);
			next();
		},
		function three(next) {
			console.log('step three');
			next(null, 'wow');
		}
	);
}
```

```
getThisDone(function(err, result) {
	if (err) {
		console.log('oops! ', err);
	} else {
		console.log('result: ', result);
	}
});
```


### NOTE
check out [Co](https://github.com/visionmedia/co)  if you're running node.js with generator support
