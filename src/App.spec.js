import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('The app', () => {
  it('should render', () => {
    render(<App />);
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });
});
