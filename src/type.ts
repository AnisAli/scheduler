export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type RecurrenceFrequency = 'weekly' | undefined;
export type ScheduleEvent = {
  _id: string; // Generate locally using uuid4
  scheduleId: string;
  entityType: string;
  entityId: string;
  startTime: string; // Inclusive. Example: "09:00"
  endTime: string; // Non-inclusive. Example: "17:00"
  startDate: string; // Inclusive. Example: "2022-03-24"
  endDate?: string; // Non-inclusive. Example: "2022-03-26"
  frequency?: RecurrenceFrequency; // Must be "weekly" if event recurs
  daysOfWeek?: DayOfWeek[]; // Required if event is recurring
};
export type ScheduleEntity = {
  _id: string;
  name: string;
  date: string;
};
export type Entity = {
  _id: string;
  name: string;
  date: string;
  color: string;
  visible: boolean;
};
export type BusinessHours = {
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
};
export interface Props {
  businessHours?: BusinessHours[];
  colors?: string[];
  createEntity?: () => void;
  darkMode?: boolean;
  editable?: boolean;
  entityType?: string;
  entityTypeName?: string;
  fetchEntities: () => Promise<ScheduleEntity[]>;
  fetchEvents: () => Promise<ScheduleEvent[]>;
  language?: string;
  onEventAdd?: (event: ScheduleEvent) => void;
  onEventChange?: (event: ScheduleEvent) => void;
  onEventRemove?: (event: ScheduleEvent) => void;
  rtl?: boolean;
  scheduleId?: string;
  toggleExpand?: () => void;
}
