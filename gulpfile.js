const gulp = require("gulp");
var gutil = require("gulp-util");
const through = require("through2");

const strip = require("gulp-strip-code");
const rename = require("gulp-rename");
const gzip = require("gulp-gzip");

const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default;

const clone = require("gulp-clone");
const gulpMerge = require("gulp-merge");

const path = require("path");

const uglifyOptions = {
  ecma: 6,
  mangle: {
    reserved: [ "µ" ]
  }
};

/**
 * a gulp transformer that keeps the smallest file and discard the rest
 * @returns {*}
 */
const keepSmallest = () => {
  const files = [];

  function transform(file, encoding, callback) {
    files.push(file);
    callback();
  }

  function flush() {
    files.sort(function(a, b) {
      const sizeA = a.contents.byteLength;
      const sizeB = b.contents.byteLength;
      return sizeA < sizeB ? -1 : sizeA > sizeB ? 1 : 0;
    });

    files.forEach((file, index) => {
      const size = index
        ? gutil.colors.red(file.contents.byteLength)
        : gutil.colors.green(file.contents.byteLength);

      gutil.log(gutil.colors.magenta(path.basename(file.path)), size);
    });

    this.push(files[0]);
  }

  return through.obj(transform, flush);
};

/**
 * Trims the tailing ';' to save an extra byte
 */
const trimSemicolon = () => {
  function filter(file, enc, cb) {
    file.contents = file.contents.slice(0, -1);
    cb(null, file);
  }

  return through.obj(filter);
};

const getBaseStream = () => {
  return gulp.src("src/dotdom.js").pipe(
    strip({
      start_comment: "BEGIN NPM-GLUE",
      end_comment: "END NPM-GLUE"
    })
  );
};

gulp.task("build:js", () => {
  const baseStream = getBaseStream();

  return gulpMerge(
    baseStream
      .pipe(clone())
      .pipe(uglify(uglifyOptions))
      .on("error", function(err) {
        gutil.log(gutil.colors.red("[Error]"), err.toString());
      })
      .pipe(trimSemicolon())
      .pipe(
        rename({
          suffix: "-uglify"
        })
      ),
    baseStream
      .pipe(clone())
      .pipe(
        babel({
          presets: ["babili"]
        })
      )
      .pipe(trimSemicolon())
      .pipe(
        rename({
          suffix: "-babili"
        })
      )
  )
    .pipe(keepSmallest())
    .pipe(clone())
    .pipe(
      rename({
        basename: "dotdom.min"
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("build:gz", () => {
  const baseStream = getBaseStream();

  return gulpMerge(
    baseStream
      .pipe(clone())
      .pipe(uglify(uglifyOptions))
      .on("error", function(err) {
        gutil.log(gutil.colors.red("[Error]"), err.toString());
      })
      .pipe(trimSemicolon())
      .pipe(
        rename({
          suffix: "-uglify"
        })
      )
      .pipe(gzip({ gzipOptions: { level: 9 } })),
    baseStream
      .pipe(clone())
      .pipe(
        babel({
          presets: ["babili"]
        })
      )
      .pipe(trimSemicolon())
      .pipe(
        rename({
          suffix: "-babili"
        })
      )
      .pipe(gzip({ gzipOptions: { level: 9 } }))
  )
    .pipe(keepSmallest())
    .pipe(clone())
    .pipe(
      rename({
        basename: "dotdom.min.js"
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("build", ["build:js", "build:gz"]);

gulp.task("watch", () => {
  const watcher = gulp.watch("./src/**/*.js", ["build:js"]);
  watcher.on("change", function(event) {
    gutil.log(
      "File",
      gutil.colors.magenta(event.path),
      "was",
      gutil.colors.cyan(event.type)
    );
  });
  return watcher;
});

gulp.task("default", ["build", "watch"]);
