declare var dayjs: any;

window.addEventListener("load", () => {
    const mesLegendData: MesLegendData = {
        leftLegendItems: window.leftLegendDatasource,
        rightLegendItems: window.rightLegendDatasource
    };

    const mesLegend = MesLegend();
    mesLegend.create(document.getElementById("legend-container"), mesLegendData);
    mesLegend.render();


    const mesChart = MesChart();
    mesChart.create();
    mesChart.render();
});
