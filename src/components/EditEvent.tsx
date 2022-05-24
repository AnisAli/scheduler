/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Group,
  Select,
  Checkbox,
  Menu,
  Text,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import Icon from '@mdi/react';
import {
  mdiTrashCanOutline,
  mdiCalendarMonthOutline,
  mdiClockOutline,
  mdiContentCopy,
} from '@mdi/js';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { Entity, ScheduleEvent } from '../type';
import { daysForLocale } from '../event-utils';
import { namespaces } from '../i18n/i18n.constants';
import useStyles from '../style';

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  entities: Entity[];
  event: ScheduleEvent | null;
  lang: string;
}
interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string;
  label: string;
  color: string;
}
function EditEvent(props: Props) {
  const [showRecurring, setShowRecurring] = useState(false);
  const [repeatEnd, setRepeatEnd] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState<any>([]);
  const WEEK_DAYS = daysForLocale(props.lang);
  const modals = useModals();
  const form = useForm({
    initialValues: {
      _id: props?.event?._id || '',
      scheduleId: props?.event?.scheduleId || '',
      entityType: props?.event?.entityId || '',
      entityId: props?.event?.entityId || '',
      startDate: moment(props?.event?.startDate).toDate() || new Date(),
      endDate: moment(props?.event?.endDate).toDate() || new Date(),
      startTime: moment(props?.event?.startTime).toDate() || new Date(),
      endTime: moment(props?.event?.endTime).toDate() || new Date(),
    },

    validate: {},
  });
  const { t, i18n } = useTranslation();
  const { classes } = useStyles();
  useEffect(() => {
    i18n.changeLanguage(props.lang);
  }, []);
  useEffect(() => {
    form.setValues({
      ...form.values,
      _id: props?.event?._id || '',
      scheduleId: props?.event?.scheduleId || '',
      entityType: props?.event?.entityId || '',
      entityId: props?.event?.entityId || '',
      startDate: moment(props?.event?.startDate).toDate(),
      endDate: props?.event?.endDate
        ? moment(props?.event?.endDate).toDate()
        : new Date(),
      startTime: moment(
        `${props?.event?.startDate} ${props?.event?.startTime}`
      ).toDate(),
      endTime: moment(
        `${
          props?.event?.endDate
            ? props?.event?.endDate
            : props?.event?.startDate
        } ${props?.event?.endTime}`
      ).toDate(),
    });
    if (props?.event?.daysOfWeek?.length) {
      setShowRecurring(true);
      setDaysOfWeek(props?.event?.daysOfWeek);
      if (props?.event?.endDate) {
        setRepeatEnd(true);
      }
    } else {
      setRepeatEnd(false);
      setShowRecurring(false);
      setDaysOfWeek([]);
    }
  }, [props.event, props.show]);
  // eslint-disable-next-line react/no-unstable-nested-components
  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ label, color, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <div
            style={{
              width: '1rem',
              height: '1rem',
              backgroundColor: color,
              marginRight: '0.3rem',
            }}
          />
          <Text size="sm" className={classes.textEllipsis}>
            {label}
          </Text>
        </Group>
      </div>
    )
  );
  const handleDelete = () => {
    modals.openConfirmModal({
      title: t('texts.sure', { ns: namespaces.common }),
      centered: true,
      children: (
        <Text size="sm">{t('texts.confirm', { ns: namespaces.common })}</Text>
      ),
      labels: {
        confirm: t('buttons.delete', { ns: namespaces.common }),
        cancel: t('buttons.cancel', { ns: namespaces.common }),
      },
      confirmProps: { color: 'red' },
      // onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        props.onDelete(form.values.scheduleId);
        props.onClose();
        form.reset();
        setShowRecurring(false);
        setRepeatEnd(false);
        setDaysOfWeek([]);
      },
    });
  };
  const handleDuplicate = () => {
    props.onDuplicate(form.values.scheduleId);
    props.onClose();
    form.reset();
    setShowRecurring(false);
    setRepeatEnd(false);
    setDaysOfWeek([]);
  };
  return (
    <Modal
      opened={props.show}
      onClose={props.onClose}
      withCloseButton={false}
      padding={0}
      zIndex={199}
      centered
    >
      <div className={classes.modalHeader}>
        <Group position="right">
          <div onClick={handleDelete} aria-hidden="true">
            <Icon
              path={mdiTrashCanOutline}
              size="1.25rem"
              color="gray"
              className={classes.cursorPointer}
            />
          </div>
          <Menu>
            <Menu.Item
              icon={<Icon path={mdiContentCopy} size="1.25rem" color="gray" />}
              onClick={handleDuplicate}
            >
              {t('buttons.duplicate', { ns: namespaces.common })}
            </Menu.Item>
          </Menu>
        </Group>
      </div>
      <form
        onSubmit={form.onSubmit((values) => {
          const data: ScheduleEvent = {
            ...values,
            startDate: moment(values.startDate).format('YYYY-MM-DD'),
            startTime: moment(values.startTime).format('HH:mm'),
            endDate: moment(values.endDate).format('YYYY-MM-DD'),
            endTime: moment(values.endTime).format('HH:mm'),
          };
          if (showRecurring && daysOfWeek.length) {
            data.daysOfWeek = daysOfWeek.sort((a: number, b: number) => a < b);
            data.frequency = 'weekly';
            if (!repeatEnd) {
              data.endDate = undefined;
            }
          }
          props.onSubmit(data);
          props.onClose();
          form.reset();
          setShowRecurring(false);
          setRepeatEnd(false);
          setDaysOfWeek([]);
        })}
      >
        <div className={classes.modalBody}>
          <Select
            itemComponent={SelectItem}
            data={props.entities.map((entity) => ({
              value: entity._id,
              label: entity.name,
              color: entity.color,
            }))}
            maxDropdownHeight={400}
            value={form.values.entityId}
            onChange={(value) => form.setFieldValue('entityId', value || '')}
            data-autofocus
          />
          <Group align="center" mt="md" ml="sm">
            <Icon path={mdiCalendarMonthOutline} size="1.25rem" color="gray" />
            <DatePicker
              value={form.values.startDate}
              inputFormat="dddd, MMMM D, YYYY"
              firstDayOfWeek="sunday"
              clearable={false}
              onChange={(value) =>
                form.setFieldValue('startDate', value || new Date())
              }
              locale={props.lang}
            />
          </Group>
          <Group align="center" mt="md" ml="sm">
            <Icon path={mdiClockOutline} size="1.25rem" color="gray" />
            <TimeInput
              format="12"
              value={form.values.startTime}
              onChange={(value) => form.setFieldValue('startTime', value)}
            />
            &nbsp;
            {t('labels.to', { ns: namespaces.common })}
            &nbsp;
            <TimeInput
              format="12"
              value={form.values.endTime}
              onChange={(value) => form.setFieldValue('endTime', value)}
            />
          </Group>

          <Checkbox
            mt="md"
            ml="sm"
            checked={showRecurring}
            label={t('labels.repeat', { ns: namespaces.common })}
            onChange={(event) => setShowRecurring(event.currentTarget.checked)}
          />
          {showRecurring && (
            <>
              <Group align="center" mt="md" position="center">
                {WEEK_DAYS.map((day, index) => (
                  <div
                    className={`${classes.recurringWeekday} ${
                      daysOfWeek.includes(index) ? 'active' : ''
                    }`}
                    key={day}
                    onClick={() => {
                      if (daysOfWeek.includes(index)) {
                        setDaysOfWeek(
                          daysOfWeek.filter((d: any) => d !== index)
                        );
                      } else {
                        setDaysOfWeek([...daysOfWeek, index]);
                      }
                    }}
                    aria-hidden="true"
                  >
                    {day.substring(0, 2)}
                  </div>
                ))}
              </Group>
              <Group align="center" mt="md" position="center">
                <Checkbox
                  checked={repeatEnd}
                  label={t('labels.ends', { ns: namespaces.common })}
                  onChange={(event) =>
                    setRepeatEnd(event.currentTarget.checked)
                  }
                />
                <DatePicker
                  value={form.values.endDate}
                  inputFormat="dddd, MMMM D, YYYY"
                  firstDayOfWeek="sunday"
                  disabled={!repeatEnd}
                  onChange={(value) =>
                    form.setFieldValue('endDate', value || new Date())
                  }
                  locale={props.lang}
                />
              </Group>
            </>
          )}
        </div>
        <div className={classes.modalFooter}>
          <Group position="right">
            <Button
              variant="default"
              type="button"
              onClick={() => {
                props.onClose();
                form.reset();
                setShowRecurring(false);
                setRepeatEnd(false);
                setDaysOfWeek([]);
              }}
            >
              {t('buttons.cancel', { ns: namespaces.common })}
            </Button>
            <Button type="submit">
              {t('buttons.save', { ns: namespaces.common })}
            </Button>
          </Group>
        </div>
      </form>
    </Modal>
  );
}
export default EditEvent;
