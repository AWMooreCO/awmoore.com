#!/usr/bin/env node

var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    templates  = require('metalsmith-templates'),
    serve      = require('metalsmith-serve'),
    watch      = require('metalsmith-watch');

var nopt     = require('nopt'),
    noptOpts = { "clean" : Boolean,
                 "serve" : Boolean,
                 "watch" : Boolean
               },
    noptAbbr = { "c" : ["--clean"],
                 "s" : ["--serve"],
                 "w" : ["--watch"]
               },
    options  = nopt(noptOpts, noptAbbr);

var ms = new Metalsmith(__dirname);

ms.clean(options.clean);
ms.use(templates({
  engine: 'swig',
  inPlace: true,
  pattern: '**/*.md'
}));
ms.use(markdown({
  smartypants: true,
  gfm: true,
  tables: true
}));
ms.use(templates({
  engine: 'swig',
  directory: 'templates/'
}));
ms.destination('./build');

// Launch in Browser
if (options.serve) {
  ms.use(serve({
    port: 8080,
    verbose: true
  }));
}

// LiveReload when Launched
if (options.watch) {
  ms.use(watch({
    pattern : '**/*',
    livereload: true
  }));
}

ms.build(function (err) {
  if (err) {
    throw err && console.log(err);
  } else {
    console.log("Forged with no errors!");
  }
});
