const gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename");

gulp.task("js", ()=>{
  return gulp.src("./src/*.js")
    .pipe(uglify())
    .pipe(rename({
      suffix: "-min"
    }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("copy", ()=>{
  return gulp.src(["./src/*.*", "!src/*.js"])
    .pipe(gulp.dest("./dist"));
});

gulp.task("default", ["copy", "js"]);
