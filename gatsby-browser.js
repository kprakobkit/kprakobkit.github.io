import ReactGA from 'react-ga';
ReactGA.initialize('UA-37050244-3');

exports.onRouteChange = (state, page, pages) => {
  ReactGA.pageview(state.pathname);
};
