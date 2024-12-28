import { lexer } from "./compiler/lexer";


const input = (`
if foo
  if bar
    baz
else
  baz
`);

for (const token of lexer.tokens(input)) {
  console.log(token);
}