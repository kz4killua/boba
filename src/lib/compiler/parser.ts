import nearley from "nearley";
import { default as lexer } from "./lexer";
import { default as grammar } from "./grammar";
import { ASTNode } from "@/types";


class Parser {

  parser: nearley.Parser;
  results: ASTNode[];

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


const parser = new Parser();
export default parser;
