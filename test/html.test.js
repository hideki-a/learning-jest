global.$ = require('jquery')
global.moment = require('moment')
const EventList = require('../src/eventlist')

describe('HTMLの処理', () => {
    let instance;
    document.body.innerHTML = '<div id="test"></div>'
    beforeEach(() => {
        instance = new EventList('test', null, 5)
        instance.currentDate = new Date(2019, 10 - 1, 5)  // set 2019-10-05
    })
    it('HTMLが正しく生成されていること', () => {
        const html = instance._eventHTML({
            "id": 1,
            "title": "お米フェア",
            "regularlyClosed": false,
            "startDate": "2019-10-01",
            "endDate": "2019-10-10",
            "repeatDayOfWeek": [],
            "permalink": "/event/rice.html",
            "priority": 0
        })
        const expectHTML = '<div class="event">' +
            '    <a href="/event/rice.html?date=20191001" class="event__link">' +
            '        <div class="event__title">' +
            '            2019年10月01日 お米フェア' +
            '        </div>' +
            '    </a>' +
            '</div>'
        expect(html).toBe(expectHTML)
    })
    it('イベントがDOMに正しく追加されていること', () => {
        instance.eventData = {
            events: [
                {
                    "id": 1,
                    "title": "お米フェア",
                    "regularlyClosed": false,
                    "startDate": "2019-10-01",
                    "endDate": "2019-10-10",
                    "repeatDayOfWeek": [],
                    "priority": 0
                }
            ]
        }
        instance._loadEvents()
        instance._dispList()
        expect($('#test .event').length).toBe(5)
    })
})
