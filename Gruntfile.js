module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'src/*.js'
      ]
    },
    jasmine: {
      components: {
        src: [
          'src/*js'
        ],
        options: {
          specs: 'specs/*_spec.js',
          keepRunner : true,
          helpers: 'specs/helpers/*.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('jshintage', [
    'jshint',
  ]);

  grunt.registerTask('test', [
    'jasmine',
  ]);

  grunt.registerTask('travis', [
    'jshint',
    'jasmine'
  ]);
};
