declare var dayjs: any;

window.addEventListener("load", () => {
    const CLS_TOOLTIP = "tr-tooltip";
    const entityRangeEventColors = new Map([
        ["op10", "#92d050"],
        ["op20", "#00b0f0"],
        ["op30", "#ffc000"],
        ["op40", "#7030a0"],
        ["op50", "#f2460d"]
    ]);
    const globalRangeEventColors = new Map([
        ["pause", "#d9d9d9"],
        ["fault", "#7f7f7f"],
        ["networkError", "#cc00ff"],
        ["barcodeMissing", "#081fda"]
    ]);
    const globalRangeEventNames = new Map([
        ["pause", "계획정지 (휴식)"],
        ["fault", "비가동 (설비고장)"],
        ["networkError", "네트워크 이상"],
        ["barcodeMissing", "바코드 누락"]
    ]);

    const barcodeEntities = window.barcodeEntities;
    const machinePointEvents = window.machinePointEvents;
    const machineRangeEvents = window.machineRangeEvents;

    function getTimeDiff(start: Date, end: Date) {
        const totalMilliseconds = end.getTime() - start.getTime();
        const totalSeconds = totalMilliseconds / 1000;
        const totalMinutes = totalSeconds / 60;
        const totalHours = totalMinutes / 60;
        const totalDays = totalHours / 24;
        const totalMonths = totalDays / 30;
        const totalYears = totalMonths / 12;

        const milliseconds = Math.floor(totalMilliseconds % 1000);
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalMinutes % 60);
        const hours = Math.floor(totalHours % 24);
        const days = Math.floor(totalDays % 30);
        const months = Math.floor(totalMonths % 12);
        const years = Math.floor(totalYears);

        return {
            years: years,
            months: months,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            milliseconds: milliseconds,

            totalYears: totalYears,
            totalMonths: totalMonths,
            totalDays: totalDays,
            totalHours: totalHours,
            totalMinutes: totalMinutes,
            totalSeconds: totalSeconds,
            totalMilliseconds: totalMilliseconds,
        };
    }

    function getTimeDiffString(timeDiff: any) {
        let timeDiffString = '';
        if (timeDiff.years > 0) {
            timeDiffString = timeDiffString + timeDiff.years + "년";
        }
        if (timeDiff.months > 0) {
            timeDiffString = timeDiffString + timeDiff.months + "개월";
        }
        if (timeDiff.days > 0) {
            timeDiffString = timeDiffString + timeDiff.days + "일";
        }
        if (timeDiff.hours > 0) {
            timeDiffString = timeDiffString + timeDiff.hours + "시간";
        }
        if (timeDiff.minutes > 0) {
            timeDiffString = timeDiffString + timeDiff.minutes + "분";
        }
        if (timeDiff.seconds > 0) {
            timeDiffString = timeDiffString + timeDiff.seconds + "초";
        }
        if (timeDiffString === '')
            timeDiffString = '0초';
        return timeDiffString;
    }


    const headerCellRender = function (time: Date, containerElement: HTMLElement) {
        const divElement = document.createElement("div");
        containerElement.appendChild(divElement);
        divElement.innerText = dayjs(time).format("HH:mm");
        divElement.style.backgroundColor = "#ddd";
        divElement.style.color = "black";
        divElement.style.textAlign = "center";
        divElement.style.height = "100%";
        divElement.style.width = "100%";
    };
    const relocateTooltip = function (tooltipElement: HTMLElement, e: MouseEvent) {
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
    const entityPointEventRender = function (event: BarcodePointEvent, canvasElement: HTMLElement, containerElement: HTMLElement) {
        const imgElement = document.createElement("img");
        imgElement.style.width = "100%";
        imgElement.style.height = "100%";
        imgElement.style.padding = "10%";
        imgElement.src = "./asset/image/error.png";
        containerElement.appendChild(imgElement);

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(CLS_TOOLTIP);
        canvasElement.appendChild(tooltipElement);

        const titleElement = document.createElement("div");
        titleElement.innerText = "품질 이상";
        titleElement.style.fontWeight = "bold";
        titleElement.style.textAlign = "center";
        titleElement.style.color = "black"
        tooltipElement.appendChild(titleElement);

        const barcode = barcodeEntities.find(x => x.id == event.entityId);
        const barcodeElement = document.createElement("div");
        barcodeElement.innerText = `Barcode: ${barcode.barcodeNumber}`;
        tooltipElement.appendChild(barcodeElement);

        const productElement = document.createElement("div");
        productElement.innerText = `ProductNo: ${barcode.productNumber}`;
        tooltipElement.appendChild(productElement);

        const descElement = document.createElement("div");
        descElement.innerText = event.description;
        tooltipElement.appendChild(descElement);

        const timeElement = document.createElement("div");
        timeElement.innerText = dayjs(event.time).format("HH:mm:ss");
        tooltipElement.appendChild(timeElement);

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
    const entityRangeEventRender = function (event: BarcodeRangeEvent, canvasElement: HTMLElement, containerElement: HTMLElement) {
        const boxElement = document.createElement("div");
        containerElement.appendChild(boxElement);
        boxElement.style.width = "100%";
        boxElement.style.height = "100%";
        boxElement.style.backgroundColor = entityRangeEventColors.get(event.type);

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(CLS_TOOLTIP);
        canvasElement.appendChild(tooltipElement);

        const typeElement = document.createElement("div");
        typeElement.innerText = event.type;
        typeElement.style.fontWeight = "bold";
        typeElement.style.textAlign = "center";
        typeElement.style.color = "black"
        tooltipElement.appendChild(typeElement);

        const timeDifference = getTimeDiff(event.start, event.end);
        const timeDifferenceString = getTimeDiffString(timeDifference);
        const timeElement = document.createElement("div");
        timeElement.innerText = dayjs(event.start).format("HH:mm:ss") + " ~ " + dayjs(event.end).format("HH:mm:ss") + " (" + timeDifferenceString + ")";
        tooltipElement.appendChild(timeElement);

        const barcodeElement = document.createElement("div");
        barcodeElement.innerText = barcodeEntities.find(entity => entity.id == event.entityId).name;
        tooltipElement.appendChild(barcodeElement);

        const barcode = barcodeEntities.find(x => x.id == event.entityId);
        const productElement = document.createElement("div");
        productElement.innerText = `ProductNo: ${barcode.productNumber}`;
        tooltipElement.appendChild(productElement);

        const descElement = document.createElement("div");
        descElement.innerText = event.description;
        tooltipElement.appendChild(descElement);

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
    const machinePointEventRender = function (event: MachinePointEvent, canvasElement: HTMLElement, containerElement: HTMLElement) {
        const imgElement = document.createElement("img");
        imgElement.style.width = "100%";
        imgElement.style.height = "100%";
        imgElement.src = "./asset/image/warning.png";
        containerElement.appendChild(imgElement);

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(CLS_TOOLTIP);
        canvasElement.appendChild(tooltipElement);

        const titleElement = document.createElement("div");
        titleElement.innerText = "설비 이상";
        titleElement.style.fontWeight = "bold";
        titleElement.style.textAlign = "center";
        titleElement.style.color = "black"
        tooltipElement.appendChild(titleElement);

        const descElement = document.createElement("div");
        descElement.innerText = event.description;
        tooltipElement.appendChild(descElement);

        const timeElement = document.createElement("div");
        timeElement.innerText = dayjs(event.time).format("HH:mm:ss");
        tooltipElement.appendChild(timeElement);

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
    const machineRangeEventRender = function (event: MachineRangeEvent, canvasElement: HTMLElement, containerElement: HTMLElement) {
        const boxElement = document.createElement("div");
        containerElement.appendChild(boxElement);
        boxElement.style.width = "100%";
        boxElement.style.height = "100%";
        boxElement.style.backgroundColor = globalRangeEventColors.get(event.type);
        boxElement.style.opacity = "0.8";

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(CLS_TOOLTIP);
        canvasElement.appendChild(tooltipElement);

        const typeElement = document.createElement("div");
        typeElement.innerText = globalRangeEventNames.get(event.type);
        typeElement.style.fontWeight = "bold";
        typeElement.style.textAlign = "center";
        typeElement.style.color = "black"
        tooltipElement.appendChild(typeElement);

        const timeDifference = getTimeDiff(event.start, event.end);
        const timeDifferenceString = getTimeDiffString(timeDifference);
        const timeElement = document.createElement("div");
        timeElement.innerText = dayjs(event.start).format("HH:mm:ss") + " ~ " + dayjs(event.end).format("HH:mm:ss") + " (" + timeDifferenceString + ")";
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

    const cellMinutes = 30;
    const cellWidth = 50;
    const cellHeight = 50;

    const tr = Traceability();
    tr.setup();
    tr.setData(window.leftLegendDatasource, window.rightLegendDatasource);
    tr.drawLegend();

    const sc = StatusChart();
    sc.create(document.getElementById("sc-container"));
    sc.setSettings({
        chartStartTime: new Date(Date.parse("2020-01-01T00:00:00")),
        chartEndTime: new Date(Date.parse("2020-01-02T00:00:00")),
        timelineTitleHeight: cellHeight,
        timelineHeaderHeight: cellHeight,
        timelineCanvasHeight: cellHeight,
        timelineCanvasContentHeight: cellHeight / 2,
        cellMinutes: cellMinutes,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        cellContentHeight: cellHeight / 2,
        headerCellRender: headerCellRender,
        timelinePointEventRender: machinePointEventRender,
        entityPointEventRender: entityPointEventRender,
        entityRangeEventRender: entityRangeEventRender,
        globalRangeEventRender: machineRangeEventRender,
        canAutoFit: true,
        hasHorizontalLine: true,
        hasVerticalLine: true,
    });
    sc.setData(barcodeEntities, machinePointEvents, machineRangeEvents, "XXX H/L LH Line 03", "Serial No.", "Time Line");
    sc.initLayout();
    sc.drawTimelineCanvas();
    sc.drawEntityList();
    sc.drawMainCanvas();
});
