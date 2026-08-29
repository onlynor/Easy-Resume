// CodeMirror 的 Typst 语法高亮（基于正则的轻量实现，够用即可）
import { StreamLanguage } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const KEYWORDS = new Set([
  'let',
  'set',
  'show',
  'import',
  'if',
  'else',
  'for',
  'in',
  'while',
  'return',
  'none',
  'auto',
  'true',
  'false',
  'context',
  'state',
  'query',
  'read',
  'sys',
  'break',
  'continue',
]);

export const typstLanguage = StreamLanguage.define({
  name: 'typst',
  token(stream) {
    if (stream.match(/^\/\/.*/)) return 'lineComment';
    if (stream.match(/^"(?:[^"\\]|\\.)*"/)) return 'string';
    if (stream.match(/^#/)) {
      if (stream.match(/[A-Za-z_][A-Za-z0-9_]*/)) {
        const word = stream.current().slice(1);
        return KEYWORDS.has(word) ? 'keyword' : 'function(tag-name)';
      }
      return 'meta';
    }
    if (stream.match(/^\$[^$]*\$/)) return 'string';
    if (stream.match(/^\d+(?:\.\d+)?(?:pt|cm|mm|em|%|px|deg|rad|fr)?/)) return 'number';
    if (stream.match(/^={1,6}\s/)) return 'heading';
    if (stream.match(/^<[A-Za-z_][A-Za-z0-9_-]*>/)) return 'labelName';
    if (stream.match(/^[+\-*/=<>!&|:]+/)) return 'operator';
    if (stream.match(/^[A-Za-z_][A-Za-z0-9_-]*/)) {
      return KEYWORDS.has(stream.current()) ? 'keyword' : null;
    }
    stream.next();
    return null;
  },
});

export const typstHighlightStyle = [
  { tag: tags.comment, color: '#8b949e', fontStyle: 'italic' },
  { tag: tags.string, color: '#0a7d33' },
  { tag: tags.number, color: '#0550ae' },
  { tag: tags.keyword, color: '#cf222e' },
  { tag: tags.function(tags.name), color: '#8250df' },
  { tag: tags.meta, color: '#953800' },
  { tag: tags.heading, color: '#2458b8', fontWeight: 'bold' },
  { tag: tags.labelName, color: '#116329' },
  { tag: tags.operator, color: '#57606a' },
];
