import * as React from 'react';
import { Editor } from '../../components/Editor/index';
import { Preview } from '../../components/Preview/index';
import { getMarkedWorker } from '../../webWorkers/markdown/getWorker';
import { defaultValue } from './defaultValue';
import './editor-container.css';

const conversionTimeout: {
  duration: number;
  id: ReturnType<typeof setTimeout>;
} = {
  duration: 5000,
  id: null,
};

const defaultOptions = {
  breaks: true,
  gfm: true,
  smartLists: true,
  smartyPants: true,
};

export const EditorContainer = () => {
  const [value, setValue] = React.useState(defaultValue);
  const [markdown, setMarkdown] = React.useState('');
  const [error, setError] = React.useState(false);
  // TODO: enable changing options
  const [options] = React.useState(defaultOptions);
  const workerRef = React.useRef(getMarkedWorker());

  const handleChange = ({
    currentTarget: { value: changedValue },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(changedValue);
  };

  React.useEffect(() => {
    workerRef.current.onmessage = ({ data }: { data: string }) => {
      clearTimeout(conversionTimeout.id);
      setMarkdown(data);
    };
  }, []);

  React.useEffect(() => {
    clearTimeout(conversionTimeout.id);
    workerRef.current.postMessage({ value, options });

    conversionTimeout.id = setTimeout(() => {
      workerRef.current.terminate();
      setError(true);
    }, conversionTimeout.duration);
  }, [value, options]);

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
      {error ? (
        <div role="alert" className="editor-error">
          There was an error
        </div>
      ) : (
        <section className="editor-container-inner preview-section">
          <Preview id="preview" className="editor-preview" content={markdown} />
        </section>
      )}
    </main>
  );
};
