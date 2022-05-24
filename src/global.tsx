import React from 'react';
import { Global } from '@mantine/core';

function globalStyle() {
  return (
    <Global
      styles={(theme) => ({
        '.mantine-Col-root': {
          padding: '0px',
        },
        '.mantine-Popover-target': {
          height: '100%',
        },
        '.fc': {
          fontFamily:
            '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji !important',
        },
        '.fc-scrollgrid': {
          borderLeft: 'none',
        },
        '.fc .fc-toolbar': {
          justifyContent: 'space-around',
        },
        '.fc-toolbar .fc-button-group': {
          display: 'block !important',
          backgroundColor:
            theme.colorScheme === 'light'
              ? theme.colors.gray[4]
              : theme.colors.gray[5],
        },
        '.fc-prev-button': {
          marginRight: '1rem !important',
        },
        '.fc-next-button': {
          marginLeft: '1rem !important',
        },
        '.fc-prev-button, .fc-next-button': {
          backgroundColor:
            theme.colorScheme === 'light'
              ? `${theme.white} !important`
              : `${theme.colors.dark[7]} !important`,
          color:
            theme.colorScheme === 'light'
              ? `${theme.black} !important`
              : `${theme.colors.gray[4]} !important`,
          border: 'none !important',
          borderRadius: '0 !important',
        },
        '.fc-dayGridMonth-button, .fc-timeGridWeek-button, .fc-timeGridDay-button':
          {
            backgroundColor: 'transparent !important',
            color:
              theme.colorScheme === 'light'
                ? `${theme.black} !important`
                : `${theme.colors.dark[7]} !important`,
            border: 'none !important',
            paddingLeft: '0.7rem !important',
            paddingRight: '0.7rem !important',
            textTransform: 'capitalize !important' as 'capitalize',
          },
        '.fc-toolbar .fc-button-active': {
          fontWeight: 'bold !important',
          backgroundColor: `${theme.white} !important`,
          paddingTop: '0rem !important',
          paddingBottom: '0rem !important',
          borderRadius: '5px !important',
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        },
        '.fc-toolbar .fc-button-group .fc-button:focus': {
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important',
        },
        '.fc .fc-day-today': {
          backgroundColor: 'inherit !important',
        },
        '.fc-toolbar-title': {
          color:
            theme.colorScheme === 'light'
              ? `${theme.colors.dark[3]} !important`
              : `${theme.colors.gray[1]} !important`,
          fontWeight: 'normal !important',
        },
        '.fc-col-header-cell-cushion p': {
          margin: '0 !important',
        },
        '.fc-col-header-cell-cushion': {
          padding: '0.5rem 0 !important',
        },
        '.fc-col-header-cell-cushion .timegrid-weekday': {
          fontWeight: 'normal !important',
          textTransform: 'uppercase',
          fontSize: '0.9rem',
        },
        '.fc-col-header-cell-cushion .timegrid-day': {
          color: `${theme.colors.dark[2]} !important`,
          fontWeight: 'normal !important',
          fontSize: '1.5rem',
        },
        '.fc-timegrid-slots tr': {
          height: '2.5rem',
        },
        '.fc-timegrid-slot-label-cushion.fc-scrollgrid-shrink-cushion': {
          textTransform: 'uppercase',
        },
        '.fc-timegrid-slot.fc-timegrid-slot-label.fc-scrollgrid-shrink': {
          borderTop: 'none !important',
          borderBottom: 'none !important',
          verticalAlign: 'top !important',
          color: `${theme.colors.dark[2]} !important`,
          fontSize: '0.8rem',
        },
        '.fc-event-main div': {
          position: 'relative',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '.fc-event-main i': {
          width: '100%',
          fontStyle: 'normal !important',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '.fc-timegrid-event-harness-inset .fc-timegrid-event:hover': {
          border: '2px solid black !important',
        },
        '.d-none': {
          display: 'none !important',
        },
      })}
    />
  );
}

export default globalStyle;
