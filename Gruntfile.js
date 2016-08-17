module.exports = function (grunt) {

    var appConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        project: appConfig,
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    '.tmp/css/styles.css': 'css/scss/styles.scss'
                }
            }
        },
        watch: {
            css: {
                files: [
                    'css/scss/*.scss',
                    'css/scss/**/*.scss',
                ],
                tasks: ['sass']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= project.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= project.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9002,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            dist: {
                options: {
                    open: true,
                    base: ['./app','./.tmp']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', ['sass']);
    grunt.registerTask('serve', [
        'sass',
        'connect:dist',
        'watch:css'
    ]);
}