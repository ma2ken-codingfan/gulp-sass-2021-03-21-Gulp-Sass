const { src, dest, watch, series, parallel } = require("gulp")

// call for plugin
const sass = require("gulp-sass")
const browserSync = require('browser-sync')
const del = require('del')

// variable to substitute directory

// source
const srcDir = {
  scss: "src/scss/**/*.scss",
  copy: "src/docs/**/*"
}

const distDir = {
  scss: "dist/css",
  copy: "dist",
  delFiles: "dist/**/*",
  css: "dist/css",
  images: "dist/images",
  js: "dist/js"
}

// function

const delFunc = done => {
  del.sync([distDir.delFiles, '!' + distDir.images, '!' + distDir.js, '!' + 'distDir.css'], {force: true})
  done()
}

//
const copyFunc = done => {
  src(srcDir.copy) // Copy source
  .pipe(dest(distDir.copy)) // Copy output
  done()
}
// sass
const sassFunc = done => {
  src(srcDir.scss) // Compile source
  .pipe(sass({
    outputStyle: "expanded",
    sourcmaps: true
  }))
  .pipe(dest(distDir.scss, {sourcemaps: true})).on('error', sass.logError) // Compile output
  done()
}

// browser-sync start server
const bsFunc = done => {
  browserSync.init({
    server: {
      baseDir: "./dist/",
      index: "index.html"
      //proxy: "localhost
    }

  })
  done()
}

// browser-sync Browser reload
const bsReload = done => {
  browserSync.reload()
  done()
  console.log('Reload Brower OK！👌')
}

// watch task
const watchFunc = done => {
  watch(srcDir.copy, series(delFunc, copyFunc, bsReload))
  watch(srcDir.scss, series(sassFunc, bsReload))
  done()
}

// batch processing all task
exports.default = series(delFunc, bsFunc, watchFunc, copyFunc, sassFunc)
