const shell = require('shelljs');
const path = require('path');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

// set env variable for global & service path using local config for development.
gulp.task('set-env', () => {
    // read path from local for global & service yaml files.
    const globalSettingPath = path.resolve('config/local/application.yaml');
    const serviceSettingPath = path.resolve('config/local/core-services/cafu.yaml');
    const logFilePath = path.resolve('logs/application.log');
    shell.env.SERVICE_APP_SETTING_PATH = serviceSettingPath;
    shell.env.GLOBAL_APP_SETTING_PATH = globalSettingPath;
    shell.env.LOG_FILE_SETTING_PATH = logFilePath;
});

// for running the gulp & nodemon task on same PID.
gulp.task('start-nodemon-dev-mode', () => {
    nodemon({
      script: 'app.js',
      exec: 'babel-node',
      nodeArgs: [],
    });
});

// for starting the debug mode on same PID.
gulp.task('start-nodemon-debug-mode', () => {
    nodemon({
      script: 'app.js',
      exec: 'babel-node',
      args: ['--inspect'],
      nodeArgs: [],
    });
});

gulp.task('start-nodemon', ['set-env', 'start-nodemon-dev-mode']); // for local development.
gulp.task('start-nodemon-debug', ['set-env', 'start-nodemon-debug-mode']); // for debug environment.
