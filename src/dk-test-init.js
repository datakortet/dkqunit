
(function () {
    console.log("IN DK TEST INIT");
    dk.import.css('/dist/dk.css');
    dk.import.css('/dktest/diffview.css');
    dk.import.css('/dktest/dktest.css');

    dk.import.js("https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/run_prettify.js");
    dk.import.js("https://netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js");

    var structure = {
        toolbar: {
            classes: ['btn-toolbar', 'pull-right'],
            btngrp: {
                classes: ['btn-group'],
                expandbtn: {
                    classes: ['btn', 'btn-default'],
                    template: '<button id="expand-all">expand all</button>'
                },
                collapsebtn: {
                    classes: ['btn', 'btn-default'],
                    template: '<button id="collapse-all">collapse all</button>'
                }
            }
        }
    };

    var btntoolbar = $('<div/>').prependTo($('.container-fluid'));
    dk.dom.Template.create(structure).construct_on(btntoolbar);

    $(document).ready(function () {
        $('#expand-all').click(function () {
            $('.panel-body').show();
        });
        $('#collapse-all').click(function () {
            $('.panel-body').hide();
        });
        var fname = dk.parse_uri(window.location).name;
        $('head').prepend($('<title/>').text(fname));
        //$('head').prepend('<meta charset="utf-8">');  // doesn't work.. :-(

        var title = $('h1:eq(0)');
        title.prepend("<small>" + fname + ".html:</small> ");
        //if (!title.text())  title.text(fname);
    });

}());
