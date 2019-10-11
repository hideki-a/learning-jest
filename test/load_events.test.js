global.$ = require('jquery')
global.moment = require('moment')
const EventList = require('../src/eventlist')

describe('イベントロード処理', () => {
    let instance;
    beforeEach(() => {
        instance = new EventList()
        instance.currentDate = new Date(2019, 10 - 1, 5)  // set 2019-10-05
    })
    it('曜日指定のイベント', () => {
        instance.eventData = {
            events: [
                {
                    "id": 1,
                    "title": "お米フェア",
                    "regularlyClosed": false,
                    "startDate": "2019-10-01",
                    "endDate": "2019-10-10",
                    "repeatDayOfWeek": [2, 4],
                    "priority": 0
                }
            ]
        }
        instance._loadEvents()
        expect(instance.eventsForDisplay.length).toBe(2)
    })
    it('期間指定のイベント', () => {
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
        expect(instance.eventsForDisplay.length).toBe(6)
    })
    it('当日のイベント', () => {
        instance.eventData = {
            events: [
                {
                    "id": 1,
                    "title": "お米フェア",
                    "regularlyClosed": false,
                    "startDate": "2019-10-05",
                    "endDate": null,
                    "repeatDayOfWeek": [],
                    "priority": 0
                }
            ]
        }
        instance._loadEvents()
        expect(instance.eventsForDisplay.length).toBe(1)
    })
    it('当日のイベント（常に上に表示）', () => {
        instance.eventData = {
            events: [
                {
                    "id": 1,
                    "title": "お米フェア",
                    "regularlyClosed": false,
                    "startDate": "2019-10-05",
                    "endDate": null,
                    "repeatDayOfWeek": [],
                    "priority": 1
                }
            ]
        }
        instance._loadEvents()
        expect(instance.eventsForDisplay.length).toBe(0)
        expect(instance.priorityEventsForDisplay.length).toBe(1)
    })
    it('当日のイベント（曜日指定）', () => {
        instance.eventData = {
            events: [
                {
                    "id": 1,
                    "title": "お米フェア",
                    "regularlyClosed": false,
                    "startDate": "2019-10-05",
                    "endDate": null,
                    "repeatDayOfWeek": [6],
                    "priority": 0
                }
            ]
        }
        instance._loadEvents()
        expect(instance.eventsForDisplay.length).toBe(1)
    })
    it('当日のイベント（曜日が不正）', () => {
        instance.eventData = {
            events: [
                {
                    "id": 1,
                    "title": "お米フェア",
                    "regularlyClosed": false,
                    "startDate": "2019-10-05",
                    "endDate": null,
                    "repeatDayOfWeek": [0],
                    "priority": 0
                }
            ]
        }
        instance._loadEvents()
        expect(instance.eventsForDisplay.length).toBe(0)
    })
    it('当日のイベント（定休日と一致）', () => {
        instance.eventData = {
            events: [
                {
                    "id": 1,
                    "title": "定休日",
                    "regularlyClosed": true,
                    "startDate": "2019-10-01",
                    "endDate": "2019-10-31",
                    "repeatDayOfWeek": [6],
                    "priority": 0
                },
                {
                    "id": 1,
                    "title": "お米フェア",
                    "regularlyClosed": false,
                    "startDate": "2019-10-05",
                    "endDate": null,
                    "repeatDayOfWeek": [],
                    "priority": 0
                }
            ]
        }
        instance._loadEvents()
        expect(instance.eventsForDisplay.length).toBe(0)
    })
})
