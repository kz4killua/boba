const nearley = require("nearley");
import { default as lexer } from "./lexer";
import { default as grammar } from "./grammar";


const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), {
  lexer: lexer,
});


export default parser;
