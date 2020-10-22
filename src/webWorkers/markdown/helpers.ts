import marked from 'marked';

export const convertMarkdown = (value: string) => marked(value);

let appliedOptions: object;

export const applyMarkdownOptions = (options: object) => {
  if (appliedOptions === options) return;
  marked.setOptions(options);
  appliedOptions = options;
};
