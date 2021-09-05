import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import CacheBuster from './components/CacheBuster';

const render = (Component) => {
  return ReactDOM.render(<Component />, document.getElementById('root'));
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();

// for invalidating cache and force reload
const MyApp = (
  <CacheBuster>
    {async ({ isCurrentLatestVersion, refreshCacheAndReload }) => {
      // if current is not latest
      if (!isCurrentLatestVersion) {
        await new Promise((resolve) =>
          setTimeout(() => {
            console.log('**************force reload in 7 secs');
            resolve();
          }, 7000)
        );

        // You can decide how and when you want to force reload
        refreshCacheAndReload();
      }

      return (
        <>
          <App />
        </>
      );
    }}
  </CacheBuster>
);

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}
