class EventListMock {
    _getJSON() {
        const defer = $.Deferred()
        setTimeout(() => {
            defer.resolve({
                "totalResult": 2,
                "events": [
                    {
                        "id": 1,
                        "title": "梅干しフェア",
                        "startDate": "2030-10-02"
                    },
                    {
                        "id": 2,
                        "title": "お米フェア",
                        "startDate": "2030-10-01"
                    }
                ]
            })
        }, 1500)
        return defer.promise()
    }
}

module.exports = EventListMock
