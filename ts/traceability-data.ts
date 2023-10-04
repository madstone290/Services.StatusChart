var leftLegendDatasource = [
    { color: "#92d050", label: "Op 10" },
    { color: "#00b0f0", label: "Op 20" },
    { color: "#ffc000", label: "Op 30" },
    { color: "#7030a0", label: "Op 40" },
    { color: "#5a6cf9", label: "Op 50" }
];
var rightLegendDatasource = [
    { color: "#d9d9d9", label: "계획정지" },
    { color: "#7f7f7f", label: "비가동" },
    { color: "#cc00ff", label: "네트워크이상" },
    { color: "#081fda", label: "바코드누락" },
    { icon: "asset/image/warning.png", label: "설비이상" },
    { icon: "asset/image/error.png", label: "품질이상" },
];

var entities: BarcodeEntity[] = [
    {
        id: 1,
        name: "H34A2900001",
        pointEvents: [
            {
                type: 1,
                description: "불량품",
                time: new Date(Date.parse("2020-01-01T01:30:00")),
            },
            {
                type: 2,
                description: "도색불량",
                time: new Date(Date.parse("2020-01-01T02:00:00")),
            }
        ],
        rangeEvents: [
            {
                type: "op10",
                start: new Date(Date.parse("2020-01-01T01:00:00")),
                end: new Date(Date.parse("2020-01-01T03:00:00")),
            },
            {
                type: "op20",
                start: new Date(Date.parse("2020-01-01T03:00:00")),
                end: new Date(Date.parse("2020-01-01T04:00:00")),
            },
            {
                type: "op30",
                start: new Date(Date.parse("2020-01-01T06:00:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
            },
        ]
    },
    {
        id: 2,
        name: "H34A2900002",
        rangeEvents: [
            {
                type: "op10",
                start: new Date(Date.parse("2020-01-01T06:00:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
            },
        ],
        pointEvents: [
            {
                type: 1,
                description: "불량품 2시",
                time: new Date(Date.parse("2020-01-01T02:00:00")),
            },
            {
                type: 2,
                description: "도색불량 3시",
                time: new Date(Date.parse("2020-01-01T03:00:00")),
            }
        ]
    },
    {
        id: 3,
        name: "H34A2900003",
        rangeEvents: [
            {
                type: "op10",
                start: new Date(Date.parse("2020-01-01T03:00:00")),
                end: new Date(Date.parse("2020-01-01T04:00:00")),
            },
            {
                type: "op20",
                start: new Date(Date.parse("2020-01-01T06:00:00")),
                end: new Date(Date.parse("2020-01-01T07:00:00")),
            },
        ]
    },
    {
        id: 4,
        name: "H34A2900004",
        rangeEvents: [
            {
                type: "op30",
                start: new Date(Date.parse("2020-01-01T22:00:00")),
                end: new Date(Date.parse("2020-01-01T23:00:00")),
            },
            {
                type: "op40",
                start: new Date(Date.parse("2020-01-01T23:00:00")),
                end: new Date(Date.parse("2020-01-01T23:50:00")),
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
    { id: 17, name: "H34A2900017" },
    { id: 18, name: "H34A2900018" },
    { id: 19, name: "H34A2900019" },
    { id: 20, name: "H34A2900020" },
]

var machineErrors: MachineError[] = [
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
    }
];

var machineEvents: MachineGlobalRangeEvent[] = [
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
    }

]
