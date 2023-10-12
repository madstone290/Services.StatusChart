interface MesLegendData {
    /**
     * 왼쪽 범례 아이템 목록
     */
    leftLegendItems: LegendItem[];

    /**
     * 오른쪽 범례 아이템 목록
     */
    rightLegendItems: LegendItem[];
}

const MesLegend = function () {
    const CLS_LEGEND_ITEM = "tr-legend-item";
    const CLS_LEGEND_ITEM_ICON = "tr-legend-item-icon";
    const CLS_LEGEND_ITEM_COLOR = "tr-legend-item-color";
    const CLS_LEGEND_ITEM_LABEL = "tr-legend-item-label";

    const ID_LEFT_LEGEND = "tr-legend-left";
    const ID_RIGHT_LEGEND = "tr-legend-right";

    let _data: MesLegendData;

    let _leftLegendElement: HTMLElement;
    let _rightLegendElement: HTMLElement;

    function create(data: MesLegendData) {
        _data = data;
        
        _leftLegendElement = document.getElementById(ID_LEFT_LEGEND);
        _rightLegendElement = document.getElementById(ID_RIGHT_LEGEND);
    }

    function render() {
        drawLegendItems(_data.leftLegendItems, _leftLegendElement);
        drawLegendItems(_data.rightLegendItems, _rightLegendElement);
    }

    function drawLegendItems(items: LegendItem[], container: HTMLElement) {
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
            } else {
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
        create,
        render
    }
};