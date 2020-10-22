import * as React from 'react';
import { Editor } from '../../components/Editor/index';
import { Preview } from '../../components/Preview/index';
import ClipboardJS from 'clipboard';
import { CopyToClipboard } from '../../components/CopyToClipboard/index';
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

const loadingTimeout: {
  duration: number;
  id: ReturnType<typeof setTimeout>;
} = {
  duration: 200,
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
  const [loading, setLoading] = React.useState(false);
  // TODO: enable changing options
  const [options] = React.useState(defaultOptions);
  const workerRef = React.useRef(getMarkedWorker());

  const handleChange = ({
    currentTarget: { value: changedValue },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(changedValue);
  };

  React.useEffect(() => {
    if (!workerRef.current) {
      setError(true);
      return;
    }

    workerRef.current.onmessage = ({ data }: { data: string }) => {
      clearTimeout(conversionTimeout.id);
      clearTimeout(loadingTimeout.id);
      setMarkdown(data);
      if (error) setError(false);
      if (loading) setError(false);
    };
  }, []);

  React.useEffect(() => {
    clearTimeout(conversionTimeout.id);
    clearTimeout(loadingTimeout.id);

    workerRef.current.postMessage({ value, options });

    conversionTimeout.id = setTimeout(() => {
      workerRef.current.terminate();
      setLoading(false);
      setError(true);
    }, conversionTimeout.duration);

    loadingTimeout.id = setTimeout(() => {
      setLoading(true);
    }, loadingTimeout.duration);
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
        {ClipboardJS.isSupported() && (
          <CopyToClipboard
            id="editorCopy"
            className="editor-copy"
            target="#editor"
            text="copy"
            copiedText="copied!"
          />
        )}
      </section>
      <section className="editor-container-inner preview-section">
        {loading ? (
          <div role="alert" className="editor-loading">
            Loading preview...
          </div>
        ) : error ? (
          <div role="alert" className="editor-error">
            There was an error
          </div>
        ) : (
          <Preview id="preview" className="editor-preview" content={markdown} />
        )}
      </section>
    </main>
  );
};
