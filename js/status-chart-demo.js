window.addEventListener("load", () => {
    const chartHeight = 400;
    const chartWidth = 1000;
    const cellMinutes = 60;
    const cellWidth = 200;
    const cellHeight = 40;
    const TOOLTIP_BOX_CLS = "sc-tooltip";
    const TOOLTIP_TEXT_CLS = "sc-tooltip-text";
    const container = document.getElementById("sc-container");
    const sc = StatusChart();
    sc.create(container);
    const entityPointEventRender = function (error, canvasElement, containerElement) {
        const divElement = document.createElement("div");
        divElement.style.width = "100%";
        divElement.style.height = "100%";
        divElement.style.backgroundColor = "red";
        containerElement.appendChild(divElement);
    };
    const entityRangeEventRender = function (event, canvasElement, containerElement) {
        const divElement = document.createElement("div");
        divElement.style.backgroundColor = "orange";
        divElement.style.width = "100%";
        divElement.style.height = "100%";
        containerElement.appendChild(divElement);
    };
    const timelinePointEventRender = function (event, canvasElement, containerElement) {
        const divElement = document.createElement("div");
        divElement.style.width = "20px";
        divElement.style.height = "20px";
        divElement.style.backgroundColor = "blue";
        containerElement.appendChild(divElement);
    };
    const globalRangeEventRender = (event, canvasElement, containerElement) => {
        const divElement = document.createElement("div");
        divElement.style.width = "100%";
        divElement.style.height = "100%";
        divElement.style.backgroundColor = "pink";
        divElement.style.opacity = "0.5";
        containerElement.appendChild(divElement);
    };
    sc.setSettings({
        chartStartTime: new Date(Date.parse("2020-01-01T00:00:00")),
        chartEndTime: new Date(Date.parse("2020-01-02T00:00:00")),
        cellMinutes: cellMinutes,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        timelinePointEventRender: timelinePointEventRender,
        entityPointEventRender: entityPointEventRender,
        entityRangeEventRender: entityRangeEventRender,
        globalRangeEventRender: globalRangeEventRender,
        canAutoFit: true,
        hasHorizontalLine: true,
        hasVerticalLine: true,
    });
    sc.setData(window.DEMO_ENTITIES, window.TIMELINE_POINT_EVENTS, window.GLOBAL_RANGE_EVENTS, "Main title", "Sub title", "Timeline title");
    sc.initLayout();
    sc.drawTimelineCanvas();
    sc.drawEntityList();
    sc.drawMainCanvas();
});
