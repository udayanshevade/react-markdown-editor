import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Editor } from '../index';

describe('Editor component', () => {
  const handleChange = jest.fn();
  beforeEach(() => {
    handleChange.mockClear();
  });

  it('renders correctly', () => {
    render(
      <Editor
        id="editor"
        name="editor"
        value="foo"
        handleChange={handleChange}
      />
    );
    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveValue('foo');
    expect(editor).toHaveAttribute('id', 'editor');
    expect(editor).toHaveAttribute('name', 'editor');
  });

  it('processes user interaction', () => {
    const handleChange = jest.fn();
    render(
      <Editor
        id="editor"
        name="editor"
        value="foo"
        handleChange={handleChange}
      />
    );
    const editor = screen.getByRole('textbox');
    userEvent.type(editor, 'hello,{enter}world!');
    expect(handleChange).toHaveBeenCalled();
  });
});
