import parser from "../../src/compiler/parser";


describe('Parser', () => {

  test('Simple valid expressions', () => {

    let input: string;

    input = '1 * (1 + 1)';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = '-1 + 1 * 1 >= 1';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = '+++1 or 1 or 1 and not not - - - -1 and 1';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

  });


  test('Simple invalid expressions', () => {

    let input: string;

    input = '1 * (1 * * 1)';
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

    input = '-1 <= 1 and )';
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

    input = '1 > (1 and 1))';
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

  });

  test('Valid assignment statements', () => {

    let input: string;

    input = 'set complete to true';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = 'set complete to settled';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = 'set complete to (1 + 1) * 1';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

  });

  test('Invalid assignment statements', () => {
    
    let input: string;

    input = 'set complete to to true';
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

    input = 'set false to true';
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

    input = 'set complete to true false';
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

  });

  test('Valid if statements', () => {

    let input: string;

    input = (
      'if i > 0\n' +
      '    set complete to true\n' +
      '    set complete to true\n'
    );
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = (
      'if i > 0\n' +
      '    set complete to true\n' +
      'else\n' +
      '    set complete to true\n'
    );
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = (
      'if i = 0\n' +
      '    set complete to true\n' +
      'else if i = 0\n' +
      '    set complete to true\n' +
      'else if i = 0\n' +
      '    set complete to true\n'
    );
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = (
      'if 1 > 0\n' +
      '    set complete to true\n' +
      'else if 1 < 0\n' +
      '    set complete to true\n' +
      'else\n' +
      '    set complete to true\n'
    );
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

  });

  test('Invalid if statements', () => {

    let input: string;

    input = (
      'else if 1 > 0\n' +
      '    set complete to true\n'
    );
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

    input = (
      'else\n' +
      '    set complete to true\n'
    );
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

    input = (
      'if 1 > 0\n' +
      '    set complete to true\n' +
      'else if 1 < 0\n' +
      '    set complete to false\n' +
      'else\n' +
      '    set complete to settled\n' +
      'else\n' +
      '    set complete to settled'
    );
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

  });

});