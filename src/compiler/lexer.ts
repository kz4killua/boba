import moo from 'moo';

export const lexer = moo.compile({
  
  COMMENT: /#.*?$/,

  KEYWORD: ['set', 'to', 'if', 'else', 'repeat', 'until', 'times', 'forever'],

  IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/,

  // Whitespace, newlines
  WHITESPACE: /[ \t]+/,
  NEWLINE: { match: /\n/, lineBreaks: true },

  // Data types
  TEXT: /"(?:\\["\\]|[^\n"\\])*"/,
  NUMBER: /0|-?[1-9][0-9]*(?:\.[0-9]*)?/,
  BOOLEAN: ['true', 'false'],

  // Arithmetic operators
  PLUS: '+',
  MINUS: '-',
  TIMES: '*',
  DIVIDE: '/',

  // Comparison operators
  EQ: '=',
  LT: '<',
  GT: '>',
  LTE: '<=',
  GTE: '>=',

  // Logical operators
  AND: 'and',
  OR: 'or',
  NOT: 'not',

  // Punctuation
  LPAREN: '(',
  RPAREN: ')',
})