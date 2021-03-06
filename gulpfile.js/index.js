/*  */

/**
 * Settings
 * Turn on/off build features
 */

const settings = {
  clean: true,
  scripts: true,
  polyfills: true,
  styles: true,
  svgs: true,
  copy: true,
  reload: true
};

exports.settings = settings;

/**
 * Paths to project folders
 */

const paths = {
  input: "src/",
  output: "dist/",
  scripts: {
    input: "src/**/*.js",
    output: "dist/js/"
  },
  styles: {
    input: "src/sass/**/*.{scss,sass}",
    output: "dist/css/"
  },
  svgs: {
    input: "src/svg-sprite/*.svg",
    output: "dist/svg/"
  },
  copy: {
    input: "src/copy/**/*",
    output: "dist/"
  },
  copyHTML: {
    input: "dist/index.html",
    output: "./"
  },
  reload: "./dist/"
};
exports.paths = paths;

/**
 * Gulp Packages
 */

// General
const { gulp, src, dest, watch, series, parallel } = require("gulp");

const rename = require("gulp-rename");
/* eslint-disable next-line */

// Scripts
const babel = require("gulp-babel");
const eslint = require("gulp-eslint");
const concat = require("gulp-concat");
const uglify = require("gulp-terser");
const { argv } = require("yargs");
const gulpif = require("gulp-if");

// Styles
const sass = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-cssnano");

// SVGs
// const svgmin = require("gulp-svgmin");
const svgo = require("gulp-svgo");
const svgstore = require("gulp-svgstore");

// BrowserSync
const browserSync = require("browser-sync");

const fileinclude = require("gulp-file-include");
const { cleanDist } = require("./cleanDist");

// Lint, minify, and concatenate scripts
function buildScripts(done) {
  // Make sure this feature is activated before running
  if (!settings.scripts) return done();

  // Run tasks on script files
  return src(paths.scripts.input)
    .pipe(gulpif(argv.production, babel({ presets: ["@babel/preset-env"] })))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(concat("main.js"))
    .pipe(dest(paths.scripts.output));
}

// Lint scripts
function lintScripts(done) {
  // Make sure this feature is activated before running
  if (!settings.scripts) return done();

  // Lint scripts
  return src(paths.scripts.input)
    .pipe(
      eslint({
        configFile: "./.eslintrc.json"
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Process, lint, and minify Sass files
function buildStyles(done) {
  // Make sure this feature is activated before running
  if (!settings.styles) return done();

  // Run tasks on all Sass files
  return src(paths.styles.input)
    .pipe(
      sass({
        outputStyle: "expanded",
        sourceComments: true,
        includePaths: "node_modules/bootstrap/scss"
      })
    )
    .pipe(
      prefix({
        cascade: true,
        remove: true
      })
    )
    .pipe(dest(paths.styles.output))
    .pipe(rename({ suffix: ".min" }))
    .pipe(
      minify({
        discardComments: {
          removeAll: true
        }
      })
    )
    .pipe(dest(paths.styles.output));
}

function svgSprite() {
  return src(paths.svgs.input)
    .pipe(
      svgo({
        plugins: [
          { removeDoctype: true },
          { removeXMLProcInst: true },
          { removeComments: true },
          { removeMetadata: true },
          { removeDesc: true },
          { removeUselessDefs: true },
          { removeTitle: true },
          { convertPathData: { floatPrecision: 2 } },
          { removeViewBox: false }
        ]
      })
    )
    .pipe(rename({ prefix: "image-" }))
    .pipe(svgstore())
    .pipe(dest(paths.svgs.output));
}

// Robi inline czego trzeba w src-master.hbs i zapisuje jako master.hbs
function inlineComponents() {
  return src("dist/index.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .pipe(dest("./dist"));
}

// Copy static files into output folder
function copyFiles(done) {
  // Make sure this feature is activated before running
  if (!settings.copy) return done();

  // Copy static files
  return src(paths.copy.input).pipe(dest(paths.copy.output));
}

// Copy static files into output folder
function copyHtml(done) {
  // Make sure this feature is activated before running
  if (!settings.copy) return done();

  // Copy static files
  return src(paths.copyHTML.input).pipe(dest(paths.copyHTML.output));
}

// Watch for changes to the src directory
function startServer(done) {
  // Make sure this feature is activated before running
  if (!settings.reload) return done();

  // Initialize BrowserSync
  browserSync.init({
    server: {
      baseDir: paths.reload
    }
  });

  // Signal completion
  return done();
}

// Reload the browser when files change
function reloadBrowser(done) {
  if (!settings.reload) return done();
  browserSync.reload();
  return done();
}

// Watch for changes
function watchSource(done) {
  watch(paths.input, series(exports.default, reloadBrowser));
  return done();
}

/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
  cleanDist,
  parallel(lintScripts, buildScripts, buildStyles, svgSprite, copyFiles),
  inlineComponents
);

// argv - production
exports.build = series(
  cleanDist,
  parallel(lintScripts, buildScripts, buildStyles, svgSprite, copyFiles,),
  inlineComponents, copyHtml
);

exports.svgSprite = svgSprite;

exports.copyHtml = copyHtml;
// Watch and reload
// gulp watch
exports.watch = series(exports.default, startServer, watchSource);
