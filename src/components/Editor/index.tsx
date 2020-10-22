import * as React from 'react';
import classnames from 'classnames';

export const Editor = ({
  id,
  className,
  name,
  value,
  handleChange,
}: {
  id?: string;
  className?: string;
  name?: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <textarea
      id={id}
      className={classnames('editor', className)}
      name={name}
      value={value}
      onChange={handleChange}
    />
  );
};
