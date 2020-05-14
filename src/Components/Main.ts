'use strict';

import $ from 'jquery';
import JSZip, { JSZipObject } from 'jszip';
import ContentXml from './ContentXml';

class Main {
    private $result: JQuery;
    private CX: ContentXml;
    private data: { [key: string]: string } = {};

    constructor() {
        const _this = this;

        this.$result = $('#jsFileLoading');
        this.CX = new ContentXml({
            get_data: function (key: string) {
                return _this.data[key];
            },
        });

        $('#file').on('change', function (e: any) {

            const files = e.target.files;
            for (let i = 0; i < files.length; i++) {
                _this.handleFile(files[i]);
            }
        });
    }

    handleFile(file: any) {
        const _this = this;

        const $title = $('<h4>', {
            text: 'Выбран файл: ' + file.name,
        });
        this.$result.append($title);

        const dateBefore: any = new Date();
        JSZip.loadAsync(file)                                   // 1) read the Blob
            .then(function (zip: JSZip) {
                const dateAfter: any = new Date();
                $title.append($('<span>', {
                    'class': 'small',
                    text: ' (loaded in ' + (dateAfter - dateBefore) + 'ms)'
                }));

                zip.forEach(function (relativePath: string, zipEntry: JSZipObject) {  // 2) print entries
                    if (zipEntry.name.startsWith('Images/') || zipEntry.name.startsWith('Audio/')) {
                        zipEntry.async('base64').then((txt) => {
                            _this.data[zipEntry.name] = txt;
                        });
                    }

                    if ('content.xml' === zipEntry.name) {
                        zipEntry.async('text').then((txt: string) => {
                            _this.CX.parse(txt);
                        });
                    }
                });
            }, function (e) {
                _this.$result.append($('<div>', {
                    'class': 'alert alert-danger',
                    text: 'Error reading ' + file.name + ': ' + e.message
                }));
            });
    }
}

export default Main;
