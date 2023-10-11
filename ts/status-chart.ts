
interface StatusChartSettings {
    chartStartTime: Date;
    chartEndTime: Date;
    timelineTitleHeight?: number;
    timelineHeaderHeight?: number;
    timelineCanvasHeight?: number;
    timelineCanvasContentHeight?: number;
    cellMinutes: number;
    cellWidth?: number;
    cellHeight?: number;
    cellContentHeight?: number;
    headerTimeFormat?: (time: Date) => string;
    headerCellRender?: (time: Date, containerElement: HTMLElement) => void;
    timelinePointEventRender?: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
    entityPointEventRender?: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
    entityRangeEventRender?: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
    globalRangeEventRender?: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
    hasHorizontalLine?: boolean;
    hasVerticalLine?: boolean;
    canAutoFit?: boolean;
}

const StatusChart = function () {
    const ID_TIMELINE_TITLE = "sc-timeline-title";
    const ID_TIMELINE_HEADER_BOX = "sc-timeline-header-box";
    const ID_TIMELINE_HEADER = "sc-timeline-header";
    const ID_TIMELINE_CANVAS_BOX = "sc-timeline-canvas-box";
    const ID_TIMELINE_CANVAS = "sc-timeline-canvas";
    const CLS_TIMELINE_HEADER_ITEM = "sc-timeline-header-item";

    const ID_MAIN_TITLE = "sc-maintitle";
    const ID_SUBTITLE = "sc-subtitle";
    const ID_ENTITY_LIST_BOX = "sc-entity-list-box";

    const ID_MAIN_CANVAS_BOX = "sc-main-canvas-box";
    const ID_MAIN_CANVAS = "sc-main-canvas";

    const CLS_ENTITY_LIST_ITEM = "sc-entity-list-item";
    const CLS_TIMELINE_CANVAS_ITEM = "sc-timeline-canvas-item";
    const CLS_MAIN_CANVAS_ITEM = "sc-main-canvas-item";
    const CLS_HLINE = "sc-hline";
    const CLS_VLINE = "sc-vline";

    const Z_INDEX_ENTITY_POINT_EVENT = 3;
    const Z_INDEX_ENTITY_RANGE_EVENT = 2;
    const Z_INDEX_GLOBAL_RANGE_EVENT = 1;

    const MIN_CELL_WIDTH = 50;
    const MAX_CELL_WIDTH = 500;

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
    let _chartStartTime: Date;

    /**
     * 차트의 종료 시간
     */
    let _chartEndTime: Date;

    /**
     * 하나의 셀이 표현하는 시간. 단위는 분
     */
    let _cellMinutes: number;

    /**
     * 헤더 셀 개수. (시작시간 - 종료시간) / 셀시간
     */
    let _headerCellCount: number;

    /**
     * 캔버스 가로선 표시 여부
     */
    let _hasHorizontalLine: boolean;

    /**
     * 캔버스 세로선 표시 여부
     */
    let _hasVertialLine: boolean;

    /**
     * 캔버스 자동 맞춤 여부. true일 경우 캔버스의 빈 공간을 없앤다.
     */
    let _canAutoFit: boolean;

    /**
     * 헤더 시간 포맷 함수
     */
    let _headerTimeFormat: (time: Date) => string;

    /**
     * 헤더 셀 렌더러
     */
    let _headerCellRender: (time: Date, containerElement: HTMLElement) => void;

    /**
     * 타임라인 포인트 이벤트 렌더러
     */
    let _timelinePointEventRender: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;

    /**
     * 엔티티 포인트 이벤트 렌더러
     */
    let _entityPointEventRender: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;

    /**
     * 엔티티 레인지 이벤트 렌더러
     */
    let _entityRangeEventRender: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;

    /**
     * 글로벌 레인지 이벤트 렌더러
     */
    let _globalRangeEventRender: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;


    /* 데이터 */

    /**
     * 엔티티 리스트
     */
    let _entities: Entity[];

    /**
     * 타임라인 포인트 이벤트 리스트
     */
    let _timelinePointEvents: PointEvent[];

    /**
     * 글로벌 레인지 이벤트 리스트
     */
    let _globalRangeEvents: RangeEvent[];

    /* Html Elements */

    let _mainTitleElement: HTMLElement;
    let _subTitleElement: HTMLElement;
    let _timelineTitleElement: HTMLElement;

    let _entityListBoxElement: HTMLElement;

    let _timelineHeaderBoxElement: HTMLElement;
    let _timelineHeaderElement: HTMLElement;

    let _timelineCanvasBoxElement: HTMLElement;
    let _timelineCanvasElement: HTMLElement;

    let _mainCanvasBoxElement: HTMLElement;
    let _mainCanvasElement: HTMLElement;


    const dateTimeService = function () {

        function toMinutes(time: number) {
            return time / (60 * 1000);
        }
        function toTime(minutes: number) {
            return minutes * 60 * 1000;
        }
        return {
            toMinutes,
            toTime
        }
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

        function getVariable(name: string) {
            return getComputedStyle(document.documentElement).getPropertyValue(name);
        }

        function setVariable(name: string, value: string) {
            document.documentElement.style.setProperty(name, value);
        }

        function setChartWidth(width: number) {
            setVariable(VAR_CHART_WIDTH, `${width}px`);
        }

        function getChartHeight() { return parseInt(getVariable(VAR_CHART_HEIGHT)); }
        function setChartHeight(height: number) { setVariable(VAR_CHART_HEIGHT, `${height}px`); }

        function getTimelineTitleHeight() { return parseInt(getVariable(VAR_TIMELINE_TITLE_HEIGHT)); }
        function setTimeLineTitleHeight(height: number) { setVariable(VAR_TIMELINE_TITLE_HEIGHT, `${height}px`); }

        function getTimelineHeaderHeight() { return parseInt(getVariable(VAR_TIMELINE_HEADER_HEIGHT)); }
        function setTimelineHeaderHeight(height: number) { setVariable(VAR_TIMELINE_HEADER_HEIGHT, `${height}px`); }

        function getTimelineCanvasHeight() { return parseInt(getVariable(VAR_TIMELINE_CANVAS_HEIGHT)); }
        function setTimelineCanvasHeight(height: number) { setVariable(VAR_TIMELINE_CANVAS_HEIGHT, `${height}px`); }

        function getTimelineCanvasContentHeight() { return parseInt(getVariable(VAR_TIMELINE_CANVAS_CONTENT_HEIGHT)); }
        function setTimelineCanvasContentHeight(height: number) { setVariable(VAR_TIMELINE_CANVAS_CONTENT_HEIGHT, `${height}px`); }

        function getTimelineHeight() { return getTimelineTitleHeight() + getTimelineHeaderHeight() + getTimelineCanvasHeight(); }

        function getCellWidth() { return parseInt(getVariable(VAR_CELL_WIDTH)); }
        function setCellWidth(width: number) { setVariable(VAR_CELL_WIDTH, `${width}px`); }

        function getCellHeight() { return parseInt(getVariable(VAR_CELL_HEIGHT)); }
        function setCellHeight(height: number) { setVariable(VAR_CELL_HEIGHT, `${height}px`); }

        function getCellContentHeight() { return parseInt(getVariable(VAR_CELL_CONTENT_HEIGHT)); }
        function setCellContentHeight(height: number) { setVariable(VAR_CELL_CONTENT_HEIGHT, `${height}px`); }

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
        }
    }();

    /**
     * 차트 엘리먼트를 생성한다.
     * @param container 
     */
    function create(container: HTMLElement) {
        const elementString = `
        <div id="sc-root">
            <div id="sc-left-panel">
                <div id="sc-maintitle"></div>
                <div id="sc-subtitle"></div>
                <div id="sc-entity-list-box"></div>
            </div>
            <div id="sc-main-panel">
                <div id="sc-timeline">
                    <div id="sc-timeline-title"></div>
                    <div id="sc-timeline-header-box">
                        <div id="sc-timeline-header"></div>
                    </div>
                    <div id="sc-timeline-canvas-box">
                        <div id="sc-timeline-canvas"></div>
                    </div>

                </div>
                <div id="sc-main-canvas-box">
                    <div id="sc-main-canvas">
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

    function setSettings({
        chartStartTime,
        chartEndTime,
        timelineTitleHeight = 40,
        timelineHeaderHeight = 40,
        timelineCanvasHeight = 40,
        timelineCanvasContentHeight = 30,
        cellMinutes = 60,
        cellWidth = 200,
        cellHeight = 40,
        cellContentHeight = 30,
        headerTimeFormat,
        headerCellRender,
        timelinePointEventRender,
        entityPointEventRender,
        entityRangeEventRender,
        globalRangeEventRender,
        hasHorizontalLine = true,
        hasVerticalLine = true,
        canAutoFit = true
    }: StatusChartSettings) {
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

        _headerTimeFormat = headerTimeFormat ?? ((time: Date) => { return time.toLocaleString(); });
        _headerCellRender = headerCellRender;
        _timelinePointEventRender = timelinePointEventRender;
        _entityRangeEventRender = entityRangeEventRender;
        _entityPointEventRender = entityPointEventRender;
        _globalRangeEventRender = globalRangeEventRender;


        _mainTitleElement = document.getElementById(ID_MAIN_TITLE) as HTMLElement;
        _subTitleElement = document.getElementById(ID_SUBTITLE) as HTMLElement;
        _timelineTitleElement = document.getElementById(ID_TIMELINE_TITLE) as HTMLElement;

        _entityListBoxElement = document.getElementById(ID_ENTITY_LIST_BOX) as HTMLElement;

        _timelineHeaderBoxElement = document.getElementById(ID_TIMELINE_HEADER_BOX) as HTMLElement;
        _timelineHeaderElement = document.getElementById(ID_TIMELINE_HEADER) as HTMLElement;

        _timelineCanvasBoxElement = document.getElementById(ID_TIMELINE_CANVAS_BOX) as HTMLElement;
        _timelineCanvasElement = document.getElementById(ID_TIMELINE_CANVAS) as HTMLElement;

        _mainCanvasBoxElement = document.getElementById(ID_MAIN_CANVAS_BOX) as HTMLElement;
        _mainCanvasElement = document.getElementById(ID_MAIN_CANVAS) as HTMLElement;
    }

    function setData(entities: Entity[],
        timelinePointEvents: PointEvent[],
        globalRangeEvents: RangeEvent[],
        mainTitle: string, subtitle: string, timelineHeader: string) {

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
        _headerCellCount = 0;
        while (time < end) {

            if (_headerCellRender != null) {
                const containerElement = document.createElement("div");
                _timelineHeaderElement.appendChild(containerElement);
                containerElement.classList.add(CLS_TIMELINE_HEADER_ITEM);
                _headerCellRender(time, containerElement);
            }
            else {
                const div = document.createElement("div");
                div.innerText = _headerTimeFormat(time);;
                div.classList.add(CLS_TIMELINE_HEADER_ITEM);
                _timelineHeaderElement.appendChild(div);
            }

            time = new Date(time.getTime() + dateTimeService.toTime(_cellMinutes));
            _headerCellCount++;
        }

        resetCanvas();

        _mainCanvasBoxElement.addEventListener("scroll", (e) => {
            _timelineHeaderBoxElement.scrollLeft = _mainCanvasBoxElement.scrollLeft;
            _timelineCanvasBoxElement.scrollLeft = _mainCanvasBoxElement.scrollLeft;
        });

        _mainCanvasBoxElement.addEventListener("scroll", (e) => {
            _entityListBoxElement.scrollTop = _mainCanvasBoxElement.scrollTop;
        });

        _mainCanvasElement.addEventListener("wheel", (e) => {
            if (e.ctrlKey) {
                let pivotPoint = 0; // 리사이징 기준위치. 마우스 커서가 위치한 셀의 좌표.
                // 대상 엘리먼트에 따라 pivotPoint를 다르게 계산한다.
                if (e.target == _mainCanvasElement) {
                    pivotPoint = e.offsetX;
                }
                else if ((e.target as HTMLElement).parentElement.parentElement == _mainCanvasElement) {
                    pivotPoint = (e.target as HTMLElement).parentElement.offsetLeft + e.offsetX;
                }
                else {
                    return;
                }

                if (e.deltaY > 0) {
                    sizeDownCellWidth(pivotPoint);
                }
                else {
                    sizeUpCellWidth(pivotPoint);
                }
            }
        });

        // prevent default zoom
        document.body.addEventListener("wheel", (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        }, {
            passive: false
        });
    }

    /**
     * 캔버스 크기를 재조정한다.
     */
    function resetCanvas() {
        /**
         * main canvas에만 스크롤을 표시한다.
         * timeline header와 timeline canvas는 main canvas 수평스크롤과 동기화한다.
         * entity list는 main canvas 수직스크롤과 동기화한다.
         */
        const canvasWidth = cssService.getCellWidth() * _headerCellCount;

        const chartHeight = cssService.getChartHeight();
        const timelineHeight = cssService.getTimelineHeight();
        const scrollWidth = cssService.getScrollWidth();
        const providedCanvasHeight = chartHeight - timelineHeight - scrollWidth;
        const requiredCanvasHeight = cssService.getCellHeight() * _entities.length;
        let canvasHeight = requiredCanvasHeight;
        // 필요한 높이가 제공된 높이보다 작을 경우 높이를 맞춘다.
        if (_canAutoFit && requiredCanvasHeight < providedCanvasHeight) {
            cssService.setChartHeight(timelineHeight + scrollWidth + canvasHeight);
        }

        _timelineHeaderElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _timelineCanvasElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _mainCanvasElement.style.width = `${canvasWidth}px`;
        _mainCanvasElement.style.height = `${canvasHeight}px`;
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
            div.classList.add(CLS_ENTITY_LIST_ITEM);

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

    function drawTimelinePointEvent(event: PointEvent) {
        const containerElement = document.createElement("div");
        _timelineCanvasElement.appendChild(containerElement);

        const center = dateTimeService.toMinutes(event.time.valueOf() - _chartStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const top = (cssService.getTimelineCanvasHeight() - cssService.getTimelineCanvasContentHeight()) / 2 - 1;
        const width = cssService.getTimelineCanvasContentHeight();
        containerElement.style.left = `${center - (width / 2)}px`;
        containerElement.style.top = `${top}px`;
        containerElement.classList.add(CLS_TIMELINE_CANVAS_ITEM);

        _timelinePointEventRender(event, _timelineCanvasElement, containerElement);
    }

    /**
     * 메인 캔버스를 그린다.
     */
    function drawMainCanvas() {
        _mainCanvasElement.replaceChildren();

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
            const line = document.createElement("div") as HTMLElement;
            line.classList.add(CLS_VLINE);

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
            line.classList.add(CLS_HLINE);

            line.style.top = `${cellHeight * (i + 1) - 1}px`;
            line.style.width = `${_mainCanvasElement.scrollWidth}px`;
            _mainCanvasElement.appendChild(line);
        }
    }


    function drawEntityRangeEvents(entity: Entity, rowIndex: number) {
        if (entity.rangeEvents == null || entity.rangeEvents.length == 0)
            return;
        for (const event of entity.rangeEvents) {
            drawLocalRangeEvent(event, rowIndex, _entityRangeEventRender);
        }
    }

    function drawLocalRangeEvent(event: RangeEvent, rowIndex: number, render: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void) {
        const containerElement = document.createElement("div");
        containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);
        _mainCanvasElement.appendChild(containerElement);

        const left = dateTimeService.toMinutes(event.start.valueOf() - _chartStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / _cellMinutes;
        const top = (cssService.getCellHeight() * rowIndex)
            + (cssService.getCellHeight() - cssService.getCellContentHeight()) / 2
            - 1;

        containerElement.style.left = `${left}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.width = `${width}px`;
        containerElement.style.zIndex = `${Z_INDEX_ENTITY_RANGE_EVENT}`;
        containerElement.addEventListener("click", (e) => {
            console.log(e);
        });

        render(event, _mainCanvasElement, containerElement);
    }

    function drawEntityPointEvents(entity: Entity, rowIndex: number) {
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
    function drawLocalPointEvent(event: PointEvent, rowIndex: number, render: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void) {
        const containerElement = document.createElement("div");
        _mainCanvasElement.appendChild(containerElement);

        const center = dateTimeService.toMinutes(event.time.valueOf() - _chartStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const top = (cssService.getCellHeight() * rowIndex) + ((cssService.getCellHeight() - cssService.getCellContentHeight()) / 2) - 1;
        const width = cssService.getCellContentHeight();
        containerElement.style.left = `${center - (width / 2)}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.zIndex = `${Z_INDEX_ENTITY_POINT_EVENT}`;
        containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);

        render(event, _mainCanvasElement, containerElement);
    }

    function drawGlobalEvent(event: RangeEvent, render: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void) {
        const containerElement = document.createElement("div");
        _mainCanvasElement.appendChild(containerElement);

        const left = dateTimeService.toMinutes(event.start.valueOf() - _chartStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / _cellMinutes;
        containerElement.style.left = `${left}px`;
        containerElement.style.top = "0px";
        containerElement.style.width = `${width}px`;
        containerElement.style.height = "100%";
        containerElement.style.zIndex = `${Z_INDEX_GLOBAL_RANGE_EVENT}`;
        containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);

        render(event, _mainCanvasElement, containerElement);
    }

    /**
     * 셀 너비 변경을 통해 캔버스 크기를 조정한다. 
     * @param cellWidth 셀 너비
     * @param pivotPointX 스크롤 기준 위치
     */
    function resizeCanvas(cellWidth: number, pivotPointX?: number) {
        if (cellWidth < MIN_CELL_WIDTH) {
            return;
        }
        if (cellWidth > MAX_CELL_WIDTH) {
            return;
        }

        // 리사이징 후 스크롤 위치 계산
        let scrollLeft = _mainCanvasBoxElement.scrollLeft;
        if (pivotPointX) {
            const scrollOffset = pivotPointX - scrollLeft;
            const prevCellWidth = cssService.getCellWidth();
            const newPivotPointX = pivotPointX * cellWidth / prevCellWidth; // 기준점까지의 거리
            scrollLeft = newPivotPointX - scrollOffset;
        }

        cssService.setCellWidth(cellWidth);
        resetCanvas();

        drawMainCanvas();

        // keep scroll position
        if (scrollLeft) {
            _mainCanvasBoxElement.scrollLeft = scrollLeft;
        }
    }

    function sizeUpCellWidth(pivotPointX?: number) {
        const cellWidth = cssService.getCellWidth();
        resizeCanvas(cellWidth + 10, pivotPointX);
    }

    function sizeDownCellWidth(pivotPointX?: number) {
        const cellWidth = cssService.getCellWidth();
        resizeCanvas(cellWidth - 10, pivotPointX);
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

        resizeCellWidth: resizeCanvas,
        sizeUpCellWidth,
        sizeDownCellWidth
    }
};

