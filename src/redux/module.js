import { createReducer } from 'redux-create-reducer';
const INIT = 'DEBUGGER/INIT';
const CLOSE = 'DEBUGGER/CLOSE';
const SHOW = 'DEBUGGER/SHOW';
const CLEAR = 'DEBUGGER/CLEAR';
const TOGGLE_TYPE = 'DEBUGGER/TOGGLE_TYPE';
const SET_LOG_LEVEL = 'DEBUGGER/SET_LOG_LEVEL';
const DEBUG_EVENTS = 'DEBUGGER/DEBUG_EVENTS';

export const initialize = (config) => ({
  type: INIT,
  payload: config,
});

export const batchDebugEvents = (events) => ({
  type: DEBUG_EVENTS,
  payload: events,
});

export const hideDebugger = () => ({
  type: CLOSE,
});

export const showDebugger = () => ({
  type: SHOW,
});

export const resetDebugEvents = () => ({
  type: CLEAR,
});

export const toggleType = (name) => ({
  type: TOGGLE_TYPE,
  payload: name,
});

export const setLogLevel = (level) => ({
  type: SET_LOG_LEVEL,
  payload: level,
});

const initialState = {
  isVisible: false,
  debugTypes: [],
  logLevel: '',
  events: [],
};

const matchLogLevel = (state, logLevel) => (
  state.debugger.logLevel === 'ALL'
  || state.debugger.logLevel === logLevel
);

export const getDebugger = (state) => {
  if (!state.debugger) {
    return {};
  }

  return {
    ...state.debugger,
    events: state.debugger.events.filter((e) => (
      matchLogLevel(state, e.logType) && (state.debugger.debugTypes || []).includes(e.type)
    )).sort((a,b) => b.date - a.date),
  };
};

export default createReducer(initialState, {
  [INIT]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [DEBUG_EVENTS]: (state, { payload }) => ({
    ...state,
    events: [
      ...payload,
      ...state.events.slice(0, 200),
    ],
  }),
  [CLOSE]: (state) => ({
    ...state,
    isVisible: false,
  }),
  [SHOW]: (state) => ({
    ...state,
    isVisible: true,
  }),
  [CLEAR]: (state) => ({
    ...state,
    events: [],
  }),
  [SET_LOG_LEVEL]: (state, { payload }) => ({
    ...state,
    logLevel: payload,
  }),
  [TOGGLE_TYPE]: (state, { payload }) => {
    const debugTypes = [...state.debugTypes];
    const arrayIndex = debugTypes.indexOf(payload);

    if (arrayIndex > -1) {
      debugTypes.splice(arrayIndex, 1);
    } else {
      debugTypes.push(payload);
    }

    return ({
      ...state,
      debugTypes,
    });
  },
});
