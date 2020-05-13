'use strict';

import $ from 'jquery';
import JSZip from 'jszip';

class Main {
    constructor() {
        const $result = $('#result');
        $('#file').on('change', function (evt) {
            // remove content
            $result.html('');
            // be sure to show the results
            $('#result_block').removeClass('hidden').addClass('show');

            // Closure to capture the file information.
            function handleFile(f: any) {
                const $title = $('<h4>', {
                    text: f.name
                });
                const $fileContent = $('<ul>');
                $result.append($title);
                $result.append($fileContent);

                const dateBefore: any = new Date();
                JSZip.loadAsync(f)                                   // 1) read the Blob
                    .then(function (zip) {
                        const dateAfter: any = new Date();
                        $title.append($('<span>', {
                            'class': 'small',
                            text: ' (loaded in ' + (dateAfter - dateBefore) + 'ms)'
                        }));

                        zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                            $fileContent.append($('<li>', {
                                text: zipEntry.name
                            }));
                        });
                    }, function (e) {
                        $result.append($('<div>', {
                            'class': 'alert alert-danger',
                            text: 'Error reading ' + f.name + ': ' + e.message
                        }));
                    });
            }

            const files = evt.target.files;
            for (let i = 0; i < files.length; i++) {
                handleFile(files[i]);
            }
        });
    }
}

export default Main;
