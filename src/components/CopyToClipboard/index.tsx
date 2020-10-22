import * as React from 'react';
import classnames from 'classnames';
import ClipboardJS from 'clipboard';

const successTimeout: {
  duration: number;
  id: ReturnType<typeof setTimeout>;
} = {
  duration: 1000,
  id: null,
};

export const CopyToClipboard = ({
  id,
  target,
  name,
  className,
  text,
  copiedText,
  handleClick,
}: {
  id: string;
  target: string;
  name?: string;
  className?: string;
  text: string;
  copiedText?: string;
  handleClick?: () => void;
}) => {
  const [success, setSuccess] = React.useState(false);
  React.useEffect(() => {
    const clipboard = new ClipboardJS(`#${id}`);
    clipboard.on('success', (e) => {
      e.clearSelection();
      setSuccess(true);
      successTimeout.id = setTimeout(() => {
        setSuccess(false);
      }, successTimeout.duration);
    });
  }, []);

  return (
    <button
      id={id}
      name={name}
      className={classnames('copy-button', className)}
      data-clipboard-target={target}
      onClick={handleClick}
      disabled={success}
    >
      {success && copiedText ? copiedText : text}
    </button>
  );
};
