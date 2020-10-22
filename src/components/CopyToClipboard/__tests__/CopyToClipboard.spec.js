import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyToClipboard } from '../index';

describe('Copy to clipboard', () => {
  it('renders correctly', () => {
    render(<CopyToClipboard id="editorCopy" target="editor" text="copy" />);
    expect(screen.getByRole('button', { name: 'copy' })).toBeInTheDocument();
  });
});
