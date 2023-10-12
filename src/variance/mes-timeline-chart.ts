interface MesChartData {
    /**
       * 엔티티 목록. 메인 캔버스에 표시할 엔티티 목록.
       */
    entities: MesEntity[];

    /**
     * 사이드(타임라인)캔버스에 표시할 이벤트
     */
    sidePointEvents: MesSidePointEvents[];

    /**
     * 메인 캔버스에 표시할 글로벌 레인지 이벤트 목록.
     */
    globalRangeEvents: MesGlobalRangeEvent[];
}
const MesChart = function () {
};