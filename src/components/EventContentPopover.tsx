import React, { useState, useEffect } from 'react';
import { Popover, Text, Group } from '@mantine/core';
import { EventContentArg } from '@fullcalendar/react';
import moment from 'moment-timezone';
import Icon from '@mdi/react';
import {
  mdiCalendarMonthOutline,
  mdiCalendarEnd,
  mdiClockOutline,
  mdiUpdate,
} from '@mdi/js';
import { useTranslation } from 'react-i18next';
import { daysForLocale } from '../event-utils';
import { namespaces } from '../i18n/i18n.constants';
import useStyles from '../style';

interface Props {
  eventContent: EventContentArg;
  lang: string;
}

function EventContentPopover(props: Props) {
  const WEEK_DAYS = daysForLocale(props.lang);
  const [opened, setOpened] = useState(false);
  const { t, i18n } = useTranslation();
  const { classes } = useStyles();
  useEffect(() => {
    i18n.changeLanguage(props.lang);
  }, []);
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      placement="center"
      withArrow
      trapFocus={false} // -> disable focus trap
      closeOnEscape={false} // -> disable escape key press handling
      closeOnClickOutside={false} // -> disable outside click handling
      transition="pop-top-left"
      width={260}
      style={{ width: '100%', height: '100%' }}
      styles={{ body: { pointerEvents: 'none' } }}
      target={
        props.eventContent.view.type === 'dayGridMonth' ? (
          <div
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
          >
            <i>{props.eventContent.event.title}</i>
            <br />
            <span>
              {moment(props.eventContent.event.startStr)
                .locale(props.lang)
                .format('h:mma')}
            </span>
            &nbsp;-&nbsp;
            <span>
              {props.eventContent.event.endStr === ''
                ? moment(props.eventContent.event.startStr)
                    .locale(props.lang)
                    .add(1, 'hour')
                    .format('h:mma')
                : moment(props.eventContent.event.endStr)
                    .locale(props.lang)
                    .format('h:mma')}
            </span>
          </div>
        ) : (
          <div
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
            style={{ height: '100%' }}
          >
            {props.eventContent.event.extendedProps.recurring && (
              <>
                <Icon path={mdiUpdate} size="1rem" color="white" /> <br />
              </>
            )}
            <i>{props.eventContent.event.title}</i>
            <br />
            <span>
              {moment(props.eventContent.event.startStr)
                .locale(props.lang)
                .format('h:mma')}
            </span>
            <br />
            <span>
              {props.eventContent.event.endStr === ''
                ? moment(props.eventContent.event.startStr)
                    .locale(props.lang)
                    .add(1, 'hour')
                    .format('h:mma')
                : moment(props.eventContent.event.endStr)
                    .locale(props.lang)
                    .format('h:mma')}
            </span>
          </div>
        )
      }
      radius="xs"
    >
      <>
        <Group align="center" noWrap spacing="xs">
          <div
            style={{
              width: '1rem',
              height: '1rem',
              backgroundColor: props.eventContent.event.backgroundColor,
            }}
          />
          <Text className={classes.textEllipsis}>
            {props.eventContent.event.title}
          </Text>
        </Group>
        <Group align="center" noWrap spacing="xs">
          <Icon path={mdiCalendarMonthOutline} size="1rem" color="gray" />
          <Text>
            {moment(props.eventContent.event.startStr)
              .locale(props.lang)
              .format('dddd, MMMM D, YYYY')}
          </Text>
        </Group>
        <Group align="center" noWrap spacing="xs">
          <Icon path={mdiClockOutline} size="1rem" color="gray" />
          <Text>
            {moment(props.eventContent.event.startStr)
              .locale(props.lang)
              .format('h:mm A')}
            &nbsp;
            {t('labels.to', { ns: namespaces.common })}
            &nbsp;
            {props.eventContent.event.endStr === ''
              ? moment(props.eventContent.event.startStr)
                  .locale(props.lang)
                  .add(1, 'hour')
                  .format('h:mm A')
              : moment(props.eventContent.event.endStr)
                  .locale(props.lang)
                  .format('h:mm A')}
          </Text>
        </Group>
        {props.eventContent.event.extendedProps.recurring && (
          <Group align="center" noWrap spacing="xs">
            <Icon path={mdiUpdate} size="1rem" color="gray" />
            <Text>
              Repeat{' '}
              {props.eventContent.event.extendedProps.daysOfWeek.map(
                (weekDay: number, index: number) =>
                  WEEK_DAYS[weekDay].substring(0, 2) +
                  (index <
                  props.eventContent.event.extendedProps.daysOfWeek.length - 1
                    ? ', '
                    : '')
              )}
            </Text>
          </Group>
        )}
        {props.eventContent.event.extendedProps.recurring &&
          props.eventContent.event.extendedProps.endRecur && (
            <Group align="center" noWrap spacing="xs">
              <Icon path={mdiCalendarEnd} size="1rem" color="gray" />
              <Text>
                {moment(props.eventContent.event.extendedProps.endRecur).format(
                  'dddd, MMMM D, YYYY'
                )}
              </Text>
            </Group>
          )}
      </>
    </Popover>
  );
}
export default EventContentPopover;
