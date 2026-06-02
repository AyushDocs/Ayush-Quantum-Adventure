import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export function Inline({ math, color }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, { throwOnError: false, displayMode: false });
    } catch {
      return math;
    }
  }, [math]);
  return <span dangerouslySetInnerHTML={{ __html: html }} style={{ color: color || 'inherit' }} />;
}

export function Block({ math, color }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, { throwOnError: false, displayMode: true });
    } catch {
      return math;
    }
  }, [math]);
  return <div dangerouslySetInnerHTML={{ __html: html }} style={{ textAlign: 'center', color: color || 'inherit', padding: '4px 0' }} />;
}
