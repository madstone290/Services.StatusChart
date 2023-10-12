interface MesEntity extends Entity {
    id?: any;
    barcodeNumber?: string;
    productNumber?: string;
    pointEvents?: MesEntityPointEvent[];
    rangeEvents?: MesEntityRangeEvent[];
}

/**
 * 바코드 포인트이벤트(품질이상)
 */
interface MesEntityPointEvent extends PointEvent {
    id?: any;
    entityId?: any;
    description?: string;
}

interface MesEntityRangeEvent extends RangeEvent {
    id?: any;
    entityId?: any;
    type: "op10" | "op20" | "op30" | "op40" | "op50";
    description?: string;
}

/**
 * 설비 글로벌 이벤트(계획정지/비가동/네트워크이상/바코드누락)
 */
interface MesGlobalRangeEvent extends RangeEvent {
    id?: any;
    type: "pause" | "fault" | "barcodeMissing" | "networkError";
    description?: string;
}

/**
 * 설비 이벤트(설비이상)
 */
interface MesSidePointEvents extends PointEvent {
    id?: any;
    description?: string;
}

/**
 * 범례
 */
interface LegendItem {
    label: string;
    color?: string;
    icon?: string;
}
