import { ASTNode } from "@/types";

// AST objects
// -----------

export function program(body: ASTNode[]) {
  return { type: 'Program', body: body, sourceType: 'script' };
}

export function literal(type: string, value: string) {
  return { type: 'Literal', value: getLiteralValue(type, value) };
}

export function identifier(name: string) {
  return { type: 'Identifier', name: name };
}

export function unaryExpression(operator: string, argument: ASTNode) {
  return { type: 'UnaryExpression', operator: getExpressionOperator(operator), argument: argument };
}

export function binaryExpression(operator: string, left: ASTNode, right: ASTNode) {
  return { type: 'BinaryExpression', operator: getExpressionOperator(operator), left: left, right: right };
}

export function logicalExpression(operator: string, left: ASTNode, right: ASTNode) {
  return { type: 'LogicalExpression', operator: getExpressionOperator(operator), left: left, right: right };
}

export function updateExpression(operator: string, argument: ASTNode, prefix: boolean) {
  return { type: 'UpdateExpression', operator: operator, argument: argument, prefix: prefix };
}

export function callExpression(callee: ASTNode, args: ASTNode[], optional: boolean) {
  return { type: 'CallExpression', callee: callee, arguments: args, optional: optional };
}

export function memberExpression(object: ASTNode, property: ASTNode, computed: boolean, optional: boolean) {
  return { type: 'MemberExpression', object: object, property: property, computed: computed, optional: optional };
}

export function ifStatement(test: ASTNode, consequent: ASTNode, alternate: ASTNode | null) {
  return { type: 'IfStatement', test: test, consequent: consequent, alternate: alternate };
}

export function blockStatement(body: ASTNode[]) {
  return { type: 'BlockStatement', body: body };
}

export function whileStatement(test: ASTNode, body: ASTNode) {
  return { type: 'WhileStatement', test: test, body: body };
}

export function forStatement(init: ASTNode, test: ASTNode, update: ASTNode, body: ASTNode) {
  return { type: 'ForStatement', init: init, test: test, update: update, body: body };
}

export function expressionStatement(expression: ASTNode) {
  return { type: 'ExpressionStatement', expression: expression };
}

export function variableDeclaration(kind: string, declarations: ASTNode[]) {
  return { type: 'VariableDeclaration', kind: kind, declarations: declarations };
}

export function variableDeclarator(id: ASTNode, init: ASTNode) {
  return { type: 'VariableDeclarator', id: id, init: init };
}

// Language constructs
// -------------------

export function assignment(id: ASTNode, init: ASTNode) {
  return variableDeclaration('var', [variableDeclarator(id, init)])
}

export function repeatUntil(test: ASTNode, body: ASTNode) {
  return whileStatement(unaryExpression('not', test), body);
}

export function repeatTimes(times: ASTNode, body: ASTNode) {
  const id = identifier('_');
  const init = assignment(id, literal('NUMBER', '0'));
  const test = binaryExpression('<', id, times);
  const update = updateExpression('++', id, false);
  return forStatement(init, test, update, body);
}

export function repeatFor(id: ASTNode, from: ASTNode, to: ASTNode, body: ASTNode) {
  const init = assignment(id, from);
  const test = binaryExpression('<=', id, to);
  const update = updateExpression('++', id, false);
  return forStatement(init, test, update, body);
}

export function conditional(ifBlock: { expression: ASTNode, body: ASTNode }, elseIfBlocks: { expression: ASTNode, body: ASTNode }[], elseBlock: { body: ASTNode } | null): ASTNode {
  const test = ifBlock.expression;
  const consequent = ifBlock.body;

  if (elseIfBlocks.length === 0) {
    const alternate = elseBlock !== null ? elseBlock.body : null;
    return ifStatement(test, consequent, alternate);
  } else {
    const alternate = conditional(elseIfBlocks[0], elseIfBlocks.slice(1), elseBlock);
    return ifStatement(test, consequent, alternate);
  }
}

export function output(args: ASTNode[]) {
  const callee = memberExpression(identifier('console'), identifier('log'), false, false);
  const expression = callExpression(callee, args, false);
  return expressionStatement(expression);
}

// Helper functions
// ----------------

function getLiteralValue(type: string, value: string) {
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
  if (value === '=') {
    return '===';
  } else if (value === 'and') {
    return '&&';
  } else if (value === 'or') {
    return '||';
  } else if (value === 'not') {
    return '!';
  } else {
    return value;
  }
}