var leftLegendDatasource = [
    { color: "#92d050", value: "Op 10" },
    { color: "#00b0f0", value: "Op 20" },
    { color: "#ffc000", value: "Op 30" },
    { color: "#7030a0", value: "Op 40" },
    { color: "#5a6cf9", value: "Op 50" }
];
var rightLegendDatasource = [
    { color: "#d9d9d9", value: "계획정지" },
    { color: "#7f7f7f", value: "비가동" },
    { color: "#cc00ff", value: "네트워크이상" },
    { color: "#081fda", value: "바코드누락" },
    { icon: "asset/image/warning.png", value: "설비이상" },
    { icon: "asset/image/error.png", value: "품질이상" },
];

var entities = [
    {
        id: 1,
        name: "H34A2900001",
        events: [
            {
                type: 1,
                start: new Date(Date.parse("2020-01-01T01:00:00")),
                end: new Date(Date.parse("2020-01-01T03:00:00")),
            },
            {
                type: 2,
                start: new Date(Date.parse("2020-01-01T03:00:00")),
                end: new Date(Date.parse("2020-01-01T04:00:00")),
            },
            {
                type: 3,
                start: new Date(Date.parse("2020-01-01T06:00:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
            },
        ]
    },
    {
        id: 2,
        name: "H34A2900002",
        events: [
            {
                type: 3,
                start: new Date(Date.parse("2020-01-01T06:00:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
            },
        ]
    },
    {
        id: 3,
        name: "H34A2900003",
        events: [
            {
                type: 3,
                start: new Date(Date.parse("2020-01-01T03:00:00")),
                end: new Date(Date.parse("2020-01-01T04:00:00")),
            },
            {
                type: 2,
                start: new Date(Date.parse("2020-01-01T06:00:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
            },
        ]
    },
    {
        id: 4,
        name: "H34A2900004",
        events: [
            {
                type: 3,
                start: new Date(Date.parse("2020-01-01T03:00:00")),
                end: new Date(Date.parse("2020-01-01T04:00:00")),
            },
            {
                type: 1,
                start: new Date(Date.parse("2020-01-01T04:30:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
            },
        ]
    },
    { id: 5, name: "H34A2900005" },
    { id: 6, name: "H34A2900006" },
    { id: 7, name: "H34A2900007" },
    { id: 8, name: "H34A2900008" },
    { id: 9, name: "H34A2900009" },
    { id: 10, name: "H34A2900010" },
    { id: 11, name: "H34A2900011" },
    { id: 12, name: "H34A2900012" },
    { id: 13, name: "H34A2900013" },
    { id: 14, name: "H34A2900014" },
    { id: 15, name: "H34A2900015" },
    { id: 16, name: "H34A2900016" },

]



var timelineHeaders = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
];