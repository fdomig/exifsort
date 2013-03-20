"use strict";

var exifsort = require('../lib/exifsort'),
	assert     = require('assert'),
	fs         = require('fs');

var from_files = [
	'from/test1.jpg', 'from/test2.jpg', 'from/test3.jpg'
];

var to_files = [
	'to/2010/04/19/test1.jpg', 'to/2009/04/13/test2.jpg', 'to/2009/04/13/test3.jpg'
];

var cleanup = function() {
	var i=0, l=from_files.length, a = 0;
	for (i=0;i<l;i++) {
		fs.rename(__dirname+'/'+to_files[i], __dirname+'/'+from_files[i]);
		if (++a === l) {
			// todo remove folders
		}
	}
};

exifsort({
	from: __dirname+'/from',
	to:   __dirname+'/to',
	callback: function () {
		var i=0, l=to_files.length, a = 0;
		for (i=0;i<l;i++) {
			fs.exists(__dirname+'/'+to_files[i], function (exists) {
				assert(exists);
				if (++a === l) cleanup();
			});
		}
	}
});
