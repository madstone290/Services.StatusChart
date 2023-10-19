namespace Mad {

    /**
     * 차트 이벤트.
     */
    export interface PointEvent {
        [key: string]: any;
        time: Date;
    }

    export interface RangeEvent {
        [key: string]: any;
        startTime: Date;
        endTime: Date;
    }

    export interface Entity {
        [key: string]: any;
        name: string;
        pointEvents: PointEvent[];
        rangeEvents: RangeEvent[];
    }

    export interface ChartData {

        entities: Entity[];

        /**
         * 사이드캔버스에 표시할 이벤트
         */
        sidePointEvents: PointEvent[];

        /**
         * 메인 캔버스에 표시할 글로벌 포인트 이벤트 목록.
         */
        globalRangeEvents: RangeEvent[];
    }

    export interface ChartDataOptions {
        entityNameProp?: string;
        entityPointEventsProp?: string;
        entityRangeEventsProp?: string;
        pointEventTimeProp?: string;
        rangeEventStartTimeProp?: string;
        rangeEventEndTimeProp?: string;
    }

    export interface ChartOptions {
        chartStartTime: Date;
        chartEndTime: Date;
        paddingCellCount?: number;
        mainTitle?: string;
        subTitle?: string;
        headerTitle?: string;
        leftPanelWidth?: number;
        timelineTitleHeight?: number;
        timelineHeaderHeight?: number;
        timelineCanvasHeight?: number;
        timelineCanvasContentHeightRatio?: number;
        cellMinutes?: number;
        cellWidth?: number;
        cellHeight?: number;
        minCellWidth?: number;
        minCellHeight?: number;
        maxCellWidth?: number;
        maxCellHeight?: number;
        cellContentHeightRatio?: number;
        maxResizeScale?: number;
        hasHorizontalLine?: boolean;
        hasVerticalLine?: boolean;
        canAutoFit?: boolean;
        headerTimeFormat?: (time: Date) => string;
        headerCellRender?: (time: Date, containerEl: HTMLElement) => void;
        entityRender?: (entity: Entity, containerEl: HTMLElement) => void;
        sidePointEventRender: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
        entityPointEventRender: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
        entityRangeEventRender: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
        globalRangeEventRender: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;

    }

    interface ChartState {
        chartStartTime: Date;
        chartEndTime: Date;
        paddingCellCount: number;
        mainTitle: string;
        subTitle: string;
        headerTitle?: string;
        leftPanelWidth: number;
        timelineTitleHeight: number;
        timelineHeaderHeight: number;
        timelineCanvasHeight: number;
        timelineCanvasContentHeightRatio: number;
        timelineCanvasContentHeight: number;
        scrollWidth: number;
        cellMinutes: number;
        cellWidth: number;
        cellHeight: number;
        minCellWidth: number;
        minCellHeight: number;
        maxCellWidth: number;
        maxCellHeight: number;
        chartHeight: number;
        chartWidth: number;
        cellContentHeightRatio: number;
        cellContentHeight: number;
        headerCellCount: number;
        maxResizeScale: number;
        hasHorizontalLine: boolean;
        hasVerticalLine: boolean;
        canAutoFit: boolean;
        headerTimeFormat: (time: Date) => string;
        headerCellRender: (time: Date, containerElement: HTMLElement) => void;
        entityRender: (entity: Entity, containerEl: HTMLElement) => void;
        sidePointEventRender: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
        entityPointEventRender: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
        entityRangeEventRender: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
        globalRangeEventRender: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;

        /**
        * 차트 렌더링 시작 시간
        */
        chartRenderStartTime: Date;

        /**
         * 차트 렌더링 종료 시간
         */
        chartRenderEndTime: Date;

        /**
         * 셀 너비 조절 단위. 마우스 휠을 이용해 셀 크기를 조절할 때 사용한다.
         */
        resizeWidthstep: number;

        /**
         * 셀 높이 조절 단위. 마우스 휠을 이용해 셀 크기를 조절할 때 사용한다.
         */
        resizeHeightStep: number;

    }

    export const TimelineChart = function () {

        /* Layout
        |---------------|-------------------|
        | main title    | timeline title    |
        |---------------|-------------------|
        |               | timeline header   |
        | sub title     |-------------------|
        |               | side canvas       |
        |---------------|-------------------|
        |               |                   |
        | entity list   | main canvas       |
        |               |                   |
        |---------------|-------------------|
        */
        // #region Constants
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

        const Z_INDEX_ENTITY_POINT_EVENT = 3;
        const Z_INDEX_ENTITY_RANGE_EVENT = 2;
        const Z_INDEX_GLOBAL_RANGE_EVENT = 1;

        // #endregion
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

        let _data: ChartData;
        let _dataOptions: ChartDataOptions = {
            entityNameProp: "name",
            entityPointEventsProp: "pointEvents",
            entityRangeEventsProp: "rangeEvents",
            pointEventTimeProp: "time",
            rangeEventStartTimeProp: "startTime",
            rangeEventEndTimeProp: "endTime"
        }

        let _state: ChartState = {
            chartStartTime: new Date(),
            chartEndTime: new Date(),
            paddingCellCount: 2,
            mainTitle: "",
            subTitle: "",
            leftPanelWidth: 200,
            scrollWidth: 15,
            timelineTitleHeight: 40,
            timelineHeaderHeight: 40,
            timelineCanvasHeight: 40,
            timelineCanvasContentHeightRatio: 0.8,
            cellMinutes: 30,
            cellWidth: 40,
            cellHeight: 40,
            minCellWidth: 40,
            minCellHeight: 40,
            maxCellWidth: 40 * 3,
            maxCellHeight: 40 * 3,
            chartHeight: 0,
            chartWidth: 0,
            cellContentHeightRatio: 0.8,
            maxResizeScale: 3,
            headerTimeFormat: null,
            headerCellRender: null,
            entityRender: null,
            sidePointEventRender: null,
            entityPointEventRender: null,
            entityRangeEventRender: null,
            globalRangeEventRender: null,
            hasHorizontalLine: true,
            hasVerticalLine: true,
            canAutoFit: true,
            chartRenderStartTime: new Date(),
            chartRenderEndTime: new Date(),
            resizeHeightStep: 10,
            resizeWidthstep: 10,
            headerCellCount: 0,
            cellContentHeight: 0,
            timelineCanvasContentHeight: 0,
        }

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

            const VAR_LEFT_PANEL_WIDTH = "--tc-list-width";
            function getVariable(name: string) {
                return getComputedStyle(_rootElement).getPropertyValue(name);
            }

            function setVariable(name: string, value: string) {
                _rootElement.style.setProperty(name, value);
            }

            function setChartWidth(width: number) {
                setVariable(VAR_CHART_WIDTH, `${width}px`);
            }

            function setLeftPanelWidth(width: number) {
                setVariable(VAR_LEFT_PANEL_WIDTH, `${width}px`);
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

            function setScrollWidth(width: number) { setVariable(VAR_SCROLL_WIDTH, `${width}px`); }

            return {
                getVariable,
                setVariable,

                setLeftPanelWidth,

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

                setScrollWidth
            }
        }();

        /**
         * 차트 엘리먼트를 생성한다.
         * @param container 
         */
        function create(container: HTMLElement, data: ChartData, options: ChartOptions, dataOptions?: ChartDataOptions) {
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
            _state.chartWidth = container.clientWidth;
            _state.chartHeight = container.clientHeight;

            setData(data);
            setOptions(options);
            _dataOptions = dataOptions ?? _dataOptions;
        }


        function setOptions(options: ChartOptions) {
            Object.entries(options)
                .filter(([key, value]) => value !== undefined)
                .forEach(([key, value]) => {
                    (_state as any)[key] = value;
                });

            _state.minCellWidth = options.minCellWidth ?? _state.cellWidth;
            _state.maxCellWidth = options.maxCellWidth ?? _state.cellWidth * _state.maxResizeScale;
            _state.minCellHeight = options.minCellHeight ?? _state.cellHeight;
            _state.maxCellHeight = options.maxCellHeight ?? _state.cellHeight * _state.maxResizeScale;

            _state.timelineCanvasContentHeight = _state.timelineCanvasContentHeightRatio * _state.timelineCanvasHeight;
            _state.cellContentHeight = _state.cellContentHeightRatio * _state.cellHeight;

            _state.chartRenderStartTime = new Date(_state.chartStartTime.getTime() - dateTimeService.toTime(_state.cellMinutes * _state.paddingCellCount))
            _state.chartRenderEndTime = new Date(_state.chartEndTime.getTime() + dateTimeService.toTime(_state.cellMinutes * _state.paddingCellCount))
            _state.resizeWidthstep = _state.cellWidth / 10;
            _state.resizeHeightStep = _state.cellHeight / 10;

            _state.headerTimeFormat = options.headerTimeFormat ?? ((time: Date) => { return time.toLocaleString(); });
            _state.headerCellRender = options.headerCellRender ?? ((time: Date, containerElement: HTMLElement) => {
                const div = document.createElement("div");
                div.innerText = _state.headerTimeFormat(time);
                containerElement.appendChild(div);
            });
            _state.entityRender = options.entityRender ?? ((entity: Entity, containerElement: HTMLElement) => {
                const div = document.createElement("div");
                div.style.height = "100%";
                div.style.width = "100%";
                div.style.display = "flex";
                div.style.justifyContent = "center";
                div.style.alignItems = "center";
                div.innerText = entity[_dataOptions.entityNameProp]
                containerElement.appendChild(div);
            });
        }

        function setData(data: ChartData) {
            _data = data;
        }

        /**
         * 차트를 그린다.
         */
        function render() {
            // init layout (calc & apply size)
            // render texts
            // render header
            // add event listeners
            // render side canvas
            // render entity list(main canvas)

            _initLayout();
            _renderHeader();
            _addEventListeners();

            _resetCanvasSize();

            _renderSideCanvas();
            _renderSidePointEvents();

            _renderMainCanvas();
            _renderEntityList();
            _renderGlobalRangeEvents();
        }

        function _initLayout() {
            cssService.setChartWidth(_state.chartWidth);
            cssService.setChartHeight(_state.chartHeight);
            cssService.setLeftPanelWidth(_state.leftPanelWidth);
            cssService.setTimeLineTitleHeight(_state.timelineTitleHeight);
            cssService.setTimelineHeaderHeight(_state.timelineHeaderHeight);
            cssService.setTimelineCanvasHeight(_state.timelineCanvasHeight);

            cssService.setCellWidth(_state.cellWidth);
            cssService.setCellHeight(_state.cellHeight);
            cssService.setTimelineCanvasContentHeight(_state.timelineCanvasContentHeight);
            cssService.setCellContentHeight(_state.cellContentHeight);

            cssService.setScrollWidth(_state.scrollWidth);

            _mainTitleElement.innerText = _state.mainTitle;
            _subTitleElement.innerText = _state.subTitle;
            _timelineTitleElement.innerText = _state.headerTitle;
        }

        function _renderHeader() {
            let time = _state.chartRenderStartTime;
            let end = _state.chartRenderEndTime;
            let headerCellCount = 0;

            while (time < end) {
                const containerElement = document.createElement("div");
                _timelineHeaderElement.appendChild(containerElement);
                containerElement.classList.add(CLS_TIMELINE_HEADER_ITEM);
                _state.headerCellRender(time, containerElement);

                time = new Date(time.getTime() + dateTimeService.toTime(_state.cellMinutes));
                headerCellCount++;
            }
            _state.headerCellCount = headerCellCount;
        }

        function _addEventListeners() {
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
                resizeCanvasWhenWheel(_mainCanvasElement, e);
            });

            _timelineCanvasElement.addEventListener("wheel", (e) => {
                resizeCanvasWhenWheel(_timelineCanvasElement, e);
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
         * 휠이벤트 발생시 캔버스 리사이징을 수행한다.
         * @param canvasElement 
         * @param e 
         * @returns 
         */
        function resizeCanvasWhenWheel(canvasElement: HTMLElement, e: WheelEvent) {
            if (e.ctrlKey) {
                let pivotPoint = { x: 0, y: 0 }; // 리사이징 기준위치. 마우스 커서가 위치한 셀의 좌표.
                // 대상 엘리먼트에 따라 pivotPoint를 다르게 계산한다.
                if (e.target == canvasElement) {
                    pivotPoint.x = e.offsetX;
                    pivotPoint.y = e.offsetY;
                }
                else if ((e.target as HTMLElement).parentElement.parentElement == canvasElement) {
                    pivotPoint.x = (e.target as HTMLElement).parentElement.offsetLeft + e.offsetX;
                    pivotPoint.y = (e.target as HTMLElement).parentElement.offsetTop + e.offsetY;
                }
                else {
                    return;
                }
                if (e.deltaY > 0) {
                    sizeDownCanvas(pivotPoint.x, pivotPoint.y);
                }
                else {
                    sizeUpCanvas(pivotPoint.x, pivotPoint.y);
                }
            }
        }
        /**
         * 캔버스 크기를 재조정한다.
         */
        function _resetCanvasSize() {
            /**
             * main canvas에만 스크롤을 표시한다.
             * timeline header와 timeline canvas는 main canvas 수평스크롤과 동기화한다.
             * entity list는 main canvas 수직스크롤과 동기화한다.
             */
            const canvasWidth = _state.cellWidth * _state.headerCellCount;
            const chartHeight = cssService.getChartHeight();
            const timelineHeight = cssService.getTimelineHeight();
            const scrollWidth = _state.scrollWidth;
            const providedCanvasHeight = chartHeight - timelineHeight - scrollWidth;
            const requiredCanvasHeight = cssService.getCellHeight() * _data.entities.length;
            let canvasHeight = requiredCanvasHeight;
            // 필요한 높이가 제공된 높이보다 작을 경우 높이를 맞춘다.
            if (_state.canAutoFit && requiredCanvasHeight < providedCanvasHeight) {
                cssService.setChartHeight(timelineHeight + scrollWidth + canvasHeight);
            }

            _timelineHeaderElement.style.width = `${canvasWidth + _state.scrollWidth}px`;
            _timelineCanvasElement.style.width = `${canvasWidth + _state.scrollWidth}px`;
            _mainCanvasElement.style.width = `${canvasWidth}px`;
            _mainCanvasElement.style.height = `${canvasHeight}px`;
        }

        /**
         * 보조 캔버스를 그린다.
         */
        function _renderSideCanvas() {
            _timelineCanvasElement.replaceChildren();
            if (_state.hasVerticalLine)
                _renderSideCanvasVerticalLine();
        }
        function _renderSideCanvasVerticalLine() {
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

        function _renderSidePointEvents() {
            if (_data.sidePointEvents != null && _data.sidePointEvents.length > 0) {
                for (const event of _data.sidePointEvents) {
                    _renderSidePointEvent(event);
                }
            }
        }
        function _renderSidePointEvent(event: PointEvent) {
            const containerElement = document.createElement("div");
            _timelineCanvasElement.appendChild(containerElement);

            const eventTime = event[_dataOptions.pointEventTimeProp] as Date;
            const time = dateTimeService.toMinutes(eventTime.valueOf() - _state.chartRenderStartTime.valueOf());
            const center = time * _state.cellWidth / _state.cellMinutes;
            const top = _state.timelineCanvasHeight - _state.timelineCanvasContentHeight / 2 - 1;
            const width = _state.timelineCanvasContentHeight;

            containerElement.style.left = `${center - (width / 2)}px`;
            containerElement.style.top = `${top}px`;
            containerElement.classList.add(CLS_TIMELINE_CANVAS_ITEM);

            if (_state.sidePointEventRender != null)
                _state.sidePointEventRender(event, _timelineCanvasElement, containerElement);
        }

        function _renderMainCanvas() {
            _mainCanvasElement.replaceChildren();
            if (_state.hasHorizontalLine)
                _renderMainCanvasHLine();
            if (_state.hasVerticalLine)
                _renderMainCanvasVLine();
        }
        function _renderMainCanvasVLine() {
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
        function _renderMainCanvasHLine() {
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


        /**
         * 엔티티 리스트를 그린다.
         */
        function _renderEntityList() {
            const canvasHeight = _mainCanvasElement.scrollHeight;
            const cellHeight = _state.cellHeight;
            const lineCount = Math.floor(canvasHeight / cellHeight);
            for (let i = 0; i < lineCount; i++) {
                const containerEl = document.createElement("div");
                _entityListBoxElement.appendChild(containerEl);
                containerEl.classList.add(CLS_ENTITY_LIST_ITEM);

                const entity = _data.entities[i];
                if (entity == null)
                    continue;
                _state.entityRender(entity, containerEl);
                _renderEntityEvents(entity, i);
            }
        }


        function _renderEntityEvents(entity: Entity, rowIndex: number) {
            if (entity.pointEvents != null && entity.pointEvents.length > 0) {
                for (const event of entity.pointEvents) {
                    _renderEntityPointEvent(event, rowIndex);
                }
            }
            if (entity.rangeEvents != null && entity.rangeEvents.length > 0) {
                for (const event of entity.rangeEvents) {
                    _renderEntityRangeEvent(event, rowIndex);
                }
            }
        }

        function _renderEntityPointEvent(event: PointEvent, rowIndex: number) {
            const containerElement = document.createElement("div");
            _mainCanvasElement.appendChild(containerElement);

            const eventTime = event[_dataOptions.pointEventTimeProp] as Date;
            const time = dateTimeService.toMinutes(eventTime.valueOf() - _state.chartRenderStartTime.valueOf());
            const center = time * _state.cellWidth / _state.cellMinutes;
            const top = (_state.cellHeight * rowIndex) + ((_state.cellHeight - _state.cellContentHeight) / 2) - 1;
            const width = _state.cellContentHeight;

            containerElement.style.left = `${center - (width / 2)}px`;
            containerElement.style.top = `${top}px`;
            containerElement.style.zIndex = `${Z_INDEX_ENTITY_POINT_EVENT} `;
            containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);


            if (_state.entityPointEventRender != null)
                _state.entityPointEventRender(event, _mainCanvasElement, containerElement);
        }

        function _renderEntityRangeEvent(event: RangeEvent, rowIndex: number) {
            const containerElement = document.createElement("div");
            _mainCanvasElement.appendChild(containerElement);

            const eventStartTime = event[_dataOptions.rangeEventStartTimeProp] as Date;
            const eventEndTime = event[_dataOptions.rangeEventEndTimeProp] as Date;
            const startTime = dateTimeService.toMinutes(eventStartTime.valueOf() - _state.chartRenderStartTime.valueOf());
            const duration = dateTimeService.toMinutes(eventEndTime.valueOf() - eventStartTime.valueOf());
            const left = startTime * _state.cellWidth / _state.cellMinutes;
            const width = duration * _state.cellWidth / _state.cellMinutes;
            const top = (_state.cellHeight * rowIndex)
                + (_state.cellHeight - _state.cellContentHeight) / 2
                - 1;

            containerElement.style.left = `${left}px`;
            containerElement.style.top = `${top}px`;
            containerElement.style.width = `${width}px`;
            containerElement.style.zIndex = `${Z_INDEX_ENTITY_RANGE_EVENT} `;
            containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);

            if (_state.entityRangeEventRender != null)
                _state.entityRangeEventRender(event, _mainCanvasElement, containerElement);
        }

        function _renderGlobalRangeEvents() {
            if (_data.globalRangeEvents != null && _data.globalRangeEvents.length > 0) {
                for (const event of _data.globalRangeEvents) {
                    _renderGlobalRangeEvent(event);
                }
            }
        }

        function _renderGlobalRangeEvent(event: RangeEvent) {
            const containerElement = document.createElement("div");
            _mainCanvasElement.appendChild(containerElement);

            const eventStartTime = event[_dataOptions.rangeEventStartTimeProp] as Date;
            const eventEndTime = event[_dataOptions.rangeEventEndTimeProp] as Date;
            const startTime = dateTimeService.toMinutes(eventStartTime.valueOf() - _state.chartRenderStartTime.valueOf());
            const duration = dateTimeService.toMinutes(eventEndTime.valueOf() - eventStartTime.valueOf());
            const left = startTime * _state.cellWidth / _state.cellMinutes;
            const width = duration * _state.cellWidth / _state.cellMinutes;

            containerElement.style.left = `${left}px`;
            containerElement.style.top = "0px";
            containerElement.style.width = `${width}px`;
            containerElement.style.height = "100%";
            containerElement.style.zIndex = `${Z_INDEX_GLOBAL_RANGE_EVENT} `;
            containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);

            if (_state.globalRangeEventRender != null)
                _state.globalRangeEventRender(event, _mainCanvasElement, containerElement);
        }

        /**
         * 셀 너비 변경을 통해 캔버스 크기를 조정한다. 
         * @param cellWidth 셀 너비
         * @param cellHeight 셀 높이
         * @param pivotPointX 스크롤 x기준 위치
         * @param pivotPointY 스크롤 y기준 위치
         */
        function resizeCanvas(cellWidth: number, cellHeight: number, pivotPointX?: number, pivotPointY?: number) {
            if (cellWidth < _state.minCellWidth || cellHeight < _state.minCellHeight) {
                return;
            }
            if (cellHeight > _state.maxCellHeight || cellWidth > _state.maxCellWidth) {
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
            let scrollTop = _mainCanvasBoxElement.scrollTop;
            if (pivotPointY) {
                const scrollOffset = pivotPointY - scrollTop;
                const prevCellHeight = cssService.getCellHeight();
                const newPivotPointY = pivotPointY * cellHeight / prevCellHeight; // 기준점까지의 거리
                scrollTop = newPivotPointY - scrollOffset;
            }

            _state.cellHeight = cellHeight;
            _state.cellWidth = cellWidth;
            _state.cellContentHeight = _state.cellContentHeightRatio * _state.cellHeight;

            cssService.setCellWidth(_state.cellWidth);
            cssService.setCellHeight(_state.cellHeight);
            cssService.setCellContentHeight(_state.cellContentHeight);

            _resetCanvasSize();
            _renderSideCanvas();
            _renderMainCanvas();

            // keep scroll position
            _mainCanvasBoxElement.scrollLeft = scrollLeft;
            _mainCanvasBoxElement.scrollTop = scrollTop;
        }

        function sizeUpCanvas(pivotPointX?: number, pivotPointY?: number) {
            resizeCanvas(
                _state.cellWidth + _state.resizeWidthstep,
                _state.cellHeight + _state.resizeHeightStep,
                pivotPointX,
                pivotPointY);
        }

        function sizeDownCanvas(pivotPointX?: number, pivotPointY?: number) {
            resizeCanvas(
                _state.cellWidth - _state.resizeWidthstep,
                _state.cellHeight - _state.resizeHeightStep,
                pivotPointX,
                pivotPointY);
        }

        return {
            create,
            render,
        }
    };


}