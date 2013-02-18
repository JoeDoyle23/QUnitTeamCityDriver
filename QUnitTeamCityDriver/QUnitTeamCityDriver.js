

if (navigator.userAgent.indexOf("PhantomJS") !== -1) {
    
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
      ? args[number]
      : '{' + number + '}';
        });
    };

    String.prototype.teamCityEscape = function () {
        return this.replace(/['\n\r\|\[\]]/g, function (match) {
            switch (match) {
                case "'":
                    return "|'";
                case "\n":
                    return "|n";
                case "\r":
                    return "|r";
                case "|":
                    return "||";
                case "[":
                    return "|[";
                case "]":
                    return "|]";
                default:
                    return match;
            }
        });
    };

    /* TODO (dw): Have this passed through as a param to PhantonJS.exe? */
    var suiteName = "QUnit Tests".teamCityEscape();
    var currentModule = "";
	var currentTestName = "";

    /* QUnit.moduleStart() */
	QUnit.begin = function () {
        console.log("##teamcity[testSuiteStarted name='{0}']".format(suiteName));
    };

    /* QUnit.moduleStart({ name }) */
	QUnit.moduleStart = function(args) {
        currentModule = args.name.teamCityEscape();
        console.log("##teamcity[testSuiteStarted name='{0}']".format(currentModule));
	};

	/* QUnit.moduleDone({ name }) */
	QUnit.moduleDone = function(args) {
        currentModule = args.name.teamCityEscape();
        console.log("##teamcity[testSuiteFinished name='{0}']".format(currentModule));
	};

    /* QUnit.testStart({ name }) */
    QUnit.testStart = function (args) {
        currentTestName = args.name.teamCityEscape();
        var currentAssertion = "{0} - {1}".format(currentModule, currentTestName);

        console.log("##teamcity[testStarted name='{0}']".format(currentAssertion));
    };

    /* QUnit.testDone({ name }) */
    QUnit.testDone = function (args) {
		currentTestName = args.name.teamCityEscape();
        var currentAssertion = "{0} - {1}".format(currentModule, currentTestName);
	
        console.log("##teamcity[testFinished name='{0}']".format(currentAssertion));
    };
	
    /* QUnit.log({ result, actual, expected, message }) */
    QUnit.log = function (args) {
        if (!args.result) {
            var expected = args.expected ? args.expected.toString().teamCityEscape() : 'true';
            var actual = args.expected ? args.expected.toString().teamCityEscape() : 'false';
            console.log("##teamcity[testFailed type='comparisonFailure' name='{0}' details='{3} - expected={1}, actual={2}' expected='{1}' actual='{2}']".format(currentTestName, expected, actual, args.message.teamCityEscape()));
        }
    };

    /* QUnit.done({ failed, passed, total, runtime }) */
    QUnit.done = function (args) {
        console.log("##teamcity[testSuiteFinished name='{0}']".format(suiteName));
    };
}