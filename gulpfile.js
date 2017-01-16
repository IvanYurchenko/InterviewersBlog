////////////////////// DEPENDENCIES AND VARIABLES //////////////////////
var gulp = require('gulp');

// used for concatenating/minifying bower files and other js/css
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var tslint = require("gulp-tslint");
var kServer = require('karma').Server;

// used for pulling in bower files.
var lib = require('bower-files')({
    "overrides": {
        "bootstrap": {
            "main": [
                "less/bootstrap.less",
                "dist/css/bootstrap.css",
                "dist/js/bootstrap.js"
            ]
        }
    }
});

// used for build and clean tasks.
var del = require('del');

// set up server with watchers and run typescript compiler in the shell.
var browserSync = require('browser-sync').create();
var shell = require('gulp-shell');

// sass dependencies.
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

////////////////////// TYPESCRIPT //////////////////////
// clean task
gulp.task('tsClean', function () {
    return del(['app/**/*.js', 'app/**/*.js.map']);
});

// clean and then compile once. To be called from server and global build.
gulp.task('ts', ['tsClean'], shell.task([
    'tsc'
]));

// tslint
gulp.task("tslint", function () {
    gulp.src('app/**/*.ts')
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

////////////////////// JS BUILD //////////////////////

gulp.task('jsBuildClean', function () {
    return del(['./build/js/vendor.min.js']);
});

gulp.task('jsBuild', ['jsBuildClean'], function () {
    return gulp.src(['resources/js/**/*.js'])
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('./build/js'));
});


////////////////////// SASS & CSS BUILD //////////////////////

gulp.task('cssBuildClean', function () {
    return del(['./build/css/vendor.min.css']);
});

gulp.task('cssBuild', ['cssBuildClean'], function () {
    return gulp.src(['resources/styles/**/*.scss', 'resources/styles/**/*.css'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('./build/css'));
});

////////////////////// SERVER //////////////////////
gulp.task('serve', ['build'], function () {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });
    gulp.watch(['resources/js/*/**.js'], ['jsRebuild']); // vanilla js changes, reload.
    gulp.watch(['*.html'], ['htmlRebuild']); // html changes, reload.
    gulp.watch(['resources/styles/**/*.css', 'resources/styles/**/*.scss'], ['cssRebuild']); // css or sass changes, concatenate all css/sass, build, reload.
    gulp.watch(['app/**/*.ts'], ['tsRebuild']); // typescript files change, compile then reload.
});

gulp.task('jsRebuild', ['jsBuild'], function () {
    browserSync.reload();
});

gulp.task('htmlRebuild', function () {
    browserSync.reload();
});

gulp.task('cssRebuild', ['sassBuild'], function () {
    browserSync.reload();
});

gulp.task('tsRebuild', ['ts'], function () {
    browserSync.reload();
});

////////////////////// TESTS RUNNER TASK //////////////////////
// Run test once and exit
gulp.task('test', function (done) {
    new kServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

////////////////////// GLOBAL BUILD TASK //////////////////////
// global build task with individual clean tasks as dependencies.
gulp.task('build', ['tslint', 'ts'], function () {
    // we can use the buildProduction environment variable here later.
    gulp.start('jsBuild');
    gulp.start('cssBuild');
});
