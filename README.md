
# React Native Debugger

A react native debugger with Built in UI and Remote Debugging options.

## Installation

React Native Debugger requires **React Native 0.35 or later.**

### NPM Module

`npm install react-native-debugger`

### Setup

React Native Debugger contains 5 core modules. These modules are responsible to maintain the module correct behaviour. 

- [createDebugger](#createdebugger)
- [debuggerReducer](#debuggerReducer)
- [Debugger](#debugger)
- [DebuggerUI](#debuggerui)
- [actions](#actions)

These are the available named exports of this module.

---
#### createDebugger
This module is responsible to set up the debugger and connect it to the Redux architecture.

**Installation**

Add **createDebugger** to your compose function.
```
createStore(rootReducer, compose(
	createDebugger(),
	applyMiddleware(...middlewares)
));
```

**Parameters**

- isVisible *(Boolean|Required)*  - if true the debugger UI will be visible by default
- allowServerLogging *(Boolean|Required)* - if true the debugger will send the events to your debugger-server.
- serverUrl *(String|Required)* - debugger server url (see [debugger-server](https://github.com/istvanmakary/react-debugger-server))
- authorization *(String|Required)* Base auth hash, see details: [How to generate auth hash](https://github.com/istvanmakary/react-debugger-server#hashgeneration)
- eventTypes *(Array|Required)* - array of [Event Objects](#Events) you want to trigger

**Events**

```
IMPORTANT:
The mudule will display only the listed events!
```

- TYPE *(String|Required)* - event type (e.g NETWORK_REQUEST)
- CATEGORY_NAME *(String|Required)* - long category  name to be displayed on the Debugger UI.
- EVENT_NAME *(String|Required)* - short category  name to be displayed on the Debugger UI.

**Example setup**

```
createDebugger({
	isVisible:  true,
	allowServerLogging:  true,
	serverUrl:  'http://mydomain.com/log',
  authorization: 'YWRtaW46U2VjcmV0MTIz', <--- DEFAULT HASH
	eventTypes: [
		{
			TYPE: 'NETWORK_REQUEST',
			CATEGORY_NAME: 'Network request logging',
			EVENT_NAME: 'Net. Request',
		},
	]
})
```
---
#### debuggerReducer

Add **debuggerReducer** to your combineReducers.

**IMPORTANT:**

Name debuggerReducer as **debugger** in your store!

```
combineReducers({
	debugger: debuggerReducer,
	...otherReducers,
})
```
---
#### Debugger

This api is responsible for event triggering. Use this pice of code anywhere in your application to capture React Native Events.

```
Debugger.logAction({
	label: 'My event', 
	type: 'NETWORK_REQUEST',
	logType: 'SUCCESS',
	data: myCustomData <-- Supported types: String, Array, Object
});
```

**Debugger.EVENT_TYPES**
- NONE *use this type for neutral events*
- ERROR *use this type for error events*
- WARNING *use this type for warning events*
- SUCCESS *use this type for success events*

#### DebuggerUI
UI implementation of React Native Debugger. Insert it in your main application container, on the top of your content!

```
<SafeView>
	<StatusBar hidden />
	<RenderScreen route={route} />
	<Header />
	<Tabbar />
	<RenderOverlay />
	<DebuggerUI /> <-- IT SHOULD BE ON THE TOP OF THE SCREEN
</SafeView>
```

#### actions
Public Redux actions.
- showDebugger
- hideDebugger

### Screenshots

![React Native Debugger](http://makary.hu/debuggerui.jpeg)
