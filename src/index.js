import React from 'react';
import ReactDOM from 'react-dom';
import App, { getLazyCallbacks } from '@react-renderer/app';
import routes from './routes';
import reportWebVitals from './reportWebVitals';
import './index.scss';
//Just to avoid using multiple React instances in hooks compatibility
window['react-router-dom'] = require('react-router-dom');
window['react'] = React;

ReactDOM.hydrate(<App routes={routes} />,
  document.getElementById('root'), () => {
    //You can await for lazy components render here :D
    Promise.all(getLazyCallbacks().map((lazy_component) => lazy_component.callback())).then(() => {
      // console.log('ready!');
    });
});


// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();