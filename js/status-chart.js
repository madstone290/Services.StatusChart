const StatusChart = function () {
    const TIMELINE_TITLE_ID = "sc-content-timeline-title";
    const TIMELINE_HEADER_BOX_ID = "sc-content-timeline-header-box";
    const TIMELINE_HEADER_ID = "sc-content-timeline-header";
    const TIMELINE_STATUS_ID = "sc-content-timeline-status";
    const LIST_BOX_ID = "sc-list-box";
    const LIST_HEAD_TITLE_ID = "sc-list-head-title";
    const LIST_HEAD_SUBTITLE_ID = "sc-list-head-subtitle";
    const CANVAS_BOX_ID = "sc-content-canvas-box";
    const CANVAS_ID = "sc-content-canvas";
    const LEFT_LEGEND_ID = "sc-legend-left";
    const RIGHT_LEGEND_ID = "sc-legend-right";
    const DEFAULT_CELL_WIDTH = 200;
    const DEFAULT_CELL_HEIGHT = 40;
    const SC_CONTENT_CANVAS_ITEM = "sc-content-canvas-item";
    const SC_HLINE = "sc-hline";
    const SC_VLINE = "sc-vline";
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
    const timelineService = function () {
        const SC_CONTENT_TIMELINE_HEADER_ITEM = "sc-content-timeline-header-item";
        function setTitle(name) {
            const titleElement = document.getElementById(TIMELINE_TITLE_ID);
            titleElement.innerText = name;
        }
        /**
         * draw timeline headers
         * @param {Date} start start time of header
         * @param {Date} end end time of header
         */
        function drawHeaders(start, end, cellMinutes, cellWidth, cellHeight) {
            cssService.setCellWidth(cellWidth);
            cssService.setCellHeight(cellHeight);
            const headerElement = document.getElementById(TIMELINE_HEADER_ID);
            const headers = [];
            let time = start;
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
                time = new Date(time.getTime() + dateTimeService.toTime(cellMinutes));
            }
            for (const data of headers) {
                const div = document.createElement("div");
                div.innerText = data;
                div.classList.add(SC_CONTENT_TIMELINE_HEADER_ITEM);
                headerElement.appendChild(div);
            }
            const canvasWidth = cssService.getCellWidth() * headers.length;
            headerElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
            const canvasElement = document.getElementById(CANVAS_ID);
            canvasElement.style.width = `${canvasWidth}px`;
            const canvasBoxElement = document.getElementById(CANVAS_BOX_ID);
            const headerBoxElement = document.getElementById(TIMELINE_HEADER_BOX_ID);
            canvasBoxElement.addEventListener("scroll", (e) => {
                headerBoxElement.scrollLeft = canvasBoxElement.scrollLeft;
            });
        }
        return {
            setTitle,
            drawHeaders
        };
    }();
    const listService = function () {
        const SC_LIST_ITEM = "sc-list-item";
        function init(title, subTitle, entities) {
            setTitle(title);
            setSubTitle(subTitle);
            drawListItems(entities);
        }
        function setTitle(title) {
            const titleElement = document.getElementById(LIST_HEAD_TITLE_ID);
            titleElement.innerText = title;
        }
        function setSubTitle(subTitle) {
            const subTitleElement = document.getElementById(LIST_HEAD_SUBTITLE_ID);
            subTitleElement.innerText = subTitle;
        }
        function drawListItems(entities) {
            const listBox = document.getElementById(LIST_BOX_ID);
            const canvas = document.getElementById(CANVAS_ID);
            for (const entity of entities) {
                // list item
                const div = document.createElement("div");
                div.innerText = entity.name;
                div.classList.add(SC_LIST_ITEM);
                listBox.appendChild(div);
            }
            canvas.style.height = `${listBox.scrollHeight}px`;
            const canvasBox = document.getElementById(CANVAS_BOX_ID);
            canvasBox.addEventListener("scroll", (e) => {
                listBox.scrollTop = canvasBox.scrollTop;
            });
        }
        return {
            init
        };
    }();
    function drawStatusItems(items, render, startTime, cellMinutes) {
        const statusElement = document.getElementById(TIMELINE_STATUS_ID);
        for (const item of items) {
            const eventElement = render(item);
            eventElement.classList.add("sc-content-timeline-status-item");
            const center = dateTimeService.toMinutes(item.time.valueOf() - startTime.valueOf()) * cssService.getCellWidth() / cellMinutes;
            // const left = cssService.getCellWidth() * event.start / cellMinutes;
            const top = (cssService.getCellHeight() - cssService.getCellContentHeight()) / 2 - 1;
            const width = eventElement.clientWidth;
            const mid = width / 2;
            eventElement.style.left = `${center - mid}px`;
            eventElement.style.top = `${top}px`;
            eventElement.style.zIndex = "3";
            eventElement.addEventListener("click", (e) => {
                console.log(e);
            });
            statusElement.appendChild(eventElement);
        }
    }
    function drawEntityPointEvents(entity, render, rowIndex, startTime, cellMinutes) {
        const canvas = document.getElementById(CANVAS_ID);
        // draw point events
        for (const event of entity.pointEvents) {
            const eventElement = render(event);
            eventElement.classList.add("sc-content-canvas-item");
            const center = dateTimeService.toMinutes(event.time.valueOf() - startTime.valueOf()) * cssService.getCellWidth() / cellMinutes;
            // const left = cssService.getCellWidth() * event.start / cellMinutes;
            const top = (cssService.getCellHeight() * rowIndex)
                + (cssService.getCellHeight() - cssService.getCellContentHeight()) / 2
                - 1;
            const mid = eventElement.clientWidth / 2;
            eventElement.style.left = `${center - mid}px`;
            eventElement.style.top = `${top}px`;
            eventElement.style.zIndex = "3";
            eventElement.addEventListener("click", (e) => {
                console.log(e);
            });
            canvas.appendChild(eventElement);
        }
    }
    function drawGlobalEvents(events, render, startTime, cellMinutes) {
        const canvas = document.getElementById(CANVAS_ID);
        for (const event of events) {
            const containerElement = document.createElement("div");
            canvas.appendChild(containerElement);
            const left = dateTimeService.toMinutes(event.start.valueOf() - startTime.valueOf()) * cssService.getCellWidth() / cellMinutes;
            const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / cellMinutes;
            containerElement.style.left = `${left}px`;
            containerElement.style.top = "0px";
            containerElement.style.width = `${width}px`;
            containerElement.style.height = "100%";
            containerElement.style.zIndex = "1";
            containerElement.classList.add("sc-content-timeline-status-item");
            const eventElement = render(event);
            eventElement.style.width = "100%";
            eventElement.style.height = "100%";
            containerElement.appendChild(eventElement);
        }
    }
    const canvasService = function () {
        /**
         *
         * @param {object} entities Entities to draw
         * @param {Date} startTime Start time of chart
         * @param {number} cellMinutes Minutes for each cell
         * @param {boolean} horizontalLine Whether to draw horizontal line
         * @param {boolean} vertialLine Whether to draw vertical line
         */
        function init(entities, startTime, cellMinutes, horizontalLine = true, vertialLine = true) {
            if (horizontalLine)
                drawHorizontalLines();
            if (vertialLine)
                drawVertialLines();
            let rowIndex = 0;
            for (const entity of entities) {
                drawEntityEvents(entity, rowIndex, startTime, cellMinutes);
                rowIndex++;
            }
        }
        function drawVertialLines() {
            const canvas = document.getElementById(CANVAS_ID);
            const canvasWidth = canvas.scrollWidth;
            const cellWidth = cssService.getCellWidth();
            const lineCount = Math.floor(canvasWidth / cellWidth);
            console.log(lineCount);
            for (let i = 0; i < lineCount; i++) {
                const line = document.createElement("div");
                line.classList.add(SC_VLINE);
                line.style.left = `${cellWidth * (i + 1) - 1}px`;
                line.style.height = `${canvas.scrollHeight}px`;
                canvas.appendChild(line);
            }
        }
        function drawHorizontalLines() {
            const canvas = document.getElementById(CANVAS_ID);
            const canvasHeight = canvas.scrollHeight;
            const cellHeight = cssService.getCellHeight();
            const lineCount = Math.floor(canvasHeight / cellHeight);
            for (let i = 0; i < lineCount; i++) {
                const line = document.createElement("div");
                line.classList.add(SC_HLINE);
                line.style.top = `${cellHeight * (i + 1) - 1}px`;
                line.style.width = `${canvas.scrollWidth}px`;
                canvas.appendChild(line);
            }
        }
        function drawEntityEvents(entity, rowIndex, startTime, cellMinutes = 60) {
            if (rowIndex == null || rowIndex < 0)
                return;
            if (entity.rangeEvents == null)
                return;
            const entityEvents = entity.rangeEvents;
            const canvas = document.getElementById(CANVAS_ID);
            for (const event of entityEvents) {
                const eventElement = document.createElement("div");
                eventElement.classList.add(SC_CONTENT_CANVAS_ITEM);
                const left = dateTimeService.toMinutes(event.start.valueOf() - startTime.valueOf()) * cssService.getCellWidth() / cellMinutes;
                // const left = cssService.getCellWidth() * event.start / cellMinutes;
                const top = (cssService.getCellHeight() * rowIndex)
                    + (cssService.getCellHeight() - cssService.getCellContentHeight()) / 2
                    - 1;
                const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / cellMinutes;
                const color = event.type === 1 ? "orange" : event.type === 2 ? "blue" : "green";
                eventElement.style.left = `${left}px`;
                eventElement.style.top = `${top}px`;
                eventElement.style.width = `${width}px`;
                eventElement.style.backgroundColor = color;
                eventElement.style.zIndex = "3";
                eventElement.addEventListener("click", (e) => {
                    console.log(e);
                });
                canvas.appendChild(eventElement);
            }
        }
        function drawGlobalEvent(chartStartTime, eventStartTime, eventEndTime, eventType, cellMinutes) {
            const eventElement = document.createElement("div");
            eventElement.classList.add(SC_CONTENT_CANVAS_ITEM);
            const left = dateTimeService.toMinutes(eventStartTime.valueOf() - chartStartTime.valueOf()) * cssService.getCellWidth() / cellMinutes;
            const width = cssService.getCellWidth() * dateTimeService.toMinutes(eventEndTime.valueOf() - eventStartTime.valueOf()) / cellMinutes;
            const color = eventType === 1 ? "aqua" : eventType === 2 ? "coral" : "brown";
            eventElement.style.left = `${left}px`;
            eventElement.style.width = `${width}px`;
            eventElement.style.height = "100%";
            eventElement.style.backgroundColor = color;
            eventElement.style.opacity = "0.5";
            eventElement.addEventListener("click", (e) => {
                console.log(e);
            });
            const canvas = document.getElementById(CANVAS_ID);
            canvas.appendChild(eventElement);
        }
        return {
            init
        };
    }();
    function init({ title, subTitle, startTime, endTime, cellMinutes, cellWidth = DEFAULT_CELL_WIDTH, cellHeight = DEFAULT_CELL_HEIGHT, leftLegends, rightLegends, entities }) {
        legendService.init(leftLegends, rightLegends);
        timelineService.setTitle("Time Line");
        timelineService.drawHeaders(startTime, endTime, cellMinutes, cellWidth, cellHeight);
        listService.init(title, subTitle, entities);
        canvasService.init(entities, startTime, cellMinutes);
    }
    return {
        init,
        drawStatusItems,
        drawEntityPointEvents,
        drawGlobalEvents,
    };
}();
window.addEventListener("load", () => {
    const cellMinutes = 60;
    const cellWidth = 200;
    const cellHeight = 40;
    StatusChart.init({
        title: "XXX H/L LH Line 03",
        subTitle: "Serial No.",
        startTime: new Date(Date.parse("2020-01-01T00:00:00")),
        endTime: new Date(Date.parse("2020-01-02T00:00:00")),
        cellMinutes: cellMinutes,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        leftLegends: window.leftLegendDatasource,
        rightLegends: window.rightLegendDatasource,
        entities: window.entities
    });
    const renderMachineError = (error) => {
        const divElement = document.createElement("div");
        divElement.classList.add("sc-tooltip");
        const eventElement = document.createElement("img");
        eventElement.width = 20;
        eventElement.height = 20;
        eventElement.src = "asset/image/warning.png";
        divElement.appendChild(eventElement);
        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add("sc-tooltip-text");
        tooltipElement.innerText = error.description;
        divElement.appendChild(tooltipElement);
        return divElement;
    };
    StatusChart.drawStatusItems(window.machineErrors, renderMachineError, new Date(Date.parse("2020-01-01T00:00:00")), cellMinutes);
    const renderProductError = (error) => {
        const divElement = document.createElement("div");
        divElement.classList.add("sc-tooltip");
        const eventElement = document.createElement("img");
        eventElement.width = 20;
        eventElement.height = 20;
        eventElement.src = "asset/image/error.png";
        divElement.appendChild(eventElement);
        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add("sc-tooltip-text");
        tooltipElement.innerText = error.description;
        divElement.appendChild(tooltipElement);
        return divElement;
    };
    StatusChart.drawEntityPointEvents(window.entities[0], renderProductError, 0, new Date(Date.parse("2020-01-01T00:00:00")), cellMinutes);
    const renderPause = (error) => {
        const divElement = document.createElement("div");
        divElement.classList.add("sc-tooltip");
        divElement.style.opacity = "0.5";
        divElement.style.backgroundColor = "gray";
        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add("sc-tooltip-text");
        tooltipElement.innerText = error.description;
        divElement.appendChild(tooltipElement);
        return divElement;
    };
    StatusChart.drawGlobalEvents(window.pauseEvents, renderPause, new Date(Date.parse("2020-01-01T00:00:00")), cellMinutes);
    const renderNetworkError = (error) => {
        const divElement = document.createElement("div");
        divElement.classList.add("sc-tooltip");
        divElement.style.width = "200px";
        divElement.style.height = "200px";
        divElement.style.backgroundColor = "pink";
        // divElement.style.border = "1px solid red";
        divElement.style.opacity = "0.5";
        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add("sc-tooltip-text");
        tooltipElement.innerText = error.description;
        divElement.appendChild(tooltipElement);
        return divElement;
    };
    StatusChart.drawGlobalEvents(window.networkErrorEvents, renderNetworkError, new Date(Date.parse("2020-01-01T00:00:00")), cellMinutes);
});
