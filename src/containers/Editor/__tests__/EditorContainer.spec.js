import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorContainer } from '../';
jest.mock('../../../webWorkers/markdown/getWorker');
import {
  Worker,
  getMarkedWorker,
} from '../../../webWorkers/markdown/getWorker';
jest.mock('clipboard');
import Clipboard from 'clipboard';

describe('Editor container', () => {
  beforeAll(() => {
    Clipboard.isSupported.mockReturnValue(true);
  });

  it('renders correctly', () => {
    render(<EditorContainer />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'copy' })).toBeInTheDocument();
    expect(screen.getByRole('document')).toBeInTheDocument();
  });

  it('renders default content', () => {
    const { container } = render(<EditorContainer />);
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(container.querySelector('ol')).toBeInTheDocument();
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

  it('shows a placeholder if taking longer than expected', async () => {
    jest.useFakeTimers();
    jest.setTimeout(6000);

    const worker = new Worker();
    const defaultPostMessage = worker.postMessage;
    worker.postMessage = jest.fn().mockImplementation((data) => {
      // just delay the existing functionality by 500ms
      setTimeout(() => {
        defaultPostMessage(data);
      }, 500);
    });
    getMarkedWorker.mockImplementationOnce(() => worker);

    render(<EditorContainer />);
    const promise = screen.findByRole('alert', {}, { timeout: 300 });
    jest.advanceTimersByTime(600);
    const alert = await promise;
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Loading preview...');
    jest.advanceTimersByTime(5000);

    expect(worker.terminate).not.toHaveBeenCalled();
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
      jest.advanceTimersByTime(5000);
      const alert = await promise;
      expect(worker.terminate).toHaveBeenCalled();
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('There was an error');

      jest.clearAllTimers();
    });
  });

  it('hides the copy button if not supported', () => {
    Clipboard.isSupported.mockReturnValue(false);
    render(<EditorContainer />);
    expect(
      screen.queryByRole('button', { name: 'copy' })
    ).not.toBeInTheDocument();
    Clipboard.isSupported.mockReturnValue(true);
  });
});
