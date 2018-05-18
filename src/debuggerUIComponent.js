import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import s from './debuggerUIComponent.style.js';
import Debugger from './debugger';

const formatDate = (renderDate, date) => {
  const diff = renderDate - date;

  if (diff < 1000) {
    return `${diff} milisecounds ago`;
  }

  return `${(diff / 1000).toFixed(1)} secounds ago`;
};

const POSITIONS = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
};

class DebuggerUI extends Component {
  state = {
    opendItems: [],
    showSettings: false,
    position: POSITIONS.TOP,
  };

  componentDidMount() {
    this.updateTime();
  }

  componentDidUpdate() {
    this.updateTime();
  }

  updateTime = () => {
    if (this.props.events.length && !this.state.showSettings && this.props.isVisible) {
      clearTimeout(this.forceRenderTimeout);
      this.forceRenderTimeout = setTimeout(() => {
        this.forceUpdate();
        this.updateTime();
      }, 1000);
    }
  };

  toggleItem = (id) => {
    const opendItems = [...this.state.opendItems];
    const arrayPosition = this.state.opendItems.indexOf(id);
    if (arrayPosition > -1) {
      opendItems.splice(arrayPosition, 1);
    } else {
      opendItems.push(id);
    }

    this.setState({
      opendItems,
    });
  }

  toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  }

  isActiveEventType = ({ type }) => this.props.debugTypes.includes(type);

  renderItem = ({ label, date, logType, id, data, type }, i) => (
    <TouchableOpacity onPress={() => this.toggleItem(id)}>
      <View key={`${id}-${i}`} style={s.event}>
        <View style={s.statusContainer}>
          <View style={[s.marker, s[`${logType.toLowerCase()}Marker`]]} />
        </View>
        <View style={s.textContainer}>
          <Text
            children={this.state.opendItems.includes(id) ? label : label.slice(0, 100)}
            style={[s.text, s.label]}
          />
          <Text children={formatDate(this.renderDate, date)} style={[s.text, s.time]} />
          <Text
            children={`Type: ${Debugger.getActionTypeShortName(type)}`}
            type="white"
            style={s.time}
          />
          {
            this.state.opendItems.includes(id) && data && (
              <View style={s.dataContainer}>
                <Text children={JSON.stringify(data, null, 2)} style={[s.text, s.data]} />
              </View>
            )
          }
        </View>
      </View>
    </TouchableOpacity>
  );

  renderSettings = () => (
    <View style={s.settingsContainer}>
      <View style={s.settingsBlockContianer}>
        <Text children="Log Categories" style={[s.text, { paddingBottom: 10 }]} />
        {Debugger.actionTypeList.map((type) => {
          const isActive = this.isActiveEventType({ type });
          return (
            <TouchableOpacity onPress={() => this.props.toggleSetting(type)}>
              <View key={type} style={s.settingsItem}>
                <Text
                  style={[s.text, { color: isActive ? 'green' : 'white' }]}
                  children={`${Debugger.getActionTypeName(type)}: ${isActive ? 'ON' : 'OFF'}`}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text children="Event Types" style={[s.text, { paddingBottom: 10 }]} />
      <View style={[s.settingsBlockContianer, { flexDirection: 'row' }]}>
        {Debugger.eventTypeList.map((type) => (
          <TouchableOpacity onPress={() => this.props.setLogLevel(type)} style={{ flex: 1 }}>
            <View key={type} style={s.eventItem}>
              <Text
                style={[s.text, { color: this.props.logLevel === type ? 'green' : 'white' }]}
                children={type}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  renderControls = () => (
    <View style={s.controls}>
      <TouchableOpacity onPress={this.props.clear} style={{ flex: 1 }}>
        <View style={s.button}>
          <Text style={[s.text, s.text]}>Clear</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={this.toggleSettings} style={{ flex: 1 }}>
        <View style={s.button}>
          <Text
            children={
              this.state.showSettings ? 'Back' : 'Settings'
            }
            style={[s.text, s.text]}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={this.props.close} style={{ flex: 1 }}>
        <View style={s.button}>
          <Text style={[s.text, s.text]}>Close</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  renderEvents = () => this.props.events.map(this.renderItem);

  render() {
    if (!this.props.isVisible) {
      return null;
    }

    this.renderDate = new Date().getTime();

    return (
      <View
        style={[
          s.root,
          {
            [this.state.position === POSITIONS.BOTTOM ? 'bottom' : 'top']: 0,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            this.setState({
              position: this.state.position === POSITIONS.TOP ? POSITIONS.BOTTOM : POSITIONS.TOP,
            });
          }}
        >
          <Text children="DEBUGGER UI" style={[s.text, s.title]} />
        </TouchableOpacity>
        <ScrollView style={s.scroller}>
          {
            this.state.showSettings ? this.renderSettings() : this.renderEvents()
          }
        </ScrollView>
        {this.renderControls()}
      </View>
    );
  }
}

DebuggerUI.propTypes = {
  isVisible: PropTypes.bool,
  events: PropTypes.array,
  debugTypes: PropTypes.array,
  close: PropTypes.func,
  clear: PropTypes.func,
  setLogLevel: PropTypes.func,
  logLevel: PropTypes.string,
  toggleSetting: PropTypes.func,
};

export default DebuggerUI;
