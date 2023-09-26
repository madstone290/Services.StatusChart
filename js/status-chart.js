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
    }
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
            } else {
                const color = document.createElement("div");
                color.classList.add(SC_LEGEND_ITEM_COLOR);
                color.style.backgroundColor = item.color;
                box.appendChild(color);
            }

            const label = document.createElement("div");
            label.classList.add(SC_LEGEND_ITEM_LABEL);
            label.innerText = item.value;
            box.appendChild(label);
        }
    }

    return {
        init
    }
}();

const timelineService = function () {
    SC_CONTENT_TIMELINE_HEADER_ITEM = "sc-content-timeline-header-item";

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

        const header = document.getElementById(TIMELINE_HEADER_ID);
        const headers = [];
        let time = start;

        while (time < end) {
            // TODO : add time format service
            headers.push(time.toLocaleTimeString([], {
                day: 'numeric', month: 'numeric', year: 'numeric',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            }));
            time = new Date(time.getTime() + cellMinutes * 60 * 1000);
        }
        console.log(headers);

        for (const data of headers) {
            const div = document.createElement("div");
            div.innerText = data;
            div.classList.add(SC_CONTENT_TIMELINE_HEADER_ITEM);
            header.appendChild(div);
        }
        const canvasWidth = cssService.getCellWidth() * headers.length
        header.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;

        const canvas = document.getElementById(CANVAS_ID);
        canvas.style.width = `${canvasWidth}px`;

        const canvasBox = document.getElementById(CANVAS_BOX_ID);
        const headerBox = document.getElementById(TIMELINE_HEADER_BOX_ID);
        canvasBox.addEventListener("scroll", (e) => {
            headerBox.scrollLeft = canvasBox.scrollLeft;
        });
    }

    return {
        setTitle,
        drawHeaders
    }
}();

const listService = function () {
    const SC_LIST_ITEM = "sc-list-item";
    const SC_HLINE = "sc-hline";

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

        let i = 0;
        for (const entity of entities) {
            // list item
            const div = document.createElement("div");
            div.innerText = entity.name;
            div.classList.add(SC_LIST_ITEM);
            listBox.appendChild(div);

            // grid line
            const line = document.createElement("div");
            line.classList.add(SC_HLINE);

            const rowHeight = cssService.getCellHeight();
            line.style.top = `${rowHeight * (i + 1) - 1}px`;
            line.style.width = canvas.scrollWidth;
            canvas.appendChild(line);

            i++;
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

const canvasService = function () {
    const SC_CONTENT_CANVAS_ITEM = "sc-content-canvas-item";

    function init(entities, cellMinutes) {
        let rowIndex = 0;
        for (const entity of entities) {
            drawEntityEvents(entity, rowIndex, cellMinutes);
            rowIndex++;
        }
    }

    function drawEntityEvents(entity, rowIndex, cellMinutes = 60) {
        if (rowIndex == null || rowIndex < 0)
            return;

        if (entity.events == null)
            return;

        const entityEvents = entity.events;
        for (const event of entityEvents) {
            const eventElement = document.createElement("div");
            eventElement.classList.add(SC_CONTENT_CANVAS_ITEM);

            const left = cssService.getCellWidth() * event.start / cellMinutes;
            const top = (cssService.getCellHeight() * rowIndex) + (cssService.getCellHeight() - cssService.getCellContentHeight()) / 2 - 1;
            const width = cssService.getCellWidth() * (event.end - event.start) / cellMinutes;
            const color = event.type === 1 ? "red" : event.type === 2 ? "yellow" : "green";

            eventElement.style.left = `${left}px`;
            eventElement.style.top = `${top}px`;
            eventElement.style.width = `${width}px`;
            eventElement.style.backgroundColor = color;
            
            eventElement.addEventListener("click", (e) => {
                console.log(e);
            });

            const canvas = document.getElementById(CANVAS_ID);
            canvas.appendChild(eventElement);
        }
    }

    return {
        init
    }
}();


const chartService = function () {
    function init({
        title, subTitle, start, end,
        cellMinutes,
        cellWidth = DEFAULT_CELL_WIDTH,
        cellHeight = DEFAULT_CELL_HEIGHT,
        leftLegends,
        rightLegends,
        entities
    }) {
        legendService.init(leftLegends, rightLegends);
        timelineService.setTitle("Time Line");
        timelineService.drawHeaders(start, end, cellMinutes, cellWidth, cellHeight);
        listService.init(title, subTitle, entities);
        canvasService.init(entities, cellMinutes);
    }

    return {
        init
    }
}();


window.addEventListener("load", () => {
    chartService.init({
        title: "XXX H/L LH Line 03",
        subTitle: "Serial No.",
        start: new Date(Date.parse("2020-01-01T00:00:00")),
        end: new Date(Date.parse("2020-01-02T00:00:00")),
        cellMinutes: 60,
        cellWidth: 150,
        cellHeight: 40,
        leftLegends: leftLegendDatasource,
        rightLegends: rightLegendDatasource,
        entities: entities
    });

});