const nearley = require("nearley");
import { default as lexer } from "./lexer";
import { default as grammar } from "./grammar";


class Parser {

  parser: nearley.Parser;
  results: any[];

  constructor() {
    this.parser = getParser();
    this.results = [];
  }

  reset() {
    this.parser = getParser();
    this.results = [];
  }

  feed(input: string) {
    this.parser.feed(input);
    this.results = this.parser.results;
  }

}


function getParser() {
  return new nearley.Parser(nearley.Grammar.fromCompiled(grammar), {
    lexer: lexer,
  });
}


export default new Parser();
