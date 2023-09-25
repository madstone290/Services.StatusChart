const listBoxId = "ab-chart-list-box";
const canvasId = "ab-chart-content-canvas";
const canvasBoxId = "ab-chart-content-canvas-box";

const css = function () {
    function getVariable(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name);
    }

    function getCellWidth() {
        return parseInt(this.getVariable("--ab-chart-cell-width"));
    }

    function getCellHeight() {
        return parseInt(this.getVariable("--ab-chart-cell-height"));
    }

    function getCellContentHeight(){
        return parseInt(this.getVariable("--ab-chart-cell-content-height"));
    }

    return {
        getVariable,
        getCellWidth,
        getCellHeight,
        getCellContentHeight
    }
}();

const legend = function () {
    const LEFT_LEGEND_ID = "ab-chart-legend-left";
    const RIGHT_LEGEND_ID = "ab-chart-legend-right";
    function init(leftItems, rightItems) {
        const left = document.getElementById(LEFT_LEGEND_ID);
        drawLegend(leftItems, left);

        const right = document.getElementById(RIGHT_LEGEND_ID);
        drawLegend(rightItems, right);
    }

    function drawLegend(items, container) {
        for (const item of items) {
            const box = document.createElement("div");
            box.classList.add("ab-chart-legend-item");
            container.appendChild(box);

            if (item.icon) {
                const icon = document.createElement("img");
                icon.classList.add("ab-chart-legend-item-icon");
                icon.src = item.icon;
                box.appendChild(icon);
            } else {
                const color = document.createElement("div");
                color.classList.add("ab-chart-legend-item-color");
                color.style.backgroundColor = item.color;
                box.appendChild(color);
            }

            const label = document.createElement("div");
            label.classList.add("ab-chart-legend-item-label");
            label.innerText = item.value;
            box.appendChild(label);
        }
    }

    return {
        init
    }
}();

const timeline = function () {
    const timeline_title_id = "ab-chart-content-timeline-title";
    const timline_header_box_id = "ab-chart-content-timeline-header-box";
    const timeline_header_id = "ab-chart-content-timeline-header";
    const timeline_status_id = "ab-chart-content-timeline-status";

    function setTitle(name) {
        const titleElement = document.getElementById(timeline_title_id);
        titleElement.innerText = name;
    }
    function drawHeaders() {
        const header = document.getElementById(timeline_header_id);
        for (const data of timelineHeaders) {
            const div = document.createElement("div");
            div.innerText = data;
            div.classList.add("ab-chart-content-timeline-header-item");
            header.appendChild(div);
        }

        const canvasBox = document.getElementById(canvasBoxId);
        const box = document.getElementById(timline_header_box_id);
        canvasBox.addEventListener("scroll", (e) => {
            // todo; vertical only
            box.scrollLeft = canvasBox.scrollLeft;
        });
    }

    return {
        setTitle,
        drawHeaders
    }
}();

const list = function () {
    const HEAD_TITLE_ID = "ab-chart-list-head-title";
    const HEAD_SUBTITLE_ID = "ab-chart-list-head-subtitle";

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
            div.classList.add("ab-chart-list-item");
            div.setAttribute("data-key", item.key);
            box.appendChild(div);

            // todo: get height from css variable
            const rowHeight = css.getCellHeight();
            // grid line
            const line = document.createElement("div");
            line.classList.add("ab-chart-hline");
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
    const CANVAS_ID = "ab-chart-content-canvas";
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
            eventElement.classList.add("ab-chart-content-canvas-item");

            const left = css.getCellWidth() * event.start / 60;
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

    list.init("XXX H/L LH Line 03", "Serial No.", listDatasource);

    timeline.setTitle("Time Line");
    timeline.drawHeaders();

    canvas.init(listDatasource, entities);
});