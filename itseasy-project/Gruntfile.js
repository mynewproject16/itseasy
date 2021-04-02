 module.exports = function(grunt) {

   var projectjsfile = [
     'public/js/base-controller.js',
     'public/js/its-easy-controller.js',
     'public/js/its-easy-confirm-delete-controller.js',
     'public/js/its-easy-apiservice.js',
     'public/js/utility-service.js',
     'public/js/itseasy.js',
     'public/js/its-easy-directives.js',
     'public/js/its-easy-filters.js',
     'public/js/its-easy-confirm-delete-controller.js'
   ];

   grunt.initConfig({

     pkg: grunt.file.readJSON('package.json'),
     // get the configuration info from package.json ----------------------------
     // this way we can use things like name and version (pkg.name)
     //    pkg: grunt.file.readJSON('package.json'),
     //
     //    ...

     // configure uglify to minify js files -------------------------------------
     uglify: {
       options: {
         banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
       },
       build: {
         files: {
           'public/build/app.min.js': projectjsfile
         }
       }
     },

     concat: {

       options: {
         separator: '\n;\n\n'
       },

       all: {
         src: [
           'bower_components/jquery/dist/jquery.min.js',
           'bower_components/bootstrap/dist/js/bootstrap.min.js',
           'bower_components/angular/angular.min.js',
           'bower_components/angular-ui-router/release/angular-ui-router.min.js',
           'bower_components/angular-toastr/dist/angular-toastr.min.js',
           'bower_components/angular-toastr/dist/angular-toastr.tpls.min.js',
           'public/js/uib/ui-bootstrap-tpls-2.5.0.min.js'
         ],

         dest: 'public/build/lib.min.js'
       }
     },
     jshint: {
       beforeconcat: projectjsfile,
     },
     cssmin: {
       options: {
         shorthandCompacting: false,
         roundingPrecision: -1
       },
       target: {
         files: {
           'public/build/app.min.css': [
             'bower_components/bootstrap/dist/css/bootstrap.css',
             'bower_components/angular-toastr/dist/angular-toastr.css',

             'public/css/styleLine.css',
             'public/css/styleSolid.css',
             'public/css/itseasy.css'
           ]
         }
       }
     }
   });

   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks("grunt-contrib-uglify");
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-cssmin');

   grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'cssmin']);
 };
