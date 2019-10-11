global.$ = require('jquery');
global.moment = require('moment');
const EventList = require('../src/eventlist')

describe('期間指定イベントの処理', () => {
    let instance;
    beforeEach(() => {
        instance = new EventList()
        instance.currentDate = new Date(2019, 10 - 1, 5)  // set 2019-10-05
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
        expect(instance.eventsForDisplay.length).toBe(6)
        expect(instance.priorityEventsForDisplay.length).toBe(0)
    })
    it('今日以降のイベント（常に上に表示）が配列に追加されていること', () => {
        instance._pushRepeatEvent({
            "id": 1,
            "title": "お米フェア",
            "regularlyClosed": false,
            "startDate": "2019-10-01",
            "endDate": "2019-10-10",
            "repeatDayOfWeek": [],
            "priority": 1
        })
        expect(instance.eventsForDisplay.length).toBe(0)
        expect(instance.priorityEventsForDisplay.length).toBe(6)
    })
    it('今日以降の曜日指定イベントが配列に追加されていること', () => {
        instance._pushRepeatDayOfTheWeekEvent({
            "id": 1,
            "title": "お米フェア",
            "regularlyClosed": false,
            "startDate": "2019-10-01",
            "endDate": "2019-10-10",
            "repeatDayOfWeek": [0, 2, 4],
            "priority": 0
        })
        expect(instance.eventsForDisplay.length).toBe(3)
        expect(instance.priorityEventsForDisplay.length).toBe(0)
    })
    it('今日以降の曜日指定イベント（常に上に表示）が配列に追加されていること', () => {
        instance._pushRepeatDayOfTheWeekEvent({
            "id": 1,
            "title": "お米フェア",
            "regularlyClosed": false,
            "startDate": "2019-10-01",
            "endDate": "2019-10-10",
            "repeatDayOfWeek": [0, 2, 4],
            "priority": 1
        })
        expect(instance.eventsForDisplay.length).toBe(0)
        expect(instance.priorityEventsForDisplay.length).toBe(3)
    })
})
