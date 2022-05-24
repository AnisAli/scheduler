import React from 'react';
import { Container, Space } from '@mantine/core';
import Scheduler from './Scheduler';
import {
  DEFAULT_COLORS,
  TEMP_BUSINESS_HOURS,
  DEFAULT_ENTITIES,
  DEFAULT_EVENTS,
} from './event-utils';
import { ScheduleEvent } from './type';

function DemoApp() {
  return (
    <Container>
      <Space h={50} />
      <Scheduler
        businessHours={TEMP_BUSINESS_HOURS}
        colors={DEFAULT_COLORS}
        createEntity={() => {
          console.log('Create Entity:');
        }}
        editable
        language="en"
        onEventAdd={(event: ScheduleEvent) => {
          console.log('Event Added:', event);
        }}
        onEventChange={(event: ScheduleEvent) => {
          console.log('Event Changed:', event);
        }}
        onEventRemove={(event: ScheduleEvent) => {
          console.log('Event Removed:', event);
        }}
        fetchEntities={() =>
          new Promise((resolve) => {
            resolve(DEFAULT_ENTITIES);
          })
        }
        fetchEvents={() =>
          new Promise((resolve) => {
            resolve(DEFAULT_EVENTS);
          })
        }
        toggleExpand={() => {
          console.log('Toggle Expand');
        }}
        // darkMode
        // rtl
      />
    </Container>
  );
}

export default DemoApp;
