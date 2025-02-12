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

  test('Numbers', () => {

    let input, tokens, expected;

    input = '0';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['NUMBER'];
    expect(tokens.map(t => t.type)).toEqual(expected);

    input = '123';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['NUMBER'];
    expect(tokens.map(t => t.type)).toEqual(expected);

    input = '0.123';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['NUMBER'];
    expect(tokens.map(t => t.type)).toEqual(expected);

    input = '1.230';
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = ['NUMBER'];
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

  test('Valid indentation', () => {

    let input, tokens, expected;

    input = [
      'if true',
      '    output 0'
    ].join('\n');
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = [
      'KEYWORD', 'BOOLEAN', 
      'NL', 'INDENT', 'KEYWORD', 'NUMBER', 'DEDENT'
    ];
    expect(tokens.map(t => t.type)).toEqual(expected);

    input = [
      'if true',
      '    ',
      '    output 0'
    ].join('\n');
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = [
      'KEYWORD', 'BOOLEAN', 
      'NL', 
      'NL', 'INDENT', 'KEYWORD', 'NUMBER', 'DEDENT'
    ];
    expect(tokens.map(t => t.type)).toEqual(expected);

    input = [
      'if true',
      '    # This comment should be ignored.',
      '    output 0'
    ].join('\n');
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = [
      'KEYWORD', 'BOOLEAN', 
      'NL', 
      'NL', 'INDENT', 'KEYWORD', 'NUMBER', 'DEDENT'
    ];
    expect(tokens.map(t => t.type)).toEqual(expected);

    input = [
      'if true',
      '    ',
      '    output 0',
      '    ',
      '    output 0',
      '    ',
      'output 0'
    ].join('\n');
    lexer.reset(input);
    tokens = Array.from(lexer.tokenize());
    expected = [
      'KEYWORD', 'BOOLEAN', 
      'NL', 
      'NL', 'INDENT', 'KEYWORD', 'NUMBER', 
      'NL',
      'NL', 'KEYWORD', 'NUMBER', 
      'NL',
      'NL', 'DEDENT', 'KEYWORD', 'NUMBER'
    ];
    expect(tokens.map(t => t.type)).toEqual(expected);

  });

});
