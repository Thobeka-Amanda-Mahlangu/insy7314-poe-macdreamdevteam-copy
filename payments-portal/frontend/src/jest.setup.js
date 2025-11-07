// Jest setup: provide a simple manual mock for react-router-dom so tests can run in Jest
const React = require('react');

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => React.createElement(React.Fragment, null, children),
  Routes: ({ children }) => React.createElement(React.Fragment, null, children),
  Route: ({ element }) => element || null,
  Navigate: () => null,
  Link: ({ children }) => React.createElement('a', null, children),
  useNavigate: () => () => {},
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({}),
}));
