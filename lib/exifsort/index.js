"use strict";

var fs   = require('fs'),
	exif   = require('exiv2'),
	mkdirp = require('mkdirp');

var log = function(msg) {
	console.log(msg);
};

var process_exif_file = function (file, dst, cb) {
	exif.getImageTags(file, function (err, tags) {
		if (err || !tags) {
			log('Could not read exif data of "'+file+'"');
			cb && cb();
			return;
		}
		var date = tags["Exif.Photo.DateTimeOriginal"].split(' ')[0].replace(/:/g, '/');
		move_file(file, dst, date, cb);
	});
};

var process_file = function (file, dst, cb) {
	fs.stat(file, function(err, stats) {
		if (err) { cb && cb(err); }
	  move_file(file, dst, stats.mtime, cb);
	});
};

var move_file = function (file, dst, date, cb) {
	if (!(date instanceof Date)) { cb && cb('date is not instance of Date'); }
	dst = dst+'/'+date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
	mkdirp(dst, function (err) {
		if (err) { log(err); cb && cb(err); return; }
		var to = dst+'/'+file.replace(/^.*[\\\/]/, '');
		fs.rename(file, to, function (err) {
			if (err) { log(err); cb && cb(); return; }
			log(file+' -> '+to);
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
			process_file(file, to, function () {
				if (++a === l) {
					options.callback && options.callback(a);
				}
			});
		}
	});
};
