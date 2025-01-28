const moo = require('moo');


export const tokens = {
  COMMENT: /#.*?$/,

  // Arithmetic operators
  PLUS: /\+/,
  MINUS: /\-/,
  TIMES: /\*/,
  DIVIDE: /\//,
  MOD: /%/,

  // Comparison operators
  EQ: /=/,
  LTE: /<=/,
  GTE: />=/,
  LT: /</,
  GT: />/,

  // Logical operators
  AND: /\band\b/,
  OR: /\bor\b/,
  NOT: /\bnot\b/,

  // Punctuation
  LPAREN: /\(/,
  RPAREN: /\)/,
  COMMA: /,/,

  KEYWORD: [
    /\bset\b/, /\bto\b/, 
    /\bif\b/, /\belse\b/, 
    /\brepeat\b/, /\buntil\b/, /\btimes\b/, 
    /\boutput\b/
  ],

  // Native data types
  TEXT: /"(?:\\["\\]|[^\n"\\])*"/,
  NUMBER: /0|-?[1-9][0-9]*(?:\.[0-9]*)?/,
  BOOLEAN: [/\btrue\b/, /\bfalse\b/],

  IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/,

  // Whitespace, newlines
  WS: /[ \t]+/,
  NL: { match: /\n/, lineBreaks: true },
};


class Lexer {

  lexer: moo.Lexer;
  atbol: boolean;
  indents: number[];
  tokens: Generator<moo.Token | { type: string }>;

  constructor() {
    this.lexer = moo.compile(tokens);
    this.indents = [];
    this.atbol = false;
    this.tokens = this.tokenize();
  }

  reset(chunk?: string, state?: moo.LexerState) : moo.Lexer {
    this.lexer.reset(chunk, state);
    this.indents = [];
    this.atbol = false;
    this.tokens = this.tokenize();
    return this.lexer;
  }

  next() : moo.Token | undefined {
    return this.tokens.next().value;
  }

  save(): moo.LexerState {
    return this.lexer.save();
  }

  formatError(token: moo.Token, message?: string): string {
    return this.lexer.formatError(token, message);
  }

  has(tokenType: string): boolean {
    return this.lexer.has(tokenType);
  }

  *tokenize(): Generator<moo.Token | { type: string }> {

    while (true) {
      const token = this.lexer.next();
      if (token === undefined) {
        break;
      }

      if (this.atbol) {
        yield* this.updateIndentation(token);
      }
      if ((token.type !== 'WS') && (token.type !== 'COMMENT')) {
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
    yield { type: 'INDENT', value: '' };
  }

  *dedent(level: number) {
    if (level !== 0 && this.indents.length > 0 && !this.indents.includes(level)) {
      throw new Error('Indentation error: Please use consistent indentation.');
    }
    while (level < this.indents[this.indents.length - 1] && this.indents.length > 0) {
      this.indents.pop();
      yield { type: 'DEDENT', value: '' };
    }
  }
}


export default new Lexer();