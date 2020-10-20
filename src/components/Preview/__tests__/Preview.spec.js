import * as React from 'react';
import marked from 'marked';
import { render, screen } from '@testing-library/react';
import { Preview } from '../index';

describe('Preview component', () => {
  it('renders correctly', () => {
    render(<Preview id="preview" content={marked('hello world!')} />);
    const preview = screen.getByRole('document');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveTextContent('hello world!');
  });
});
