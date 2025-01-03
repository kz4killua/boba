export function program(body: any[]) {
  return { type: 'Program', body: body, sourceType: 'script' };
}

export function literal(type: string, value: string) {
  return { type: 'Literal', value: getLiteralValue(type, value) };
}

export function identifier(name: string) {
  return { type: 'Identifier', name: name };
}

export function unaryExpression(operator: string, argument: any) {
  return { type: 'UnaryExpression', operator: getExpressionOperator(operator), argument: argument };
}

export function binaryExpression(operator: string, left: any, right: any) {
  return { type: 'BinaryExpression', operator: getExpressionOperator(operator), left: left, right: right };
}

export function logicalExpression(operator: string, left: any, right: any) {
  return { type: 'LogicalExpression', operator: getExpressionOperator(operator), left: left, right: right };
}

export function updateExpression(operator: string, argument: any, prefix: boolean) {
  return { type: 'UpdateExpression', operator: operator, argument: argument, prefix: prefix };
}

export function callExpression(callee: any, _arguments: any[], optional: boolean) {
  return { type: 'CallExpression', callee: callee, arguments: _arguments, optional: optional };
}

export function memberExpression(object: any, property: any, computed: boolean, optional: boolean) {
  return { type: 'MemberExpression', object: object, property: property, computed: computed, optional: optional };
}

export function ifStatement(test: any, consequent: any, alternate: any) {
  return { type: 'IfStatement', test: test, consequent: consequent, alternate: alternate };
}

export function blockStatement(body: any[]) {
  return { type: 'BlockStatement', body: body };
}

export function whileStatement(test: any, body: any) {
  return { type: 'WhileStatement', test: test, body: body };
}

export function forStatement(init: any, test: any, update: any, body: any) {
  return { type: 'ForStatement', init: init, test: test, update: update, body: body };
}

export function expressionStatement(expression: any) {
  return { type: 'ExpressionStatement', expression: expression };
}

export function variableDeclaration(declarations: any[]) {
  return { type: 'VariableDeclaration', kind: 'let', declarations: declarations };
}

export function variableDeclarator(id: any, init: any) {
  return { type: 'VariableDeclarator', id: id, init: init };
}

export function assignment(id: any, init: any) {
  return variableDeclaration([
    variableDeclarator(id, init)
  ])
}

export function repeatForever(body: any[]) {
  const test = literal('BOOLEAN', 'true');
  return whileStatement(test, body);
}

export function repeatUntil(test: any, body: any[]) {
  return whileStatement(unaryExpression('not', test), body);
}

export function repeatTimes(times: any, body: any[]) {
  const _identifier = identifier('_');
  const init = assignment(_identifier, literal('NUMBER', '0'));
  const test = binaryExpression('<', _identifier, times);
  const update = updateExpression('++', _identifier, false);
  return forStatement(init, test, update, body);
}

export function conditional(ifBlock: any, elifBlocks: any[], elseBlock: any | null): any {
  const test = ifBlock.expression;
  const consequent = ifBlock.body;

  if (elifBlocks.length === 0) {
    const alternate = elseBlock !== null ? elseBlock.body : null;
    return ifStatement(test, consequent, alternate);
  } else {
    const alternate = conditional(elifBlocks[0], elifBlocks.slice(1), elseBlock);
    return ifStatement(test, consequent, alternate);
  }
}

export function output(_arguments: any[]) {
  const callee = memberExpression(identifier('console'), identifier('log'), false, false);
  const expression = callExpression(callee, _arguments, false);
  return expressionStatement(expression);
}

function getLiteralValue(type: string, value: any) {
  if (type === 'NUMBER') {
    return parseFloat(value);
  } else if (type === 'BOOLEAN') {
    return value === 'true';
  } else if (type === 'TEXT') {
    return value.slice(1, -1);
  } else {
    throw new Error(`Unknown literal type: ${type}`);
  }
}

function getExpressionOperator(value: string) {
  if (value === '+') {
    return '+';
  } else if (value === '-') {
    return '-';
  } else if (value === '*') {
    return '*';
  } else if (value === '/') {
    return '/';
  } else if (value === '<') {
    return '<';
  } else if (value === '>') {
    return '>';
  } else if (value === '<=') {
    return '<=';
  } else if (value === '>=') {
    return '>=';
  } else if (value === '=') {
    return '===';
  } else if (value === 'and') {
    return '&&';
  } else if (value === 'or') {
    return '||';
  } else if (value === 'not') {
    return '!';
  } else {
    throw new Error(`Unknown operator: ${value}`);
  }
}