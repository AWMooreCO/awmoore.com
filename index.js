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
      pattern: '*/*.md'
    }
  }))

  // Parse and Render Templates to Pages
  .use(plugins.templates({
    engine: 'swig',
    inPlace: true,
    pattern: '**/*.md'
  }))

  .use(plugins.markdown({
    smartypants: true,
    gfm: true,
    tables: true
  }))

  .use(plugins.templates({
    engine: 'swig',
    directory: 'templates/'
  }))

  // Files will build from ./src -> ./build
  .destination('./build');

  // Permalinks
  // TODO: Figure Out Permalinks


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
