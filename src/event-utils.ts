import { BusinessHours, ScheduleEntity, ScheduleEvent } from './type';

export const DEFAULT_COLORS = [
  '#1971C2',
  '#E67700',
  '#5F3DC4',
  '#C92A2A',
  '#3BC9DB',
  '#40C057',
  '#FFA94D',
  '#DA77F2',
  '#C0EB75',
  '#4DABF7',
  '#FFA8A8',
  '#C2255C',
];

export const DEFAULT_ENTITIES: ScheduleEntity[] = [
  {
    _id: 'd1904006-a40c-44c4-a11d-abf574863965',
    name: 'Playlist1',
    date: '2022-04-01',
  },
  {
    _id: '615ab1a3-9870-435f-956c-0500d2561ad5',
    name: 'Advertising',
    date: '2022-02-01',
  },
  {
    _id: 'ed7db86c-2cc6-48b1-b6db-082e68389af0',
    name: 'Play with long name that Play with long name that Play with long name that',
    date: '2022-03-01',
  },
  {
    _id: '515547c9-d886-4f52-9ecd-2080fde1b0b8',
    name: 'Another Playlist',
    date: '2022-01-01',
  },
];
export const TEMP_BUSINESS_HOURS: BusinessHours[] = [
  {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: '09:00',
    endTime: '17:00',
  },
];
export const DEFAULT_BUSINESS_HOURS: BusinessHours[] = [
  {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: '00:00',
    endTime: '23:59',
  },
];

export const DEFAULT_EVENTS: ScheduleEvent[] = [
  {
    _id: '5d61ab83-5003-40ef-acda-975dfc91f4ea',
    scheduleId: '0d1ef389-dc2b-41ba-b287-409c667a9bea',
    entityType: 'd1904006-a40c-44c4-a11d-abf574863965',
    entityId: 'd1904006-a40c-44c4-a11d-abf574863965',
    startDate: '2022-05-09',
    endDate: '2022-05-09',
    startTime: '11:00',
    endTime: '14:30',
  },
  {
    _id: 'efa1545f-0bd8-4822-9481-f9ee3a172d95',
    scheduleId: '3c731956-6e16-476c-ad44-073ed17233a6',
    entityType: '615ab1a3-9870-435f-956c-0500d2561ad5',
    entityId: '615ab1a3-9870-435f-956c-0500d2561ad5',
    startDate: '2022-05-10',
    endDate: '2022-05-10',
    startTime: '10:30',
    endTime: '15:00',
  },
  {
    _id: '82184ad4-aba0-46c8-9e85-4004926095ae',
    scheduleId: 'cfb4ddc5-cba1-4b53-8991-6841fb8f79db',
    entityType: 'ed7db86c-2cc6-48b1-b6db-082e68389af0',
    entityId: 'ed7db86c-2cc6-48b1-b6db-082e68389af0',
    startDate: '2022-05-11',
    endDate: '2022-05-11',
    startTime: '10:00',
    endTime: '15:30',
  },
  {
    _id: '6ce06f8f-bc6e-4bf2-b55b-d525aa16e309',
    scheduleId: 'f3d6200c-bf48-4527-b2e9-0fcdfc9dcb1d',
    entityType: '515547c9-d886-4f52-9ecd-2080fde1b0b8',
    entityId: '515547c9-d886-4f52-9ecd-2080fde1b0b8',
    startDate: '2022-05-12',
    endDate: '2022-05-12',
    startTime: '09:00',
    endTime: '16:00',
  },
  {
    _id: 'fbe0afc9-e892-4961-9c01-27cdace8670d',
    scheduleId: '208eb7bf-8469-475c-833e-221eeb07e8bf',
    entityType: '615ab1a3-9870-435f-956c-0500d2561ad5',
    entityId: '615ab1a3-9870-435f-956c-0500d2561ad5',
    startDate: '2022-05-10',
    endDate: undefined,
    startTime: '10:30',
    endTime: '15:00',
    frequency: 'weekly',
    daysOfWeek: [1, 2, 4],
  },
];
export function daysForLocale(
  localeName = 'en',
  weekday: 'long' | 'short' | 'narrow' | undefined = 'short'
) {
  const { format } = new Intl.DateTimeFormat(localeName, { weekday });
  return [1, 2, 3, 4, 5, 6, 7].map((day) =>
    format(new Date(Date.UTC(2021, 2, day)))
  );
}
