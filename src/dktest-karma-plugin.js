(function (win) {
    /**
     * Returned function is used to kick off tests
     */
    function createStartFn(karma) {
        return function () {
        };
    }

    /**
     * Returned function is used for logging by Karma
     */
    function createDumpFn(karma, serialize) {
        // inside you could use a custom `serialize` function
        // to modify or attach messages or hook into logging
        return function () {
            karma.info({ dump: [].slice.call(arguments) });
        };
    }

    win.__karma__.start = createStartFn(window.__karma__);
    win.dump = createDumpFn(win.__karma__, function (value) {
        return value;
    });
})(window);



function DktestKarmaRenderer(karma) {
    this.karma = karma;
}

/**
 * Invoked before all tests are run; reports complete number of tests
 * @param  {Object} dktest Instance of Dktest unit tests runner
 */
DktestKarmaRenderer.prototype.beforeRun = function (dktest) {
    this.karma.info({
        // count number of tests in each of the modules
        total: dktest.modules.reduce(function (memo, currentModule) {
            return memo + currentModule.tests.length;
        }, 0)
    });
};


/**
 * Invoked after each test, used to provide Karma with feedback
 * for each of the tests
 * @param  {Object} test current test object
 * @param  {Object} module instance of Dktest module
 *                  to which this test belongs
 */
DktestKarmaRenderer.prototype.afterTest = function (test, module) {
    this.karma.result({
        description: test.name,
        suite: [module.name + "#"] || [],
        success: test.status === Dktest.PASS,
        log: [test.statusMessage] || [],
        time: test.runTime
    });
};


/**
 * Invoked after all the tests are finished running
 * with unit tests runner as a first parameter.
 * `window.__coverage__` is provided by Karma.
 * This function notifies Karma that the unit tests runner is done.
 */
DktestKarmaRenderer.prototype.afterRun = function (/* dktest */) {
    this.karma.complete({
        coverage: window.__coverage__
    });
};


/**
 * Creates instance of Dktest to run the tests.
 *
 * Returned start function is invoked by Karma runner when Karma is
 * ready (connected with a browser and loaded all the required files)
 *
 * When invoked, the start function will AMD require the list of test
 * files (saved by Karma in window.__karma__.files) and set them
 * as test modules for Dktest and then invoke Dktest runner to kick
 * off tests.
 *
 * @param  {Object} karma Karma runner instance
 * @return {Function}     start function
 */
function createStartFn(karma) {
    var runner = new Dktest({});

    Dktest.setRenderer(new DktestKarmaRenderer(karma));
    return function () {
        var testFiles = Object.keys(window.__karma__.files).filter(function (file) {
                return (/-test\.js$/).test(file);
            }).map(function (testFile) {
                return testFile.replace('/base/public/', '').replace('.js', '');
            });
        require(testFiles, function (testModules) {
            // test files can return a single module, or an array of them.
            testFiles.forEach(function (testFile) {
                var testModule = require(testFile);
                if (!Array.isArray(testModule)) {
                    testModule = [testModule];
                }
                testModule.forEach(function (aModule, index) {
                    aModule.setAMDName(testFile, index);
                    runner.module(aModule);
                });
            });
            runner.run();
        });
    };
}
