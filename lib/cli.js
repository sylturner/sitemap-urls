#!/usr/bin/env node

/* eslint-disable no-sync, no-process-exit */
'use strict';
var path = require('path');
var fs = require('fs');
var meow = require('meow');
var stdin = require('get-stdin');
var updateNotifier = require('update-notifier');
var sitemapUrls = require('../');
var pkg = require('../package.json');

var HELP_FILE_PATH = path.join(__dirname, 'help.txt');
var cli;


updateNotifier({ pkg: pkg }).notify();

cli = meow({
    pkg: pkg,
    help: fs.readFileSync(HELP_FILE_PATH, { encoding: 'utf8' }).trim()
}, {
    alias: {
        help: 'h',
        version: 'v',
    }
});


stdin().then(function onStdin(stdinSitemap) {
    var urls;
    var filepath;
    var sitemap;

    // Require stdin or file
    if (!stdinSitemap && !cli.input[0]) {
        cli.showHelp();
        process.exit(1);
    }

    // Try reading file if no stdin
    if (stdinSitemap) {
        sitemap = stdinSitemap;
    } else {
        filepath = path.resolve(cli.input[0]);
        if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
            console.error('File doesn\'t exist:', filepath);
            process.exit(1);
        }

        sitemap = fs.readFileSync(filepath, { encoding: 'utf8' });
    }

    urls = sitemapUrls.extractUrls(sitemap);

    urls.forEach(function forEachUrl(url) {
        console.log(url);
    });
});
