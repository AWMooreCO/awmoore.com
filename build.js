#!/usr/bin/env node

var Metalsmith = require('metalsmith'),
    plugins    = require('load-metalsmith-plugins')();

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

ms
  .clean(options.clean)

  // Setup Collections
  .use(plugins.collections({
    pages: {
      pattern: 'content/pages/*.md'
    },
    posts: {
      pattern: 'content/posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))

  // Parse and Render Templates to Pages
  .use(plugins.less({
    parse: {
      paths: ['./src/assets/less'],
      compress: false
    }
  }))

  .use(plugins.templates({
    engine: 'swig',
    inPlace: true,
    pattern: '**/*.md'
  }))

  .use(plugins.markdown({
    gfm: true,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true
  }))

  .use(plugins.templates({
    engine: 'swig',
    directory: 'templates/'
  }))

  // Files will build from ./src -> ./build
  .destination('./build')

  // Permalinks
  .use(plugins.permalinks({
    pattern: ':collection/:title',
    relative: true
  }));


// Launch in Browser with '--serve-' or '-s' flag.
if (options.serve) {
  ms.use(plugins.serve({
    port: 8080,
    verbose: true
  }));
}

// LiveReload (over Serve) with '--watch' or '-w' flag.
if (options.watch) {
  ms.use(plugins.watch({
    pattern : '**/*',
    livereload: true
  }));
}

// Forge the Site; Catch any Errors.
ms.build(function (err) {
  if (err) {
    throw err && console.log(err);
  } else {
    console.log("Forged with no errors!");
  }
});
