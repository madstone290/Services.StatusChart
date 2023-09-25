const listBoxId = "ab-chart-list-box";
const canvasId = "ab-chart-content-canvas";
const canvasBoxId = "ab-chart-content-canvas-box";

const css = {
    getVariable: function (name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name);
    },

    getRowHeight: function () {
        return parseInt(this.getVariable("--ab-chart-row-height"));
    }
}

function createList() {
    const box = document.getElementById(listBoxId);
    const canvas = document.getElementById(canvasId);

    let i = 0;
    for (const data of listDatasource) {
        // list item
        const div = document.createElement("div");
        div.innerText = data.value;
        div.classList.add("ab-chart-list-item");
        div.setAttribute("data-key", data.key);
        box.appendChild(div);

        // todo: get height from css variable
        const rowHeight = css.getRowHeight();
        // grid line
        const line = document.createElement("div");
        line.classList.add("ab-chart-hline");
        line.style.top = `${(rowHeight + 1) * (i + 1) - 1}px`;
        line.style.width = canvas.scrollWidth;
        canvas.appendChild(line);

        i++;
    }

    canvas.style.height = `${box.scrollHeight}px`;

    const canvasBox = document.getElementById(canvasBoxId);
    canvasBox.onscroll = (e) => {
        console.log(e);
        box.scrollTop = canvasBox.scrollTop;
    };
}

window.addEventListener("load", () => {
    createList();
});