import { convertMarkdown, applyMarkdownOptions } from './helpers';

// https://github.com/webpack-contrib/worker-loader#integrating-with-typescript
const ctx: Worker = self as any;

ctx.onmessage = ({
  data: { value, options },
}: {
  data: { value: string; options: object };
}) => {
  applyMarkdownOptions(options);
  const markdown = convertMarkdown(value);
  ctx.postMessage(markdown);
};
