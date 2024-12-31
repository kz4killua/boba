@preprocessor typescript

@{%
const lexer = require('./lexer');
%}

@lexer lexer


# STARTING RULES
# ==============

main -> 
      statements

# STATEMENTS
# ==========

statements -> 
      statement ( %NL statement ):*

statement -> 
      assignment
    | conditional
    | expression

    | statement %NL
    | %NL statement
    | %NL

# Assignment statements
# ---------------------

assignment -> 
      "set" %IDENTIFIER "to" expression

# if statements
# -------------

conditional -> 
      if_block ( elif_block ):* ( else_block ):?

if_block -> 
      "if" expression block

elif_block -> 
      "else" "if" expression block

else_block ->
      "else" block

# Blocks
# ------

block -> 
      %NL %INDENT statements %DEDENT

# EXPRESSIONS
# ===========

expression -> 
      disjunction

# Logical expressions
# -------------------

disjunction ->
      conjunction ( %OR conjunction ):+
    | conjunction

conjunction ->
      negation ( %AND negation ):+
    | negation

negation ->
      %NOT negation
    | comparison

# Relational expressions
# ----------------------

comparison -> 
      sum %EQ sum
    | sum %LTE sum
    | sum %GTE sum
    | sum %LT sum
    | sum %GT sum
    | sum

# Arithmetic expressions
# ----------------------

sum ->
      sum %PLUS product
    | sum %MINUS product
    | product

product ->
      product %TIMES factor
    | product %DIVIDE factor
    | factor

factor ->
      %PLUS factor
    | %MINUS factor
    | atom

# Basic expression units
# ----------------------

atom ->
      %TEXT
    | %NUMBER
    | %BOOLEAN
    | %IDENTIFIER
    | %LPAREN expression %RPAREN
