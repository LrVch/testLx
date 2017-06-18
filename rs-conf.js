(function () {
  'use strict';

  var baseDir = "./app",
    distBaseDir = "./dist";

  module.exports = {
    path: {
      // App
      baseDir: baseDir,
      cssDir: baseDir + "/css/*.css",
      cssDirDest: baseDir + "/css",
      scssDir: baseDir + "/scss/**/*.scss",
      scssDirDest: baseDir + "/scss",
      scssСonnect: baseDir + "/scss/style.scss",
      jsDir: baseDir + "/js/*.js",
      htmlDir: baseDir + "/*.html",
      fontsDir: baseDir + "/fonts/*",
      bootstrapFontsDir: baseDir + "/fonts/bootstrap/*",
      imgDir: baseDir + "/img/**/*",
      imgDestDir: baseDir + "/img/",
      iconsSvgDir: baseDir + "/img/icons-svg-for-inline/*.svg",
      bowerDir: baseDir + "/bower",
      iconDir: baseDir + "/img/",
      extraFiles: [baseDir + "/*.*", "!" + baseDir + "/*.html"],
      allAppFiles: baseDir + "/**/*",
	    jadeLocation: baseDir + "/markups/**/*.jade",
	    jadeCompiled: baseDir + "/markups/_pages/*.jade",
	    jadeDestination: baseDir,
	    jadeMain: baseDir + "/markups/_templates/main.jade",
      jadeWiredepSrc: baseDir + "/markups/_templates/*.jade",
      jadeWiredepDist: baseDir + "/markups/_templates",
	    compassConfig: "config.rb",
      // Dist
      distDir: distBaseDir,
      distCssDir: distBaseDir + "/css/",
      distJsDir: distBaseDir + "/js/",
      distFontsDir: distBaseDir + "/fonts/",
      distBootstrapFontsDir: distBaseDir + "/fonts/bootstrap/",
      distImgDir: distBaseDir + "/img/",
      distDelDir: [distBaseDir + "/**", "!" + distBaseDir],
      allDistFiles: distBaseDir + "/**/*"
    },
    conn: {
      host: "host",
      user: "user",
      password: "password",
      folder: "domains/site-name/public_html/",
      src: [distBaseDir + "/**/*"],
      base: distBaseDir
    }
  };
})();