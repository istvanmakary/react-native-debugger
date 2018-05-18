import { values, pick, omit } from 'lodash';
import { Platform } from 'react-native';
import deviceInfo from 'react-native-device-info';
import ErrorUtils from 'ErrorUtils';
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

const cloneInstance = (base, instance, originalModule) => {
  Object.setPrototypeOf(base, pick(Object.getPrototypeOf(instance), ['logAction']));
  Object.assign(base, instance);
  Object.assign(base, omit(originalModule, ['logOnServer']));
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
    static EVENT_TYPES = {
      NONE: 'NONE',
      ERROR: 'ERROR',
      WARNING: 'WARNING',
      SUCCESS: 'SUCCESS',
      ALL: 'ALL',
    };

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

      Debugger.ACTION_TYPES = EventConfig.ACTION_TYPES;
      Debugger.CATEGORY_NAMES = EventConfig.CATEGORY_NAMES;
      Debugger.EVENT_NAMES = EventConfig.EVENT_NAMES;
      Debugger.actionTypeList = values(Debugger.ACTION_TYPES);
      Debugger.eventTypeList = values(Debugger.EVENT_TYPES);
      Debugger.getActionTypeName = (actionType) => EventConfig.CATEGORY_NAMES[actionType];
      Debugger.getActionTypeShortName = (actionType) => EventConfig.EVENT_NAMES[actionType];


      store.dispatch(initialize({
        isVisible,
        logLevel,
        debugTypes: Debugger.actionTypeList,
      }));
    }

    // setUpGlobalErrorListener() {
    //   const globalHAndler = ErrorUtils.getGlobalHandler();
    //   ErrorUtils.setGlobalHandler((data) => {
    //     this.log({
    //       event: this.ACTION_TYPES.CRASH,
    //       type: this.ACTION_TYPES.CRASH,
    //       logType: Debugger.EVENT_TYPES.ERROR,
    //       data,
    //     });
    //     globalHAndler(data);
    //   });
    // }

    static logOnServer = (events) => {
      fetch(config.serverUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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

  cloneInstance(DebuggerCreator, new Debugger(), Debugger);
};

export default DebuggerCreator;
