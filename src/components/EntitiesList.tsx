import React, { useEffect, useState } from 'react';
import { Input, Grid, Checkbox, Text, Group } from '@mantine/core';
import Icon from '@mdi/react';
import {
  mdiMagnify,
  mdiPlus,
  mdiSortCalendarAscending,
  mdiSortCalendarDescending,
} from '@mdi/js';
import moment from 'moment-timezone';
import { Entity } from '../type';
import useStyles from '../style';

interface Props {
  entities: Entity[];
  activeEntity: Entity | null;
  onCreateEntity: (() => void) | undefined;
  onToggleEntity: (id: string) => void;
  onSelectEntity: (entity: Entity) => void;
}
function EntitiesList(props: Props) {
  const [searchString, setSearchString] = useState('');
  const [entities, setEntities] = useState(props.entities);
  const [sortOrder, setSortOrder] = useState(true);
  const { classes } = useStyles();
  useEffect(() => {
    setEntities(props.entities);
  }, [props]);
  return (
    <div>
      <Grid
        className={classes.borderY}
        style={{ margin: 0 }}
        align="center"
        grow
        columns={24}
      >
        <Grid.Col span={18} className={classes.borderRight}>
          <Input
            rightSection={<Icon path={mdiMagnify} size="1.3rem" color="gray" />}
            placeholder="Playlists"
            radius={0}
            value={searchString}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setSearchString(e.currentTarget.value)
            }
            sx={() => ({
              input: {
                border: 'none',
              },
            })}
          />
        </Grid.Col>
        <Grid.Col
          span={3}
          className={`${classes.cursorPointer} ${classes.borderRight}`}
          onClick={() => setSortOrder((oSortOder) => !oSortOder)}
        >
          <Group position="center" noWrap>
            <Icon
              path={
                sortOrder ? mdiSortCalendarAscending : mdiSortCalendarDescending
              }
              size="1.5rem"
              color="gray"
            />
          </Group>
        </Grid.Col>
        {props.onCreateEntity && (
          <Grid.Col
            span={3}
            className={classes.cursorPointer}
            onClick={() => props.onCreateEntity}
          >
            <Group position="center" noWrap>
              <Icon path={mdiPlus} size="1.5rem" color="gray" />
            </Group>
          </Grid.Col>
        )}
      </Grid>
      <div className={classes.entityList} id="entity-list">
        {entities
          .filter((entity) => entity.name.includes(searchString))
          .sort((a: Entity, b: Entity) => {
            if (moment(a.date).isSame(b.date)) {
              return 0;
            }
            if (sortOrder) {
              return moment(a.date).isAfter(b.date) ? 1 : -1;
            }
            return moment(a.date).isBefore(b.date) ? 1 : -1;
          })
          .map((entity) => (
            <Group
              onClick={() => {
                props.onSelectEntity(entity);
              }}
              key={entity._id}
              align="center"
              aria-hidden="true"
              className={`entity-item ${
                props.activeEntity?._id === entity._id ? 'entity-active' : ''
              }`}
              noWrap
            >
              <Checkbox
                value={entity._id}
                radius={3}
                size="md"
                sx={() => ({
                  '.mantine-Checkbox-input': {
                    '&:checked': {
                      backgroundColor: entity.color,
                      borderColor: entity.color,
                    },
                  },
                })}
                checked={entity.visible}
                onChange={() => {
                  props.onToggleEntity(entity._id);
                }}
                className={classes.cursorPointer}
              />
              <Text
                className={`${classes.textEllipsis} ${classes.cursorPointer}`}
              >
                {entity.name}
              </Text>
            </Group>
          ))}
      </div>
    </div>
  );
}

export default EntitiesList;
