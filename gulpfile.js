"use strict";
var browserSync = require("browser-sync");
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var fileinclude = require('gulp-file-include');
var gulpRemoveHtml = require('gulp-remove-html');
var bourbon = require('node-bourbon');
var ftp = require('vinyl-ftp');
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});
gulp.task('sass', ['headersass'], function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass({
        includePaths: bourbon.includePaths
    }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('headersass', function () {
    return gulp.src('app/header.sass')
        .pipe(sass({
        includePaths: bourbon.includePaths
    }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS())
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('libs', function () {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});
gulp.task('watch', ['sass', 'libs', 'browser-sync'], function () {
    gulp.watch('app/header.sass', ['headersass']);
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});
gulp.task('imagemin', function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()]
    })))
        .pipe(gulp.dest('dist/img'));
});
gulp.task('buildhtml', function () {
    gulp.src(['app/*.html'])
        .pipe(fileinclude({
        prefix: '@@'
    }))
        .pipe(gulpRemoveHtml())
        .pipe(gulp.dest('dist/'));
});
gulp.task('removedist', function () {
    return del.sync('dist');
});
gulp.task('build', ['removedist', 'buildhtml', 'imagemin', 'sass', 'libs'], function () {
    var buildCss = gulp.src([
        'app/css/fonts.min.css',
        'app/css/main.min.css'
    ]).pipe(gulp.dest('dist/css'));
    var buildFiles = gulp.src([
        'app/.htaccess'
    ]).pipe(gulp.dest('dist'));
    var buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
    var buildJs = gulp.src('app/js/**/*').pipe(gulp.dest('dist/js'));
});
gulp.task('clearcache', function () {
    return cache.clearAll();
});
gulp.task('default', ['watch']);
