'use strict';

var exec = require('child_process').exec;

module.exports = function(file, cb) {
	exec('exiftool '+file, function(err, stdout, stderr) {
		if (err) { cb(err, null); return;	}
		
		var res = {};

		res = stdout.split('\n').reduce(function(obj, line) {
      var i = line.indexOf(':'),
      	key = line.slice(0, i).trim().replace(/[^\w]+/g, ' ').toLowerCase(),
      	val = line.slice(i + 1, line.length).trim();

      if ('' === key || '' === val) return res;
      res[key] = val;
      
      return res;
    }, {});

		cb(null, res);
	});
};