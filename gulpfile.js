const { src, dest, watch, series } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');

// Imagenes
const imagemin = require('gulp-imagemin');

function fonts() {
    return src('src/fonts/**/*.ttf')
        .pipe(dest('build/fonts') )
}

function html() {
    return src('src/*.html')
        .pipe( dest('build') )
}

function css( done ) {
    src('src/scss/app.scss')
        .pipe(plumber({
            errorHandler: function(err) {
                console.error('Error en la tarea CSS:', err.message);
                this.emit('end');
            }
        }))
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        // .pipe( postcss([ autoprefixer() ]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest('build/css') )

    done();
}

function imagenes() {
    return src('src/images/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('build/images') )
}

function dev() {
    watch( 'src/*.html', html );
    watch( 'src/scss/**/*.scss', css );
    watch( 'src/images/**/*', imagenes );
}

exports.fonts = fonts
exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.default = series( imagenes, fonts, html, css, dev );