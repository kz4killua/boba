import { lexer } from "./compiler/lexer";


const input = (`
# This is a comment
`);

lexer.reset(input);

let token;
while ((token = lexer.next()) !== undefined) {
  console.log(token);
}