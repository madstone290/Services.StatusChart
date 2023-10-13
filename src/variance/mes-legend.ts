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

    const CLS_LEGEND = "mes-legend";
    const CLS_LEFT_LEGEND = "mes-legend-left";
    const CLS_RIGHT_LEGEND = "mes-legend-right";

    let _data: MesLegendData;

    let _leftLegendElement: HTMLElement;
    let _rightLegendElement: HTMLElement;



    function create(container: HTMLElement, data: MesLegendData) {
        const elementString = `
        <div class="${CLS_LEGEND}">
            <div class="${CLS_LEFT_LEGEND}"></div>
            <div class="${CLS_RIGHT_LEGEND}"></div>
        </div>
        `;
        const parser = new DOMParser();
        const doc = parser.parseFromString(elementString, 'text/html');
        const element = doc.body.firstChild;
        container.appendChild(element);

        _data = data;

        _leftLegendElement = container.getElementsByClassName(CLS_LEFT_LEGEND)[0] as HTMLElement;
        _rightLegendElement = container.getElementsByClassName(CLS_RIGHT_LEGEND)[0] as HTMLElement;
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