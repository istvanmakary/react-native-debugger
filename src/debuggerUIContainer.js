import { connect } from 'react-redux';
import DebuggerUI from './debuggerUIComponent';
import {
  getDebugger,
  resetDebugEvents,
  hideDebugger,
  toggleType,
  setLogLevel,
} from './redux/module';

const mapStateToProps = (state) => ({
  ...getDebugger(state),
});

const mapDispatchToProps = (dispatch) => ({
  clear: () => dispatch(resetDebugEvents()),
  close: () => dispatch(hideDebugger()),
  toggleSetting: (name) => dispatch(toggleType(name)),
  setLogLevel: (name) => dispatch(setLogLevel(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DebuggerUI);
