import { values, pick, omit } from 'lodash';
import { Platform } from 'react-native';
import deviceInfo from 'react-native-device-info';
import { initialize, batchDebugEvents } from './redux/module';

const device = {
  bundleId: deviceInfo.getBundleId(),
  name: deviceInfo.getDeviceName(),
  platform: Platform.OS,
  id: deviceInfo.getUniqueID(),
  buildNumber: deviceInfo.getBuildNumber(),
  country: deviceInfo.getDeviceCountry(),
};

const __config = {
  isVisible: false,
  logLevel: 'ALL',
  eventTypes: [
    {
      TYPE: 'NETWORK',
      CATEGORY_NAME: 'Network request logging',
      EVENT_NAME: 'Net. Request',
    }
  ],
};

const defaultConfig = {
  enabled: true,
  isVisible: false,
  logLevel: 'ALL',
};

function DebuggerCreator (store, _config) {
  if (!store) {
    throw new Error('[react-debugger] store is not attached');
  }

  const config = {
    ...defaultConfig,
    ..._config,
  };

  class Debugger {
    static ACTION_TYPES = {};
    static CATEGORY_NAMES = {};
    static EVENT_NAMES = {};

    static validateEvent = ({ label, type, logType }) => !!label && !!type && !!logType;

    constructor() {
      if (config.enabled) {
        this.initialize();
        this.dispatchEvents();
      }
    }

    initialize() {
      const {
        isVisible,
        logLevel,
        activeEvents,
        eventTypes,
      } = config;

      const EventConfig = eventTypes.reduce((acc, b) => ({
        ACTION_TYPES: {
          ...acc.ACTION_TYPES,
          [b.TYPE]: b.TYPE,
        },
        CATEGORY_NAMES: {
          ...acc.CATEGORY_NAMES,
          [b.TYPE]: b.CATEGORY_NAME,
        },
        EVENT_NAMES: {
          ...acc.EVENT_NAMES,
          [b.TYPE]: b.EVENT_NAME,
        },
      }), {
        ACTION_TYPES: {},
        CATEGORY_NAMES: {},
        EVENT_NAMES: {},
      });

      DebuggerCreator.ACTION_TYPES = EventConfig.ACTION_TYPES;
      DebuggerCreator.CATEGORY_NAMES = EventConfig.CATEGORY_NAMES;
      DebuggerCreator.EVENT_NAMES = EventConfig.EVENT_NAMES;
      DebuggerCreator.actionTypeList = values(EventConfig.ACTION_TYPES);
      DebuggerCreator.getActionTypeName = (actionType) => EventConfig.CATEGORY_NAMES[actionType];
      DebuggerCreator.getActionTypeShortName = (actionType) => EventConfig.EVENT_NAMES[actionType];

      store.dispatch(initialize({
        isVisible,
        logLevel,
        debugTypes: DebuggerCreator.actionTypeList,
      }));
    }

    static logOnServer = (events) => {
      fetch(config.serverUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${config.authorization}`
        },
        body: JSON.stringify({
          device,
          events,
        }),
      });
    }

    events = [];

    dispatchEvents = () => {
      if (store && this.events.length) {
        store.dispatch(batchDebugEvents([...this.events]));
        if (config.allowServerLogging) {
          Debugger.logOnServer(this.events);
        }
        this.events = [];
      }
      setTimeout(this.dispatchEvents, 1000);
    }

    logAction(event) {
      if (config.enabled) {
        if (Debugger.validateEvent(event)) {
          const date = new Date().getTime();
          this.events.push({
            ...event,
            id: `${event.label}-${date}`,
            date,
          });
        } else {
          /* eslint no-console: 0 */
          console.warn('[DEBUGGER] invalid event');
        }
      }
    }
  }

  const _Debugger = new Debugger();
  DebuggerCreator.logAction = _Debugger.logAction.bind(_Debugger);
  DebuggerCreator.EVENT_TYPES = {
    NONE: 'NONE',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    SUCCESS: 'SUCCESS',
    ALL: 'ALL',
  };
  DebuggerCreator.eventTypeList = values(DebuggerCreator.EVENT_TYPES);
};

export default DebuggerCreator;
