module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: [
            'dist'
        ],
        concat: {
            options: {
                separator: '\n'
            },
            build: {
                files: [
                    {
                        src: [
                            'js/x.js',
                            'js/extend/x/**/*.js',
                            'js/extend/controller/**/*.js',
                            'js/extend/view/**/*.js',
                            'js/extend/mvvm.js',
                            'js/extend/aspects.js',
                            'js/aspects/**/*.js'
                        ],
                        dest: 'dist/<%= pkg.name %>.js'
                    }
                ]

            }
        },
        uglify: {
            options: {
                banner: '/*\nPackage: <%= pkg.name %>\nVersion: <%= pkg.version %>\nBuild Date: <%= grunt.template.today("mm-dd-yyyy h:MM:ssTT") %>\n*/\n'
            },
            build: {
                files: {
                    'dist/<%= pkg.name %>.min.js': [
                        '<%= concat.build.files[0].dest %>'
                    ]
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'js/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.',
                    keepalive: true,
                    open: {
                        target: 'http://localhost:8000/demos/todo/index.html'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['clean', 'concat']);
    grunt.registerTask('cleaner', ['clean']);
    grunt.registerTask('demo', ['connect']);
    grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify']);
};
