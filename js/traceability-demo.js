window.addEventListener("load", () => {
    const CLS_TOOLTIP = "tr-tooltip";
    const entityRangeEventColors = new Map([
        ["op10", "orange"],
        ["op20", "green"],
        ["op30", "blue"],
        ["op40", "yellow"],
        ["op50", "purple"]
    ]);
    const globalRangeEventColors = new Map([
        ["pause", "gray"],
        ["fault", "blue"],
        ["barcodeMissing", "blue"],
        ["networkError", "purple"]
    ]);
    const cellMinutes = 60;
    const cellWidth = 200;
    const cellHeight = 40;
    const tr = Traceability();
    tr.setup();
    tr.setData(window.leftLegendDatasource, window.rightLegendDatasource);
    tr.drawLegend();
    const sc = StatusChart();
    sc.create(document.getElementById("sc-container"));
    const relocateTooltip = function (tooltipElement, e) {
        const tooltipOffset = 10;
        let top = e.clientY + tooltipOffset;
        let left = e.clientX + tooltipOffset;
        if (window.innerWidth < e.clientX + tooltipElement.offsetWidth + tooltipOffset) {
            left = window.innerWidth - tooltipElement.offsetWidth - tooltipOffset;
        }
        if (window.innerHeight < e.clientY + tooltipElement.offsetHeight + tooltipOffset) {
            top = window.innerHeight - tooltipElement.offsetHeight - tooltipOffset;
        }
        tooltipElement.style.visibility = "visible";
        tooltipElement.style.opacity = "1";
        tooltipElement.style.top = top + "px";
        tooltipElement.style.left = left + "px";
    };
    const entityPointEventRender = function (error, canvasElement, containerElement) {
        const imgElement = document.createElement("img");
        imgElement.style.width = "20px";
        imgElement.style.height = "20px";
        imgElement.src = "asset/image/error.png";
        containerElement.appendChild(imgElement);
        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(CLS_TOOLTIP);
        tooltipElement.style.zIndex = "100";
        tooltipElement.innerText = "desc: " + error.description;
        canvasElement.appendChild(tooltipElement);
        imgElement.addEventListener("mousemove", (e) => {
            if (e.target !== imgElement)
                return;
            relocateTooltip(tooltipElement, e);
        });
        imgElement.onmouseleave = (e) => {
            tooltipElement.style.visibility = "hidden";
            tooltipElement.style.opacity = "0";
        };
    };
    const entityRangeEventRender = function (event, canvasElement, containerElement) {
        const boxElement = document.createElement("div");
        containerElement.appendChild(boxElement);
        boxElement.style.width = "100%";
        boxElement.style.height = "100%";
        boxElement.style.backgroundColor = entityRangeEventColors.get(event.type);
        const tooltipElement = document.createElement("div");
        canvasElement.appendChild(tooltipElement);
        tooltipElement.style.zIndex = "100";
        tooltipElement.classList.add(CLS_TOOLTIP);
        const typeElement = document.createElement("div");
        typeElement.innerText = event.type;
        tooltipElement.appendChild(typeElement);
        const descElement = document.createElement("div");
        descElement.innerText = event.description;
        tooltipElement.appendChild(descElement);
        // TODO: add time format service
        const timeElement = document.createElement("div");
        timeElement.innerText = event.start.toString() + " ~ " + event.end.toString();
        tooltipElement.appendChild(timeElement);
        boxElement.addEventListener("mousemove", (e) => {
            if (e.target !== boxElement)
                return;
            relocateTooltip(tooltipElement, e);
        });
        boxElement.onmouseleave = (e) => {
            tooltipElement.style.visibility = "hidden";
            tooltipElement.style.opacity = "0";
        };
    };
    const timelineMachineErrorEventRender = function (error, canvasElement, containerElement) {
        const imgElement = document.createElement("img");
        imgElement.width = 20;
        imgElement.height = 20;
        imgElement.src = "asset/image/warning.png";
        containerElement.appendChild(imgElement);
        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(CLS_TOOLTIP);
        tooltipElement.innerText = error.description;
        tooltipElement.style.zIndex = "100";
        canvasElement.appendChild(tooltipElement);
        imgElement.addEventListener("mousemove", (e) => {
            if (e.target !== imgElement)
                return;
            relocateTooltip(tooltipElement, e);
        });
        imgElement.onmouseleave = (e) => {
            tooltipElement.style.visibility = "hidden";
            tooltipElement.style.opacity = "0";
        };
    };
    const globalRangeEventRender = function (event, canvasElement, containerElement) {
        const boxElement = document.createElement("div");
        containerElement.appendChild(boxElement);
        boxElement.style.width = "100%";
        boxElement.style.height = "100%";
        boxElement.style.backgroundColor = globalRangeEventColors.get(event.type);
        boxElement.style.opacity = "0.7";
        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(CLS_TOOLTIP);
        tooltipElement.innerText = event.description;
        tooltipElement.style.zIndex = "100";
        canvasElement.appendChild(tooltipElement);
        boxElement.addEventListener("mousemove", (e) => {
            if (e.target !== boxElement)
                return;
            relocateTooltip(tooltipElement, e);
        });
        boxElement.onmouseleave = (e) => {
            tooltipElement.style.visibility = "hidden";
            tooltipElement.style.opacity = "0";
        };
    };
    sc.setSettings({
        chartStartTime: new Date(Date.parse("2020-01-01T00:00:00")),
        chartEndTime: new Date(Date.parse("2020-01-02T00:00:00")),
        cellMinutes: cellMinutes,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        timelinePointEventRender: timelineMachineErrorEventRender,
        entityPointEventRender: entityPointEventRender,
        entityRangeEventRender: entityRangeEventRender,
        globalRangeEventRender: globalRangeEventRender,
        canAutoFit: true,
        hasHorizontalLine: true,
        hasVerticalLine: true,
    });
    sc.setData(window.entities, window.machineErrors, window.machineEvents, "XXX H/L LH Line 03", "Serial No.", "Time Line");
    sc.initLayout();
    sc.drawTimelineCanvas();
    sc.drawEntityList();
    sc.drawMainCanvas();
});
