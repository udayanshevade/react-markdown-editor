import * as React from 'react';

export const Preview = ({
  id,
  className,
  content,
}: {
  id?: string;
  className?: string;
  content: string;
}) => (
  <section
    id={id}
    className={className}
    role="document"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);
