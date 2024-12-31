import parser from "../../src/compiler/parser";


describe('Parser', () => {

  test('Simple valid expressions', () => {

    let input: string;

    input = '1 * (1 + 1)';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);

    input = '-1 + 1 * 1 >= 1';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);

    input = '+++1 or 1 or 1 and not not - - - -1 and 1';
    parser.feed(input);
    expect(parser.results.length).toEqual(1);

  });


  test('Simple invalid expressions', () => {

    let input: string;

    input = '1 * (1 + 1';
    expect(() => parser.feed(input)).toThrow();

    input = '-1 <= 1 and';
    expect(() => parser.feed(input)).toThrow();

    input = '1 > (1 and 1))';
    expect(() => parser.feed(input)).toThrow();

  });

});