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
    let _canAutoFit;
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
        const CHART_WIDTH = "--sc-width";
        const SC_CELL_WIDTH = "--sc-cell-width";
        const SC_CELL_HEIGHT = "--sc-cell-height";
        const SC_CELL_CONTENT_HEIGHT = "--sc-cell-content-height";
        const SC_SCROLL_WIDTH = "--sc-scroll-width";
        const VAR_CHART_HEIGHT = "--sc-height";
        const VAR_LIST_HEAD_HEIGHT = "--sc-list-head-height";
        function getVariable(name) {
            return getComputedStyle(document.documentElement).getPropertyValue(name);
        }
        function setVariable(name, value) {
            document.documentElement.style.setProperty(name, value);
        }
        function setChartWidth(width) {
            setVariable(CHART_WIDTH, `${width}px`);
        }
        function getChartHeight() { return parseInt(getVariable(VAR_CHART_HEIGHT)); }
        function setChartHeight(height) { setVariable(VAR_CHART_HEIGHT, `${height}px`); }
        function getHeadHeight() { return parseInt(getVariable(VAR_LIST_HEAD_HEIGHT)); }
        function setHeadHeight(height) { setVariable(VAR_LIST_HEAD_HEIGHT, `${height}px`); }
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
            setChartWidth,
            getChartHeight,
            setChartHeight,
            getHeadHeight,
            setHeadHeight,
            getCellWidth,
            setCellWidth,
            getCellHeight,
            setCellHeight,
            getCellContentHeight,
            getScrollWidth
        };
    }();
    /**
     * 차트 엘리먼트를 생성한다.
     * @param container
     */
    function create(container) {
        const elementString = `
        <div id="sc-main">
            <div id="sc-list">
                <div id="sc-list-head">
                    <div id="sc-list-head-maintitle"></div>
                    <div id="sc-list-head-subtitle"></div>
                </div>
                <div id="sc-list-box">
                </div>
            </div>
            <div id="sc-content-box">
                <div id="sc-content-timeline">
                    <div id="sc-content-timeline-title"></div>
                    <div id="sc-content-timeline-header-box">
                        <div id="sc-content-timeline-header"></div>
                    </div>
                    <div id="sc-content-timeline-canvas-box">
                        <div id="sc-content-timeline-canvas"></div>
                    </div>

                </div>
                <div id="sc-content-canvas-box">
                    <div id="sc-content-canvas">
                    </div>
                </div>
            </div>
        </div>
        `;
        const parser = new DOMParser();
        const doc = parser.parseFromString(elementString, 'text/html');
        const element = doc.body.firstChild;
        container.appendChild(element);
        // 컨테이너 크기에 맞춰 차트 크기를 조정한다.
        cssService.setChartWidth(container.clientWidth);
        cssService.setChartHeight(container.clientHeight);
    }
    function setSettings(chartStartTime, chartEndTime, cellMinutes, cellWidth = DEFAULT_CELL_WIDTH, cellHeight = DEFAULT_CELL_HEIGHT, timelinePointEventRender = null, entityPointEventRender = null, entityRangeEventRender = null, globalRangeEventRender = null, hasHorizontalLine = true, hasVerticalLine = true, canAutoFit = true) {
        _chartStartTime = chartStartTime;
        _chartEndTime = chartEndTime;
        _cellMinutes = cellMinutes;
        _hasHorizontalLine = hasHorizontalLine;
        _hasVertialLine = hasVerticalLine;
        _canAutoFit = canAutoFit;
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
        _timelineHeaderElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _timelineCanvasElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _mainCanvasElement.style.width = `${canvasWidth}px`;
        const chartHeight = cssService.getChartHeight();
        const headHeight = cssService.getHeadHeight();
        const scrollWidth = cssService.getScrollWidth();
        const providedCanvasHeight = chartHeight - headHeight - scrollWidth;
        const requiredCanvasHeight = cssService.getCellHeight() * _entities.length;
        let canvasHeight = requiredCanvasHeight;
        if (_canAutoFit && requiredCanvasHeight < providedCanvasHeight) {
            cssService.setChartHeight(headHeight + scrollWidth + canvasHeight);
        }
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
        const canvasHeight = _mainCanvasElement.scrollHeight;
        const cellHeight = cssService.getCellHeight();
        const lineCount = Math.floor(canvasHeight / cellHeight);
        for (let i = 0; i < lineCount; i++) {
            const div = document.createElement("div");
            _entityListBoxElement.appendChild(div);
            div.classList.add(SC_LIST_ITEM);
            const entity = _entities[i];
            if (entity == null)
                continue;
            div.innerText = entity.name;
        }
    }
    /**
     * 타임라인 캔버스를 그린다.
     */
    function drawTimelineCanvas() {
        if (_timelinePointEvents != null && _timelinePointEvents.length > 0) {
            for (const event of _timelinePointEvents) {
                drawTimelinePointEvent(event);
            }
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
        containerElement.style.height = width + "px";
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
        containerElement.style.height = width + "px";
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
        cssService,
        // public
        create,
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
