interface PointEvent {
    time: Date;
}

interface RangeEvent {
    start: Date;
    end: Date;
}

interface Entity {
    id: number;
    name?: string;
    pointEvents?: PointEvent[];
    rangeEvents?: RangeEvent[];
}