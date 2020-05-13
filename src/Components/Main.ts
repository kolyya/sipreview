'use strict';

import $ from 'jquery';
import JSZip, { JSZipObject } from 'jszip';

class Main {
    constructor() {
        const $result = $('#jsFileLoading');

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
                                    $('#jsGameId').html($package.attr('version'));
                                    $('#jsGameVersion').html($package.attr('id'));
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
