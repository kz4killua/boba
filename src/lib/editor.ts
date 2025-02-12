import { tokens } from "@/lib/compiler/lexer";
import * as monaco from "monaco-editor";

export const languageId = "boba";

export const languageConfiguration: monaco.languages.LanguageConfiguration = {
  surroundingPairs: [
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  autoClosingPairs: [
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  onEnterRules: [
    {
      beforeText: combineRegex([
        /^\s*(repeat).*$/,
        /^\s*(if).*$/,
        /^\s*(else).*$/,
      ]),
      action: { indentAction: monaco.languages.IndentAction.Indent }
    }
  ],
  comments: {
    lineComment: "#"
  }
}

export const tokensProvider: monaco.languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      [combineRegex([...tokens.KEYWORD, ...tokens.BOOLEAN]), "keyword"],
      [combineRegex([tokens.AND, tokens.OR, tokens.NOT]), "keyword"],
      [tokens.IDENTIFIER, "identifier"],
      [tokens.NUMBER, "number"],
      [tokens.TEXT, "string"],
      [tokens.COMMENT, "comment"],
      [
        combineRegex([
          tokens.PLUS, 
          tokens.MINUS, 
          tokens.TIMES, 
          tokens.DIVIDE,
          tokens.EQ,
          tokens.LTE,
          tokens.GTE,
          tokens.LT,
          tokens.GT,
        ]), 
        "operator"
      ],
      [tokens.COMMA, "delimiter"],
      [combineRegex([tokens.LPAREN, tokens.RPAREN]), "bracket"]
    ]
  }
};

export const completionItemProvider: monaco.languages.CompletionItemProvider = {
  provideCompletionItems: (model, position) => {

    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    return {
      suggestions: [

        ...tokens.KEYWORD.map(keyword => ({
          label: stripRegex(keyword),
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: stripRegex(keyword),
          range: range,
        })),

        ...[tokens.AND, tokens.OR, tokens.NOT].map(operator => ({
          label: stripRegex(operator),
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: stripRegex(operator),
          range: range,
        })),

        ...tokens.BOOLEAN.map(boolean => ({
          label: stripRegex(boolean),
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: stripRegex(boolean),
          range: range,
        })),

      ]
    }
  }
};

function combineRegex(regexes: RegExp[]): RegExp {
  // Combine multiple regexes disjunctively
  return new RegExp(
    regexes.map(r => `(${r.source})`).join("|")
  );
}

function stripRegex(regex: RegExp): string {
  // Remove all special characters from a regex
  return regex.source.replace(/\\[bBdDsSwW]|\\\d|\\.|[\^\$\.\|\?\*\+\(\)]/g, '');
}