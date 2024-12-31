import lexer from "../../src/compiler/lexer";


describe('Lexer', () => {

  test('Text', () => {
    
    let input, tokens, expected;

    input = '"(and or not)"';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['TEXT'];
    expect(tokens.map(t => t.type)).toEqual(expected);

    input = '"# This is a comment"';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['TEXT'];
    expect(tokens.map(t => t.type)).toEqual(expected);

  });

  test('Non-keywords e.g. repeat-ed, or-ange, set-tled', () => {

    let input, tokens, expected;
    
    input = 'repeated';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['IDENTIFIER'];
    expect(tokens.map(t => t.type)).toEqual(expected);

    input = 'orange';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['IDENTIFIER'];
    expect(tokens.map(t => t.type)).toEqual(expected);

  });
  
  test('Assignment statements', () => {

    let input, tokens, expected;

    input = 'set complete to true';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['KEYWORD', 'IDENTIFIER', 'KEYWORD', 'BOOLEAN'];
    expect(tokens.map(t => t.type)).toEqual(expected);

    input = 'set complete to settled';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['KEYWORD', 'IDENTIFIER', 'KEYWORD', 'IDENTIFIER'];
    expect(tokens.map(t => t.type)).toEqual(expected);

  });

});
