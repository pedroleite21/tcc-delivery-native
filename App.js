import 'react-native-gesture-handler';
import * as React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { setConsole } from 'react-query';
import Main from './src/main';

setConsole({
  log: console.log,
  warn: console.warn,
  error: console.warn,
});

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00838f',
    accent: '#d81b60',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Main />
    </PaperProvider>
  );
}
