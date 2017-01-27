////////////////////// DEPENDENCIES AND VARIABLES //////////////////////
var srcCssDir = './resources/styles/';
var srcJsDir = './resources/js/';
var dstCssDir = './build/css/';
var dstJsDir = './build/js/';
var appDir = './app/';


var gulp = require('gulp');

// used for concatenating/minifying bower files and other js/css
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var tslint = require('gulp-tslint');
var mainBowerFiles = require('main-bower-files');
var kServer = require('karma').Server;


gulp.task('bower', function () {
    return gulp.src(mainBowerFiles(), {
        base: 'bower_components'
    }).pipe(gulp.dest('./lib/bootstrap/'));
});

gulp.task('bootstrap:prepareLess', ['bower'], function () {
    return gulp.src('./lib/less/bootstrap/variables.less')
        .pipe(gulp.dest('./build/less'));
});

gulp.task('bootstrap:compileLess', ['bootstrap:prepareLess'], function () {
    return gulp.src('public/lib/bootstrap/less/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('public/lib/bootstrap/dist/css'));
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
    return del([appDir + '**/*.js', appDir + '**/*.js.map']);
});

// clean and then compile once. To be called from server and global build.
gulp.task('ts', ['tsClean'], shell.task([
    'tsc'
]));

// tslint
gulp.task("tslint", function () {
    gulp.src(appDir + '**/*.ts')
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

////////////////////// JS BUILD //////////////////////

gulp.task('jsBuildClean', function () {
    return del([dstJsDir + 'vendor.min.js']);
});

gulp.task('jsBuild', ['jsBuildClean'], function () {
    return gulp.src([srcJsDir + '**/*.js'])
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(dstJsDir));
});


////////////////////// SASS & CSS BUILD //////////////////////

gulp.task('cssBuildClean', function () {
    return del([dstCssDir + 'vendor.min.css']);
});

gulp.task('cssBuild', ['cssBuildClean'], function () {
    return gulp.src([srcCssDir + '**/*.scss', srcCssDir + '**/*.css'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(dstCssDir));
});

////////////////////// SERVER //////////////////////
gulp.task('serve', ['build'], function () {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html",
            routes: {
                '/**': 'index.html'
            }
        }
    });
    gulp.watch([srcJsDir + '*/**.js'], ['jsRebuild']); // vanilla js changes, reload.
    gulp.watch(['*.html', appDir + '**/*.html'], ['htmlRebuild']); // html changes, reload.
    gulp.watch([srcCssDir + '**/*.css', srcCssDir + '**/*.scss', appDir + '**/*.css', appDir + '**/*.scss'], ['cssRebuild']); // css or sass changes, concatenate all css/sass, build, reload.
    gulp.watch([appDir + '**/*.ts'], ['tsRebuild']); // typescript files change, compile then reload.
});

gulp.task('jsRebuild', ['jsBuild'], function () {
    browserSync.reload();
});

gulp.task('htmlRebuild', function () {
    browserSync.reload();
});

gulp.task('cssRebuild', ['cssBuild'], function () {
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
