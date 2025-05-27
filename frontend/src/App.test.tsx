import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('should render nothing', () => {
    const { container } = render(<App />);
    expect(container).toBeEmptyDOMElement();
  });
});
