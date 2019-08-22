const gulp = require("gulp");
const gutil = require("gulp-util");
const through = require("through2");

const strip = require("gulp-strip-code");
const rename = require("gulp-rename");
const gzip = require("gulp-gzip");
const brotli = require("gulp-brotli");

const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default;

const clone = require("gulp-clone");
const gulpMerge = require("gulp-merge");

const path = require("path");

const useBrotli = process.env.ENABLE_BROTLI || false;

const uglifyOptions = {
  ecma: 6,
  mangle: {
    reserved: [],
    toplevel: true
  }
};

const plugins = [
  "keyed"
];

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

/**
 * Strips out the NPM-GLUE armor from the given source file
 */
const getBaseStream = (src) => {
  return gulp.src(src).pipe(
    strip({
      start_comment: "BEGIN NPM-GLUE",
      end_comment: "END NPM-GLUE"
    })
  );
};

/**
 * Wraps the input stream with uglify
 */
const getUglifyStream = baseStream =>
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
    );

/**
 * Wraps the input stream with minify
 */
const getMinifyStream = baseStream =>
  baseStream
    .pipe(clone())
    .pipe(
      babel({
        presets: ["minify"],
        comments: false
      })
    )
    .on("error", function(err) {
      gutil.log(gutil.colors.red("[Error]"), err.toString());
    })
    .pipe(trimSemicolon())
    .pipe(
      rename({
        suffix: "-minify"
      })
    );

/**
 * Builds the given source file to the specified destination as a source stream
 */
const getBuildSource = (srcName, dstName) => {
  const baseStream = getBaseStream(srcName);
  const uglifyStream = getUglifyStream(baseStream);
  const minifyStream = getMinifyStream(baseStream);

  return gulpMerge(
    uglifyStream,
    minifyStream,
    null
  )
    .pipe(keepSmallest())
    .pipe(clone())
    .pipe(
      rename({
        basename: dstName
      })
    )
    .pipe(gulp.dest("./dist"));
}

/**
 * Builds the given source file to the specified destination as a compressed stream,
 * picking the best out of the compression matrix available.
 */
const getBuildCompressed = (srcName, dstName, gzipOptions={level: 9}) => {
  const baseStream = getBaseStream(srcName);
  const uglifyStream = getUglifyStream(baseStream);
  const minifyStream = getMinifyStream(baseStream);

  const streams = [
    uglifyStream.pipe(clone()).pipe(gzip({ gzipOptions })),
    minifyStream.pipe(clone()).pipe(gzip({ gzipOptions })),
  ];
  if (useBrotli) {
    streams.push(
      uglifyStream.pipe(clone()).pipe(brotli.compress()),
      minifyStream.pipe(clone()).pipe(brotli.compress()),
    );
  }
  streams.push(null);

  return gulpMerge.apply(null, streams)
    .pipe(keepSmallest())
    .pipe(clone())
    .pipe(
      rename({
        basename: dstName
      })
    )
    .pipe(gulp.dest("./dist"));
}

gulp.task("build:plugins:js", () => {
  const args = plugins.map(name => getBuildSource(
    "src/plugins/" + name + ".js",
    "plugin-" + name + ".min"
  ));

  args.push(null);
  return gulpMerge.apply(null, args);
});

gulp.task("build:plugins:gz", () => {
  const args = plugins.map(name => getBuildCompressed(
    "src/plugins/" + name + ".js",
    "plugin-" + name + ".min"
  ));

  args.push(null);
  return gulpMerge.apply(null, args);
});

gulp.task("build:js", () => {
  return getBuildSource(
    "src/dotdom.js",
    "dotdom.min"
  );
});

gulp.task("build:gz", () => {
  return getBuildCompressed(
    "src/dotdom.js",
    "dotdom.min"
  );
});

gulp.task("build:plugins", ["build:plugins:js", "build:plugins:gz"]);
gulp.task("build", ["build:js", "build:gz", "build:plugins"]);

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
