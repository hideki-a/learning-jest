global.$ = require('jquery');
global.moment = require('moment');
const EventList = require('../src/eventlist')

describe('ソート機能', () => {
    let instance;
    beforeEach(() => {
        instance = new EventList();
    })
    it('日付の昇順でソートされること', () => {
        const events = instance._sortEvent([
            {
                "id": 1,
                "title": "梅干しフェア",
                "startDate": "2019-10-02",
            },
            {
                "id": 2,
                "title": "お米フェア",
                "startDate": "2019-10-01",
            }
        ])
        expect(events[0].id).toBe(2);
    })
    it('日付の昇順・IDの降順でソートされること', () => {
        const events = instance._sortEvent([
            {
                "id": 1,
                "title": "梅干しフェア",
                "startDate": "2019-10-03",
            },
            {
                "id": 2,
                "title": "お米フェア",
                "startDate": "2019-10-01",
            },
            {
                "id": 21,
                "title": "野菜フェア",
                "startDate": "2019-10-01",
            },
            {
                "id": 4,
                "title": "野菜フェア",
                "startDate": "2019-10-01",
            }
        ])
        expect(events[0].id).toBe(21);
        expect(events[1].id).toBe(4);
        expect(events[2].id).toBe(2);
        expect(events[3].id).toBe(1);
    })
})
