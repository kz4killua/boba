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

});