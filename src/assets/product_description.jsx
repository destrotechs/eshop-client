import React from 'react';
import DOMPurify from 'dompurify';

export default function OutputContent({ htmlContent = '', sanitize = true }) {
  // Sanitize the HTML content if `sanitize` is enabled
  const content = sanitize ? DOMPurify.sanitize(htmlContent) : htmlContent;

  return (
    <div
      style={{
        padding: '10px',
        borderRadius: '4px',
        fontFamily: 'Arial, sans-serif',
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
}
