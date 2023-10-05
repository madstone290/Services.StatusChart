interface BarcodeEntity extends Entity {
    pointEvents?: BarcodePointEvent[];
    rangeEvents?: BarcodeRangeEvent[];
}

/**
 * 바코드 포인트이벤트(품질이상)
 */
interface BarcodePointEvent extends PointEvent {
    id?: any;
    description?: string;
}

interface BarcodeRangeEvent extends RangeEvent {
    id?: any;
    type: "op10" | "op20" | "op30" | "op40" | "op50";
    description?: string;
}

/**
 * 설비 글로벌 이벤트(계획정지/비가동/네트워크이상/바코드누락)
 */
interface MachineGlobalRangeEvent extends RangeEvent {
    id?: any;
    type: "pause" | "fault" | "barcodeMissing" | "networkError";
    description?: string;
}

/**
 * 설비 이벤트(설비이상)
 */
interface MachinePointEvent extends PointEvent {
    id?: any;
    description?: string;
}

interface LegendItem {
    color: string;
    label: string;
    icon?: string;
}
