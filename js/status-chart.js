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
    /* Settings */
    /**
     * 차트의 시작 시간
     */
    let _chartStartTime;
    /**
     * 차트의 종료 시간
     */
    let _chartEndTime;
    /**
     * 하나의 셀이 표현하는 시간. 단위는 분
     */
    let _cellMinutes;
    /**
     * 캔버스 가로선 표시 여부
     */
    let _hasHorizontalLine;
    /**
     * 캔버스 세로선 표시 여부
     */
    let _hasVertialLine;
    /**
     * 캔버스 자동 맞춤 여부. true일 경우 캔버스의 빈 공간을 없앤다.
     */
    let _canAutoFit;
    /**
     * 헤더 시간 포맷 함수
     */
    let _headerTimeFormat;
    /**
     * 헤더 셀 렌더러
     */
    let _headerCellRender;
    /**
     * 타임라인 포인트 이벤트 렌더러
     */
    let _timelinePointEventRender;
    /**
     * 엔티티 포인트 이벤트 렌더러
     */
    let _entityPointEventRender;
    /**
     * 엔티티 레인지 이벤트 렌더러
     */
    let _entityRangeEventRender;
    /**
     * 글로벌 레인지 이벤트 렌더러
     */
    let _globalRangeEventRender;
    /* 데이터 */
    /**
     * 엔티티 리스트
     */
    let _entities;
    /**
     * 타임라인 포인트 이벤트 리스트
     */
    let _timelinePointEvents;
    /**
     * 글로벌 레인지 이벤트 리스트
     */
    let _globalRangeEvents;
    /* Html Elements */
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
        const VAR_CELL_WIDTH = "--sc-cell-width";
        const VAR_CELL_HEIGHT = "--sc-cell-height";
        const VAR_CELL_CONTENT_HEIGHT = "--sc-cell-content-height";
        const VAR_SCROLL_WIDTH = "--sc-scroll-width";
        const VAR_CHART_HEIGHT = "--sc-height";
        const VAR_CHART_WIDTH = "--sc-width";
        const VAR_TIMELINE_TITLE_HEIGHT = "--sc-timeline-title-height";
        const VAR_TIMELINE_HEADER_HEIGHT = "--sc-timeline-header-height";
        const VAR_TIMELINE_CANVAS_HEIGHT = "--sc-timeline-canvas-height";
        const VAR_TIMELINE_CANVAS_CONTENT_HEIGHT = "--sc-timeline-canvas-content-height";
        function getVariable(name) {
            return getComputedStyle(document.documentElement).getPropertyValue(name);
        }
        function setVariable(name, value) {
            document.documentElement.style.setProperty(name, value);
        }
        function setChartWidth(width) {
            setVariable(VAR_CHART_WIDTH, `${width}px`);
        }
        function getChartHeight() { return parseInt(getVariable(VAR_CHART_HEIGHT)); }
        function setChartHeight(height) { setVariable(VAR_CHART_HEIGHT, `${height}px`); }
        function getTimelineTitleHeight() { return parseInt(getVariable(VAR_TIMELINE_TITLE_HEIGHT)); }
        function setTimeLineTitleHeight(height) { setVariable(VAR_TIMELINE_TITLE_HEIGHT, `${height}px`); }
        function getTimelineHeaderHeight() { return parseInt(getVariable(VAR_TIMELINE_HEADER_HEIGHT)); }
        function setTimelineHeaderHeight(height) { setVariable(VAR_TIMELINE_HEADER_HEIGHT, `${height}px`); }
        function getTimelineCanvasHeight() { return parseInt(getVariable(VAR_TIMELINE_CANVAS_HEIGHT)); }
        function setTimelineCanvasHeight(height) { setVariable(VAR_TIMELINE_CANVAS_HEIGHT, `${height}px`); }
        function getTimelineCanvasContentHeight() { return parseInt(getVariable(VAR_TIMELINE_CANVAS_CONTENT_HEIGHT)); }
        function setTimelineCanvasContentHeight(height) { setVariable(VAR_TIMELINE_CANVAS_CONTENT_HEIGHT, `${height}px`); }
        function getTimelineHeight() { return getTimelineTitleHeight() + getTimelineHeaderHeight() + getTimelineCanvasHeight(); }
        function getCellWidth() { return parseInt(getVariable(VAR_CELL_WIDTH)); }
        function setCellWidth(width) { setVariable(VAR_CELL_WIDTH, `${width}px`); }
        function getCellHeight() { return parseInt(getVariable(VAR_CELL_HEIGHT)); }
        function setCellHeight(height) { setVariable(VAR_CELL_HEIGHT, `${height}px`); }
        function getCellContentHeight() { return parseInt(getVariable(VAR_CELL_CONTENT_HEIGHT)); }
        function setCellContentHeight(height) { setVariable(VAR_CELL_CONTENT_HEIGHT, `${height}px`); }
        function getScrollWidth() { return parseInt(getVariable(VAR_SCROLL_WIDTH)); }
        return {
            getVariable,
            setChartWidth,
            getChartHeight,
            setChartHeight,
            getTimelineTitleHeight,
            setTimeLineTitleHeight,
            getTimelineHeaderHeight,
            setTimelineHeaderHeight,
            getTimelineCanvasHeight,
            setTimelineCanvasHeight,
            getTimelineCanvasContentHeight,
            setTimelineCanvasContentHeight,
            getTimelineHeight,
            getCellWidth,
            setCellWidth,
            getCellHeight,
            setCellHeight,
            getCellContentHeight,
            setCellContentHeight,
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
    function setSettings({ chartStartTime, chartEndTime, timelineTitleHeight = 40, timelineHeaderHeight = 40, timelineCanvasHeight = 40, timelineCanvasContentHeight = 30, cellMinutes = 60, cellWidth = 200, cellHeight = 40, cellContentHeight = 30, headerTimeFormat, headerCellRender, timelinePointEventRender, entityPointEventRender, entityRangeEventRender, globalRangeEventRender, hasHorizontalLine = true, hasVerticalLine = true, canAutoFit = true }) {
        _chartStartTime = chartStartTime;
        _chartEndTime = chartEndTime;
        _cellMinutes = cellMinutes;
        _hasHorizontalLine = hasHorizontalLine;
        _hasVertialLine = hasVerticalLine;
        _canAutoFit = canAutoFit;
        cssService.setTimeLineTitleHeight(timelineTitleHeight);
        cssService.setTimelineHeaderHeight(timelineHeaderHeight);
        cssService.setTimelineCanvasHeight(timelineCanvasHeight);
        cssService.setTimelineCanvasContentHeight(timelineCanvasContentHeight);
        cssService.setCellWidth(cellWidth);
        cssService.setCellHeight(cellHeight);
        cssService.setCellContentHeight(cellContentHeight);
        _headerTimeFormat = headerTimeFormat !== null && headerTimeFormat !== void 0 ? headerTimeFormat : ((time) => { return time.toLocaleString(); });
        _headerCellRender = headerCellRender;
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
        let time = _chartStartTime;
        let end = _chartEndTime;
        let headerCellCount = 0;
        while (time < end) {
            if (_headerCellRender != null) {
                const containerElement = document.createElement("div");
                _timelineHeaderElement.appendChild(containerElement);
                containerElement.classList.add(TIMELINE_HEADER_ITEM_CLS);
                _headerCellRender(time, containerElement);
            }
            else {
                const div = document.createElement("div");
                div.innerText = _headerTimeFormat(time);
                ;
                div.classList.add(TIMELINE_HEADER_ITEM_CLS);
                _timelineHeaderElement.appendChild(div);
            }
            time = new Date(time.getTime() + dateTimeService.toTime(_cellMinutes));
            headerCellCount++;
        }
        /**
         * main canvas에만 스크롤을 표시한다.
         * timeline header와 timeline canvas는 main canvas 수평스크롤과 동기화한다.
         * entity list는 main canvas 수직스크롤과 동기화한다.
         */
        const canvasWidth = cssService.getCellWidth() * headerCellCount;
        _timelineHeaderElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _timelineCanvasElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _mainCanvasElement.style.width = `${canvasWidth}px`;
        const chartHeight = cssService.getChartHeight();
        const timelineHeight = cssService.getTimelineHeight();
        const scrollWidth = cssService.getScrollWidth();
        const providedCanvasHeight = chartHeight - timelineHeight - scrollWidth;
        const requiredCanvasHeight = cssService.getCellHeight() * _entities.length;
        let canvasHeight = requiredCanvasHeight;
        if (_canAutoFit && requiredCanvasHeight < providedCanvasHeight) {
            cssService.setChartHeight(timelineHeight + scrollWidth + canvasHeight);
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
        const top = (cssService.getTimelineCanvasHeight() - cssService.getTimelineCanvasContentHeight()) / 2 - 1;
        const width = cssService.getTimelineCanvasContentHeight();
        containerElement.style.left = `${center - (width / 2)}px`;
        containerElement.style.top = `${top}px`;
        containerElement.classList.add(TIMELINE_CANVAS_ITEM_CLS);
        _timelinePointEventRender(event, _timelineCanvasElement, containerElement);
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
    function drawLocalRangeEvent(event, rowIndex, render) {
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
        render(event, _mainCanvasElement, containerElement);
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
    function drawLocalPointEvent(event, rowIndex, render) {
        const containerElement = document.createElement("div");
        _mainCanvasElement.appendChild(containerElement);
        const center = dateTimeService.toMinutes(event.time.valueOf() - _chartStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const top = (cssService.getCellHeight() * rowIndex) + ((cssService.getCellHeight() - cssService.getCellContentHeight()) / 2) - 1;
        const width = cssService.getCellContentHeight();
        containerElement.style.left = `${center - (width / 2)}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.zIndex = "2";
        containerElement.classList.add(MAIN_CANVAS_ITEM_CLS);
        render(event, _mainCanvasElement, containerElement);
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
        render(event, _mainCanvasElement, containerElement);
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
