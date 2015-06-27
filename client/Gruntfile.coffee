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
          src: "**/*.jade",
          dest: "app/",
          expand: true,
          ext: ".html"
        } ]
      }

    fileblocks:
      todos:
        src:'./app/index.html'
        blocks:
          app:
            src:[
              './app/scripts/app.js'
            ]

    copy :
      main :
        files :[
          {
            expand:true
            cwd: 'dev/assets'
            src: ['**', '**/*.*']
            dest: 'app/assets/'
          }
          {
            expand:true
            cwd: 'dev/styles'
            src: ['**', '**/*.css']
            dest: 'app/styles/'
          }
          {
            expand:true
            cwd: 'dev/scripts'
            src: ['**', '**/*.js']
            dest: 'app/scripts/'
          }
        ]

    coffee:
      build:
        expand:true
        cwd: 'dev/scripts'
        src: ['*.coffee']
        dest: 'app/scripts'
        ext: '.js'


    connect:
      options:
        hostname: 'localhost'
        livereload: 35729
        port: 3000
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
          'dev/*.*'
          'dev/**/*.*'
        ]
        tasks : [
          'copy:main'
          'jade:debug'
          'coffee'
          'fileblocks'
          'wiredep'
        ]



  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-wiredep'
  grunt.loadNpmTasks 'grunt-file-blocks'

  grunt.registerTask 'jade2', ['jade:debug']

  grunt.registerTask 'serve', () ->
    if grunt.option 'build'
      grunt.log.ok 'Mode build'
      grunt.run.task 'buildMode'
    else
      grunt.log.ok 'Mode développement'
      grunt.task.run 'devMode'


  grunt.registerTask 'devMode', ->
    grunt.task.run 'connect:server'
    grunt.task.run 'watch:all'

  grunt.registerTask 'buildMode', ->



