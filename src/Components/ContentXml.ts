'use strict';

import $ from 'jquery';

class ContentXml {
    private $gameRoundsNav: JQuery;
    private $gameRounds: JQuery;
    private $gameQuestion: JQuery;

    constructor(public options: { get_data: any }) {
        this.$gameRoundsNav = $('#jsGameRoundsNav');
        this.$gameRounds = $('#jsGameRounds');
        this.$gameQuestion = $('#jsGameQuestion');
    }

    /**
     * Parse content.xml file
     * @param txt
     */
    parse(txt: string) {
        this.$gameRoundsNav.html('');
        this.$gameRounds.html('');
        this.$gameQuestion.html('');

        const $package: any = $($.parseXML(txt.trim())).find('package');

        // info
        $('#jsGameName').html($package.attr('name'));
        $('#jsGameDate').html($package.attr('date'));
        $('#jsGameVersion').html($package.attr('version'));
        $('#jsGameId').html($package.attr('id'));

        // rounds
        this.parseRounds($package);
    }

    /**
     * @param $package
     */
    private parseRounds($package: any) {
        const _this = this;

        $package.find('round').each(function (i: number) {
            // tab
            const $round = $(this);
            $('<a>', {
                'class': 'nav-link' + (i === 0 ? ' active' : ''),
                'html': $round.attr('name'),
                'data-toggle': 'tab',
                'href': '#round' + i,
            }).appendTo($('<li>', {
                'class': 'nav-item',
            }).appendTo(_this.$gameRoundsNav));

            // content
            const $roundEl = $('<div>', {
                'class': 'tab-pane fade' + (i === 0 ? ' active show' : ''),
                'id': 'round' + i,
            });

            const $table = $('<table>', {
                'class': 'table table-hover',
            }).appendTo($roundEl);

            // themes
            _this.parseThemes($round, $table);

            $roundEl.appendTo(_this.$gameRounds);
        });
    }

    /**
     * @param $round
     * @param $table
     */
    private parseThemes($round: JQuery, $table: JQuery) {
        const _this = this;

        $round.find('themes').find('theme').each(function () {
            const $tr = $('<tr>', {});
            const $theme = $(this);
            const themeName = $theme.attr('name');

            // название темы
            $('<td>', {
                'html': themeName,
            }).appendTo($tr);

            // questions
            _this.parseQuestions($theme, themeName, $tr);

            $tr.appendTo($table);
        });
    }

    /**
     *
     * @param $theme
     * @param themeName
     * @param $tr
     */
    private parseQuestions($theme: JQuery, themeName: string | undefined, $tr: JQuery) {
        const _this = this;

        $theme.find('questions').find('question').each(function () {
            const $question = $(this);
            const questionPrice = $(this).attr('price');

            const $type = $question.find('type');

            $('<td>', {
                'class': 'question-cell' + ($type.length ? ' question-cell_star' : ''),
                'html': questionPrice,
                click: function () {
                    _this.$gameQuestion.html('');

                    // тема, стоимость
                    $('<h4>', {
                        'html': themeName + ', ' + questionPrice,
                    }).appendTo(_this.$gameQuestion);

                    // тип вопроса и параметры
                    if ($type.length >= 1) {
                        $('<div>', {
                            'html': 'Тип вопроса: ' + $type.attr('name'),
                        }).appendTo(_this.$gameQuestion);

                        const $params = $('<div>', {
                            'html': '',
                        }).appendTo(_this.$gameQuestion);

                        $type.find('param').each(function () {
                            $('<span>', {
                                'html': $(this).attr('name') + ':' + $(this).html() + ' ',
                            }).appendTo($params);
                        });

                    }

                    // вывод вопроса
                    $question.find('scenario').find('atom').each(function () {
                        const $atom = $(this);
                        const html = $atom.html();
                        const type = $atom.attr('type');

                        // обрабатывать картинки и звук
                        if ('image' === type) {
                            $('<img>', {
                                'src': 'data:image/jpeg;charset=utf-8;base64, ' + _this.options.get_data('Images/' + encodeURI(html).substr(1)),
                                'alt': html,
                                'title': html,
                                'width': '100%',
                            }).appendTo(_this.$gameQuestion);
                        } else if ('voice' === type) {
                            $('<audio>', {
                                'src': 'data:audio/mp3;charset=utf-8;base64, ' + _this.options.get_data('Audio/' + encodeURI(html).substr(1)),
                                'controls': true,
                            }).appendTo(_this.$gameQuestion);
                        } else {
                            $('<div>', {
                                'html': html,
                            }).appendTo(_this.$gameQuestion);
                        }
                    });

                    // ответ
                    const $answer = $('<div>', {
                        'html': '<h5>Ответ<h5>',
                    }).appendTo(_this.$gameQuestion);

                    $('<div>', {
                        'class': 'spoiler',
                        'html': $question.find('right')
                            .find('answer')
                            .html(),
                    }).appendTo($answer);
                },
            }).appendTo($tr);
        });
    }
}

export default ContentXml;
