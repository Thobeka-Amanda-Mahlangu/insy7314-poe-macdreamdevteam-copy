// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Provide a manual mock for react-router-dom so tests can run without resolving ESM-only exports
jest.mock('react-router-dom', () => {
	const React = require('react');
	return {
		BrowserRouter: ({ children }) => React.createElement(React.Fragment, null, children),
		Routes: ({ children }) => React.createElement(React.Fragment, null, children),
		Route: ({ element }) => element || null,
		Navigate: () => null,
		Link: ({ children }) => React.createElement('a', null, children),
		useNavigate: () => () => {},
		useLocation: () => ({ pathname: '/' }),
		useParams: () => ({}),
	};
}, { virtual: true });

// Mock axios (ESM package) so Jest doesn't try to parse node_modules axios source
jest.mock('axios', () => {
	const mockAxios = {
		get: jest.fn(() => Promise.resolve({ data: {} })),
		post: jest.fn(() => Promise.resolve({ data: {} })),
		put: jest.fn(() => Promise.resolve({ data: {} })),
		delete: jest.fn(() => Promise.resolve({ data: {} })),
		create: function () { return mockAxios; },
		interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
	};
	return mockAxios;
}, { virtual: true });
