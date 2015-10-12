module.exports = (grunt) ->

  grunt.initConfig

    pkg : grunt.file.readJSON 'package.json'

    wiredep:
      task:
        src :['app/index.html']

    jade:
      debug: {
        options: {
          client: false,
          pretty: true
        },
        files: [ {
          cwd: "dev/",
          src: "{,*/}*.jade",
          dest: "app/",
          expand: true,
          ext: ".html"
        } ]
      }

    less:
      development:
        options:
          compress: true
        files:
          'app/styles/styles.css': 'dev/less/styles.less'

    fileblocks:
      js:
        src:'./app/index.html'
        blocks:
          js:
            src:[
              './app/bower/bower.js',
              './app/scripts/app.js',
              './app/scripts/**/*.js'
            ]
      css:
        src:'./app/index.html'
        blocks:
          css:
            src:[
              './app/bower/bower.css',
              './app/styles/styles.css'
            ]

    copy :
      dist :
        files :[
          {
            expand:true
            cwd: 'dev/assets'
            src: ['**', '{,*/}*.*']
            dest: 'app/assets/'
          }
          {
            expand:true
            cwd: 'dev/scripts'
            src: ['**', '{,*/}*.js']
            dest: 'app/scripts/'
          }
        ]

    connect:
      options:
        hostname: 'localhost'
        livereload: 35729
        port: 9000
      server:
        options:
          base: ['./app', './']
          open: true

    watch:
      options:
        livereload: '<%= connect.options.livereload %>'
        reload: false
        debounceDelay: 1000
      all:
        files: [
          'Gruntfile.coffee'
          'dev/*.*',
          'dev/**/*',
          'dev/scripts/{,*/}*.*'
        ]
        tasks : [
          'copy:main'
          'jade:debug'
          'fileblocks'
          'wiredep'
          'less'
        ]

    bower_concat:
      all:
        dest: 'app/bower/bower.js',
        cssDest: 'app/bower/bower.css'

    clean:
      client: ["app"]



  require('load-grunt-tasks')(grunt)


  grunt.registerTask 'jade2', ['jade:debug']

  grunt.registerTask 'dev', ->
    grunt.task.run 'clean:client'
    grunt.task.run 'copy:dist'
    grunt.task.run 'jade'
    grunt.task.run 'less'
    grunt.task.run 'bower_concat'
    grunt.task.run 'fileblocks'
    grunt.task.run 'connect:server'
    grunt.task.run 'watch:all'

  grunt.registerTask 'build', ->
    grunt.task.run 'clean:client'
    grunt.task.run 'copy:dist'
    grunt.task.run 'jade'
    grunt.task.run 'less'
    grunt.task.run 'bower_concat'
    grunt.task.run 'fileblocks'
    grunt.task.run 'copy:toserver'



