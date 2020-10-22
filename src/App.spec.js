import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';
jest.mock('./webWorkers/markdown/getWorker');

describe('The app', () => {
  it('should render', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('document')).toBeInTheDocument();
  });
});
