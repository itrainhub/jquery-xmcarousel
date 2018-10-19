const gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass");

gulp.task("js-uncompressed", ()=>{
  return gulp.src("./src/*.js")
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("js-copy", ()=>{
  return gulp.src(["./src/*.js"])
    .pipe(gulp.dest("./dist"));
});
gulp.task("js", ["js-uncompressed", "js-copy"]);

gulp.task("sass-uncompressed", ()=>{
  return gulp.src("./src/scss/*.scss")
    .pipe(sass({outputStyle: "expanded"}))
    .pipe(gulp.dest("./dist"));
});
gulp.task("sass-min", ()=>{
  return gulp.src("./src/scss/*.scss")
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("./dist"));
});
gulp.task("sass", ["sass-uncompressed", "sass-min"]);

gulp.task("watch", ()=>{
  gulp.watch("./src/*.js", ["js"]);
  gulp.watch("./src/scss/*.scss", ["sass"]);
});

gulp.task("default", ["js", "sass", "watch"]);
