const StatusChart = function () {
    const TIMELINE_TITLE_ID = "sc-content-timeline-title";
    const TIMELINE_HEADER_BOX_ID = "sc-content-timeline-header-box";
    const TIMELINE_HEADER_ID = "sc-content-timeline-header";
    const TIMELINE_CANVAS_BOX_ID = "sc-content-timeline-canvas-box";
    const TIMELINE_CANVAS_ID = "sc-content-timeline-canvas";
    const TIMELINE_HEADER_ITEM_CLS = "sc-content-timeline-header-item";
    const MAIN_TITLE_ID = "sc-list-head-maintitle";
    const SUBTITLE_ID = "sc-list-head-subtitle";
    const LIST_BOX_ID = "sc-list-box";
    const CANVAS_BOX_ID = "sc-content-canvas-box";
    const CANVAS_ID = "sc-content-canvas";
    const LEFT_LEGEND_ID = "sc-legend-left";
    const RIGHT_LEGEND_ID = "sc-legend-right";
    const DEFAULT_CELL_WIDTH = 200;
    const DEFAULT_CELL_HEIGHT = 40;
    const SC_LIST_ITEM = "sc-list-item";
    const TIMELINE_CANVAS_ITEM_CLS = "sc-content-timeline-canvas-item";
    const MAIN_CANVAS_ITEM_CLS = "sc-content-canvas-item";
    const SC_HLINE = "sc-hline";
    const SC_VLINE = "sc-vline";
    /* Layout
    |---------------|-------------------|
    | main title    | timeline title    |
    |---------------|-------------------|
    |               | timeline header   |
    | sub title     |-------------------|
    |               | timeline canvas   |
    |---------------|-------------------|
    |               |                   |
    | entity list   | main canvas       |
    |               |                   |
    |---------------|-------------------|
    */
    /**
     * Settings
     */
    let _chartStartTime;
    let _chartEndTime;
    /**
     * minutes for each cell
     */
    let _cellMinutes;
    let _hasHorizontalLine;
    let _hasVertialLine;
    let _timelinePointEventRender;
    let _entityPointEventRender;
    let _entityRangeEventRender;
    let _globalRangeEventRender;
    /**
     * Data
     */
    let _entities;
    let _timelinePointEvents;
    let _globalRangeEvents;
    /**
     * Html Elements
     */
    let _mainTitleElement;
    let _subTitleElement;
    let _timelineTitleElement;
    let _entityListBoxElement;
    let _timelineHeaderBoxElement;
    let _timelineHeaderElement;
    let _timelineCanvasBoxElement;
    let _timelineCanvasElement;
    let _mainCanvasBoxElement;
    let _mainCanvasElement;
    const dateTimeService = function () {
        function toMinutes(time) {
            return time / (60 * 1000);
        }
        function toTime(minutes) {
            return minutes * 60 * 1000;
        }
        return {
            toMinutes,
            toTime
        };
    }();
    const cssService = function () {
        const SC_CELL_WIDTH = "--sc-cell-width";
        const SC_CELL_HEIGHT = "--sc-cell-height";
        const SC_CELL_CONTENT_HEIGHT = "--sc-cell-content-height";
        const SC_SCROLL_WIDTH = "--sc-scroll-width";
        function getVariable(name) {
            return getComputedStyle(document.documentElement).getPropertyValue(name);
        }
        function setVariable(name, value) {
            document.documentElement.style.setProperty(name, value);
        }
        function getCellWidth() {
            return parseInt(getVariable(SC_CELL_WIDTH));
        }
        function setCellWidth(width) {
            setVariable(SC_CELL_WIDTH, `${width}px`);
        }
        function getCellHeight() {
            return parseInt(getVariable(SC_CELL_HEIGHT));
        }
        function setCellHeight(height) {
            setVariable(SC_CELL_HEIGHT, `${height}px`);
        }
        function getCellContentHeight() {
            return parseInt(getVariable(SC_CELL_CONTENT_HEIGHT));
        }
        function getScrollWidth() {
            return parseInt(getVariable(SC_SCROLL_WIDTH));
        }
        return {
            getVariable,
            getCellWidth,
            setCellWidth,
            getCellHeight,
            setCellHeight,
            getCellContentHeight,
            getScrollWidth
        };
    }();
    const legendService = function () {
        const SC_LEGEND_ITEM = "sc-legend-item";
        const SC_LEGEND_ITEM_ICON = "sc-legend-item-icon";
        const SC_LEGEND_ITEM_COLOR = "sc-legend-item-color";
        const SC_LEGEND_ITEM_LABEL = "sc-legend-item-label";
        function init(leftItems, rightItems) {
            const left = document.getElementById(LEFT_LEGEND_ID);
            drawLegend(leftItems, left);
            const right = document.getElementById(RIGHT_LEGEND_ID);
            drawLegend(rightItems, right);
        }
        function drawLegend(items, container) {
            for (const item of items) {
                const box = document.createElement("div");
                box.classList.add(SC_LEGEND_ITEM);
                container.appendChild(box);
                if (item.icon) {
                    const icon = document.createElement("img");
                    icon.classList.add(SC_LEGEND_ITEM_ICON);
                    icon.src = item.icon;
                    box.appendChild(icon);
                }
                else {
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
        };
    }();
    function setSettings(chartStartTime, chartEndTime, cellMinutes, cellWidth, cellHeight, timelinePointEventRender = null, entityPointEventRender = null, entityRangeEventRender = null, globalRangeEventRender = null, hasHorizontalLine = true, hasVerticalLine = true) {
        _chartStartTime = chartStartTime;
        _chartEndTime = chartEndTime;
        _cellMinutes = cellMinutes;
        _hasHorizontalLine = hasHorizontalLine;
        _hasVertialLine = hasVerticalLine;
        cssService.setCellWidth(cellWidth);
        cssService.setCellHeight(cellHeight);
        _timelinePointEventRender = timelinePointEventRender;
        _entityRangeEventRender = entityRangeEventRender;
        _entityPointEventRender = entityPointEventRender;
        _globalRangeEventRender = globalRangeEventRender;
        _mainTitleElement = document.getElementById(MAIN_TITLE_ID);
        _subTitleElement = document.getElementById(SUBTITLE_ID);
        _timelineTitleElement = document.getElementById(TIMELINE_TITLE_ID);
        _entityListBoxElement = document.getElementById(LIST_BOX_ID);
        _timelineHeaderBoxElement = document.getElementById(TIMELINE_HEADER_BOX_ID);
        _timelineHeaderElement = document.getElementById(TIMELINE_HEADER_ID);
        _timelineCanvasBoxElement = document.getElementById(TIMELINE_CANVAS_BOX_ID);
        _timelineCanvasElement = document.getElementById(TIMELINE_CANVAS_ID);
        _mainCanvasBoxElement = document.getElementById(CANVAS_BOX_ID);
        _mainCanvasElement = document.getElementById(CANVAS_ID);
    }
    function setData(entities, timelinePointEvents, globalRangeEvents, mainTitle, subtitle, timelineHeader) {
        _entities = entities;
        _timelinePointEvents = timelinePointEvents;
        _globalRangeEvents = globalRangeEvents;
        _mainTitleElement.innerText = mainTitle;
        _subTitleElement.innerText = subtitle;
        _timelineTitleElement.innerText = timelineHeader;
    }
    /**
     * 설정값에 맞춰 레이아웃을 초기화한다.
     */
    function initLayout() {
        const headers = [];
        let time = _chartStartTime;
        let end = _chartEndTime;
        while (time < end) {
            // TODO : add time format service
            headers.push(time.toLocaleTimeString([], {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            }));
            time = new Date(time.getTime() + dateTimeService.toTime(_cellMinutes));
        }
        for (const data of headers) {
            const div = document.createElement("div");
            div.innerText = data;
            div.classList.add(TIMELINE_HEADER_ITEM_CLS);
            _timelineHeaderElement.appendChild(div);
        }
        /**
         * main canvas에만 스크롤을 표시한다.
         * timeline header와 timeline canvas는 main canvas 수평스크롤과 동기화한다.
         * entity list는 main canvas 수직스크롤과 동기화한다.
         */
        const canvasWidth = cssService.getCellWidth() * headers.length;
        const canvasHeight = cssService.getCellHeight() * _entities.length;
        _timelineHeaderElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _timelineCanvasElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _mainCanvasElement.style.width = `${canvasWidth}px`;
        _mainCanvasElement.style.height = `${canvasHeight}px`;
        _mainCanvasBoxElement.addEventListener("scroll", (e) => {
            _timelineHeaderBoxElement.scrollLeft = _mainCanvasBoxElement.scrollLeft;
            _timelineCanvasBoxElement.scrollLeft = _mainCanvasBoxElement.scrollLeft;
        });
        _mainCanvasBoxElement.addEventListener("scroll", (e) => {
            _entityListBoxElement.scrollTop = _mainCanvasBoxElement.scrollTop;
        });
    }
    /**
     * 엔티티 리스트를 그린다.
     */
    function drawEntityList() {
        for (const entity of _entities) {
            // list item
            const div = document.createElement("div");
            div.innerText = entity.name;
            div.classList.add(SC_LIST_ITEM);
            _entityListBoxElement.appendChild(div);
        }
    }
    /**
     * 타임라인 캔버스를 그린다.
     */
    function drawTimelineCanvas() {
        for (const event of _timelinePointEvents) {
            drawTimelinePointEvent(event);
        }
    }
    function drawTimelinePointEvent(event) {
        const containerElement = document.createElement("div");
        _timelineCanvasElement.appendChild(containerElement);
        const center = dateTimeService.toMinutes(event.time.valueOf() - _chartStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const top = (cssService.getCellHeight() - cssService.getCellContentHeight()) / 2 - 1;
        const width = cssService.getCellContentHeight();
        containerElement.style.left = `${center - (width / 2)}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.width = width + "px";
        containerElement.style.zIndex = "3";
        containerElement.classList.add(TIMELINE_CANVAS_ITEM_CLS);
        const eventElement = _timelinePointEventRender(event, _timelineCanvasElement, containerElement);
        containerElement.appendChild(eventElement);
        eventElement.style.width = "100%";
        eventElement.style.height = "100%";
    }
    /**
     * 메인 캔버스를 그린다.
     */
    function drawMainCanvas() {
        if (_hasHorizontalLine)
            drawHorizontalLines();
        if (_hasVertialLine)
            drawVertialLines();
        let rowIndex = 0;
        for (const entity of _entities) {
            drawEntityRangeEvents(entity, rowIndex);
            drawEntityPointEvents(entity, rowIndex);
            rowIndex++;
        }
        if (_globalRangeEvents != null && _globalRangeEvents.length > 0) {
            for (const event of _globalRangeEvents) {
                drawGlobalEvent(event, _globalRangeEventRender);
            }
        }
    }
    function drawVertialLines() {
        const canvasWidth = _mainCanvasElement.scrollWidth;
        const cellWidth = cssService.getCellWidth();
        const lineCount = Math.floor(canvasWidth / cellWidth);
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement("div");
            line.classList.add(SC_VLINE);
            line.style.left = `${cellWidth * (i + 1) - 1}px`;
            line.style.height = `${_mainCanvasElement.scrollHeight}px`;
            _mainCanvasElement.appendChild(line);
        }
    }
    function drawHorizontalLines() {
        const canvasHeight = _mainCanvasElement.scrollHeight;
        const cellHeight = cssService.getCellHeight();
        const lineCount = Math.floor(canvasHeight / cellHeight);
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement("div");
            line.classList.add(SC_HLINE);
            line.style.top = `${cellHeight * (i + 1) - 1}px`;
            line.style.width = `${_mainCanvasElement.scrollWidth}px`;
            _mainCanvasElement.appendChild(line);
        }
    }
    function drawEntityRangeEvents(entity, rowIndex) {
        if (entity.rangeEvents == null || entity.rangeEvents.length == 0)
            return;
        for (const event of entity.rangeEvents) {
            drawLocalRangeEvent(event, rowIndex, _entityRangeEventRender);
        }
    }
    function drawLocalRangeEvent(event, rowIndex, render = null) {
        const containerElement = document.createElement("div");
        containerElement.classList.add(MAIN_CANVAS_ITEM_CLS);
        _mainCanvasElement.appendChild(containerElement);
        const left = dateTimeService.toMinutes(event.start.valueOf() - _chartStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / _cellMinutes;
        const top = (cssService.getCellHeight() * rowIndex)
            + (cssService.getCellHeight() - cssService.getCellContentHeight()) / 2
            - 1;
        containerElement.style.left = `${left}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.width = `${width}px`;
        containerElement.style.zIndex = "3";
        containerElement.addEventListener("click", (e) => {
            console.log(e);
        });
        const eventElement = render(event, _mainCanvasElement, containerElement);
        containerElement.appendChild(eventElement);
        eventElement.style.width = "100%";
        eventElement.style.height = "100%";
    }
    function drawEntityPointEvents(entity, rowIndex) {
        if (entity.pointEvents == null || entity.pointEvents.length == 0)
            return;
        for (const event of entity.pointEvents) {
            drawLocalPointEvent(event, rowIndex, _entityPointEventRender);
        }
    }
    /**
     * 포인트 이벤트를 그린다. 이벤트 시간을 중심으로 엘리먼트가 위치한다.
     * @param event
     * @param rowIndex
     */
    function drawLocalPointEvent(event, rowIndex, render = null) {
        const containerElement = document.createElement("div");
        _mainCanvasElement.appendChild(containerElement);
        const center = dateTimeService.toMinutes(event.time.valueOf() - _chartStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const top = (cssService.getCellHeight() * rowIndex) + ((cssService.getCellHeight() - cssService.getCellContentHeight()) / 2) - 1;
        const width = cssService.getCellContentHeight();
        containerElement.style.left = `${center - (width / 2)}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.width = width + "px";
        containerElement.style.zIndex = "3";
        containerElement.classList.add(MAIN_CANVAS_ITEM_CLS);
        const eventElement = render(event, _mainCanvasElement, containerElement);
        containerElement.appendChild(eventElement);
        eventElement.style.width = "100%";
        eventElement.style.height = "100%";
    }
    function drawGlobalEvent(event, render) {
        const containerElement = document.createElement("div");
        _mainCanvasElement.appendChild(containerElement);
        const left = dateTimeService.toMinutes(event.start.valueOf() - _chartStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / _cellMinutes;
        containerElement.style.left = `${left}px`;
        containerElement.style.top = "0px";
        containerElement.style.width = `${width}px`;
        containerElement.style.height = "100%";
        containerElement.style.zIndex = "1";
        containerElement.classList.add(MAIN_CANVAS_ITEM_CLS);
        const eventElement = render(event, _mainCanvasElement, containerElement);
        eventElement.style.width = "100%";
        eventElement.style.height = "100%";
        containerElement.appendChild(eventElement);
    }
    return {
        legendService,
        setSettings,
        setData,
        initLayout,
        drawTimelineCanvas,
        drawEntityList,
        drawMainCanvas,
        // custom render
        drawLocalPointEvent,
        drawGlobalEvent,
    };
};
window.addEventListener("load", () => {
    const cellMinutes = 60;
    const cellWidth = 200;
    const cellHeight = 40;
    const TOOLTIP_BOX_CLS = "sc-tooltip";
    const TOOLTIP_TEXT_CLS = "sc-tooltip-text";
    const sc = StatusChart();
    sc.legendService.init(window.leftLegendDatasource, window.rightLegendDatasource);
    const entityPointEventRender = (error) => {
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
    const entityRangeEventRender = (event, canvasEl, containerEl) => {
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
    const timelineMachineErrorEventRender = (error) => {
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
    const globalRangeEventRender = (event, canvasEl, containerEl) => {
        const tooltipEl = document.createElement("div");
        tooltipEl.classList.add(TOOLTIP_BOX_CLS);
        tooltipEl.style.width = "200px";
        tooltipEl.style.height = "200px";
        if (event.type == "pause")
            tooltipEl.style.backgroundColor = "red";
        else if (event.type == "fault")
            tooltipEl.style.backgroundColor = "blue";
        else if (event.type == "barcodeMissing")
            tooltipEl.style.backgroundColor = "green";
        else if (event.type == "networkError")
            tooltipEl.style.backgroundColor = "pink";
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
    sc.setSettings(new Date(Date.parse("2020-01-01T00:00:00")), new Date(Date.parse("2020-01-02T00:00:00")), cellMinutes, cellWidth, cellHeight, timelineMachineErrorEventRender, entityPointEventRender, entityRangeEventRender, globalRangeEventRender);
    sc.setData(window.entities, window.machineErrors, window.machineEvents, "XXX H/L LH Line 03", "Serial No.", "Time Line");
    sc.initLayout();
    sc.drawTimelineCanvas();
    sc.drawEntityList();
    sc.drawMainCanvas();
});
