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

var listDatasource = [
    { id: 1, value: "H34A2900001" },
    { id: 2, value: "H34A2900002" },
    { id: 3, value: "H34A2900003" },
    { id: 4, value: "H34A2900004" },
    { id: 5, value: "H34A2900005" },
    { id: 6, value: "H34A2900006" },
    { id: 7, value: "H34A2900007" },
    { id: 8, value: "H34A2900008" },
    { id: 9, value: "H34A2900009" },
    { id: 10, value: "H34A2900010" },
    { id: 11, value: "H34A2900011" },
    { id: 12, value: "H34A2900012" },
    { id: 13, value: "H34A2900013" },
    { id: 14, value: "H34A2900014" },
    { id: 15, value: "H34A2900015" },
    { id: 16, value: "H34A2900016" },
];


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

var entityLines = [
    {
        id: 1,
        events: [
            { type: 1, start: 0, end: 60 },
            { type: 2, start: 60, end: 120 },
            { type: 3, start: 140, end: 160 },
            { type: 1, start: 60 * 22, end: 60 * 23 },
            { type: 3, start: 60 * 23, end: 60 * 24 },
        ]
    },
    {
        id: 3,
        events: [
            { type: 1, start: 60, end: 160 },
        ]
    },
    {
        id: 4,
        events: [
            { type: 2, start: 10, end: 60 },
            { type: 3, start: 120, end: 240 },
        ]
    },
    {
        id: 5,
        events: [
            { type: 1, start: 60 * 22, end: 60 * 23 },
            { type: 3, start: 60 * 23, end: 60 * 24 },
        ]
    }


]

