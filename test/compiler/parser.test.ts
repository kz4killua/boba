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

  test('Valid loop statements', () => {

    let input: string;

    input = (
      'repeat\n' +
      '    set complete to true\n'
    );
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = (
      'repeat until i > 0 or i < 0\n' +
      '    set complete to true\n'
    );
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = (
      'repeat 50 times\n' +
      '    set complete to true\n'
    );
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

  });

  test('Invalid loop statements', () => {

    let input: string;

    input = (
      'repeat set complete to true\n'
    );
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

    input = (
      'repeat until until i > 0\n' +
      '    set complete to true\n'
    );
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

  });


  test('Valid output statements', () => {

    let input: string;

    input = 'output "Hello, World!"\n';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = 'output "Hello,", name\n';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

    input = 'output true\n';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);
    parser.reset();

  });

  test('Invalid output statements', () => {

    let input: string;

    input = 'output\n';
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

    input = 'output 1 1\n';
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

    input = 'output "Hello, World!" name\n';
    expect(() => parser.feed(input)).toThrow();
    parser.reset();

  });

});