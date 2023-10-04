interface BarcodeEntity extends Entity {
    pointEvents?: BarcodePointEvent[];
    rangeEvents?: BarcodeRangeEvent[];
}

interface BarcodePointEvent extends PointEvent {
    type: any;
    description?: string;
}

interface BarcodeRangeEvent extends RangeEvent {
    type: "op10" | "op20" | "op30" | "op40" | "op50";
    description?: string;
}

interface MachineGlobalRangeEvent extends RangeEvent {
    type: "pause" | "fault" | "barcodeMissing" | "networkError";
    description?: string;
}

interface LegendItem {
    color: string;
    label: string;
    icon?: string;
}

interface MachineError extends PointEvent {
    id: number;
    description: string;
}

interface ProductError extends PointEvent {
    id: number;
    description: string;
}