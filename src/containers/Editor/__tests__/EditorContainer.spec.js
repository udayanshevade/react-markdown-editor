import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorContainer } from '../';
import userEvent from '@testing-library/user-event';
jest.mock('../../../webWorkers/markdown/getWorker');
import {
  Worker,
  getMarkedWorker,
} from '../../../webWorkers/markdown/getWorker';

describe('Editor container', () => {
  it('renders correctly', () => {
    render(<EditorContainer />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('document')).toBeInTheDocument();
  });

  it('renders default content', () => {
    const { container } = render(<EditorContainer />);
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelector('li')).toBeInTheDocument();
    expect(container.querySelector('em')).toBeInTheDocument();
    expect(container.querySelector('strong')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('blockquote')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  describe('processes text', () => {
    it('from the input', () => {
      render(<EditorContainer />);
      const editor = screen.getByRole('textbox');
      userEvent.clear(editor);
      expect(editor).not.toHaveValue('Hello world');
      userEvent.type(editor, 'Hello world');
      expect(editor).toHaveValue('Hello world');
    });

    it('and renders markdown in the preview', () => {
      render(<EditorContainer />);
      const editor = screen.getByRole('textbox');
      const preview = screen.getByRole('document');
      expect(screen.queryByText('Hello world')).not.toBeInTheDocument();
      userEvent.clear(editor);
      userEvent.type(editor, '# Hello world');
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Hello world');
    });
  });

  describe('handles errors', () => {
    it('if the conversion takes too long', async () => {
      jest.useFakeTimers();
      jest.setTimeout(6000);

      const worker = new Worker();
      worker.postMessage = jest.fn();
      getMarkedWorker.mockImplementationOnce(() => worker);

      render(<EditorContainer />);
      const promise = screen.findByRole('alert', {}, { timeout: 5000 });
      const alert = await promise;
      jest.advanceTimersByTime(5000);
      expect(alert).toBeInTheDocument();

      jest.clearAllTimers();
    });
  });
});
