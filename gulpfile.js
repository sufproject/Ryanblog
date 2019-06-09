/*template:

npm i -global gulp gulp-sass gulp-concat gulp-autoprefixer gulp-minify browser-sync child_process gulp-cssnano del gulp-rename gulp-eslint gulp-imagemin gulp-newer gulp-postcss webpack webpack-stream --save-dev


*/
"use strict";
/************************************************************************************/
// Load Basic plugins
const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require('gulp-concat');

/** == Prefix CSS with Autoprefixer : npm install --save-dev gulp-autoprefixer */
const autoprefixer = require("autoprefixer");
/** == A basic use is to watch all CSS files : npm install -g browser-sync */
const browsersync = require("browser-sync").create();
/** == sevice for spawn()、exec()、execFile()、fork() */
const cp = require("child_process");
/** == Minify CSS with cssnano : npm install gulp-cssnano --save-dev */
const cssnano = require("cssnano");
const minify = require('gulp-minify');
/** == Delete files and folders using globs : npm install --save del */
const del = require("del");
/** == gulp-rename is a gulp plugin to rename files easily : npm install gulp-rename --save */
const rename = require("gulp-rename");
/** == Minify PNG, JPEG, GIF and SVG images with imagemin : npm install --save-dev gulp-imagemin */
const imagemin = require("gulp-imagemin");
/** == Only pass through newer source files : npm install gulp-newer --save-dev */
const newer = require("gulp-newer");
/** == Prevent pipe breaking caused by errors from gulp plugins */
const plumber = require("gulp-plumber");
/** == PostCSS gulp plugin to pipe CSS through several plugins, but parse CSS only once. : npm install --save-dev gulp-postcss */
const postcss = require("gulp-postcss");
/** == webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.
 : npm in  stall --save-dev webpack
 */
//const webpack = require("webpack");
//const webpackconfig = require("./webpack.config.js");
/** == Run webpack as a stream to conveniently integrate with gulp. : npm install --save-dev webpack-stream */
//const webpackstream = require("webpack-stream");

/************************************************************************************/
// create variables

var siteDir = './',
    asseDir = siteDir + 'assets/',
    imgsDir = asseDir + 'images/',
    csopDir = asseDir + 'css/',
    jsopDir = asseDir + 'js/',
    sassDir = asseDir + 'sass/',
    ignoreFile = [sassDir + 'dooioomoo.scss',sassDir + 'admin.scss'],
    sassfile = [],
    ignoreFilePlug = '';

//ignoreFile2 = '!' + sassDir + 'admin.scss';

/************************************************************************************/
function createignoreFileList(){
    sassfile = [sassDir + '*.scss'];
    for (var i in ignoreFile){
        ignoreFilePlug = '!'+ignoreFile[i];
        sassfile.push(ignoreFilePlug);
    }
    console.log(sassfile);
}
// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: siteDir
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean assets
function clean() {
    return del([sassDir +csopDir]);
}

// Optimize Images
function images() {
    return gulp
        .src(imgsDir + "**/*")
        .pipe(newer(imgsDir))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                            collapseGroups: true
                        }
                    ]
                })
            ])
        )
        .pipe(gulp.dest(imgsDir));
}

// CSS task
function css() {
    return gulp
        .src(sassfile)
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(concat('common.css'))
        .pipe(gulp.dest(sassDir +csopDir))
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest(csopDir));
    //.pipe(browsersync.stream());
}

function ignoreFilecss(){
    return gulp
        .src(ignoreFile)
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(gulp.dest(csopDir))
        .pipe(postcss([cssnano()]))
        .pipe(gulp.dest(csopDir));
    // var ignoreFileClearn = ignoreFile.replace('!','');
    //.pipe(browsersync.stream());
}

// Transpile, concatenate and minify scripts
function scripts() {
    return (
        gulp
            .src([sassDir + "js/**/*"])
            .pipe(plumber())
            // .pipe(webpackstream(webpackconfig, webpack))
            // folder only, filename is specified in webpack config
            .pipe(minify())
            .pipe(gulp.dest(jsopDir))
    //.pipe(browsersync.stream())
);
}

/****** WATCH FUNCTION **************************************************************/

// Watch files
function watchFiles() {
    gulp.watch(sassDir + "**/*", css);
    gulp.watch(sassDir + "js/**/*", gulp.series(scriptsLint, scripts));
    // gulp.watch(
    //   [
    //     "./_includes/**/*",
    //     "./_layouts/**/*",
    //     "./_pages/**/*",
    //     "./_posts/**/*",
    //     "./_projects/**/*"
    //   ],
    //   gulp.series(browserSyncReload)
    // );
    //gulp.watch("./assets/img/**/*", images);
}

/************************************************************************************/

// define complex tasks
createignoreFileList();
const js 	= gulp.series(scripts);
// const build = gulp.series(gulp.parallel(css,ignoreFilecss, images, js,clean));
const build = gulp.series(gulp.parallel(css,ignoreFilecss));
//const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images 	= images;
exports.css 	= css;
exports.js 		= js;
// exports.clean 	= clean;
//exports.build 	= build;
//exports.watch 	= watch;
exports.default = build;