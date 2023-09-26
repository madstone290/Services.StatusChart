interface LegendItem {
    color: string;
    label: string;
    icon?: string;
}

interface EntityEvent {
    type: any;
    start: Date;
    end: Date;
}

interface GlobalEvent {
    type: any;
    start: Date;
    end: Date;
}

interface Entity {
    id: number;
    name: string;
    events: EntityEvent[];
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