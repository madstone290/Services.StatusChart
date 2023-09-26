const listBoxId = "sc-list-box";
const canvasId = "sc-content-canvas";
const canvasBoxId = "sc-content-canvas-box";

const css = function () {
    function getVariable(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name);
    }

    function getCellWidth() {
        return parseInt(getVariable("--sc-cell-width"));
    }

    function getCellHeight() {
        return parseInt(getVariable("--sc-cell-height"));
    }

    function getCellContentHeight() {
        return parseInt(getVariable("--sc-cell-content-height"));
    }

    function getScrollWidth() {
        return parseInt(getVariable("--sc-scroll-width"));
    }

    return {
        getVariable,
        getCellWidth,
        getCellHeight,
        getCellContentHeight,
        getScrollWidth
    }
}();

const legend = function () {
    const LEFT_LEGEND_ID = "sc-legend-left";
    const RIGHT_LEGEND_ID = "sc-legend-right";
    function init(leftItems, rightItems) {
        const left = document.getElementById(LEFT_LEGEND_ID);
        drawLegend(leftItems, left);

        const right = document.getElementById(RIGHT_LEGEND_ID);
        drawLegend(rightItems, right);
    }

    function drawLegend(items, container) {
        for (const item of items) {
            const box = document.createElement("div");
            box.classList.add("sc-legend-item");
            container.appendChild(box);

            if (item.icon) {
                const icon = document.createElement("img");
                icon.classList.add("sc-legend-item-icon");
                icon.src = item.icon;
                box.appendChild(icon);
            } else {
                const color = document.createElement("div");
                color.classList.add("sc-legend-item-color");
                color.style.backgroundColor = item.color;
                box.appendChild(color);
            }

            const label = document.createElement("div");
            label.classList.add("sc-legend-item-label");
            label.innerText = item.value;
            box.appendChild(label);
        }
    }

    return {
        init
    }
}();

const timeline = function () {
    const timeline_title_id = "sc-content-timeline-title";
    const timline_header_box_id = "sc-content-timeline-header-box";
    const timeline_header_id = "sc-content-timeline-header";
    const timeline_status_id = "sc-content-timeline-status";
    const canvas_id = "sc-content-canvas";

    function setTitle(name) {
        const titleElement = document.getElementById(timeline_title_id);
        titleElement.innerText = name;
    }
    function drawHeaders() {
        const header = document.getElementById(timeline_header_id);
        for (const data of timelineHeaders) {
            const div = document.createElement("div");
            div.innerText = data;
            div.classList.add("sc-content-timeline-header-item");
            header.appendChild(div);
        }
        const canvasWidth = css.getCellWidth() * timelineHeaders.length
        header.style.width = `${canvasWidth + css.getScrollWidth()}px`;

        const canvas = document.getElementById(canvas_id);
        canvas.style.width = `${canvasWidth}px`;

        const canvasBox = document.getElementById(canvasBoxId);
        const headerBox = document.getElementById(timline_header_box_id);
        canvasBox.addEventListener("scroll", (e) => {
            // todo; vertical only
            headerBox.scrollLeft = canvasBox.scrollLeft;
        });
    }

    return {
        setTitle,
        drawHeaders
    }
}();

const list = function () {
    const HEAD_TITLE_ID = "sc-list-head-title";
    const HEAD_SUBTITLE_ID = "sc-list-head-subtitle";

    function init(title, subTitle, items) {
        setTitle(title);
        setSubTitle(subTitle);
        drawListItems(items);
    }

    function setTitle(title) {
        const titleElement = document.getElementById(HEAD_TITLE_ID);
        titleElement.innerText = title;
    }

    function setSubTitle(subTitle) {
        const subTitleElement = document.getElementById(HEAD_SUBTITLE_ID);
        subTitleElement.innerText = subTitle;
    }

    function drawListItems(items) {
        const box = document.getElementById(listBoxId);
        const canvas = document.getElementById(canvasId);

        let i = 0;
        for (const item of items) {
            // list item
            const div = document.createElement("div");
            div.innerText = item.value;
            div.classList.add("sc-list-item");
            box.appendChild(div);

            // grid line
            const line = document.createElement("div");
            line.classList.add("sc-hline");
            const rowHeight = css.getCellHeight();
            line.style.top = `${rowHeight * (i + 1) - 1}px`;
            line.style.width = canvas.scrollWidth;
            canvas.appendChild(line);

            i++;
        }

        canvas.style.height = `${box.scrollHeight}px`;

        const canvasBox = document.getElementById(canvasBoxId);
        canvasBox.addEventListener("scroll", (e) => {
            // todo; horizontal only
            box.scrollTop = canvasBox.scrollTop;
        });
    }

    return {
        init
    };
}();

const canvas = function () {
    const CANVAS_ID = "sc-content-canvas";
    let _headers;
    function init(headers, entities) {
        _headers = headers;
        for (const entity of entities) {
            drawEntityEvents(entity);
        }
    }

    function drawEntityEvents(entity) {
        const entityIndex = _headers.findIndex(e => e.id === entity.id);

        if (entityIndex < 0) {
            return;
        }

        const entityEvents = entity.events;
        for (const event of entityEvents) {
            const eventElement = document.createElement("div");
            eventElement.classList.add("sc-content-canvas-item");

            const left = css.getCellWidth() * event.start / 60;
            console.log("left", left);
            const top = (css.getCellHeight() * entityIndex) + (css.getCellHeight() - css.getCellContentHeight()) / 2 - 1;
            const width = css.getCellWidth() * (event.end - event.start) / 60;
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


window.addEventListener("load", () => {
    legend.init(leftLegendDatasource, rightLegendDatasource);



    timeline.setTitle("Time Line");
    timeline.drawHeaders();

    list.init("XXX H/L LH Line 03", "Serial No.", listDatasource);

    canvas.init(listDatasource, entities);
});