// connect modules
const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const watch = require("gulp-watch");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const del = require("del");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");

// create tasks
// search all scss files in folder scss
// pipe - one action with our files, change. We give in pipe modules.
// init sourcemap
// init sass and catch errors
// write results
// catalog for files

gulp.task("sass-compile", function() {
  return (
    gulp
      .src("./src/scss/**/*.scss")
      // .src([
      //   "./src/scss/main.scss",
      //   "./src/scss/header-nav.scss",
      //   "./src/scss/about.scss"
      // ])
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          includePaths: require("node-normalize-scss").includePaths
        })
      )
      .pipe(sass().on("error", sass.logError))
      .pipe(concat("main.css"))
      .pipe(
        autoprefixer({
          cascade: false
        })
      )
      .pipe(cleanCSS({ level: 1 }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./build/css/"))
      .pipe(browserSync.stream())
  );
});

gulp.task("html", function() {
  return gulp
    .src("*.html")
    .pipe(posthtml([include()]))
    .pipe(gulp.dest("./build/"))
    .pipe(browserSync.stream());
});

gulp.task("scripts", function() {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(concat("all.js"))
    .pipe(
      uglify({
        toplevel: true
      })
    )
    .pipe(gulp.dest("./build/js/"))
    .pipe(browserSync.stream());
});
gulp.task("images", function() {
  return gulp
    .src("./img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./build/img"));
});

gulp.task("watch", function() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
  gulp.watch("./src/scss/**/*.scss", gulp.series("sass-compile"));
  gulp.watch("./src/js/**/*.js", gulp.series("scripts"));
  gulp.watch("*.html", gulp.series("html"));
  gulp.watch("./src/img/**/*", gulp.series("images"));
});

gulp.task("del", function() {
  return del(["build/*"]);
});

gulp.task(
  "build",
  gulp.series("del", gulp.parallel("html", "sass-compile", "scripts"))
);
