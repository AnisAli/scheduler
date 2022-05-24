import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from '@mantine/dates';
import { Grid, Stack, MantineProvider, useMantineTheme } from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import FullCalendar, {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  DayHeaderContentArg,
  DatesSetArg,
  EventAddArg,
  EventChangeArg,
  EventRemoveArg,
} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { mdiArrowExpand } from '@mdi/js';
import Icon from '@mdi/react';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import rtlPlugin from 'stylis-plugin-rtl';
import { Props, Entity, ScheduleEvent, ScheduleEntity } from './type';
import { DEFAULT_COLORS, DEFAULT_BUSINESS_HOURS } from './event-utils';
import EntitiesList from './components/EntitiesList';
import EventContentPopover from './components/EventContentPopover';
import EditEvent from './components/EditEvent';
import useStyles from './style';
import globalStyle from './global';

function Scheduler(props: Props) {
  const [date, setDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<ScheduleEvent[] | []>([]);
  const [entities, setEntities] = useState<Entity[] | []>([]);
  const [activeEntity, setActiveEntity] = useState<Entity | null>(null);
  const [activeEvent, setActiveEvent] = useState<ScheduleEvent | null>(null);
  const [showEditEventPopup, setShowEditEventPopup] = useState(false);
  const [colors, setColors] = useState<string[] | []>(
    props.colors || DEFAULT_COLORS
  );
  const [lang, setLang] = useState<string>(props.language || 'en');
  const calendarRef = useRef<FullCalendar>(null);
  const [draggableHandler, setDraggableHandler] = useState<Draggable | null>(
    null
  );
  const [viewType, setViewType] = useState<string>('timeGridWeek');
  const [isLocalLoading, setLocalLoading] = useState<boolean>(false);
  const [isEventsLoaded, setEventsLoaded] = useState<boolean>(false);
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { toggle, fullscreen } = useFullscreen();

  useEffect(() => {
    moment.locale(lang, {
      week: {
        dow: 0,
      },
    });
    moment.locale(lang);
    import(`dayjs/locale/${lang}.js`).then(() => {
      setLocalLoading(true);
    });
    props.fetchEntities().then((response: ScheduleEntity[]) => {
      const propEntities = response.map(
        (pEntity: ScheduleEntity, index: number) => ({
          ...pEntity,
          visible: true,
          color: colors[index % colors.length],
        })
      );
      if (propEntities.length) {
        setActiveEntity(propEntities[0]);
      }
      setEntities(propEntities);
    });
    const calendarApi = calendarRef.current?.getApi();
    document
      .getElementsByClassName('fc-prev-button')[0]
      .addEventListener('click', () => {
        switch (calendarApi?.view.type) {
          case 'timeGridWeek':
            setDate((oDate) => moment(oDate).subtract(1, 'week').toDate());
            break;
          case 'dayGridMonth':
            setDate((oDate) => moment(oDate).subtract(1, 'month').toDate());
            break;
          case 'timeGridDay':
            setDate((oDate) => moment(oDate).subtract(1, 'day').toDate());
            break;
          default:
            break;
        }
      });
    document
      .getElementsByClassName('fc-next-button')[0]
      .addEventListener('click', () => {
        switch (calendarApi?.view.type) {
          case 'timeGridWeek':
            setDate((oDate) => moment(oDate).add(1, 'week').toDate());
            break;
          case 'dayGridMonth':
            setDate((oDate) => moment(oDate).add(1, 'month').toDate());
            break;
          case 'timeGridDay':
            setDate((oDate) => moment(oDate).add(1, 'day').toDate());
            break;
          default:
            break;
        }
      });
  }, []);
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (props.editable) {
      const draggableEl: HTMLElement = document.getElementById(
        'entity-list'
      ) as HTMLElement;
      if (draggableHandler) {
        draggableHandler.destroy();
      }
      setDraggableHandler(
        new Draggable(draggableEl, {
          itemSelector: '.entity-item',
          eventData(eventEl) {
            const id = eventEl.getElementsByTagName('input')[0].value;
            const entity = entities.find((e) => e._id === id);
            return {
              id: uuidv4(),
              textColor: 'white',
              borderColor: entity?.color,
              backgroundColor: entity?.color,
              display: 'block',
              extendedProps: {
                entityId: entity?._id,
              },
              constraint: 'businessHours',
              title: entity?.name,
            };
          },
        })
      );
    }
    if (entities.length && !isEventsLoaded) {
      props.fetchEvents().then((response: ScheduleEvent[]) => {
        setEvents(response);
        response.map((pEvent: ScheduleEvent) => {
          const pEventEntity = entities.find(
            (entity) => entity._id === pEvent.entityId
          );
          return calendarApi?.addEvent({
            id: pEvent.scheduleId,
            title: pEventEntity?.name,
            backgroundColor: pEventEntity?.color,
            borderColor: pEventEntity?.color,
            textColor: 'white',
            groupId: uuidv4(),
            start: moment(`${pEvent.startDate} ${pEvent.startTime}`).toDate(),
            end: moment(`${pEvent.startDate} ${pEvent.endTime}`).toDate(),
            daysOfWeek: pEvent.frequency ? pEvent.daysOfWeek : undefined,
            startTime: pEvent.frequency ? pEvent.startTime : null,
            endTime: pEvent.frequency ? pEvent.endTime : null,
            startRecur: pEvent.frequency ? pEvent.startDate : null,
            endRecur: pEvent.frequency ? pEvent.endDate : null,
            display: 'block',
            extendedProps: {
              entityId: pEventEntity?._id,
              recuringEventId: pEvent.frequency ? pEvent.scheduleId : null,
              recurring: !!pEvent.frequency,
              daysOfWeek: pEvent.frequency ? pEvent.daysOfWeek : null,
              startTime: pEvent.frequency ? pEvent.startTime : null,
              endTime: pEvent.frequency ? pEvent.endTime : null,
              startRecur: pEvent.frequency ? pEvent.startDate : null,
              endRecur: pEvent.frequency ? pEvent.endDate : null,
            },
            constraint: 'businessHours',
          });
        });
        calendarApi?.refetchEvents();
        setEventsLoaded(true);
      });
    }
  }, [entities]);
  useEffect(() => {
    // console.log(JSON.stringify(events), "events local use effect")
    // let calendarApi = calendarRef.current?.getApi()
    // console.log(calendarApi?.getEvents(), "events calendar use effect");
  }, [events]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (activeEntity && props.editable) {
      const calendarApi = selectInfo.view.calendar;
      const interval = moment(selectInfo.endStr).diff(
        moment(selectInfo.startStr),
        'minutes'
      );
      calendarApi.unselect(); // clear date selection
      calendarApi.addEvent({
        id: uuidv4(),
        title: activeEntity?.name,
        backgroundColor: activeEntity?.color,
        borderColor: activeEntity?.color,
        textColor: 'white',
        start: selectInfo.startStr,
        end:
          interval >= 60
            ? selectInfo.endStr
            : moment(selectInfo.startStr)
                .add(1, 'hour')
                .format('YYYY-MM-DDTHH:mm:ssZ'),
        display: 'block',
        extendedProps: {
          entityId: activeEntity?._id,
        },
        constraint: 'businessHours',
      });
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (props.editable) {
      setShowEditEventPopup(true);
      const selectedEvent = events.find(
        (e) => e.scheduleId === clickInfo.event.id
      );
      setActiveEvent(selectedEvent || null);
    }
  };

  const handleEventAdd = (data: EventAddArg) => {
    if (!data.event.extendedProps.recurring) {
      if (!events.find((e) => e.scheduleId === data.event.id)) {
        const newEvent: ScheduleEvent = {
          _id: uuidv4(),
          scheduleId: data.event.id,
          entityType: data.event.extendedProps.entityId,
          entityId: data.event.extendedProps.entityId,
          startDate: moment(data.event.startStr).format('YYYY-MM-DD'),
          endDate:
            data.event.endStr === ''
              ? moment(data.event.startStr).add(1, 'hour').format('YYYY-MM-DD')
              : moment(data.event.endStr).format('YYYY-MM-DD'),
          startTime: moment(data.event.startStr).format('HH:mm'),
          endTime:
            data.event.endStr === ''
              ? moment(data.event.startStr).add(1, 'hour').format('HH:mm')
              : moment(data.event.endStr).format('HH:mm'),
        };
        if (props.onEventAdd && !data.event.extendedProps.updated) {
          props.onEventAdd(newEvent);
        }
        if (props.onEventChange && data.event.extendedProps.updated) {
          props.onEventChange(newEvent);
        }
        setEvents((oldEvents) => [...oldEvents, newEvent]);
        if (data.event.extendedProps.duplicated) {
          setTimeout(() => {
            setShowEditEventPopup(true);
            setActiveEvent(newEvent);
          }, 500);
        }
      }
    } else {
      const uEvent = events.find((e) => e.scheduleId === data.event.id);
      if (props.onEventChange && data.event.extendedProps.updated && uEvent) {
        props.onEventChange(uEvent);
      }
    }
  };

  const handleEventChange = (data: EventChangeArg) => {
    try {
      const index = events.findIndex((e) => e.scheduleId === data.event.id);
      const newEvents: ScheduleEvent[] = [...events];

      newEvents[index] = {
        _id: newEvents[index]._id,
        scheduleId: data.event.id,
        entityType: data.event.extendedProps.entityId,
        entityId: data.event.extendedProps.entityId,
        startDate: moment(data.event.startStr).format('YYYY-MM-DD'),
        endDate:
          data.event.endStr === ''
            ? moment(data.event.startStr).add(1, 'hour').format('YYYY-MM-DD')
            : moment(data.event.endStr).format('YYYY-MM-DD'),
        startTime: moment(data.event.startStr).format('HH:mm'),
        endTime:
          data.event.endStr === ''
            ? moment(data.event.startStr).add(1, 'hour').format('HH:mm')
            : moment(data.event.endStr).format('HH:mm'),
        frequency: data.event.extendedProps.recurring ? 'weekly' : undefined,
        daysOfWeek: data.event.extendedProps.daysOfWeek,
      };
      if (data.event.extendedProps.recurring) {
        const calendarApi = calendarRef.current?.getApi();
        const eventHandler = calendarApi?.getEventById(
          data.event.extendedProps.recuringEventId
        );
        eventHandler?.remove();
        const dayInterval = moment(data.event.start).diff(
          moment(data.oldEvent.start),
          'day'
        );
        const newDaysOfWeek = data.event.extendedProps.daysOfWeek.map(
          (d: number) => (d + dayInterval + 7) % 7
        );
        const newEventId = uuidv4();
        newEvents[index].daysOfWeek = newDaysOfWeek;
        newEvents[index].scheduleId = newEventId;
        newEvents[index].endDate = data.event.extendedProps.endRecur;
        newEvents[index].startDate = moment(data.event.start).isBefore(
          moment(data.oldEvent.start)
        )
          ? moment(data.event.start).format('YYYY-MM-DD')
          : moment(data.oldEvent.start).format('YYYY-MM-DD');
        calendarApi?.addEvent({
          id: newEventId,
          groupId: uuidv4(),
          title: data.event.title,
          backgroundColor: data.event.backgroundColor,
          borderColor: data.event.borderColor,
          textColor: 'white',
          daysOfWeek: newDaysOfWeek,
          startTime: moment(data.event.start).format('HH:mm'),
          endTime: moment(data.event.end).format('HH:mm'),
          startRecur: moment(data.event.start).isBefore(
            moment(data.oldEvent.start)
          )
            ? moment(data.event.start).format('YYYY-MM-DD')
            : moment(data.oldEvent.start).format('YYYY-MM-DD'),
          endRecur: data.event.extendedProps.endRecur,
          display: 'block',
          extendedProps: {
            recuringEventId: newEventId,
            entityId: data.event.extendedProps.entityId,
            recurring: true,
            daysOfWeek: newDaysOfWeek,
            startTime: moment(data.event.start).format('HH:mm'),
            endTime: moment(data.event.end).format('HH:mm'),
            startRecur: moment(data.event.start).isBefore(
              moment(data.oldEvent.start)
            )
              ? moment(data.event.start).format('YYYY-MM-DD')
              : moment(data.oldEvent.start).format('YYYY-MM-DD'),
            endRecur: data.event.extendedProps.endRecur,
          },
        });
        calendarApi?.refetchEvents();
      }
      setEvents(newEvents);
      if (props.onEventChange) {
        props.onEventChange(newEvents[index]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEventRemove = (data: EventRemoveArg) => {
    let newEvents: ScheduleEvent[] = [...events];
    newEvents = newEvents.filter((e) => e.scheduleId !== data.event.id);
    setEvents(newEvents);
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    setViewType(arg.view.type);
  };

  const handleToggleEntity = (id: string) => {
    const newList = [...entities];
    const index = entities.findIndex((entity) => entity._id === id);
    newList[index].visible = !newList[index].visible;
    setEntities(newList);
  };

  const handleSelectEntity = (entity: Entity) => {
    setActiveEntity(entity);
  };

  const handleCalendarChange = (newDate: Date) => {
    setDate(newDate);
    const calendarApi = calendarRef.current?.getApi();
    switch (viewType) {
      case 'timeGridWeek':
        calendarApi?.gotoDate(
          moment(newDate).startOf('week').format('YYYY-MM-DD')
        );
        break;
      case 'dayGridMonth':
        calendarApi?.gotoDate(
          moment(newDate).startOf('month').format('YYYY-MM-DD')
        );
        break;
      case 'timeGridDay':
        calendarApi?.gotoDate(moment(newDate).format('YYYY-MM-DD'));
        break;
      default:
        break;
    }
  };

  const handleCalendarStyle = (sDate: Date) => {
    let startDate;
    let endDate;
    switch (viewType) {
      case 'timeGridWeek':
        startDate = moment(date).startOf('week').startOf('day');
        endDate = moment(date).endOf('week').endOf('day');
        break;
      case 'dayGridMonth':
        startDate = moment(date).startOf('month').startOf('day');
        endDate = moment(date).endOf('month').endOf('day');
        break;
      case 'timeGridDay':
        startDate = moment(date).startOf('day');
        endDate = moment(date).endOf('day');
        break;
      default:
        break;
    }
    if (moment(sDate).isBetween(startDate, endDate, undefined, '[]')) {
      const dayColor =
        moment(sDate).weekday() !== 0 && moment(sDate).weekday() !== 6
          ? '#495057'
          : '#f03e3e';
      const dayBgColor = props.darkMode
        ? theme.colors.gray[5]
        : theme.colors.blue[0];
      return { backgroundColor: dayBgColor, color: dayColor, borderRadius: 0 };
    }
    return {};
  };

  const handleEventClassNames = (evt: EventContentArg) =>
    entities.find((entity) => entity._id === evt.event.extendedProps.entityId)
      ?.visible
      ? ''
      : 'd-none';

  const handleEventContent = (evt: EventContentArg) => (
    <EventContentPopover eventContent={evt} lang={lang} />
  );

  const handleDayHeaderContent = (args: DayHeaderContentArg) => {
    if (args.view.type === 'timeGridWeek') {
      return (
        <>
          <p className="timegrid-weekday">
            {moment(args.date).locale(lang).format('ddd')}
          </p>
          <p className="timegrid-day">
            {moment(args.date).locale(lang).format('D')}
          </p>
        </>
      );
    }
    return null;
  };

  const handleEventUpdate = (event: ScheduleEvent) => {
    const newEntity = entities.find((e) => e._id === event.entityId);
    const calendarApi = calendarRef.current?.getApi();

    const eventHandler = calendarApi?.getEventById(
      event.scheduleId ? event.scheduleId : ''
    );
    eventHandler?.remove();
    const newEventId = uuidv4();
    setTimeout(() => {
      calendarApi?.addEvent({
        id: newEventId,
        groupId: uuidv4(),
        title: newEntity?.name,
        backgroundColor: newEntity?.color,
        borderColor: newEntity?.color,
        textColor: 'white',
        start: moment(`${event.startDate} ${event.startTime}`).toDate(),
        end: moment(`${event.startDate} ${event.endTime}`).toDate(),
        daysOfWeek: event.frequency ? event.daysOfWeek : undefined,
        startTime: event.frequency ? event.startTime : null,
        endTime: event.frequency ? event.endTime : null,
        startRecur: event.frequency ? event.startDate : null,
        endRecur: event.frequency ? event.endDate : null,
        display: 'block',
        extendedProps: {
          recuringEventId: event.frequency ? newEventId : null,
          entityId: newEntity?._id,
          recurring: !!event.frequency,
          daysOfWeek: event.frequency ? event.daysOfWeek : null,
          startTime: event.frequency ? event.startTime : null,
          endTime: event.frequency ? event.endTime : null,
          startRecur: event.frequency ? event.startDate : null,
          endRecur: event.frequency ? event.endDate : null,
          updated: true,
        },
      });

      calendarApi?.refetchEvents();
    }, 200);
    if (event.frequency) {
      const newEvent: ScheduleEvent = {
        _id: uuidv4(),
        scheduleId: newEventId,
        entityType: newEntity?._id || '',
        entityId: newEntity?._id || '',
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        frequency: event.frequency,
        daysOfWeek: event.daysOfWeek,
      };
      setEvents((oldEvents) => [...oldEvents, newEvent]);
    }
  };

  const handleEventDelete = (id: string) => {
    const event = events.find((e: ScheduleEvent) => e.scheduleId === id);
    if (event) {
      const calendarApi = calendarRef.current?.getApi();
      if (props.onEventRemove) {
        props.onEventRemove(event);
      }
      const eventHandler = calendarApi?.getEventById(
        event.scheduleId ? event.scheduleId : ''
      );
      eventHandler?.remove();
      calendarApi?.refetchEvents();
    }
  };

  const handleEventDuplicate = (id: string) => {
    const event = events.find((e: ScheduleEvent) => e.scheduleId === id);
    if (event) {
      const newEntity = entities.find((e) => e._id === activeEvent?.entityId);
      const calendarApi = calendarRef.current?.getApi();
      const eventHandler = calendarApi?.getEventById(
        event.scheduleId ? event.scheduleId : ''
      );
      calendarApi?.addEvent({
        id: uuidv4(),
        title: newEntity?.name,
        backgroundColor: newEntity?.color,
        borderColor: newEntity?.color,
        textColor: 'white',
        start: moment(eventHandler?.start).toDate(),
        end: moment(eventHandler?.end).toDate(),
        display: 'block',
        extendedProps: {
          entityId: newEntity?._id,
          duplicated: true,
        },
      });
      calendarApi?.refetchEvents();
    }
  };

  const handleToggleExpand = () => {
    if (props.toggleExpand) {
      props.toggleExpand();
      toggle();
    }
  };

  return (
    <MantineProvider
      theme={{
        colorScheme: props.darkMode ? 'dark' : 'light',
        dir: props.rtl ? 'rtl' : 'ltr',
      }}
      withGlobalStyles={props.darkMode}
      withNormalizeCSS={props.darkMode}
      emotionOptions={{ key: 'mantine', stylisPlugins: [rtlPlugin] }}
    >
      <ModalsProvider>
        {globalStyle()}
        <Grid
          className={classes.border}
          columns={24}
          sx={() => ({
            position: 'relative',
            justifyContent: 'flex-end',
          })}
        >
          <Grid.Col className={classes.leftPanel} sm={7}>
            <Stack>
              {isLocalLoading && (
                <Calendar
                  value={date}
                  onChange={handleCalendarChange}
                  onMonthChange={handleCalendarChange}
                  dayStyle={handleCalendarStyle}
                  locale={lang}
                  firstDayOfWeek="sunday"
                  size="sm"
                  fullWidth
                />
              )}
              {props.editable && (
                <EntitiesList
                  entities={entities}
                  onCreateEntity={props.createEntity}
                  onToggleEntity={handleToggleEntity}
                  activeEntity={activeEntity}
                  onSelectEntity={handleSelectEntity}
                />
              )}
            </Stack>
          </Grid.Col>
          <Grid.Col
            sm={17}
            style={{ paddingTop: 20, position: 'relative' }}
            className={classes.borderLeft}
          >
            {props.toggleExpand && (
              <div
                onClick={handleToggleExpand}
                className={classes.btnToggleExpand}
                aria-hidden="true"
              >
                <Icon
                  path={mdiArrowExpand}
                  size="1.25rem"
                  color="gray"
                  className={classes.cursorPointer}
                />
              </div>
            )}
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'title',
                center: '',
                right: 'prev,dayGridMonth,timeGridWeek,timeGridDay,next',
              }}
              allDaySlot={false}
              defaultAllDay={false}
              dayMaxEvents
              slotEventOverlap={false}
              scrollTime="07:30:00"
              slotDuration="01:00:00"
              snapDuration="00:30"
              eventConstraint="businessHours"
              selectConstraint="businessHours"
              firstDay={0}
              locales={allLocales}
              locale={lang}
              ref={calendarRef}
              initialView={viewType}
              editable={props.editable}
              selectable={props.editable}
              selectMirror={props.editable}
              droppable={props.editable}
              businessHours={props.businessHours || DEFAULT_BUSINESS_HOURS}
              eventClick={handleEventClick}
              select={handleDateSelect}
              eventReceive={handleEventAdd}
              eventAdd={handleEventAdd}
              eventChange={handleEventChange}
              eventRemove={handleEventRemove}
              datesSet={handleDatesSet}
              dayHeaderContent={handleDayHeaderContent}
              eventContent={handleEventContent}
              eventClassNames={handleEventClassNames}
            />
          </Grid.Col>
          <EditEvent
            show={showEditEventPopup}
            onClose={() => {
              setShowEditEventPopup(false);
            }}
            onSubmit={handleEventUpdate}
            onDelete={handleEventDelete}
            onDuplicate={handleEventDuplicate}
            entities={entities}
            event={activeEvent}
            lang={lang}
          />
        </Grid>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default Scheduler;
