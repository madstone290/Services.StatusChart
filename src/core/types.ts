interface PointEvent {
    time: Date;
}

interface RangeEvent {
    start: Date;
    end: Date;
}

interface Entity {
    name: string;
    pointEvents?: PointEvent[];
    rangeEvents?: RangeEvent[];
}

