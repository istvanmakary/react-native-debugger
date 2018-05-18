import { StyleSheet, Dimensions } from 'react-native';
const ABSOLUTE = { position: 'absolute' };
const BLACK_75 = 'rgba(0,0,0,0.75)';
const BLACK_20 = 'rgba(0,0,0,0.2)';
const CENTER = 'center';
const ROW = 'row';
const STRETCH = 'stretch';
const WHITE = '#fff';
const BOLD = 'bold';
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    ...ABSOLUTE,
    left: 0,
    right: 0,
    minHeight: 54,
    maxHeight: (WINDOW_HEIGHT / 2.5) + 40,
    backgroundColor: BLACK_75,
    alignItems: CENTER,
  },
  scroller: {
    paddingTop: 10,
    alignSelf: STRETCH,
  },
  event: {
    alignSelf: STRETCH,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: BLACK_20,
    flexDirection: ROW,
    marginBottom: 1,
  },
  title: {
    paddingTop: 10,
    paddingBottom: 5,
    color: WHITE,
    fontWeight: BOLD,
  },
  label: {
    fontSize: 13,
    fontWeight: BOLD,
  },
  text: {
    color: WHITE,
    fontSize: 14,
    textAlign: CENTER,
  },
  time: {
    fontSize: 10,
    color: WHITE,
  },
  controls: {
    alignSelf: STRETCH,
    flexDirection: ROW,
  },
  button: {
    flex: 1,
    height: 40,
    marginRight: 1,
    marginLeft: 1,
    alignItems: CENTER,
    justifyContent: CENTER,
    backgroundColor: BLACK_20,
    color: WHITE,
  },
  marker: {
    borderRadius: 10,
    width: 10,
    height: 10,
  },
  successMarker: {
    backgroundColor: 'green',
  },
  errorMarker: {
    backgroundColor: 'red',
  },
  warningMarker: {
    backgroundColor: 'yellow',
  },
  noneMarker: {
    borderColor: WHITE,
    borderWidth: StyleSheet.hairlineWidth,
  },
  statusContainer: {
    width: 10,
    paddingRight: 5,
    alignItems: CENTER,
    justifyContent: CENTER,
  },
  textContainer: {
    flex: 1,
    alignItems: CENTER,
    justifyContent: CENTER,
    flexDirection: 'column',
  },
  dataContainer: {
    paddingTop: 5,
    paddingHorizontal: 10,
    alignSelf: STRETCH,
  },
  settingsContainer: {
    alignSelf: STRETCH,
  },
  settingsItem: {
    flex: 1,
    height: 30,
    paddingHorizontal: 10,
    marginBottom: 2,
    backgroundColor: BLACK_20,
    alignItems: CENTER,
    justifyContent: CENTER,
  },
  settingsBlockContianer: {
    alignSelf: STRETCH,
    marginBottom: 5,
  },
  eventItem: {
    flex: 1,
    height: 30,
    marginRight: 1,
    marginLeft: 1,
    backgroundColor: BLACK_20,
    alignItems: CENTER,
    justifyContent: CENTER,
  },
  data: {
    fontSize: 11,
    textAlign: 'left',
  },
});

export default styles;
