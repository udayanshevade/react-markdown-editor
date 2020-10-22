import * as React from 'react';
import marked from 'marked';
import DOMPurify from 'dompurify';
import { Editor } from '../../components/Editor/index';
import { Preview } from '../../components/Preview/index';
import { defaultValue } from './defaultValue';
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
  const [value, setValue] = React.useState(defaultValue);
  const handleChange = ({
    currentTarget: { value: changedValue },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(changedValue);
  };
  const markdown = React.useMemo(() => convert(value), [value]);
  return (
    <main className="editor-container">
      <section className="editor-container-inner editor-section">
        <Editor
          id="editor"
          className="preview-editor"
          name="editor"
          value={value}
          handleChange={handleChange}
        />
      </section>
      <section className="editor-container-inner preview-section">
        <Preview id="preview" className="editor-preview" content={markdown} />
      </section>
    </main>
  );
};
