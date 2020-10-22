import { applyMarkdownOptions, convertMarkdown } from '../helpers';

// mock the worker interface
export class Worker {
  url: string;
  onmessage: ({ data }: { data: string }) => void;

  constructor(stringUrl: string) {
    this.url = stringUrl;
  }

  postMessage = jest
    .fn()
    .mockImplementation(
      ({ value, options }: { value: string; options: object }) => {
        applyMarkdownOptions(options);
        const data = convertMarkdown(value);
        this.onmessage({ data });
      }
    );

  terminate = jest.fn();
}

// mock the simple worker factory used internally by EditorContainer
export const getMarkedWorker = jest
  .fn()
  .mockImplementation(() => new Worker('test'));
