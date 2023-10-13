
interface TimelineChartOptions {
    mainTitle?: string;
    subTitle?: string;
    headerTitle?: string;
    chartStartTime: Date;
    chartEndTime: Date;
    timelineTitleHeight?: number;
    timelineHeaderHeight?: number;
    timelineCanvasHeight?: number;
    timelineCanvasContentHeight?: number;
    cellMinutes: number;
    cellWidth?: number;
    cellHeight?: number;
    minCellWidth?: number;
    maxCellWidth?: number;
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

interface TimelineChartData {
    /**
     * 엔티티 목록. 메인 캔버스에 표시할 엔티티 목록.
     */
    entities: Entity[];

    /**
     * 사이드(타임라인)캔버스에 표시할 이벤트
     */
    sidePointEvents: PointEvent[];

    /**
     * 메인 캔버스에 표시할 글로벌 레인지 이벤트 목록.
     */
    globalRangeEvents: RangeEvent[];
}

const TimelineChart = function () {
    const CLS_ROOT = "tc-root";
    const CLS_TIMELINE_TITLE = "tc-timeline-title";
    const CLS_TIMELINE_HEADER_BOX = "tc-timeline-header-box";
    const CLS_TIMELINE_HEADER = "tc-timeline-header";
    const CLS_TIMELINE_CANVAS_BOX = "tc-timeline-canvas-box";
    const CLS_TIMELINE_CANVAS = "tc-timeline-canvas";
    const CLS_TIMELINE_HEADER_ITEM = "tc-timeline-header-item";
    const CLS_TIMELINE = "tc-timeline";
    const CLS_LEFT_PANEL = "tc-left-panel";
    const CLS_MAIN_PANEL = "tc-main-panel";
    const CLS_MAIN_TITLE = "tc-maintitle";
    const CLS_SUBTITLE = "tc-subtitle";
    const CLS_ENTITY_LIST_BOX = "tc-entity-list-box";

    const CLS_MAIN_CANVAS_BOX = "tc-main-canvas-box";
    const CLS_MAIN_CANVAS = "tc-main-canvas";

    const CLS_ENTITY_LIST_ITEM = "tc-entity-list-item";
    const CLS_TIMELINE_CANVAS_ITEM = "tc-timeline-canvas-item";
    const CLS_MAIN_CANVAS_ITEM = "tc-main-canvas-item";
    const CLS_HLINE = "tc-hline";
    const CLS_VLINE = "tc-vline";

    /**
     * 타임라인차트 엘리먼트
     */
    const TC_ELEMENT_HTML = `
        <div class="${CLS_ROOT}">
            <div class="${CLS_LEFT_PANEL}">
                <div class="${CLS_MAIN_TITLE}"></div>
                <div class="${CLS_SUBTITLE}"></div>
                <div class="${CLS_ENTITY_LIST_BOX}"></div>
            </div>
            <div class="${CLS_MAIN_PANEL}">
                <div class="${CLS_TIMELINE}">
                    <div class="${CLS_TIMELINE_TITLE}"></div>
                    <div class="${CLS_TIMELINE_HEADER_BOX}">
                        <div class="${CLS_TIMELINE_HEADER}"></div>
                    </div>
                    <div class="${CLS_TIMELINE_CANVAS_BOX}">
                        <div class="${CLS_TIMELINE_CANVAS}"></div>
                    </div>

                </div>
                <div class="${CLS_MAIN_CANVAS_BOX}">
                    <div class="${CLS_MAIN_CANVAS}">
                    </div>
                </div>
            </div>
        </div>
        `;

    const Z_INDEX_ENTITY_POINT_EVENT = 3;
    const Z_INDEX_ENTITY_RANGE_EVENT = 2;
    const Z_INDEX_GLOBAL_RANGE_EVENT = 1;

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
     * 차트의 시작 시간. 렌더링 시작시간과 다를 수 있다.
     */
    let _chartStartTime: Date;

    /**
     * 차트의 종료 시간. 렌더링 시작시간과 다를 수 있다.
     */
    let _chartEndTime: Date;

    /**
     * 차트 렌더링 시작 시간
     */
    let _chartRenderStartTime: Date;

    /**
     * 차트 렌더링 종료 시간
     */
    let _chartRenderEndTime: Date;

    /**
     * 차트 좌우 공백을 채울 셀 개수. 좌/우측에 각각 적용된다.
     */
    let _paddingCellCount: number = 2;

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
     * 셀 크기 조절 단위. 마우스 휠을 이용해 셀 크기를 조절할 때 사용한다.
     */
    let _resizeUnit = 20;

    /**
     * 리사이즈에서 허용하는 최소 셀 너비. 설정값이 없는 경우 기본 셀너비와 동일하다.
     */
    let _minCellWidth: number;

    /**
     * 리사이즈에서 허용하는 최대 셀 너비.
     */
    let _maxCellWidth: number = MAX_CELL_WIDTH

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
    let _rootElement: HTMLElement;
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
        const VAR_CELL_WIDTH = "--tc-cell-width";
        const VAR_CELL_HEIGHT = "--tc-cell-height";
        const VAR_CELL_CONTENT_HEIGHT = "--tc-cell-content-height";
        const VAR_SCROLL_WIDTH = "--tc-scroll-width";

        const VAR_CHART_HEIGHT = "--tc-height";
        const VAR_CHART_WIDTH = "--tc-width";

        const VAR_TIMELINE_TITLE_HEIGHT = "--tc-timeline-title-height";
        const VAR_TIMELINE_HEADER_HEIGHT = "--tc-timeline-header-height";
        const VAR_TIMELINE_CANVAS_HEIGHT = "--tc-timeline-canvas-height";
        const VAR_TIMELINE_CANVAS_CONTENT_HEIGHT = "--tc-timeline-canvas-content-height";

        function getVariable(name: string) {
            return getComputedStyle(_rootElement).getPropertyValue(name);
        }

        function setVariable(name: string, value: string) {
            _rootElement.style.setProperty(name, value);
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
    function create(container: HTMLElement, data: TimelineChartData, options: TimelineChartOptions) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(TC_ELEMENT_HTML, 'text/html');
        const element = doc.body.firstChild;
        container.appendChild(element);

        _rootElement = container.getElementsByClassName(CLS_ROOT)[0] as HTMLElement;
        _mainTitleElement = container.getElementsByClassName(CLS_MAIN_TITLE)[0] as HTMLElement;
        _subTitleElement = container.getElementsByClassName(CLS_SUBTITLE)[0] as HTMLElement;
        _timelineTitleElement = container.getElementsByClassName(CLS_TIMELINE_TITLE)[0] as HTMLElement;
        _entityListBoxElement = container.getElementsByClassName(CLS_ENTITY_LIST_BOX)[0] as HTMLElement;
        _timelineHeaderBoxElement = container.getElementsByClassName(CLS_TIMELINE_HEADER_BOX)[0] as HTMLElement;
        _timelineHeaderElement = container.getElementsByClassName(CLS_TIMELINE_HEADER)[0] as HTMLElement;
        _timelineCanvasBoxElement = container.getElementsByClassName(CLS_TIMELINE_CANVAS_BOX)[0] as HTMLElement;
        _timelineCanvasElement = container.getElementsByClassName(CLS_TIMELINE_CANVAS)[0] as HTMLElement;
        _mainCanvasBoxElement = container.getElementsByClassName(CLS_MAIN_CANVAS_BOX)[0] as HTMLElement;
        _mainCanvasElement = container.getElementsByClassName(CLS_MAIN_CANVAS)[0] as HTMLElement;

        // 컨테이너 크기에 맞춰 차트 크기를 조정한다.
        cssService.setChartWidth(container.clientWidth);
        cssService.setChartHeight(container.clientHeight);

        setData(data);
        setOptions(options);
    }

    function setOptions({
        mainTitle,
        subTitle,
        headerTitle,
        chartStartTime,
        chartEndTime,
        timelineTitleHeight = 40,
        timelineHeaderHeight = 40,
        timelineCanvasHeight = 40,
        timelineCanvasContentHeight = 30,
        cellMinutes = 60,
        cellWidth = 200,
        minCellWidth,
        maxCellWidth,
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
    }: TimelineChartOptions) {
        _mainTitleElement.innerText = mainTitle;
        _subTitleElement.innerText = subTitle;
        _timelineTitleElement.innerText = headerTitle;

        _cellMinutes = cellMinutes;
        _chartStartTime = chartStartTime;
        _chartEndTime = chartEndTime;
        _chartRenderStartTime = new Date(chartStartTime.getTime() - dateTimeService.toTime(_cellMinutes * _paddingCellCount));
        _chartRenderEndTime = new Date(chartEndTime.getTime() + dateTimeService.toTime(_cellMinutes * _paddingCellCount));
        _hasHorizontalLine = hasHorizontalLine;
        _hasVertialLine = hasVerticalLine;
        _canAutoFit = canAutoFit;

        _minCellWidth = minCellWidth ?? cellWidth;
        _maxCellWidth = maxCellWidth ?? MAX_CELL_WIDTH;

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
    }

    function setData(data: TimelineChartData) {
        const { entities, sidePointEvents: timelinePointEvents, globalRangeEvents } = data;

        _entities = entities;
        _timelinePointEvents = timelinePointEvents;
        _globalRangeEvents = globalRangeEvents;
    }

    /**
     * 차트를 그린다.
     */
    function render() {
        initLayout();
        drawTimelineCanvas();
        drawEntityList();
        drawMainCanvas();
    }

    /**
     * 설정값에 맞춰 레이아웃을 초기화한다.
     */
    function initLayout() {
        let time = _chartRenderStartTime;
        let end = _chartRenderEndTime;
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

        resetCanvasSize();

        _mainCanvasBoxElement.addEventListener("scroll", (e) => {
            _timelineHeaderBoxElement.scrollLeft = _mainCanvasBoxElement.scrollLeft;
            _timelineCanvasBoxElement.scrollLeft = _mainCanvasBoxElement.scrollLeft;
        });

        _mainCanvasBoxElement.addEventListener("scroll", (e) => {
            _entityListBoxElement.scrollTop = _mainCanvasBoxElement.scrollTop;
        });

        _mainCanvasElement.addEventListener("mousemove", (e) => {
            if (e.buttons === 1) {
                _mainCanvasBoxElement.scrollLeft -= e.movementX;
                _mainCanvasBoxElement.scrollTop -= e.movementY;
            }
        });
        _mainCanvasElement.addEventListener("mousedown", (e) => {
            document.body.style.cursor = "pointer";
        });
        _mainCanvasElement.addEventListener("mouseup", (e) => {
            document.body.style.cursor = "default";
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
        // change cursor when ctrl key is pressed
        document.body.addEventListener("keydown", (e) => {
            if (e.ctrlKey) {
                document.body.style.cursor = "pointer";
            }
        });
        // restore cursor when ctrl key is released
        document.body.addEventListener("keyup", (e) => {
            document.body.style.cursor = "default";
        });

    }

    /**
     * 캔버스 크기를 재조정한다.
     */
    function resetCanvasSize() {
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
        _timelineCanvasElement.replaceChildren();

        if (_hasVertialLine)
            drawTimelineVertialLines();

        if (_timelinePointEvents != null && _timelinePointEvents.length > 0) {
            for (const event of _timelinePointEvents) {
                drawTimelinePointEvent(event);
            }
        }
    }
    function drawTimelineVertialLines() {
        const canvasWidth = _timelineCanvasElement.scrollWidth;
        const cellWidth = cssService.getCellWidth();
        const lineCount = Math.floor(canvasWidth / cellWidth);

        for (let i = 0; i < lineCount - 1; i++) {
            const line = document.createElement("div") as HTMLElement;
            line.classList.add(CLS_VLINE);

            line.style.left = `${cellWidth * (i + 1)}px`;
            line.style.height = `${_timelineCanvasElement.scrollHeight}px`;
            _timelineCanvasElement.appendChild(line);
        }
    }

    function drawTimelinePointEvent(event: PointEvent) {
        const containerElement = document.createElement("div");
        _timelineCanvasElement.appendChild(containerElement);

        const center = dateTimeService.toMinutes(event.time.valueOf() - _chartRenderStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
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

        // 
        for (let i = 0; i < lineCount - 1; i++) {
            const line = document.createElement("div") as HTMLElement;
            line.classList.add(CLS_VLINE);

            line.style.left = `${cellWidth * (i + 1)}px`;
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

        const left = dateTimeService.toMinutes(event.start.valueOf() - _chartRenderStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / _cellMinutes;
        const top = (cssService.getCellHeight() * rowIndex)
            + (cssService.getCellHeight() - cssService.getCellContentHeight()) / 2
            - 1;

        containerElement.style.left = `${left}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.width = `${width}px`;
        containerElement.style.zIndex = `${Z_INDEX_ENTITY_RANGE_EVENT} `;
        containerElement.addEventListener("click", (e) => {

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

        const center = dateTimeService.toMinutes(event.time.valueOf() - _chartRenderStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const top = (cssService.getCellHeight() * rowIndex) + ((cssService.getCellHeight() - cssService.getCellContentHeight()) / 2) - 1;
        const width = cssService.getCellContentHeight();
        containerElement.style.left = `${center - (width / 2)}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.zIndex = `${Z_INDEX_ENTITY_POINT_EVENT} `;
        containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);

        render(event, _mainCanvasElement, containerElement);
    }

    function drawGlobalEvent(event: RangeEvent, render: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void) {
        const containerElement = document.createElement("div");
        _mainCanvasElement.appendChild(containerElement);

        const left = dateTimeService.toMinutes(event.start.valueOf() - _chartRenderStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / _cellMinutes;
        containerElement.style.left = `${left}px`;
        containerElement.style.top = "0px";
        containerElement.style.width = `${width}px`;
        containerElement.style.height = "100%";
        containerElement.style.zIndex = `${Z_INDEX_GLOBAL_RANGE_EVENT} `;
        containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);

        render(event, _mainCanvasElement, containerElement);
    }

    /**
     * 셀 너비 변경을 통해 캔버스 크기를 조정한다. 
     * @param cellWidth 셀 너비
     * @param pivotPointX 스크롤 기준 위치
     */
    function resizeCanvas(cellWidth: number, pivotPointX?: number) {
        if (cellWidth < _minCellWidth) {
            return;
        }
        if (cellWidth > _maxCellWidth) {
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
        resetCanvasSize();
        drawTimelineCanvas();
        drawMainCanvas();

        // keep scroll position
        if (scrollLeft) {
            _mainCanvasBoxElement.scrollLeft = scrollLeft;
        }
    }

    function sizeUpCellWidth(pivotPointX?: number) {
        const cellWidth = cssService.getCellWidth();
        resizeCanvas(cellWidth + _resizeUnit, pivotPointX);
    }

    function sizeDownCellWidth(pivotPointX?: number) {
        const cellWidth = cssService.getCellWidth();
        resizeCanvas(cellWidth - _resizeUnit, pivotPointX);
    }

    return {
        create,
        render,
    }
};

