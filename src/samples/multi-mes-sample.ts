declare var dayjs: any;

window.addEventListener("load", () => {
    // const legendContainerIds = ["legend-container1", "legend-container2", "legend-container3", "legend-container4"];
    // const tcContainerIds = ["tc-container1", "tc-container2", "tc-container3", "tc-container4"]

    const legendContainerIds = ["legend-container1"];
    const tcContainerIds = ["tc-container1"];
    const mesLegendData: MesLegendData = {
        leftLegendItems: window.leftLegendDatasource,
        rightLegendItems: window.rightLegendDatasource
    };

    legendContainerIds.forEach((id) => {
        const mesLegend = MesLegend();
        mesLegend.create(document.getElementById(id), mesLegendData);
        mesLegend.render();
    });

    const mesChartData: MesChartData =
    {
        entities: (window as any).barcodeEntities as MesEntity[],
        sidePointEvents: (window as any).machinePointEvents as MesSidePointEvents[],
        globalRangeEvents: (window as any).machineRangeEvents as MesGlobalRangeEvent[]
    };
    const cellMinutes = 30;
    const cellWidth = 50;
    const cellHeight = 50;
    const mesChartOptions: MesChartOptions = {
        useHoverColor: true,
        mainTitle: "XXX H/L LH Line 03",
        subTitle: "Serial No.",
        headerTitle: "Time Line",
        chartStartTime: new Date(Date.parse("2020-01-01T00:00:00")),
        chartEndTime: new Date(Date.parse("2020-01-02T00:00:00")),
        timelineTitleHeight: cellHeight,
        timelineHeaderHeight: cellHeight,
        timelineCanvasHeight: cellHeight,
        timelineCanvasContentHeight: cellHeight / 2,
        cellMinutes: cellMinutes,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        cellContentHeight: cellHeight / 2,
        canAutoFit: true,
        hasHorizontalLine: true,
        hasVerticalLine: true,
    };
    tcContainerIds.forEach((id) => {
        const container = document.getElementById(id);
        const mesChart = MesChart();
        mesChart.create(container, mesChartData, mesChartOptions);
        mesChart.render();
    });
});
