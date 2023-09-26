interface PointEvent {
    time: Date;
}

interface RangeEvent {
    start: Date;
    end: Date;
}

interface EntityEvent {
    type: any;
    start: Date;
    end: Date;
}

interface Entity {
    id: number;
    name: string;
    pointEvents?: ProductError[];
    rangeEvents?: EntityEvent[];
}

interface StatusChartProps {
    title: string;
    subTitle: string;
    startTime: Date;
    endTime: Date;
    cellMinutes: number;
    cellWidth: number;
    cellHeight: number;
    leftLegends: LegendItem[];
    rightLegends: LegendItem[];
    entities: Entity[];
}


/* Domain Specific Types */

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

interface NetworkErrorEvent extends RangeEvent {
    id: number;
    description: string;
}

interface PauseEvent extends RangeEvent {
    id: number;
    description: string;
}

interface FaultEvent extends RangeEvent {
    id: number;
    description: string;
}

interface BarcodeMissingEvent extends RangeEvent {
    id: number;
    description: string;
}