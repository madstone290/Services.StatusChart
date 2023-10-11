var leftLegendDatasource = [
    { color: "#92d050", label: "Op 10" },
    { color: "#00b0f0", label: "Op 20" },
    { color: "#ffc000", label: "Op 30" },
    { color: "#7030a0", label: "Op 40" },
    { color: "#f2460d", label: "Op 50" }
];
var rightLegendDatasource = [
    { color: "#d9d9d9", label: "계획정지" },
    { color: "#7f7f7f", label: "비가동" },
    { color: "#cc00ff", label: "네트워크이상" },
    { color: "#081fda", label: "바코드누락" },
    { icon: "./asset/image/warning.png", label: "설비이상" },
    { icon: "./asset/image/error.png", label: "품질이상" },
];
var barcodeEntities = [
    {
        id: 1,
        name: "H34A2900001",
        barcodeNumber: "H34A2900001",
        productNumber: "00123H1",
        pointEvents: [
            {
                description: "불량품",
                time: new Date(Date.parse("2020-01-01T01:30:00")),
                entityId: 1,
            },
            {
                description: "도색불량",
                time: new Date(Date.parse("2020-01-01T02:45:00")),
                entityId: 1,
            }
        ],
        rangeEvents: [
            {
                type: "op10",
                start: new Date(Date.parse("2020-01-01T01:30:50")),
                end: new Date(Date.parse("2020-01-01T02:45:00")),
                entityId: 1,
            },
            {
                type: "op20",
                start: new Date(Date.parse("2020-01-01T03:00:00")),
                end: new Date(Date.parse("2020-01-01T04:05:00")),
                entityId: 1,
            },
            {
                type: "op30",
                start: new Date(Date.parse("2020-01-01T06:00:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
                entityId: 1,
            },
        ],
    },
    {
        id: 2,
        name: "H34A2900002",
        barcodeNumber: "H34A2900002",
        productNumber: "00123H2",
        rangeEvents: [
            {
                type: "op10",
                start: new Date(Date.parse("2020-01-01T06:00:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
                entityId: 2,
            },
        ],
        pointEvents: [
            {
                description: "불량품",
                time: new Date(Date.parse("2020-01-01T02:00:00")),
                entityId: 2,
            },
            {
                description: "도색불량",
                time: new Date(Date.parse("2020-01-01T03:00:00")),
                entityId: 2,
            }
        ]
    },
    {
        id: 3,
        name: "H34A2900003",
        barcodeNumber: "H34A2900003",
        productNumber: "00123H3",
        rangeEvents: [
            {
                type: "op10",
                start: new Date(Date.parse("2020-01-01T03:15:00")),
                end: new Date(Date.parse("2020-01-01T04:15:00")),
                entityId: 3,
            },
            {
                type: "op20",
                start: new Date(Date.parse("2020-01-01T06:00:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
                entityId: 3,
            },
        ],
    },
    {
        id: 4,
        name: "H34A2900004",
        barcodeNumber: "H34A2900004",
        productNumber: "00123H4",
        rangeEvents: [
            {
                type: "op30",
                start: new Date(Date.parse("2020-01-01T22:00:00")),
                end: new Date(Date.parse("2020-01-01T23:00:00")),
                entityId: 4,
            },
            {
                type: "op40",
                start: new Date(Date.parse("2020-01-01T23:00:00")),
                end: new Date(Date.parse("2020-01-01T23:50:00")),
                entityId: 4,
            },
        ]
    },
    {
        id: 5,
        name: "H34A2900005",
        barcodeNumber: "H34A2900005",
        productNumber: "00123H5",
        rangeEvents: [
            {
                type: "op50",
                start: new Date(Date.parse("2020-01-01T04:10:00")),
                end: new Date(Date.parse("2020-01-01T04:25:00")),
                entityId: 5,
            },
            {
                type: "op20",
                start: new Date(Date.parse("2020-01-01T00:10:00")),
                end: new Date(Date.parse("2020-01-01T01:20:00")),
                entityId: 5,
            },
        ],
        pointEvents: [
            {
                description: "불량품",
                time: new Date(Date.parse("2019-12-31T22:00:00")),
                entityId: 5,
            },
            {
                description: "도색불량",
                time: new Date(Date.parse("2020-01-01T02:45:12")),
                entityId: 5,
            }
        ]
    },
    { id: 6, name: "H34A2900006" },
    { id: 7, name: "H34A2900007" },
    { id: 8, name: "H34A2900008" },
    {
        id: 9,
        name: "H34A2900009",
        barcodeNumber: "H34A2900009",
        productNumber: "00123H9",
        pointEvents: [
            {
                description: "불량품",
                time: new Date(Date.parse("2020-01-01T10:09:52")),
                entityId: 9,
            },
        ]
    },
    { id: 10, name: "H34A2900010" },
    { id: 11, name: "H34A2900011" },
    { id: 12, name: "H34A2900012" },
    {
        id: 13,
        name: "H34A2900013",
        barcodeNumber: "H34A2900013",
        productNumber: "00123H13",
        rangeEvents: [
            {
                type: "op30",
                start: new Date(Date.parse("2020-01-01T06:10:01")),
                end: new Date(Date.parse("2020-01-01T06:26:03")),
                entityId: 13,
            },
        ],
    },
    { id: 14, name: "H34A2900014" },
    {
        id: 15,
        name: "H34A2900015",
        barcodeNumber: "H34A2900015",
        productNumber: "00123H15",
        rangeEvents: [
            {
                type: "op10",
                start: new Date(Date.parse("2020-01-01T12:16:16")),
                end: new Date(Date.parse("2020-01-01T13:52:20")),
                entityId: 15,
            },
        ],
    },
    { id: 16, name: "H34A2900016" },
    { id: 17, name: "H34A2900017" },
    { id: 18, name: "H34A2900018" },
    { id: 19, name: "H34A2900019" },
    { id: 20, name: "H34A2900020" },
];
var machinePointEvents = [
    {
        id: 1,
        description: "서보모터 이상",
        time: new Date(Date.parse("2020-01-01T01:30:00")),
    },
    {
        id: 2,
        description: "냉각기 이상",
        time: new Date(Date.parse("2020-01-01T02:30:00")),
    },
    {
        id: 3,
        description: "온수기 이상",
        time: new Date(Date.parse("2020-01-01T03:00:00")),
    },
    {
        id: 4,
        description: "냉각기 이상",
        time: new Date(Date.parse("2020-01-01T03:02:00")),
    },
    {
        id: 5,
        description: "Test Error Test Error Test Error Test Error",
        time: new Date(Date.parse("2020-01-01T22:00:00")),
    },
    {
        id: 6,
        description: "온수기 이상",
        time: new Date(Date.parse("2020-01-01T21:29:25")),
    },
];
var machineRangeEvents = [
    {
        type: "pause",
        description: "계획정지 00:30~03:30",
        start: new Date(Date.parse("2020-01-01T00:30:00")),
        end: new Date(Date.parse("2020-01-01T03:30:00")),
    },
    {
        type: "barcodeMissing",
        description: "바코드 누락 04:00~04:30",
        start: new Date(Date.parse("2020-01-01T04:00:00")),
        end: new Date(Date.parse("2020-01-01T04:30:00")),
    },
    {
        type: "networkError",
        description: "네트워크 이상 05:30~06:30",
        start: new Date(Date.parse("2020-01-01T05:30:00")),
        end: new Date(Date.parse("2020-01-01T06:30:00")),
    },
    {
        type: "networkError",
        description: "네트워크 이상 22:30~23:30",
        start: new Date(Date.parse("2020-01-01T22:30:00")),
        end: new Date(Date.parse("2020-01-01T23:30:00")),
    },
    {
        type: "fault",
        description: "비가동",
        start: new Date(Date.parse("2020-01-01T08:10:20")),
        end: new Date(Date.parse("2020-01-01T08:43:00")),
    },
    {
        type: "barcodeMissing",
        description: "바코드 누락",
        start: new Date(Date.parse("2020-01-01T15:58:53")),
        end: new Date(Date.parse("2020-01-01T17:12:42")),
    },
];
