"use strict";

const gulp = require("gulp"),
  p = require("gulp-load-plugins")(),
  del = require("del"),
  bs = require("browser-sync").create(),
  autoprefixer = require("autoprefixer"),
  fs = require("fs"),
  argv = require("yargs").argv,
  ftp = require("vinyl-ftp");

let isProduction;

console.log(p);

// Remove build directory
gulp.task("clean", () => {
  return del(["dist"]);
});

// Pug
gulp.task("pug", () => {
  return gulp
    .src("src/pug/**/!(_)*.pug")
    .pipe(
      p.pug({
        locals: {
          isProduction,
          // : JSON.parse(fs.readFileSync("src/pug/data/.json", "utf8")),
        }
      })
    )
    .on(
      "error",
      p.notify.onError(error => {
        return {
          title: "Pug",
          message: error.message
        };
      })
    )
    .pipe(gulp.dest("dist"))
    .on("end", bs.reload);
});

// Styles
let postCSSPlugins = [
  autoprefixer({
    cascade: false,
    flexbox: false
  }),
  require("css-mqpacker")({
    sort: true
  }),
  require("cssnano")({zindex: false})
];

gulp.task("styles:dev", () => {
  return gulp
    .src("src/sass/**/*.{sass,scss}")
    .pipe(p.sourcemaps.init())
    .pipe(p.plumber())
    .pipe(p.sass().on("error", p.sass.logError))
    .pipe(p.sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(bs.reload({ stream: true }));
});

gulp.task("styles:build", () => {
  return gulp
    .src("src/sass/**/*.{sass,scss}")
    .pipe(p.sass().on("error", p.sass.logError))
    .pipe(p.postcss(postCSSPlugins))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("purifycss", () => {
  return gulp
    .src("dist/css/*.css")
    .pipe(
      p.purifycss(["dist/js/*.js", "dist/*.html"], {
        info: true,
        rejected: true
      })
    )
    .pipe(gulp.dest("dist/css"));
});

// Watchers
gulp.task("watch", () => {
  gulp.watch("src/pug/**/*", gulp.series("pug"));

  gulp.watch("src/sass/**/*.{sass,scss}", gulp.series("styles:dev"));

  gulp.watch("src/fonts/**/*.*", gulp.series("fonts"));

  gulp.watch("src/img/**/*.*", gulp.series("img:dev"));

  gulp.watch("src/img/icons/svg/*.svg", gulp.series("svgSprite"));
});

// Fonts
gulp.task("fonts", () => {
  return gulp.src("src/fonts/**/*.*").pipe(gulp.dest("dist/fonts"));
});

// Img
gulp.task("img:dev", () => {
  return gulp.src("src/img/**/*.*").pipe(gulp.dest("dist/img"));
});

gulp.task("img:build", () => {
  return gulp
    .src(["src/img/**/*.{jpg,png,svg}", "!src/img/icons/**/*.svg"])
    .pipe(
      p.imagemin([
        p.imagemin.svgo({
          plugins: [
            {
              inlineStyles: {
                onlyMatchedOnce: false
              }
            },
            { removeStyleElement: true },
            {
              removeUnknownsAndDefaults: {
                keepDataAttrs: false
              }
            },
            {
              removeAttrs: {
                attrs: ["class"]
              }
            },
            {
              cleanupListOfValues: {
                floatPrecision: 0
              }
            },
            { removeTitle: false }
          ]
        })
      ])
    )
    .pipe(gulp.dest("dist/img"));
});

gulp.task("crop", () => {
  return gulp.src("src/img/crop/*.*")
    .pipe(p.imageResize({
      width: argv.width,
      height: argv.height,
      crop: Boolean(argv.width && argv.height),
      upscale: true,
      noProfile: true
    }))
    .pipe(p.rename({suffix: `_${argv.width}`}))
    .pipe(gulp.dest("src/img/cropped"));
});

// Sprites
gulp.task("svgSprite", () => {
  let config = {
    log: "verbose",
    shape: {
      id: {
        separator: "--"
      },
      transform: [
        {
          svgo: {
            plugins: [
              {
                cleanupListOfValues: {
                  floatPrecision: 0
                }
              },
              { removeXMLNS: true },
              { removeTitle: false }
            ]
          }
        }
      ]
    },
    mode: {
      symbol: {
        dest: ".",
        sprite: "sprite.symbol.svg"
      }
    }
  };

  return gulp
    .src("**/*.svg", { cwd: "src/img/icons/svg" })
    .pipe(p.svgSprite(config))
    .pipe(gulp.dest("dist/img/icons/svg"));
});

gulp.task("deploy", () => {
  const ftpCredentials = JSON.parse(fs.readFileSync("./ftp.json"));
  const { host, user, password, folder } = ftpCredentials;

  let conn = ftp.create({
    host,
    user,
    password,
    parallel: 10,
    log: p.util
  });

  const globs = ["dist/**/*"];

  return gulp
    .src(globs, { base: "./dist", buffer: false })
    .pipe(conn.newer(folder))
    .pipe(conn.dest(folder));
});

// Browsersync
gulp.task("serve", function() {
  bs.init({
    server: {
      baseDir: "dist"
    }
  });
});

// Dev
gulp.task(
  "dev",
  gulp.series(
    // "clean",
    gulp.parallel("styles:dev", "pug", "fonts", "img:dev", "svgSprite")
  )
);

// Build
gulp.task(
  "build",
  gulp.series(
    "clean",
    () => new Promise(resolve => {isProduction = true; resolve();}),
    gulp.parallel("styles:build", "pug", "fonts", "img:build", "svgSprite")
  )
);

// Default task
gulp.task("default", gulp.series("dev", gulp.parallel("watch", "serve")));
