import * as React from 'react';
import classnames from 'classnames';

export const Editor = ({
  id,
  className,
  name,
  value,
  onChange,
}: {
  id?: string;
  className?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent) => void;
}) => {
  return (
    <textarea
      id={id}
      className={classnames('editor', className)}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
};
