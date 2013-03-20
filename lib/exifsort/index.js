"use strict";

var fs   = require('fs'),
	exif   = require('./exif'),
	mkdirp = require('mkdirp');

var log = function(msg) {
	console.log(msg);
};

var process_file = function (file, dst, cb) {
	exif(file, function (err, image) {
		if (err || !image) {
			debugger;
			log('Could not read exif data of "'+file+'"');
			cb && cb();
			return;
		}

		var date = null,
			properties = ['date created', 'create date'];

		for (var i=properties.length-1; i>=0; i--) {
			if (image.hasOwnProperty(properties[i])) {
				date = image[properties[i]];
			}
		}

		if (!date) {
			log(image);
			process.exit();
		}

		date = date.split(' ')[0].replace(':', '/');
		move_file(file, dst, date, cb);
	});
};

var move_file = function (file, dst, date, cb) {
	dst = dst+'/'+date.replace(/:/g, '/');
	mkdirp(dst, function (err) {
		if (err) { log(err); cb && cb(); return; }
		var to = dst+'/'+file.replace(/^.*[\\\/]/, '');
		fs.rename(file, to, function (err) {
			if (err) { log(err); cb && cb(); return; }
			log('File "'+file+'" moved to '+to);
			cb && cb();
		});
	});
};

module.exports = function (options) {
	var from = options.from,
		to     = options.to;

	fs.readdir(from, function(err, files) {
		if (err) {
			log(err);
			options.callback && options.callback(0);
			return;
		}

		var i = 0, l = files.length, a = 0;
		for (i=0;i<l;i++) {
			var file = from+'/'+files[i];
			if (!/jpe?g/i.test(file)) {
				log('Skipping "'+file+'".');
				a++;
				continue;
			}

			process_file(file, to, function () {
				if (++a === l) {
					options.callback && options.callback(a)
				};
			});
		}
	});
};