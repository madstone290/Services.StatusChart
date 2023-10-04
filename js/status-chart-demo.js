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
    const entityPointEventRender = (error) => {
        const divElement = document.createElement("div");
        divElement.style.width = "45px";
        divElement.style.height = "45px";
        divElement.style.backgroundColor = "red";
        return divElement;
    };
    const entityRangeEventRender = (event, canvasEl, containerEl) => {
        const divElement = document.createElement("div");
        divElement.style.backgroundColor = "orange";
        return divElement;
    };
    const timelinePointEventRender = (error) => {
        const divElement = document.createElement("div");
        divElement.style.width = "20px";
        divElement.style.height = "20px";
        divElement.style.backgroundColor = "blue";
        return divElement;
    };
    const globalRangeEventRender = (event, canvasEl, containerEl) => {
        const divElement = document.createElement("div");
        divElement.style.width = "200px";
        divElement.style.height = "200px";
        divElement.style.backgroundColor = "pink";
        divElement.style.opacity = "0.5";
        return divElement;
    };
    sc.setSettings(new Date(Date.parse("2020-01-01T00:00:00")), new Date(Date.parse("2020-01-02T00:00:00")), cellMinutes, cellWidth, cellHeight, timelinePointEventRender, entityPointEventRender, entityRangeEventRender, globalRangeEventRender, true, true, false);
    sc.setData(window.DEMO_ENTITIES, window.TIMELINE_POINT_EVENTS, window.GLOBAL_RANGE_EVENTS, "XXX H/L LH Line 03", "Serial No.", "Time Line");
    sc.initLayout();
    sc.drawTimelineCanvas();
    sc.drawEntityList();
    sc.drawMainCanvas();
});
