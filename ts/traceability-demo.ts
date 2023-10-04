window.addEventListener("load", () => {
    const CLS_TOOLTIP = "tr-tooltip";

    const entityRangeEventColors = new Map<string, string>([
        ["op10", "orange"],
        ["op20", "green"],
        ["op30", "blue"],
        ["op40", "yellow"],
        ["op50", "purple"]
    ])

    const globalRangeEventColors = new Map<string, string>([
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
    tr.setData((window as any).leftLegendDatasource, (window as any).rightLegendDatasource);
    tr.drawLegend();

    const sc = StatusChart();
    sc.create(document.getElementById("sc-container"));

    const entityPointEventRender = function (error: ProductError, canvasElement: HTMLElement, containerElement: HTMLElement) {
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
            const tooltipOffset = 10;

            tooltipElement.style.visibility = "visible";
            tooltipElement.style.opacity = "1";
            tooltipElement.style.top = e.clientY + tooltipOffset + "px";
            tooltipElement.style.left = e.clientX + tooltipOffset + "px";
        });

        imgElement.onmouseleave = (e) => {
            tooltipElement.style.visibility = "hidden";
            tooltipElement.style.opacity = "0";
        };
    };

    const entityRangeEventRender = function (event: BarcodeRangeEvent, canvasElement: HTMLElement, containerElement: HTMLElement) {
        const boxElement = document.createElement("div");
        containerElement.appendChild(boxElement);
        boxElement.style.width = "100%";
        boxElement.style.height = "100%";
        boxElement.style.backgroundColor = entityRangeEventColors.get(event.type);

        const textElement = document.createElement("div");
        canvasElement.appendChild(textElement);
        textElement.style.zIndex = "100";
        textElement.classList.add(CLS_TOOLTIP);

        // TODO: add time format service
        textElement.innerText = event.type + " : " + event.description + " : " + event.start.toString() + " ~ " + event.end.toString();

        boxElement.addEventListener("mousemove", (e) => {
            if (e.target !== boxElement)
                return;
            const tooltipOffset = 10;
            textElement.style.visibility = "visible";
            textElement.style.opacity = "1";
            textElement.style.top = e.clientY + tooltipOffset + "px";
            textElement.style.left = e.clientX + tooltipOffset + "px";
        });

        boxElement.onmouseleave = (e) => {
            textElement.style.visibility = "hidden";
            textElement.style.opacity = "0";
        };
    };

    const timelineMachineErrorEventRender = function (error: MachineError, canvasElement: HTMLElement, containerElement: HTMLElement) {
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
            const tooltipOffset = 10;
            const posY = Math.min(e.offsetY + tooltipOffset, canvasElement.offsetHeight - tooltipElement.offsetHeight - tooltipOffset);
            const posX = Math.min(e.offsetX + tooltipOffset, canvasElement.offsetWidth - containerElement.offsetLeft - tooltipElement.offsetWidth - tooltipOffset);

            tooltipElement.style.visibility = "visible";
            tooltipElement.style.opacity = "1";
            tooltipElement.style.top = e.clientY + tooltipOffset + "px";
            tooltipElement.style.left = e.clientX + tooltipOffset + "px";

        });

        imgElement.onmouseleave = (e) => {
            tooltipElement.style.visibility = "hidden";
            tooltipElement.style.opacity = "0";
        };

    };

    const globalRangeEventRender = function (event: MachineGlobalRangeEvent, canvasElement: HTMLElement, containerElement: HTMLElement) {
        const boxElement = document.createElement("div");
        containerElement.appendChild(boxElement);
        boxElement.style.width = "100%";
        boxElement.style.height = "100%";
        boxElement.style.backgroundColor = globalRangeEventColors.get(event.type);
        boxElement.style.opacity = "0.5";

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(CLS_TOOLTIP);
        tooltipElement.innerText = event.description;
        tooltipElement.style.zIndex = "100";
        canvasElement.appendChild(tooltipElement);

        boxElement.addEventListener("mousemove", (e) => {
            if (e.target !== boxElement)
                return;

            const tooltipOffset = 10;
            tooltipElement.style.visibility = "visible";
            tooltipElement.style.opacity = "1";
            tooltipElement.style.top = e.clientY + tooltipOffset + "px";
            tooltipElement.style.left = e.clientX + tooltipOffset + "px";
        });

        boxElement.onmouseleave = (e) => {
            tooltipElement.style.visibility = "hidden";
            tooltipElement.style.opacity = "0";
        };
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