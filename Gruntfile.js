module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', '*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    clean: {
      dist: ['vendor/**', '.sass-cache/**']
    },
    concurrent: {
      target: {
        tasks: ['connect', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'bower_components',
            src: ['./*/dist/**', './normalize-css/normalize.css'],
            dest: './vendor'
          }
        ]
      }
    },
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          base: './',
          keepalive: true,
          livereload: true
        }
      }
    },
    postcss: {
      options: {
        map: false,

        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'})
        ]
      },
      dist: {
        src: 'style.css'
      }
    },
    watch: {
      all: {
        options: {
          livereload: true
        },
        files: ['index.html', 'scripts.js', 'style.css'],
        tasks: ['jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('serve', ['jshint', 'clean', 'copy', 'postcss', 'concurrent:target']);

};
