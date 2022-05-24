import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme, _params, getRef) => ({
  border: {
    border: '1px solid lightgray',
  },
  borderX: {
    borderLeft: '1px solid lightgray',
    borderRight: '1px solid lightgray',
  },
  borderY: {
    borderTop: '1px solid lightgray',
    borderBottom: '1px solid lightgray',
  },
  borderLeft: {
    borderLeft: '1px solid lightgray',
  },
  borderRight: {
    borderRight: '1px solid lightgray',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  leftPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'auto',
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      position: 'relative',
    },
  },
  btnToggleExpand: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 999,
  },
  modalHeader: {
    padding: '0.75rem',
    borderBottom: '1.5px solid lightgray',
  },
  modalBody: {
    padding: '0.75rem',
  },
  modalFooter: {
    padding: '0.75rem',
    borderTop: '1.5px solid lightgray',
  },
  entityList: {
    padding: '0.5rem 0',
    '.mantine-Checkbox-root': {
      padding: '0.25rem 0rem 0.25rem 1rem',
    },
    '.entity-active': {
      backgroundColor:
        theme.colorScheme === 'light'
          ? theme.colors.blue[0]
          : theme.colors.gray[7],
    },
  },
  recurringWeekday: {
    width: '30px',
    height: '30px',
    fontSize: '15px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
    color: 'black',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji !important',
    cursor: 'pointer',
    '&.active': {
      color: 'white',
      backgroundColor: '#278bed',
    },
  },
  textEllipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
}));

export default useStyles;
