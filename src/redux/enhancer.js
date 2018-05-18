import Debugger from '../debugger';

const createDebugger = (config) => (createSore) => (...props) => {
  const store = createSore(...props);

  new Debugger(store, config);
  return store;
};


export default createDebugger;
