function EventList(calendarElemId, eventDataURL, dispDays, onlyFirstTimeHeld) {
    this.$elem = $('#' + calendarElemId);
    this.currentDate = (function () {
        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const date = dateObj.getDate();
        return new Date(year, month, date);
    }());
    this.eventData = null;
    this.closedDate = [];
    this.priorityEventsForDisplay = [];
    this.eventsForDisplay = [];
    this.eventDataURL = eventDataURL;
    this.dispDays = dispDays ? dispDays : 3;
    this.onlyFirstTimeHeld = onlyFirstTimeHeld ? onlyFirstTimeHeld : false;
}

EventList.prototype = {
    _sanitize: function (str) {
        return str.replace(/<(|\/|[^>\/bi]|\/[^>bi]|[^\/>][^>]+|\/[^>][^>]+)>/g, '');
    },

    _eventHTML: function (event) {
        let html = '';
        const dateAttr = '?date=' + moment(event.startDate).format('YYYYMMDD');

        html += '<div class="event">';
        html += '    <a href="' + event.permalink + dateAttr + '" class="event__link">';
        html += '        <div class="event__title">';
        html += '            ' + moment(event.startDate).format('YYYY年MM月DD日') + ' ' + event.title;
        html += '        </div>';
        html += '    </a>';
        html += '</div>';

        return html;
    },

    _pushRepeatDayOfTheWeekEvent: function (event) {
        const checkDate = moment(event.startDate);
        // 開始日から終了日まで1日ずつチェックする
        while (checkDate.isSameOrBefore(event.endDate)) {
            if (event.repeatDayOfWeek.indexOf(checkDate.day()) > -1) {
                // 曜日がマッチ
                if (checkDate.isSameOrAfter(this.currentDate)) {
                    // 開始日が今日以降
                    const dateStr = checkDate.format('YYYYMMDD');
                    if (this.closedDate.indexOf(dateStr) > -1) {
                        // 定休日の場合
                        // Void
                    } else {
                        const tempEvent = $.extend({}, event);
                        tempEvent.startDate = checkDate.format('YYYY-MM-DD');
                        if (event.priority) {
                            this.priorityEventsForDisplay.push(tempEvent);
                        } else {
                            this.eventsForDisplay.push(tempEvent);
                        }
                    }
                    if (this.onlyFirstTimeHeld) {
                        break;
                    }
                }
            }
            checkDate.add(1, 'day');
        }
    },

    _pushRepeatEvent: function (event) {
        const checkDate = moment(event.startDate);
        // 開始日から終了日まで1日ずつチェックする
        while (checkDate.isSameOrBefore(event.endDate)) {
            if (checkDate.isSameOrAfter(this.currentDate)) {
                const dateStr = checkDate.format('YYYYMMDD');
                if (this.closedDate.indexOf(dateStr) > -1) {
                    // 定休日の場合
                    // Void
                } else {
                    const tempEvent = $.extend({}, event);
                    tempEvent.startDate = checkDate.format('YYYY-MM-DD');
                    if (event.priority) {
                        this.priorityEventsForDisplay.push(tempEvent);
                    } else {
                        this.eventsForDisplay.push(tempEvent);
                    }
                    if (this.onlyFirstTimeHeld) {
                        break;
                    }
                }
            }
            checkDate.add(1, 'day');
        }
    },

    _pushClosedDate: function (event) {
        if (moment(event.endDate).isSameOrAfter(this.currentDate)) {
            // 終了日が今日以降
            if (event.repeatDayOfWeek.length) {
                // 曜日指定
                const checkDate = moment(event.startDate);
                // 開始日から終了日まで1日ずつチェックする
                while (checkDate.isSameOrBefore(event.endDate)) {
                    if (event.repeatDayOfWeek.indexOf(checkDate.day()) > -1) {
                        // 曜日がマッチ
                        if (checkDate.isSameOrAfter(this.currentDate)) {
                            const tempEvent = $.extend({}, event);
                            tempEvent.startDate = checkDate.format('YYYYMMDD');
                            this.closedDate.push(tempEvent.startDate);
                        }
                    }
                    checkDate.add(1, 'day');
                }
            } else {
                // 期間が連続した店休日もしくは当日のみ
                const checkDate = moment(event.startDate);
                // 開始日から終了日まで1日ずつチェックする
                while (checkDate.isSameOrBefore(event.endDate)) {
                    if (checkDate.isSameOrAfter(this.currentDate)) {
                        // 開始日が今日以降
                        const tempEvent = $.extend({}, event);
                        tempEvent.startDate = checkDate.format('YYYYMMDD');
                        this.closedDate.push(tempEvent.startDate);
                    }
                    checkDate.add(1, 'day');
                }
            }
        } else if (moment(event.startDate).isSameOrAfter(this.currentDate)) {
            // 1日限り・終了日指定なしの店休日
            let dowCheck = false;
            if (event.repeatDayOfWeek.length === 0) {
                dowCheck = true;
            } else {
                const startDateDow = moment(event.startDate).day();
                if (event.repeatDayOfWeek.indexOf(startDateDow) > -1) {
                    dowCheck = true;
                }
            }
            if (dowCheck) {
                this.closedDate.push(event.startDate.replace(/\-/g, ''));
            }
        }
    },

    _loadEvents: function () {
        const self = this;
        this.eventData.events.forEach(function (event) {
            if (event.regularlyClosed) {
                self._pushClosedDate(event);
            }
        });
        this.eventData.events.forEach(function (event) {
            if (!event.regularlyClosed) {
                // 定休日でない場合に処理を実行
                if (moment(event.endDate).isSameOrAfter(self.currentDate)) {
                    // 終了日が今日以降
                    if (event.repeatDayOfWeek.length) {
                        // 曜日指定
                        self._pushRepeatDayOfTheWeekEvent(event);
                    } else {
                        // 期間が連続したイベントもしくは当日のみのイベント
                        self._pushRepeatEvent(event);
                    }
                } else if (moment(event.startDate).isSameOrAfter(self.currentDate)) {
                    // 1日限り・終了日指定なしのイベント
                    let dowCheck = false;
                    if (event.repeatDayOfWeek.length === 0) {
                        dowCheck = true;
                    } else {
                        const startDateDow = moment(event.startDate).day();
                        if (event.repeatDayOfWeek.indexOf(startDateDow) > -1) {
                            dowCheck = true;
                        }
                    }
                    if (dowCheck) {
                        const dateStr = event.startDate.replace(/\-/g, '');
                        if (self.closedDate.indexOf(dateStr) > -1) {
                            // 定休日の場合
                            // Void
                        } else {
                            if (event.priority) {
                                self.priorityEventsForDisplay.push(event);
                            } else {
                                self.eventsForDisplay.push(event);
                            }
                        }
                    }
                }
            }
        });
    },

    _sortEvent: function (events) {
        return events.sort(function (a, b) {
            if (a.startDate > b.startDate) return 1;
            if (a.startDate < b.startDate) return -1;
            if (a.id < b.id) return 1;
            if (a.id > b.id) return -1;
            return 0;
        });
    },

    _dispList: function () {
        const self = this;
        let appendHTML = '';
        let counter = 0;
        const priorityEvents = this._sortEvent(this.priorityEventsForDisplay);
        const events = this._sortEvent(this.eventsForDisplay);
        priorityEvents.forEach(function (event) {
            if (counter < self.dispDays) {
                appendHTML += self._eventHTML(event);
            }
            counter += 1;
        });
        events.forEach(function (event) {
            if (counter < self.dispDays) {
                appendHTML += self._eventHTML(event);
            }
            counter += 1;
        });
        this.$elem.html(appendHTML);
    },

    init: function () {
        // 初期化
        const self = this;
        const date = new Date();
        const dateSerial = date.getTime();

        $.ajax({
            url: this.eventDataURL + '?time=' + dateSerial,
            dataType: 'json'
        }).done(function (json) {
            self.eventData = json;
            self._loadEvents();
            self._dispList();
        });
    }
};

module.exports = EventList;
