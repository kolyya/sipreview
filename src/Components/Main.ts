'use strict';

import $ from 'jquery';
import JSZip, { JSZipObject } from 'jszip';

class Main {
    constructor() {
        const $result = $('#jsFileLoading');
        const $gameRoundsNav = $('#jsGameRoundsNav');
        const $gameRounds = $('#jsGameRounds');

        $('#file').on('change', function (e) {
            // Closure to capture the file information.
            function handleFile(f: any) {
                const $title = $('<h4>', {
                    text: 'Выбран файл: ' + f.name,
                });
                $result.append($title);

                const dateBefore: any = new Date();
                JSZip.loadAsync(f)                                   // 1) read the Blob
                    .then(function (zip: JSZip) {
                        const dateAfter: any = new Date();
                        $title.append($('<span>', {
                            'class': 'small',
                            text: ' (loaded in ' + (dateAfter - dateBefore) + 'ms)'
                        }));

                        zip.forEach(function (relativePath: string, zipEntry: JSZipObject) {  // 2) print entries
                            if ('content.xml' === zipEntry.name) {
                                zipEntry.async('text').then((txt) => {
                                    const $package: any = $($.parseXML(txt.trim())).find('package');

                                    $('#jsGameName').html($package.attr('name'));
                                    $('#jsGameDate').html($package.attr('date'));
                                    $('#jsGameVersion').html($package.attr('version'));
                                    $('#jsGameId').html($package.attr('id'));

                                    $package.find('round').each(function (i: number) {
                                        // tab
                                        $('<a>', {
                                            'class': 'nav-link' + (i === 0 ? ' active' : ''),
                                            'html': $(this).attr('name'),
                                            'data-toggle': 'tab',
                                            'href': '#round' + i,
                                        }).appendTo($('<li>', {
                                            'class': 'nav-item',
                                        }).appendTo($gameRoundsNav));

                                        // content
                                        const $round = $('<div>', {
                                            'class': 'tab-pane fade' + (i === 0 ? ' active show' : ''),
                                            'id': 'round' + i,
                                        });

                                        const $table = $('<table>', {
                                            'class': 'table',
                                        }).appendTo($round);

                                        $(this).find('themes').find('theme').each(function (j: number) {
                                            const $tr = $('<tr>', {});

                                            $('<td>', {
                                                'html': $(this).attr('name'),
                                            }).appendTo($tr);

                                            $tr.appendTo($table);
                                        });

                                        $round.appendTo($gameRounds);
                                    });

                                });
                            }


                            // $fileContent.append($('<li>', {
                            //     text: zipEntry.name
                            // }));
                        });
                    }, function (e) {
                        $result.append($('<div>', {
                            'class': 'alert alert-danger',
                            text: 'Error reading ' + f.name + ': ' + e.message
                        }));
                    });
            }

            const files = e.target.files;
            for (let i = 0; i < files.length; i++) {
                handleFile(files[i]);
            }
        });
    }
}

export default Main;