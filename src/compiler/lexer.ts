import moo from 'moo';


const base = moo.compile({
  // Comments, keywords, and identifiers
  COMMENT: /#.*?$/,
  KEYWORD: ['set', 'to', 'if', 'else', 'repeat', 'until', 'times'],
  IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/,

  // Whitespace, newlines
  WS: /[ \t]+/,
  NL: { match: /\n/, lineBreaks: true },

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


class Lexer {

  lexer: moo.Lexer;
  atbol: boolean;
  indents: number[];

  constructor() {
    this.lexer = base;
    this.indents = [];
    this.atbol = false;
  }

  *tokens(input: string): Generator<moo.Token | { type: string } | undefined> {

    this.lexer.reset(input);
    this.indents = [];
    this.atbol = false;

    while (true) {
      const token = this.lexer.next();
      if (token === undefined) {
        break;
      }

      // Create INDENT and DEDENT tokens when appropriate
      if (this.atbol) {
        yield* this.updateIndentation(token);
        if (token.type !== 'WS') {
          yield token;
        }
      } else {
        yield token;
      }

      // Keep track of whether we're at the beginning of a line (atbol)
      this.atbol = (token.type === 'NL');
    }

    // Clear the indent stack at the end of the buffer
    yield* this.dedent(0);
  }

  *updateIndentation(token: moo.Token) : Generator<{ type: string }> {
    if (!this.atbol) {
      return;
    }

    if (token.type === 'WS') {
      token.text = token.text.replace(/\t/g, '    ');
    }

    const newIndent = token.type === 'WS' ? token.text.length : 0;
    const oldIndent = this.indents.length > 0 ? this.indents[this.indents.length - 1] : 0;

    if (newIndent > oldIndent) {
      yield *this.indent(newIndent);
    } else if (newIndent < oldIndent) {
      yield *this.dedent(newIndent);
    }
  }

  *indent(level: number) {
    if (this.indents.length > 0 && this.indents[this.indents.length - 1] >= level) {
      return;
    }

    this.indents.push(level);
    yield { type: 'INDENT' };
  }

  *dedent(level: number) {
    if (level !== 0 && this.indents.length > 0 && !this.indents.includes(level)) {
      throw new Error('Indentation error: Please use consistent indentation.');
    }
    
    while (level < this.indents[this.indents.length - 1] && this.indents.length > 0) {
      this.indents.pop();
      yield { type: 'DEDENT' };
    }
  }
}


export const lexer = new Lexer();