import * as React from 'react';
import marked from 'marked';
import DOMPurify from 'dompurify';
import { Editor } from '../../components/Editor/index';
import { Preview } from '../../components/Preview/index';
import './editor-container.css';

const defaultOptions = {
  breaks: true,
  gfm: true,
  smartLists: true,
  smartyPants: true,
};

marked.setOptions(defaultOptions);

const convert = (value: string) => DOMPurify.sanitize(marked(value));

export const EditorContainer = () => {
  const [value, setValue] = React.useState('');
  const handleChange = ({
    currentTarget: { value: changedValue },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(changedValue);
  };
  const markdown = React.useMemo(() => convert(value), [value]);
  return (
    <main className="editor-container">
      <Editor
        id="editor"
        className="preview-editor"
        name="editor"
        value={value}
        handleChange={handleChange}
      />
      <Preview id="preview" className="editor-preview" content={markdown} />
    </main>
  );
};
