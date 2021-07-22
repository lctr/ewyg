var Atom;
(function (Atom1) {
  Atom1[ "KW" ] = "KW";
  Atom1[ "BOOL" ] = "BOOL";
  Atom1[ "STR" ] = "STR";
  Atom1[ "NUM" ] = "NUM";
  Atom1[ "SYM" ] = "SYM";
  Atom1[ "OP" ] = "OP";
  Atom1[ "PUNCT" ] = "PUNCT";
  Atom1[ "EOF" ] = "EOF";
})(Atom || (Atom = {
}));
var Comment1;
(function (Comment2) {
  Comment2[ "TILDE" ] = "~";
  Comment2[ "STAR" ] = "*";
})(Comment1 || (Comment1 = {
}));
var Op;
(function (Op1) {
  Op1[ "DEF" ] = "=";
  Op1[ "ASSIGN" ] = "<-";
  Op1[ "OR" ] = "||";
  Op1[ "AND" ] = "&&";
  Op1[ "EQ" ] = "==";
  Op1[ "NEQ" ] = "!=";
  Op1[ "LT" ] = "<";
  Op1[ "LEQ" ] = "<=";
  Op1[ "GT" ] = ">";
  Op1[ "GEQ" ] = ">=";
  Op1[ "PLUS" ] = "+";
  Op1[ "MINUS" ] = "-";
  Op1[ "TIMES" ] = "*";
  Op1[ "DIV" ] = "/";
  Op1[ "MOD" ] = "%";
  Op1[ "NEG" ] = "-";
  Op1[ "NOT" ] = "!";
})(Op || (Op = {
}));
var Kw;
(function (Kw1) {
  Kw1[ "LET" ] = "let";
  Kw1[ "IF" ] = "if";
  Kw1[ "THEN" ] = "then";
  Kw1[ "ELSE" ] = "else";
  Kw1[ "TRUE" ] = "true";
  Kw1[ "FALSE" ] = "false";
  Kw1[ "WITH" ] = "with";
  Kw1[ "IN" ] = "in";
  Kw1[ "OF" ] = "of";
})(Kw || (Kw = {
}));
const KW = [
  "let",
  "if",
  "then",
  "else",
  "true",
  "false",
  "with",
  "in",
  "of",
  "Number",
  "String",
  "Closure",
  "List",
  "Tuple"
];
class Token {
  type;
  value;
  position;
  literal;
  constructor (type1, value1, position, literal1) {
    this.type = type1;
    this.value = value1;
    this.position = position;
    this.literal = !literal1 ? `${ value1 }` : literal1;
    if (this.validate(Atom.KW, "true", "false")) {
      this.type = Atom.BOOL;
      this.value = value1 === "true";
    }
  }
  get end () {
    return this.position.col + this.literal.length;
  }
  typeIs (t) {
    return this.type === t;
  }
  typeIn (...types) {
    for (const t of types) if (this.type === t) return true;
    return false;
  }
  is (literal) {
    for (const val of literal) if (val === this.literal) return true;
    return false;
  }
  validate (type, ...literal) {
    if (!type) for (const val of literal) if (val === this.literal) return true;
    if (type !== this.type) return false;
    for (const val1 of literal) if (val1 === this.literal) return true;
    return false;
  }
  toJSON () {
    return `Token[${ this.type }] { \`${ this.literal }\` @ (${ this.position.line }:${ this.position.col }) }`;
  }
}
var Kind;
(function (Kind1) {
  Kind1[ "Block" ] = "block";
  Kind1[ "Condition" ] = "condition";
  Kind1[ "Vector" ] = "vector";
  Kind1[ "Variable" ] = "variable";
  Kind1[ "Lambda" ] = "lambda";
  Kind1[ "Call" ] = "call";
  Kind1[ "Assign" ] = "assign";
  Kind1[ "Binary" ] = "binary";
  Kind1[ "Unary" ] = "unary";
  Kind1[ "Literal" ] = "literal";
})(Kind || (Kind = {
}));
var Rule;
(function (Rule1) {
  Rule1[ Rule1[ "Or" ] = 0 ] = "Or";
  Rule1[ Rule1[ "And" ] = 1 ] = "And";
  Rule1[ Rule1[ "Equality" ] = 2 ] = "Equality";
  Rule1[ Rule1[ "Compare" ] = 3 ] = "Compare";
  Rule1[ Rule1[ "Term" ] = 4 ] = "Term";
  Rule1[ Rule1[ "Factor" ] = 5 ] = "Factor";
  Rule1[ Rule1[ "Unary" ] = 6 ] = "Unary";
  Rule1[ Rule1[ "Literal" ] = 7 ] = "Literal";
  Rule1[ Rule1[ "Block" ] = 8 ] = "Block";
  Rule1[ Rule1[ "Variable" ] = 9 ] = "Variable";
  Rule1[ Rule1[ "Call" ] = 10 ] = "Call";
  Rule1[ Rule1[ "Condition" ] = 11 ] = "Condition";
  Rule1[ Rule1[ "Lambda" ] = 12 ] = "Lambda";
  Rule1[ Rule1[ "Vector" ] = 13 ] = "Vector";
  Rule1[ Rule1[ "Assign" ] = 14 ] = "Assign";
})(Rule || (Rule = {
}));
class Stream {
  source;
  pos = 0;
  line = 1;
  col = 0;
  #eol;
  end;
  constructor (source) {
    this.source = source;
    this.source = source.replace(/(?:\r?\n)/g, "\n").normalize();
    this.end = this.source.length;
  }
  peek () {
    return this.source.charAt(this.pos);
  }
  after () {
    return this.source.charAt(this.pos + 1);
  }
  next () {
    const __char = this.source.charAt(this.pos++);
    if (__char == "\n") this.col = 0, this.line++, this.#eol = {
      line: this.line,
      col: this.col
    };
    else this.col++;
    return __char;
  }
  eof () {
    return this.peek() == "";
  }
  get #row () {
    return this.source.slice(this.pos - this.col, this.col);
  }
  get #divider () {
    return '-'.repeat(`${ this.line }`.length + this.col + 4);
  }
  get #indicator () {
    return '^'.repeat(Math.max(1, this.pos - this.#row.trimRight().lastIndexOf(' ') - 1));
  }
  error (msg) {
    const message = `${ msg } at (${ this.line }:${ this.col })`;
    const snippet = '\n\n  [' + this.line + '] · ' + this.#row + '\n  ' + this.#divider + this.#indicator;
    throw new Error(`${ message }${ snippet }`);
  }
  row () {
    return this.source.slice(this.pos - this.col, this.col);
  }
}
class Lexer {
  stream;
  #current = null;
  constructor (source1) {
    this.stream = source1 instanceof Stream ? source1 : new Stream(source1);
  }
  get false () {
    return this.#tokenize(Atom.BOOL, false, "<FALSE>");
  }
  error (message) {
    this.stream.error(message);
  }
  peek () {
    return this.#current ?? (this.#current = this.after());
  }
  next () {
    const token = this.#current;
    this.#current = null;
    return token ?? this.after();
  }
  eof () {
    return this.peek().type === Atom.EOF;
  }
  pos () {
    return {
      line: this.stream.line,
      col: this.stream.col
    };
  }
  after () {
    this.#eatWhile(isSpace);
    if (this.stream.eof()) return this.#tokenize(Atom.EOF, "\\0");
    const __char = this.stream.peek();
    switch (true) {
      case isComment(__char, this.stream.after()):
        this.#comment();
        return this.after();
      case __char == '"':
        return this.#string();
      case isDigit(__char):
        return this.#number();
      case startsWord(__char):
        return this.#word();
      case isPunct(__char):
        if (__char == "|" && this.stream.after() == "|") {
          return this.#operator();
        } else {
          return this.#punct();
        }
      case isOperator(__char):
        return this.#operator();
      default:
        throw this.error(`Unable to tokenize \`${ __char }\``);
    }
  }
  #tokenize (type, value, literal) {
    return new Token(type, value, this.pos(), literal);
  }
  #number () {
    let infixed = false;
    const number = this.#eatWhile((c) => {
      if (c == ".") {
        if (infixed) return false;
        infixed = true;
        return true;
      }
      return isDigit(c);
    });
    return this.#tokenize(Atom.NUM, /box/i.test(number) ? parseInt(number) : parseFloat(number), number);
  }
  #string () {
    const string = this.#escaped('"');
    return this.#tokenize(Atom.STR, string);
  }
  #word () {
    const word = this.#eatWhile(isWord);
    return this.#tokenize(isKeyword(word) ? Atom.KW : Atom.SYM, word);
  }
  #comment () {
    if (this.stream.after() == Comment1.TILDE) {
      this.#eatWhile((c) => c != "\n"
      );
    } else {
      let penult = false;
      this.#eatWhile((c) => {
        if (penult) {
          if (c == "~") return false;
          else penult = false;
        } else if (c == "*") penult = true;
        return true;
      });
    }
    this.stream.next();
  }
  #punct () {
    return this.#tokenize(Atom.PUNCT, this.stream.next());
  }
  #operator () {
    return this.#tokenize(Atom.OP, this.#eatWhile(isOperator));
  }
  #escaped (terminal) {
    let escaped = false, match = "";
    this.stream.next();
    while (!this.stream.eof()) {
      const c = this.stream.next();
      if (escaped) {
        match += c, escaped = false;
      } else if (c == "\\") {
        escaped = true;
      } else if (c == terminal) {
        break;
      } else {
        match += c;
      }
    }
    return match;
  }
  #eatWhile (charPred) {
    let word = "";
    while (!this.stream.eof() && charPred(this.stream.peek())) {
      word += this.stream.next();
    }
    return word;
  }
}
function isKeyword (word) {
  return KW.indexOf(word) > -1;
}
function isSpace (__char) {
  return /\s/.test(__char);
}
function isDigit (__char) {
  return /[0-9]/i.test(__char);
}
function isOperator (__char) {
  return "=&|<>!+-*/^%".indexOf(__char) > -1;
}
function startsWord (__char) {
  return /[\p{L}_]/ui.test(__char);
}
function isWord (word) {
  return startsWord(word) || /[\p{L}\d']/ui.test(word);
}
function isPunct (__char) {
  return ",;()[]{}|#".indexOf(__char) > -1;
}
function isComment (left, right) {
  return " ~~ ~* ".indexOf(" " + left + right + " ") > -1;
}
class Parser extends Lexer {
  #expr = new WeakSet();
  constructor (source2) {
    super(source2 instanceof Lexer ? source2.stream : source2);
  }
  eof () {
    return super.peek().typeIs(Atom.EOF);
  }
  error (message) {
    super.error(message);
  }
  eat (chars) {
    const { literal: literal2 } = this.peek();
    if (literal2 !== chars) {
      this.error(`Expected the literal \`${ chars }\` but instead got « ${ literal2 } »`);
    }
    this.next();
  }
  parse () {
    const body = [];
    while (!this.eof()) {
      body.push(this.expression());
      if (!super.eof()) {
        this.eat(";");
      }
    }
    return {
      type: Kind.Block,
      rule: Rule.Block,
      body
    };
  }
  expression () {
    return this.callish(() => this.group(this.atom));
  }
  group (parser) {
    const token = this.peek();
    if (!token.typeIs(Atom.OP)) {
      return this.callish(this.assign);
    } else {
      return parser.call(this);
    }
  }
  callish (parser) {
    const expr = parser.call(this);
    const token = this.peek();
    this.#expr.add(expr);
    return token.validate(Atom.PUNCT, "(") ? this.call(expr) : expr;
  }
  call (fn) {
    const args = this.circumscribed("(", ",", ")", this.expression);
    return {
      type: Kind.Call,
      rule: Rule.Call,
      fn,
      args
    };
  }
  conditional () {
    this.eat("if");
    const cond = this.expression();
    if (!this.peek().validate(Atom.PUNCT, "{")) this.eat("then");
    const then = this.expression();
    const expr = {
      type: Kind.Condition,
      rule: Rule.Condition,
      cond,
      then
    };
    if (this.peek().validate(Atom.KW, "else")) {
      this.next();
      expr.else = this.expression();
    }
    return expr;
  }
  circumscribed (prefix, infix, suffix, parser) {
    const nodes = [];
    const end = () => this.peek().validate(Atom.PUNCT, suffix)
      ;
    let first = true;
    this.eat(prefix);
    while (!this.eof()) {
      if (end()) break;
      if (first) first = false;
      else this.eat(infix);
      if (end()) break;
      nodes.push(parser.call(this));
    }
    this.eat(suffix);
    return nodes;
  }
  variable () {
    const skipIn = () => {
      if (this.peek().validate(Atom.KW, "in")) this.eat("in");
    };
    this.eat("let");
    if (this.peek().typeIs(Atom.SYM)) {
      const name = this.next().literal;
      const defs = this.circumscribed("(", ",", ")", this.binding);
      skipIn();
      const body = this.expression();
      return {
        type: Kind.Call,
        rule: Rule.Call,
        fn: {
          type: Kind.Lambda,
          rule: Rule.Lambda,
          name,
          args: defs.map(({ name: name1 }) => name1
          ),
          body
        },
        args: defs.map(({ def }) => def ?? super.false
        )
      };
    }
    const args = this.circumscribed("(", ",", ")", this.binding);
    skipIn();
    const body = this.expression();
    return {
      type: Kind.Variable,
      rule: Rule.Variable,
      args,
      body
    };
  }
  binding () {
    const name = this.peek().literal;
    let def;
    this.next();
    if (this.peek().validate(Atom.OP, Op.DEF)) {
      this.next();
      def = this.expression();
    }
    return {
      name,
      def
    };
  }
  lambda () {
    let token = this.peek();
    const name = token.typeIs(Atom.SYM) ? token.literal : null;
    if (name) this.next();
    this.eat("|");
    token = this.peek();
    const args = [];
    while (token.literal !== "|") {
      if (token.validate(Atom.PUNCT, ',')) {
        this.eat(',');
        break;
      }
      if (token.typeIs(Atom.KW)) {
        this.error("Lambda parameters may not be keywords!");
      } else if (!token.typeIs(Atom.SYM)) {
        this.error("Lambda parameters must be unbound symbols!");
      }
      args.push(token.literal);
      this.next();
      if (this.peek().validate(Atom.PUNCT, ",")) {
        this.eat(",");
      }
      token = this.peek();
    }
    this.eat("|");
    let body;
    token = this.peek();
    if (token.validate(Atom.OP, "{")) {
      body = this.block();
    } else {
      body = this.expression();
    }
    return {
      type: Kind.Lambda,
      rule: Rule.Lambda,
      name,
      args,
      body
    };
  }
  parameter () {
  }
  block () {
    const body = this.circumscribed("{", ";", "}", this.expression);
    switch (body.length) {
      case 0:
        return super.false;
      case 1:
        return body[ 0 ];
      default:
        return {
          type: Kind.Block,
          rule: Rule.Block,
          body
        };
    }
  }
  vector () {
    const body = this.circumscribed('[', ',', ']', this.expression);
    return {
      type: Kind.Vector,
      rule: Rule.Vector,
      body
    };
  }
  list () {
  }
  index () {
    let nth;
    if (this.peek().validate(Atom.PUNCT, '[')) {
      nth = this.expression();
    } else {
    }
  }
  atom () {
    return this.callish(() => {
      const token = this.peek();
      if (token.validate(Atom.PUNCT, "(")) {
        this.next();
        const expr = this.expression();
        this.eat(')');
        return expr;
      }
      if (token.validate(Atom.OP, Op.NEG, Op.NOT)) {
        return this.unary(token);
      }
      if (token.validate(Atom.PUNCT, "{")) {
        return this.block();
      }
      if (token.validate(Atom.KW, "if")) {
        return this.conditional();
      }
      if (token.validate(Atom.KW, "let")) {
        return this.variable();
      }
      if (token.validate(Atom.PUNCT, '|')) {
        return this.lambda();
      }
      if (token.validate(Atom.PUNCT, "[")) {
        return this.vector();
      }
      if (token.typeIn(Atom.BOOL, Atom.NUM, Atom.STR, Atom.SYM)) {
        this.next();
        return token;
      }
      if (this.eof()) {
        throw this.error('Unexpected end of input!');
      }
      throw this.error("Unable to parse " + JSON.stringify(token, null, 2));
    });
  }
  assign () {
    return this.binary(this.or, Rule.Assign, Op.ASSIGN);
  }
  binary (parser, rule, ...ops) {
    let expr = parser.call(this);
    let token = this.peek();
    while (token.validate(Atom.OP, ...ops)) {
      this.next();
      expr = {
        type: rule !== Rule.Assign ? Kind.Binary : Kind.Assign,
        rule,
        operator: token.literal,
        left: expr,
        right: parser.call(this)
      };
      token = this.peek();
    }
    return expr;
  }
  or () {
    return this.binary(this.and, Rule.Or, Op.OR);
  }
  and () {
    return this.binary(this.equality, Rule.And, Op.AND);
  }
  equality () {
    return this.binary(this.compare, Rule.Equality, Op.EQ, Op.NEQ);
  }
  compare () {
    return this.binary(this.term, Rule.Compare, Op.LT, Op.LEQ, Op.GT, Op.GEQ);
  }
  term () {
    return this.binary(this.factor, Rule.Term, Op.PLUS, Op.MINUS);
  }
  factor () {
    return this.binary(this.atom, Rule.Factor, Op.TIMES, Op.DIV, Op.MOD);
  }
  literal (type, value) {
    return {
      type,
      rule: Rule.Literal,
      value
    };
  }
  unary (token) {
    const [ type2, init, operator ] = token.literal === Op.NEG ? [
      Atom.NUM,
      0,
      Op.MINUS
    ] : [
      Atom.BOOL,
      false,
      Op.EQ
    ];
    this.next();
    return {
      type: Kind.Unary,
      rule: Rule.Unary,
      operator,
      left: this.literal(type2, init),
      right: this.expression()
    };
  }
}
function parse (program) {
  return new Parser(program).parse();
}
function isLiteral (expr) {
  return expr.type === Atom.BOOL || expr.type === Atom.NUM || expr.type === Atom.STR;
}
function evaluate (expr, env) {
  if (isLiteral(expr)) return expr.value;
  switch (expr.type) {
    case Atom.NUM:
    case Atom.STR:
    case Atom.BOOL:
      return expr.value;
    case Atom.SYM:
      return env.get(expr.value);
    case Kind.Assign:
      return evalAssign(expr, env);
    case Kind.Unary:
    case Kind.Binary:
      return evalBinary(expr, env);
    case Kind.Lambda:
      return evalLambda(expr, env);
    case Kind.Condition:
      return evalConditional(expr, env);
    case Kind.Block:
      return evalBlock(expr, env);
    case Kind.Call:
      return evalCall(expr, env);
    case Kind.Variable:
      return evalVariable(expr, env);
    case Kind.Vector:
      return evalVector(expr, env);
    default:
      throw new Error("Unable to evaluate " + JSON.stringify(expr, null, 2));
  }
}
function evalVector (expr, env) {
  if (expr.body.length === 0) return false;
  return expr.body.map((el) => evaluate(el, env)
  );
}
function evalConditional (expr, env) {
  if (evaluate(expr.cond, env) !== false) {
    return evaluate(expr.then, env);
  }
  return expr.else ? evaluate(expr.else, env) : false;
}
function evalVariable (expr, env) {
  let scope = env;
  for (const arg of expr.args) {
    scope = Object.assign(scope, env.extend());
    scope.def(arg.name, arg.def ? evaluate(arg.def, env) : false);
  }
  return evaluate(expr.body, scope);
}
function evalAssign (expr, env) {
  if (expr.left.type != Atom.SYM) {
    throw new TypeError("Cannot assign to the non-variable " + JSON.stringify(expr.left, null, 2));
  }
  return env.set(expr.left.value, evaluate(expr.right, env));
}
function evalBlock (expr, env) {
  let result = false;
  for (const arg of expr.body) {
    result = evaluate(arg, env);
  }
  return result;
}
function evalCall (expr, env) {
  const fn = evaluate(expr.fn, env);
  return fn.apply(null, expr.args.map((arg) => evaluate(arg, env)
    , fn));
}
function evalLambda (expr, env) {
  function lambda (...args) {
    const names = expr.args, scope = env.extend();
    for (let i = 0; i < names.length; ++i) {
      scope.def(names[ i ], i < args.length ? args[ i ] : false);
    }
    return evaluate(expr.body, scope);
  }
  if (expr.name) {
    env = env.extend();
    env.def(expr.name, lambda);
  }
  return lambda;
}
function evalBinary (expr, env) {
  return evalBinaryOp(expr.operator, evaluate(expr.left, env), evaluate(expr.right, env));
}
function evalBinaryOp (op, a, b) {
  switch (op) {
    case Op.PLUS:
      return _n(a) + _n(b);
    case Op.MINUS:
      return _n(a) - _n(b);
    case Op.TIMES:
      return _n(a) * _n(b);
    case Op.DIV:
      return _n(a) / _d(b);
    case Op.MOD:
      return _n(a) % _d(b);
    case Op.AND:
      return a !== false && b;
    case Op.OR:
      return a !== false ? a : b;
    case Op.LT:
      return _n(a) < _n(b);
    case Op.GT:
      return _n(a) > _n(b);
    case Op.LEQ:
      return _n(a) <= _n(b);
    case Op.GEQ:
      return _n(a) >= _n(b);
    case Op.EQ:
      return a === b;
    case Op.NEQ:
      return a !== b;
    default:
      throw new Error("Unable to recognize operator " + op);
  }
  function _n (x) {
    if (typeof x != "number") {
      throw new TypeError("Expected a number, but got " + x);
    } else return x;
  }
  function _d (x) {
    if (_n(x) === 0) {
      throw new EvalError("Trying to divide by zero!");
    } else return x;
  }
}
class Scope {
  static interrupted;
  static message;
  args;
  parent;
  constructor (parent) {
    this.args = Object.create(parent ? parent.args : null);
    this.parent = parent;
  }
  get snapshot () {
    return Object.entries(this.args).reduce((s, [ k, t ]) => s + `\n  ${ k }::${ typeof t }`, '> SCOPE: ');
    // return Object.entries(this.args).reduce((s, [ k, t ]) => ` ${ s.length + (typeof t).length > 77 ? s + '\n  ' : s + '' } ${ k }::${ typeof t },`
    //   , '(Scope)> \n').trim();
  }
  error (msg) {
    throw new EvalError(`${ msg }\n${ this.snapshot }`);
  }
  extend () {
    return new Scope(this);
  }
  lookup (name) {
    let scope = this;
    while (scope) {
      if (Object.prototype.hasOwnProperty.call(scope.args, name + '')) {
        return scope;
      }
      scope = scope.parent;
    }
  }
  get (name) {
    if (name in this.args) {
      return this.args[ `${ name }` ];
    }
    this.error(`Cannot set undefined variable « ${ name } »`);
    return false;
  }
  set (name, value) {
    const scope = this.lookup(`${ name }`);
    if (!scope && this.parent) {
      this.error(`Cannot set undefined variable « ${ name } »`);
    }
    return (scope ?? this).args[ `${ name }` ] = value;
  }
  def (name, value) {
    return this.args[ name ] = value;
  }
  static get stackmax () {
    let i = 0;
    const inc = () => {
      ++i;
      inc();
    };
    try {
      inc();
    } catch {
      return i;
    }
    return i;
  }
}
class Wyg1 {
  static cache = new WeakMap();
  #rt;
  ast;
  value;
  parseError;
  evalError;
  errors = 0;
  #session;
  constructor () {
    this.#rt = Wyg1.reset();
  }
  get session () {
    return {
      error: this.errors > 0 ? true : false,
      message: [
        this.parseError,
        this.evalError
      ].filter(Boolean),
      ast: this.ast || null,
      value: this.value || null
    };
  }
  parse (input) {
    try {
      this.ast = parse(input);
    } catch (e) {
      this.parseError = e;
      this.errors++;
    }
    return this.ast;
  }
  evaluate () {
    if (this.ast) {
      try {
        this.value = evaluate(this.ast, this.#rt);
      } catch (e) {
        this.evalError = e;
        this.errors++;
      }
    }
    return this.value;
  }
  run (input) {
    if (input.trim().length === 0) return;
    this.parse(input);
    if (!this.parseError) this.evaluate();
    return this.session;
  }
  reset () {
    this.errors = 0;
    this.parseError = null;
    this.evalError = null;
    this.ast = null;
    this.value = null;
  }
  static reset () {
    const scope = new Scope();
    scope.def("print", (v) => {
      console.log(v);
      return v;
    });
    scope.def("t'sec", Date.now);
    scope.def("t'delta", (fn) => {
      if (typeof fn != "function") return (() => {
        console.log('Callable expression not provided.');
        return fn;
      })();
      const label = `ʃ ${ fn.name } dt`;
      try {
        console.time(label);
        return fn();
      } finally {
        console.timeEnd(label);
      }
    });
    scope.def("t'pause", (duration = 100, fn = () => false
    ) => {
      let value2 = false;
      setTimeout(() => value2 = fn()
        , duration);
      return value2;
    });
    return scope;
  }
}
export { Wyg1 as Wyg };
export { Atom, Kind };
export default {
  Wyg: { Program: Wyg1, Stream, Lexer, Parser },
  Enums: { Atom, Kind, Rule, Comment1: Comment, Op },
};