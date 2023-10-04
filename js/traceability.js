const Traceability = function () {
    const CLS_LEGEND_ITEM = "tr-legend-item";
    const CLS_LEGEND_ITEM_ICON = "tr-legend-item-icon";
    const CLS_LEGEND_ITEM_COLOR = "tr-legend-item-color";
    const CLS_LEGEND_ITEM_LABEL = "tr-legend-item-label";
    const ID_LEFT_LEGEND = "tr-legend-left";
    const ID_RIGHT_LEGEND = "tr-legend-right";
    let _leftLegendItems;
    let _rightLegendItems;
    let _leftLegendElement;
    let _rightLegendElement;
    function setup() {
        _leftLegendElement = document.getElementById(ID_LEFT_LEGEND);
        _rightLegendElement = document.getElementById(ID_RIGHT_LEGEND);
    }
    function setData(leftLegendItems, rightLegendItems) {
        _leftLegendItems = leftLegendItems;
        _rightLegendItems = rightLegendItems;
    }
    function drawLegend() {
        drawLegendItems(_leftLegendItems, _leftLegendElement);
        drawLegendItems(_rightLegendItems, _rightLegendElement);
    }
    function drawLegendItems(items, container) {
        if (items == null || items.length == 0)
            return;
        for (const item of items) {
            const box = document.createElement("div");
            box.classList.add(CLS_LEGEND_ITEM);
            container.appendChild(box);
            if (item.icon) {
                const icon = document.createElement("img");
                icon.classList.add(CLS_LEGEND_ITEM_ICON);
                icon.src = item.icon;
                box.appendChild(icon);
            }
            else {
                const color = document.createElement("div");
                color.classList.add(CLS_LEGEND_ITEM_COLOR);
                color.style.backgroundColor = item.color;
                box.appendChild(color);
            }
            const label = document.createElement("div");
            label.classList.add(CLS_LEGEND_ITEM_LABEL);
            label.innerText = item.label;
            box.appendChild(label);
        }
    }
    return {
        setup,
        setData,
        drawLegend
    };
};
