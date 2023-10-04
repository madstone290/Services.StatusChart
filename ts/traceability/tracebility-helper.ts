const legendService = function () {
    const SC_LEGEND_ITEM = "sc-legend-item";
    const SC_LEGEND_ITEM_ICON = "sc-legend-item-icon";
    const SC_LEGEND_ITEM_COLOR = "sc-legend-item-color";
    const SC_LEGEND_ITEM_LABEL = "sc-legend-item-label";

    const LEFT_LEGEND_ID = "sc-legend-left";
    const RIGHT_LEGEND_ID = "sc-legend-right";

    function init(leftItems: LegendItem[], rightItems: LegendItem[]) {
        const left = document.getElementById(LEFT_LEGEND_ID);
        drawLegend(leftItems, left);

        const right = document.getElementById(RIGHT_LEGEND_ID);
        drawLegend(rightItems, right);
    }

    function drawLegend(items: LegendItem[], container: HTMLElement) {
        for (const item of items) {
            const box = document.createElement("div");
            box.classList.add(SC_LEGEND_ITEM);
            container.appendChild(box);

            if (item.icon) {
                const icon = document.createElement("img");
                icon.classList.add(SC_LEGEND_ITEM_ICON);
                icon.src = item.icon;
                box.appendChild(icon);
            } else {
                const color = document.createElement("div");
                color.classList.add(SC_LEGEND_ITEM_COLOR);
                color.style.backgroundColor = item.color;
                box.appendChild(color);
            }

            const label = document.createElement("div");
            label.classList.add(SC_LEGEND_ITEM_LABEL);
            label.innerText = item.label;
            box.appendChild(label);
        }
    }

    return {
        init
    }
}();




window.addEventListener("load", () => {

    const cellMinutes = 60;
    const cellWidth = 200;
    const cellHeight = 40;
    const TOOLTIP_BOX_CLS = "sc-tooltip";
    const TOOLTIP_TEXT_CLS = "sc-tooltip-text";

    legendService.init((window as any).leftLegendDatasource, (window as any).rightLegendDatasource);

    const sc = StatusChart();

    const entityPointEventRender = (error: ProductError) => {
        const divElement = document.createElement("div");
        divElement.classList.add(TOOLTIP_BOX_CLS);

        const eventElement = document.createElement("img");
        eventElement.style.width = "100%";
        eventElement.style.height = "100%";
        eventElement.src = "asset/image/error.png";
        divElement.appendChild(eventElement);

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(TOOLTIP_TEXT_CLS);
        tooltipElement.innerText = error.description;
        divElement.appendChild(tooltipElement);

        return divElement;
    };

    const entityRangeEventRender: (event: BarcodeRangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => HTMLElement =
        (event, canvasEl, containerEl) => {
            const tooltipBoxElement = document.createElement("div");
            tooltipBoxElement.classList.add(TOOLTIP_BOX_CLS);
            tooltipBoxElement.style.backgroundColor = event.type == 1 ? "orange" : event.type == 2 ? "green" : "blue";

            const tooltipTextElement = document.createElement("div");
            tooltipBoxElement.appendChild(tooltipTextElement);
            tooltipTextElement.classList.add(TOOLTIP_TEXT_CLS);
            // TODO: add time format service
            tooltipTextElement.innerText = event.start.toString() + " ~ " + event.end.toString();

            return tooltipBoxElement;
        };

    const timelineMachineErrorEventRender = (error: MachineError) => {
        const divElement = document.createElement("div");
        divElement.classList.add(TOOLTIP_BOX_CLS);

        const eventElement = document.createElement("img");
        eventElement.width = 20;
        eventElement.height = 20;
        eventElement.src = "asset/image/warning.png";
        divElement.appendChild(eventElement);

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(TOOLTIP_TEXT_CLS);
        tooltipElement.innerText = error.description;
        divElement.appendChild(tooltipElement);

        return divElement;
    };

    const globalRangeEventRender = (event: MachineGlobalRangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => {
        const tooltipEl = document.createElement("div");
        tooltipEl.classList.add(TOOLTIP_BOX_CLS);
        tooltipEl.style.width = "200px";
        tooltipEl.style.height = "200px";

        if(event.type == "pause")
            tooltipEl.style.backgroundColor =  "red";
        else if(event.type == "fault")
            tooltipEl.style.backgroundColor =  "blue";
        else if(event.type == "barcodeMissing")
            tooltipEl.style.backgroundColor =  "green";
        else if(event.type == "networkError")
            tooltipEl.style.backgroundColor =  "pink";

        tooltipEl.style.opacity = "0.5";

        const tooltipTextEl = document.createElement("div");
        tooltipTextEl.classList.add(TOOLTIP_TEXT_CLS);
        tooltipTextEl.innerText = event.description;
        tooltipEl.appendChild(tooltipTextEl);

        tooltipEl.addEventListener("mousemove", (e) => {
            if (e.target !== tooltipEl)
                return;

            const containerEl = tooltipEl.parentElement;
            const tooltipOffset = 10;
            const posY = Math.min(e.offsetY + tooltipOffset, canvasEl.offsetHeight - tooltipTextEl.offsetHeight - tooltipOffset);
            const posX = Math.min(e.offsetX + tooltipOffset, canvasEl.offsetWidth - containerEl.offsetLeft - tooltipTextEl.offsetWidth - tooltipOffset);

            tooltipTextEl.style.top = posY + "px";
            tooltipTextEl.style.left = posX + "px";

            // 부모 영역안에서만 위치하도록 제한
        });

        return tooltipEl;
    };

    sc.setSettings(new Date(Date.parse("2020-01-01T00:00:00")), new Date(Date.parse("2020-01-02T00:00:00")),
        cellMinutes, cellWidth, cellHeight,
        timelineMachineErrorEventRender,
        entityPointEventRender,
        entityRangeEventRender,
        globalRangeEventRender);

    sc.setData((window as any).entities,
        (window as any).machineErrors,
        (window as any).machineEvents,
        "XXX H/L LH Line 03", "Serial No.", "Time Line");
    sc.initLayout();
    sc.drawTimelineCanvas();
    sc.drawEntityList();
    sc.drawMainCanvas();

});