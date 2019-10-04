global.$ = require('jquery');
global.moment = require('moment');
const EventList = require('../src/eventlist')

describe('期間指定イベントの処理', () => {
    let instance;
    beforeEach(() => {
        instance = new EventList();
    })
    it('今日以降のイベントが配列に追加されていること', () => {
        instance._pushRepeatEvent({
            "id": 1,
            "title": "お米フェア",
            "regularlyClosed": false,
            "startDate": "2019-10-01",
            "endDate": "2019-10-10",
            "repeatDayOfWeek": [],
            "priority": 0
        })
        expect((() => {
            let result = true
            const today = new Date()
            const todayInfoArray = [today.getFullYear(), today.getMonth(), today.getDate()]
            instance.eventsForDisplay.forEach((event) => {
                if (moment(event.startDate).isBefore(todayInfoArray)) {
                    result = false
                }
            })
            return result
        })()).toBeTruthy()
    })
})
