var DEMO_ENTITIES: Entity[] = [
    {
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
        name: "Entity #2",
    },
    {
        name: "Entity #3",
    },
    {
        name: "Entity #4",
    },
    {
        name: "Entity #5",
    },
    {
        name: "Entity #6",
    },
    {
        name: "Entity #7",
    },
    {
        name: "Entity #8",
    },
    {
        name: "Entity #9",
    },
    {
        name: "Entity #10",
    },
    {
        name: "Entity #11",
    },
    {
        name: "Entity #12",
    },
    {
        name: "Entity #13",
    },
    {
        name: "Entity #14",
    },
    {
        name: "Entity #15",
    },
    {
        name: "Entity #16",
    },
    {
        name: "Entity #17",
    },
    {
        name: "Entity #18",
    },
    {
        name: "Entity #19",
    },
    {
        name: "Entity #20",
    },
    {
        name: "Entity #21",
    },
    {
        name: "Entity #22",
    },
]

var TIMELINE_POINT_EVENTS: PointEvent[] = [
    { time: new Date(Date.parse("2020-01-01T01:00:00")) },
    { time: new Date(Date.parse("2020-01-01T01:30:00")) },
];

var GLOBAL_RANGE_EVENTS: RangeEvent[] = [
    {
        start: new Date(Date.parse("2020-01-01T01:00:00")),
        end: new Date(Date.parse("2020-01-01T02:00:00")),
    },
    {
        start: new Date(Date.parse("2020-01-01T03:00:00")),
        end: new Date(Date.parse("2020-01-01T05:30:00")),
    }
];