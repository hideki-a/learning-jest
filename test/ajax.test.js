jest.mock('../src/eventlist');
global.$ = require('jquery')
global.moment = require('moment')
const EventList = require('../src/eventlist')

describe('JSON取得機能', () => {
    let instance
    let json
    beforeEach(async () => {
        instance = new EventList()
        const promise = instance._getJSON()
        json = await promise.done(json => {
            return json;
        })
    })
    it('JSONが取得できること', () => {
        expect(json.events[0].title).toBe('梅干しフェア');
    })
})
