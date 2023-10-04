var DEMO_ENTITIES: Entity[] = [
    {
        id: 1,
        name: "Entity #1",
        pointEvents: [
            { time: new Date(Date.parse("2020-01-01T01:00:00")) },
            { time: new Date(Date.parse("2020-01-01T01:30:00")) },
        ],

        rangeEvents: [
            {
                start: new Date(Date.parse("2020-01-01T02:00:00")),
                end: new Date(Date.parse("2020-01-01T03:00:00")),
            },
            {
                start: new Date(Date.parse("2020-01-01T03:30:00")),
                end: new Date(Date.parse("2020-01-01T04:30:00")),
            }
        ]
    },
    {
        id: 2,
        name: "Entity #2",
    },
    {
        id: 3,
        name: "Entity #3",
    },
    {
        id: 4,
        name: "Entity #4",
    },
    {
        id: 5,
        name: "Entity #5",
    },
    {
        id: 6,
        name: "Entity #6",
    },
    {
        id: 7,
        name: "Entity #7",
    },
    {
        id: 8,
        name: "Entity #8",
    },
    {
        id: 9,
        name: "Entity #9",
    },
    {
        id: 10,
        name: "Entity #10",
    },
]

var TIMELINE_POINT_EVENTS: PointEvent[] = [
    { time: new Date(Date.parse("2020-01-01T01:00:00")) },
    { time: new Date(Date.parse("2020-01-01T01:30:00")) },
];

var GLOBAL_RANGE_EVENTS: RangeEvent[] = [
    {
        start: new Date(Date.parse("2020-01-01T01:00:00")),
        end: new Date(Date.parse("2020-01-01T02:30:00")),
    },
    {
        start: new Date(Date.parse("2020-01-01T03:00:00")),
        end: new Date(Date.parse("2020-01-01T04:30:00")),
    }
];