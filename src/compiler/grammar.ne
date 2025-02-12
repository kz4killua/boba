@preprocessor typescript

@{%
const lexer = require('./lexer');
const processors = require('./processors');
%}

@lexer lexer


# STARTING RULES
# ==============

main -> 
      %NL:* statements %NL:*                                 {% (d) => processors.program(d[1]) %}

# STATEMENTS
# ==========

statements ->
      simple_statement %NL:+ statements                     {% (d) => [d[0], ...d[2]] %}
    | compound_statement %NL:* statements                   {% (d) => [d[0], ...d[2]] %}
    | simple_statement                                      {% (d) => [d[0]] %}
    | compound_statement                                    {% (d) => [d[0]] %}

# Simple statements (Terminated by NL tokens)
# -------------------------------------------

simple_statement ->
      assignment                                            {% id %}
    | expression                                            {% id %}
    | output                                                {% id %}

# Compound statements (Terminated by DEDENT tokens)
# -------------------------------------------------

compound_statement ->
      conditional                                           {% id %}
    | loop                                                  {% id %}

# Blocks
# ------

block -> 
      %NL:+ %INDENT %NL:* statements %NL:* %DEDENT                  {% (d) => processors.blockStatement(d[3]) %}

# Assignment statements
# ---------------------

assignment -> 
      "set" identifier "to" expression                      {% (d) => processors.assignment(d[1], d[3]) %}

# Output statements
# -----------------

output -> 
      "output" expression ( %COMMA expression ):*           {% (d) => processors.output([d[1], ...d[2].map(([a, b]: [any, any]) => b)]) %}

# if statements
# -------------

conditional -> 
      if_block elif_block:* else_block:?                    {% (d) => processors.conditional(d[0], d[1], d[2]) %}

if_block -> 
      "if" expression block                                 {% (d) => ({ expression: d[1], body: d[2] }) %}

elif_block -> 
      "else" "if" expression block                          {% (d) => ({ expression: d[2], body: d[3] }) %}

else_block ->
      "else" block                                          {% (d) => ({ body: d[1] }) %}

# Loops
# -----

loop -> 
      "repeat" block                                        {% (d) => processors.repeat(d[1]) %}
    | "repeat" "until" expression block                     {% (d) => processors.repeatUntil(d[2], d[3]) %}
    | "repeat" expression "times" block                     {% (d) => processors.repeatTimes(d[1], d[3]) %}

# EXPRESSIONS
# ===========

expression -> 
      disjunction                                           {% id %}

# Logical expressions
# -------------------

disjunction ->
      disjunction %OR conjunction                           {% (d) => processors.logicalExpression(d[1].value, d[0], d[2]) %}
    | conjunction                                           {% id %}

conjunction ->
      conjunction %AND negation                             {% (d) => processors.logicalExpression(d[1].value, d[0], d[2]) %}
    | negation                                              {% id %}

negation ->
      %NOT negation                                         {% (d) => processors.unaryExpression(d[0].value, d[1]) %}
    | comparison                                            {% id %}

# Relational expressions
# ----------------------

comparison -> 
      sum %EQ sum                                           {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | sum %LTE sum                                          {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | sum %GTE sum                                          {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | sum %LT sum                                           {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | sum %GT sum                                           {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | sum                                                   {% id %}

# Arithmetic expressions
# ----------------------

sum ->
      sum %PLUS product                                     {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | sum %MINUS product                                    {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | product                                               {% id %}

product ->
      product %TIMES factor                                 {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | product %DIVIDE factor                                {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | product %MOD factor                                   {% (d) => processors.binaryExpression(d[1].value, d[0], d[2]) %}
    | factor                                                {% id %}

factor ->
      %PLUS factor                                          {% (d) => processors.unaryExpression(d[0].value, d[1]) %}
    | %MINUS factor                                         {% (d) => processors.unaryExpression(d[0].value, d[1]) %}
    | atom                                                  {% id %}

# Basic expression units
# ----------------------

atom ->
      literal                                               {% id %}
    | identifier                                            {% id %}
    | %LPAREN expression %RPAREN                            {% (d) => d[1] %}

literal -> 
      %TEXT                                                 {% (d) => processors.literal(d[0].type, d[0].value) %}
    | %NUMBER                                               {% (d) => processors.literal(d[0].type, d[0].value) %}
    | %BOOLEAN                                              {% (d) => processors.literal(d[0].type, d[0].value) %}

identifier -> 
      %IDENTIFIER                                           {% (d) => processors.identifier(d[0].value) %}