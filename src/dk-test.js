/*
 *
 */

var xtag = require('xtag');

require('./dk-icon.js');
var $ = require('jquery');
var dk = require('../boot');
var web = require('../web');
var core = require('../core');
var dkicon = require('../unsorted').icons.icon;

var _counter = 0;

var label = function (txt) {
    return $('<b/>').text(txt).css({
        display: 'block',
        float: 'right',
        position: 'absolute',
        zIndex: 15,
        top: '2px',
        right: '1ex',
        fontSize: '11px',
        color: '#999'
    });
};

var box = function (parent, lbl, css) {
    var bx = $('<div class="box"/>').css({width: '100%', position: 'relative'});
    bx.append(label(lbl));
    if (css) bx.css(css);
    parent.append(bx);
    return bx;
};

var codebox = function (parent, txt, lbl, background, color) {
    var bx = box(parent, lbl);
    var pre = $('<pre/>').addClass('prettyprint').text(core.text.dedent(txt).trim());
    if (color) pre.css('color', color);
    if (background) pre.css('background-color', background);
    bx.append(pre);
};

var compare_html = function (a, b) {
    var aval = web.html.tidy(a || "").replace(/dk-bx-\d+/g, "dk-bx");
    var bval = web.html.tidy(b || "").replace(/dk-bx-\d+/g, "dk-bx");
    if (aval != bval) {
        console.log("Not equal!!");
        console.log(aval);
        console.log(bval);
    }
    return aval == bval;
};

try {
    xtag.register('dk-test', {
        lifecycle: {
            created: function () {
                var self = this;
                var testnum = _counter++;

                if (this.skip) {
                    $(this).hide();
                    return;
                }
                $(this).attr('testnum', testnum);
                this.work.prop('id', 'work-' + testnum);

                if (this.qunit || typeof QUnit !== "undefined") {
                    QUnit.module(this.module);
                    QUnit.test(this.name, function (assert) {
                        var error = self.runTest(assert);
                        var equalnodes = compare_html(self.work.html(), self.expect.html());
                        if (error || !equalnodes) {
                            assert.ok(false, "Created html is different from expected html");
                            $(self).show();
                            self.display(error);
                        } else {
                            assert.ok(true, "%s html as expected (completed without error).".format(self.name));
                        }
                    });
                    $(this).hide();
                } else {
                    this.display(this.runTest());
                }
            }
        },
        methods: {
            runTest: function (assert) {
                var self = this;
                if (this.skip) return;
                var error;
                try {
                    /* jshint evil:true */
                    var testfn = new Function(self.run.text());
                    var testcase = {
                        work: self.work,
                        testfn: testfn,
                        assert: assert
                    };
                    testcase.testfn();
                } catch (e) {
                    error = e;
                }
                return error;
            },
            display: function (error) {
                var self = this;
                var setup_text = this.work.html();

                this.run.hide();
                this.expect.hide();

                $(this).prepend('<div class="panel-heading">' + this.name + ' <small>(<b>in:</b> ' +  this.filename + ')</small></div>');
                $(this).addClass('panel panel-default');
                $(this).css({display: 'inline-block'});

                $(this).append('<div class="panel-body"/>');
                var panel = $(this).find('>.panel-body');

                if (this.explain) {
                    this.explain.hide();
                    var explanation = $('<div class="explanation"/>').css({
                        borderBottom: '1px solid #ccc'
                    });
                    panel.append(explanation);

                    dk.import.js('/dkjs/tests/dktest/showdown.js', function () {
                        //noinspection JSPotentiallyInvalidConstructorUsage
                        var converter = new Showdown.converter();
                        var explain_html = converter.makeHtml(core.text.dedent(self.explain.text()));
                        explanation.html(explain_html);
                    });
                }

                if (setup_text) codebox(panel, setup_text, 'setup');

                panel.append('<h4>running..</h4>');
                codebox(panel, this.run.text(), "code");

                if (error) {
                    try {
                        var errmsg = "%s[%d:%d] %s\n%s".format(error.fileName, error.lineNumber, error.columnNumber, error.message, error.stack);
                        codebox(panel, errmsg, "ERROR", 'lightsalmon', 'white');
                    } catch (e) {
                        codebox(panel, error.toString(), "ERROR", 'tomato', 'white');
                    }
                }

                panel.append('<h4>created</h4>'); //------------------------------------------------
                var created_div = $('<div/>').appendTo(panel);
                var genbx = box(created_div, "generated", {
                    border: '1px solid #bbb',
                    padding: 7,
                    borderRadius: 4
                });
                genbx.append(this.work);
                console.log("WORKTEXT:", self.work);
                dk.import.js('/dkjs/tests/dktest/beautify-html.js', function () {
                    console.log("WORKTEXT:", self.work.text());
                    codebox(created_div, html_beautify(self.work.html()), 'generated-html');
                });

                var equalnodes = compare_html(this.work.html(), this.expect.html());

                if (error || !equalnodes) {
                    panel.append('<h4>expected..</h4>');
                    var expected_div = $('<div/>').appendTo(panel);
                    var exbx = box(expected_div, "expected", {
                        border: '1px solid #bbb',
                        padding: 7,
                        borderRadius: 4
                    });
                    exbx.append(this.expect.show());
                    codebox(expected_div, this.expect.html(), 'expected-html');
                }

                if (equalnodes) {
                    $(this).find('>.panel-heading').prepend(dkicon('check-circle-o:fw', {color: 'green', marginLeft: -5, marginRight: 5}));
                } else {
                    $(this).find('>.panel-heading').prepend(dkicon('exclamation-triangle:fw', {color: 'red', marginLeft: -5, marginRight: 5}));
                    panel.append('<h4>diff</h4>');
                    var diffbx = box(panel, 'diff');
                    //web.html.tidy(a || "").replace(/dk-bx-\d+/g, "dk-bx")
                    dk.import.js(['/dkjs/tests/dktest/diffview.js', '/dkjs/tests/dktest/beautify-html.js'], function () {
                        diffbx.addClass('default').append(diffview({
                            baseTextName: 'Work (created)',
                            baseTextLines: html_beautify(web.html.tidy(self.work.html()).replace(/dk-bx-\d+/g, "dk-bx")),
                            newTextName: 'Expected',
                            newTextLines: html_beautify(web.html.tidy(self.expect.html()).replace(/dk-bx-\d+/g, "dk-bx"))
                        }));
                        diffbx.wrap('<div class="diffview" style="overflow:auto"></div>');
                    });
                }
                $(this).addClass(equalnodes? 'panel-info': 'panel-danger');
                $(this).on('click', '.panel-heading', function () {
                    $(this).parent().find('>.panel-body').toggle();
                });
                if (equalnodes) panel.hide();
            }
        },
        accessors: {
            name: {
                get: function () { return $(this).attr('name') || "<i>you need to specify name='..' on dk-test element</i>"; }
            },
            expect: { get: function () { return $(this).find('expect'); } },
            run: {
                get: function () {
                    var run = $(this).find('>run');
                    return  (run.length === 0)? $(this).find('>script[type=run]'): run;
                }
            },
            work: { get: function () { return $(this).find('work'); } },
            explain: { get: function () { return $(this).find('explain'); } },
            qunit: { get: function () { return $(this).attr('qunit') !== undefined; }},
            module: { get: function () { return $(this).attr('module') || ""; }},
            filename: { get: function () { return $(this).attr('filename') || ""; }},
            skip: { get: function () { return $(this).attr('skip') !== undefined; }}
        }
    });
} catch (e) {}
