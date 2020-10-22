import React from 'react';
import { EditorContainer } from '../';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Editor container', () => {
  it('renders correctly', () => {
    render(<EditorContainer />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('document')).toBeInTheDocument();
  });

  describe('processes text', () => {
    it('from the input', () => {
      render(<EditorContainer />);
      const editor = screen.getByRole('textbox');
      expect(editor).toHaveTextContent('');
      userEvent.type(editor, 'Hello world');
      expect(editor).toHaveTextContent('Hello world');
    });

    it('and renders markdown in the preview', () => {
      render(<EditorContainer />);
      const editor = screen.getByRole('textbox');
      const preview = screen.getByRole('document');
      expect(preview).toHaveTextContent('');
      userEvent.type(editor, '# Hello world');
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Hello world');
    });
  });
});
