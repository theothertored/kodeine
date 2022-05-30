var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __pow = Math.pow;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// engine/dist.node/abstractions.js
var require_abstractions = __commonJS({
  "engine/dist.node/abstractions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IFormulaStringParser = exports.IFormulaTokenLexer = exports.ICharReader = exports.IKodeFunction = exports.IBinaryOperator = exports.IUnaryOperator = exports.IOperator = void 0;
    var IOperator = class {
    };
    exports.IOperator = IOperator;
    var IUnaryOperator3 = class extends IOperator {
    };
    exports.IUnaryOperator = IUnaryOperator3;
    var IBinaryOperator3 = class extends IOperator {
    };
    exports.IBinaryOperator = IBinaryOperator3;
    var IKodeFunction3 = class {
    };
    exports.IKodeFunction = IKodeFunction3;
    var ICharReader3 = class {
    };
    exports.ICharReader = ICharReader3;
    var IFormulaTokenLexer3 = class {
    };
    exports.IFormulaTokenLexer = IFormulaTokenLexer3;
    var IFormulaStringParser2 = class {
    };
    exports.IFormulaStringParser = IFormulaStringParser2;
  }
});

// engine/dist.node/errors.js
var require_errors = __commonJS({
  "engine/dist.node/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RegexEvaluationError = exports.InvalidArgumentError = exports.InvalidArgumentCountError = exports.EvaluationError = exports.UnrecognizedTokenError = exports.UnquotedValueAndFunctionNameCollisionError = exports.KodeFunctionNotFoundError = exports.KodeSyntaxError = exports.KodeParsingError = exports.KodeError = void 0;
    var kodeine_js_1 = require_kodeine();
    var KodeError = class {
      constructor(message) {
        this.message = message;
      }
    };
    exports.KodeError = KodeError;
    var KodeParsingError3 = class extends KodeError {
      constructor(prefix, token, message) {
        super(`${prefix} around index ${token.getStartIndex()}: ${message}`);
        this.token = token;
      }
    };
    exports.KodeParsingError = KodeParsingError3;
    var KodeSyntaxError2 = class extends KodeParsingError3 {
      constructor(token, message) {
        super("Syntax error", token, message);
      }
    };
    exports.KodeSyntaxError = KodeSyntaxError2;
    var KodeFunctionNotFoundError2 = class extends KodeParsingError3 {
      constructor(token) {
        super("Function not found", token, `Function with name "${token.getSourceText()}" was not found.`);
      }
    };
    exports.KodeFunctionNotFoundError = KodeFunctionNotFoundError2;
    var UnquotedValueAndFunctionNameCollisionError2 = class extends KodeParsingError3 {
      constructor(token) {
        super("Unquoted string & function name collision", token, `"${token.getSourceText()}" is a function name. Kustom will throw "err: null", even though this value is not followed by an opening parenthesis.`);
      }
    };
    exports.UnquotedValueAndFunctionNameCollisionError = UnquotedValueAndFunctionNameCollisionError2;
    var UnrecognizedTokenError2 = class extends KodeParsingError3 {
      constructor(token) {
        super("Unrecognized token", token, `Token "${token.getName()}" was not recognized by the parser.`);
      }
    };
    exports.UnrecognizedTokenError = UnrecognizedTokenError2;
    var EvaluationError6 = class extends KodeError {
      constructor(evaluable, message) {
        super(`Evaluation error: ${message}`);
        this.evaluable = evaluable;
      }
    };
    exports.EvaluationError = EvaluationError6;
    var InvalidArgumentCountError2 = class extends EvaluationError6 {
      constructor(funcCall, message, funcDescription) {
        super(funcCall, `Invalid argument count for ${funcDescription || funcCall.func.getName() + "()"}: ${message}`);
      }
    };
    exports.InvalidArgumentCountError = InvalidArgumentCountError2;
    var InvalidArgumentError2 = class extends EvaluationError6 {
      constructor(funcDescription, argumentName, argumentIndex, argumentSource, invalidValue, message) {
        super(argumentSource, `Value ${invalidValue instanceof kodeine_js_1.KodeValue ? invalidValue.toOutputString() : invalidValue} given for argument "${argumentName}" (#${argumentIndex}) for ${funcDescription} is invalid: ${message}`);
      }
    };
    exports.InvalidArgumentError = InvalidArgumentError2;
    var RegexEvaluationError2 = class extends EvaluationError6 {
      constructor(evaluable, message) {
        super(evaluable, `Regex error: ${message}`);
      }
    };
    exports.RegexEvaluationError = RegexEvaluationError2;
  }
});

// engine/dist.node/string-char-reader.js
var require_string_char_reader = __commonJS({
  "engine/dist.node/string-char-reader.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StringCharReader = void 0;
    var kodeine_js_1 = require_kodeine();
    var StringCharReader2 = class extends kodeine_js_1.ICharReader {
      constructor(text) {
        super();
        this._text = text;
        this._position = 0;
      }
      getPosition() {
        return this._position;
      }
      peek(charCount, offset) {
        offset != null ? offset : offset = 0;
        return this._text.substring(this._position + offset, this._position + offset + charCount);
      }
      consume(charCount) {
        let oldPos = this._position;
        this._position += charCount;
        return this._text.substring(oldPos, oldPos + charCount);
      }
      EOF() {
        return this._position >= this._text.length;
      }
    };
    exports.StringCharReader = StringCharReader2;
  }
});

// engine/dist.node/evaluation/evaluation-context.js
var require_evaluation_context = __commonJS({
  "engine/dist.node/evaluation/evaluation-context.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnaryMinusStringModeWarning = exports.EvaluationWarning = exports.EvaluationSideEffects = exports.EvaluationContext = exports.ValidWeekdays = exports.ValidClockModes = void 0;
    exports.ValidClockModes = ["auto", "12h", "24h"];
    exports.ValidWeekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var EvaluationContext22 = class {
      constructor() {
        this.iReplacement = null;
        this.globals = /* @__PURE__ */ new Map();
        this.buildEvaluationTree = false;
        this.clockMode = "auto";
        this.firstDayOfTheWeek = "mon";
        this.sideEffects = new EvaluationSideEffects();
      }
      clearSideEffects() {
        this.sideEffects = new EvaluationSideEffects();
      }
      clone() {
        let newCtx = new EvaluationContext22();
        newCtx.iReplacement = this.iReplacement;
        newCtx.globals = new Map(this.globals);
        return newCtx;
      }
      getNow() {
        return new Date();
      }
    };
    exports.EvaluationContext = EvaluationContext22;
    var EvaluationSideEffects = class {
      constructor() {
        this.warnings = [];
        this.errors = [];
        this.globalNameStack = [];
        this.lastEvaluationTreeNode = null;
      }
    };
    exports.EvaluationSideEffects = EvaluationSideEffects;
    var EvaluationWarning2 = class {
      constructor(evaluable, message) {
        this.evaluable = evaluable;
        this.message = message;
      }
    };
    exports.EvaluationWarning = EvaluationWarning2;
    var UnaryMinusStringModeWarning2 = class extends EvaluationWarning2 {
      constructor(operation) {
        super(operation, 'Weird behavior: string negation. Negating a string returns itself with "-null" appended (ex. -abc => abc-null).');
      }
    };
    exports.UnaryMinusStringModeWarning = UnaryMinusStringModeWarning2;
  }
});

// engine/dist.node/evaluation/evaluation-tree.js
var require_evaluation_tree = __commonJS({
  "engine/dist.node/evaluation/evaluation-tree.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CouldNotBeEvaluated = exports.Literal = exports.LiteralReplacement = exports.EvaluatedUnaryOperation = exports.EvaluatedBinaryOperation = exports.EvaluatedFunctionCall = exports.EvaluatedExpression = exports.FormulaEvaluationTree = exports.FormulaEvaluationTreeNode = exports.EvaluationStepReplacement = void 0;
    var kodeine_js_1 = require_kodeine();
    var EvaluationStepReplacement = class {
      constructor(evaluable, result) {
        this.startIndex = evaluable.source.getStartIndex();
        this.sourceLength = evaluable.source.getEndIndex() - this.startIndex;
        if (result instanceof kodeine_js_1.KodeValue)
          this.replacementText = result.isNumeric ? result.toOutputString() : `"${result.toOutputString()}"`;
        else
          this.replacementText = result;
      }
    };
    exports.EvaluationStepReplacement = EvaluationStepReplacement;
    var FormulaEvaluationTreeNode4 = class {
      constructor(result) {
        this.result = result;
      }
    };
    exports.FormulaEvaluationTreeNode = FormulaEvaluationTreeNode4;
    var FormulaEvaluationTree4 = class extends FormulaEvaluationTreeNode4 {
      constructor(formula, parts, result) {
        super(result);
        this.formula = formula;
        this.parts = parts;
      }
      getDescription() {
        return "formula";
      }
      addStepReplacementsTo(replacements) {
        for (const part of this.parts) {
          part.addStepReplacementsTo(replacements);
        }
        replacements.push(new EvaluationStepReplacement(this.formula, this.result.toOutputString()));
      }
      _replaceStringSection(original, start, length, insertion) {
        let beforeReplacement = original.substring(0, start);
        let afterReplacement = original.substring(start + length);
        return `${beforeReplacement}${insertion}${afterReplacement}`;
      }
      printEvaluationSteps() {
        let stepReplacements = [];
        this.addStepReplacementsTo(stepReplacements);
        let originalText = this.formula.getSourceText();
        let output = `-- formula text --

${originalText}`;
        let lastStepText = originalText;
        let changes = [];
        for (let i = 0; i < stepReplacements.length; i++) {
          const replacement = stepReplacements[i];
          let change = {
            source: {
              start: replacement.startIndex,
              length: replacement.sourceLength
            },
            relative: {
              start: replacement.startIndex,
              length: replacement.sourceLength
            },
            replacementLength: replacement.replacementText.length
          };
          for (let j = 0; j < changes.length; j++) {
            const prevChange = changes[j];
            if (prevChange.source.start + prevChange.source.length <= change.source.start) {
              change.relative.start = change.relative.start - prevChange.relative.length + prevChange.replacementLength;
            } else if (prevChange.source.start >= change.source.start && prevChange.source.start + prevChange.source.length <= change.source.start + change.source.length) {
              change.relative.length = change.relative.length - prevChange.relative.length + prevChange.replacementLength;
            } else {
            }
          }
          let replacing = lastStepText.substring(change.relative.start, change.relative.start + change.relative.length);
          lastStepText = this._replaceStringSection(lastStepText, change.relative.start, change.relative.length, replacement.replacementText);
          output += `

-- step ${i + 1} --

${lastStepText}`;
          changes.push(change);
        }
        output += `

-- result --

${this.result.toOutputString()}`;
        return output;
      }
    };
    exports.FormulaEvaluationTree = FormulaEvaluationTree4;
    var EvaluatedExpression3 = class extends FormulaEvaluationTreeNode4 {
      constructor(expression, child, result) {
        super(result);
        this.expression = expression;
        this.child = child;
      }
      getDescription() {
        return "expression";
      }
      addStepReplacementsTo(replacements) {
        this.child.addStepReplacementsTo(replacements);
        if (!(this.expression.source.tokens[0] instanceof kodeine_js_1.DollarSignToken)) {
          replacements.push(new EvaluationStepReplacement(this.expression, this.result));
        }
      }
    };
    exports.EvaluatedExpression = EvaluatedExpression3;
    var EvaluatedFunctionCall3 = class extends FormulaEvaluationTreeNode4 {
      constructor(call, args, result) {
        super(result);
        this.call = call;
        this.args = args;
      }
      getDescription() {
        var _a;
        if (this.call.func instanceof kodeine_js_1.KodeFunctionWithModes) {
          return `${this.call.func.getName()}(${(_a = this.args[0]) == null ? void 0 : _a.result.toOutputString()}) call`;
        } else {
          return `${this.call.func.getName()}() call`;
        }
      }
      addStepReplacementsTo(replacements) {
        this.args.forEach((a) => a.addStepReplacementsTo(replacements));
        replacements.push(new EvaluationStepReplacement(this.call, this.result));
      }
    };
    exports.EvaluatedFunctionCall = EvaluatedFunctionCall3;
    var EvaluatedBinaryOperation3 = class extends FormulaEvaluationTreeNode4 {
      constructor(operation, argA, argB, result) {
        super(result);
        this.operation = operation;
        this.argA = argA;
        this.argB = argB;
      }
      getDescription() {
        return `${this.operation.operator.getSymbol()} operator`;
      }
      addStepReplacementsTo(replacements) {
        this.argA.addStepReplacementsTo(replacements);
        this.argB.addStepReplacementsTo(replacements);
        replacements.push(new EvaluationStepReplacement(this.operation, this.result));
      }
    };
    exports.EvaluatedBinaryOperation = EvaluatedBinaryOperation3;
    var EvaluatedUnaryOperation3 = class extends FormulaEvaluationTreeNode4 {
      constructor(operation, arg, result) {
        super(result);
        this.operation = operation;
        this.arg = arg;
      }
      getDescription() {
        return `${this.operation.operator.getSymbol()} operator`;
      }
      addStepReplacementsTo(replacements) {
        this.arg.addStepReplacementsTo(replacements);
        replacements.push(new EvaluationStepReplacement(this.operation, this.result));
      }
    };
    exports.EvaluatedUnaryOperation = EvaluatedUnaryOperation3;
    var LiteralReplacement2 = class extends FormulaEvaluationTreeNode4 {
      constructor(replacementValue, sourceLiteral) {
        super(replacementValue);
        this.sourceLiteral = sourceLiteral;
      }
      getDescription() {
        return `value replacement`;
      }
      addStepReplacementsTo(replacements) {
        replacements.push(new EvaluationStepReplacement(this.sourceLiteral.result, this.result));
      }
    };
    exports.LiteralReplacement = LiteralReplacement2;
    var Literal3 = class extends FormulaEvaluationTreeNode4 {
      constructor(value) {
        super(value);
      }
      getDescription() {
        return this.result.isNumeric ? "numeric value" : "value";
      }
      addStepReplacementsTo(replacements) {
      }
    };
    exports.Literal = Literal3;
    var CouldNotBeEvaluated2 = class extends FormulaEvaluationTreeNode4 {
      constructor(evaluable, result) {
        super(result);
        this.evaluable = evaluable;
      }
      getDescription() {
        return `evaluation failed`;
      }
      addStepReplacementsTo(replacements) {
        replacements.push(new EvaluationStepReplacement(this.evaluable, this.result));
      }
    };
    exports.CouldNotBeEvaluated = CouldNotBeEvaluated2;
  }
});

// engine/dist.node/evaluation/evaluables/evaluable.js
var require_evaluable = __commonJS({
  "engine/dist.node/evaluation/evaluables/evaluable.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EvaluableSource = exports.Evaluable = void 0;
    var Evaluable7 = class {
      constructor(source) {
        this.source = source;
      }
      getSourceText() {
        return this.source.tokens.map((t) => t.getSourceText()).join("");
      }
    };
    exports.Evaluable = Evaluable7;
    var EvaluableSource7 = class {
      constructor(...tokens) {
        this.tokens = tokens;
      }
      getStartIndex() {
        if (this.tokens.length > 0)
          return this.tokens[0].getStartIndex();
        else
          throw new Error("Evaluable source contains no tokens.");
      }
      getEndIndex() {
        if (this.tokens.length > 0)
          return this.tokens[this.tokens.length - 1].getEndIndex();
        else
          throw new Error("Evaluable source contains no tokens.");
      }
      static createByConcatenatingSources(evaluables) {
        let tokens = [];
        evaluables.forEach((ev) => {
          var _a;
          if (Array.isArray((_a = ev.source) == null ? void 0 : _a.tokens)) {
            tokens.push(...ev.source.tokens);
          }
        });
        return new EvaluableSource7(...tokens);
      }
    };
    exports.EvaluableSource = EvaluableSource7;
  }
});

// engine/dist.node/evaluation/implementations/helpers/kustom-date-helper.js
var require_kustom_date_helper = __commonJS({
  "engine/dist.node/evaluation/implementations/helpers/kustom-date-helper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KustomDateHelper = void 0;
    exports.KustomDateHelper = (() => {
      let padYear = (num) => num < 1e3 ? 2e3 + num : num;
      let pad2 = (num) => num < 10 ? `0${num}` : num;
      return {
        toKustomDateString: (date) => {
          return `${padYear(date.getFullYear())}y${pad2(date.getMonth() + 1)}M${pad2(date.getDate())}d${pad2(date.getHours())}h${pad2(date.getMinutes())}m${pad2(date.getSeconds())}s`;
        },
        parseKustomDateString: (now, kustomDateString) => {
          let getMonthDayCount = (year, month) => new Date(year, month + 1, 0).getDate();
          let handlers = {
            y: {
              canSet: (val) => true,
              set: (val) => now = new Date(val, now.getMonth(), Math.min(now.getDate(), getMonthDayCount(val, now.getMonth())), now.getHours(), now.getMinutes(), now.getSeconds()),
              add: (val) => now = new Date(now.getFullYear() + val, now.getMonth(), Math.min(now.getDate(), getMonthDayCount(val, now.getMonth())), now.getHours(), now.getMinutes(), now.getSeconds())
            },
            M: {
              canSet: (val) => val >= 1 && val <= 12,
              set: (val) => now = new Date(now.getFullYear(), val - 1, Math.min(now.getDate(), getMonthDayCount(now.getFullYear(), val - 1)), now.getHours(), now.getMinutes(), now.getSeconds()),
              add: (val) => now = new Date(now.getFullYear() + Math.trunc(val / 12), now.getMonth() + val % 12, Math.min(now.getDate(), getMonthDayCount(val, now.getMonth() + val % 12)), now.getHours(), now.getMinutes(), now.getSeconds())
            },
            d: {
              canSet: (val) => val >= 1 && val <= getMonthDayCount(now.getFullYear(), now.getMonth()),
              set: (val) => now = new Date(now.getFullYear(), now.getMonth(), val, now.getHours(), now.getMinutes(), now.getSeconds()),
              add: (val) => now.setDate(now.getDate() + val)
            },
            h: {
              canSet: (val) => val >= 0 && val < 24,
              set: (val) => now.setHours(val),
              add: (val) => now.setHours(now.getHours() + val)
            },
            m: {
              canSet: (val) => val >= 0 && val < 60,
              set: (val) => now.setMinutes(val),
              add: (val) => now.setMinutes(now.getMinutes() + val)
            },
            s: {
              canSet: (val) => val >= 0 && val < 60,
              set: (val) => now.setSeconds(val),
              add: (val) => now.setSeconds(now.getSeconds() + val)
            }
          };
          let state = null;
          let numberBuffer = 0;
          for (const char of kustomDateString) {
            let digit = "0123456789".indexOf(char);
            if (digit >= 0) {
              numberBuffer = (numberBuffer != null ? numberBuffer : 0) * 10 + digit;
            } else {
              if (char === "a" || char === "r") {
                state = char;
              } else if (char in handlers) {
                if (state === null) {
                  if (handlers[char].canSet(numberBuffer))
                    handlers[char].set(numberBuffer);
                } else if (state === "a") {
                  handlers[char].add(numberBuffer);
                } else if (state === "r") {
                  handlers[char].add(-numberBuffer);
                }
              }
              numberBuffer = 0;
            }
          }
          return now;
        }
      };
    })();
  }
});

// engine/dist.node/evaluation/evaluables/kode-value.js
var require_kode_value = __commonJS({
  "engine/dist.node/evaluation/evaluables/kode-value.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KodeValue = void 0;
    var kodeine_js_1 = require_kodeine();
    var kustom_date_helper_js_1 = require_kustom_date_helper();
    var signedInt32Max2 = __pow(2, 31) - 1;
    var signedInt32Min2 = -__pow(2, 31);
    var KodeValue6 = class extends kodeine_js_1.Evaluable {
      constructor(value, source) {
        super(source);
        if (typeof value === "boolean") {
          this.numericValue = value ? 1 : 0;
          this.text = this.numericValue.toString();
          this.isNumeric = true;
          this.isDate = false;
        } else if (typeof value === "string") {
          this.text = value;
          this.numericValue = (value == null ? void 0 : value.trim()) ? Number(value) : NaN;
          this.isNumeric = !isNaN(this.numericValue);
          this.isDate = false;
          let isI = value.trim().toLowerCase() === "i";
          if (isI)
            this.isI = true;
        } else if (typeof value === "number") {
          if (Number.isInteger(value)) {
            this.numericValue = Math.max(signedInt32Min2, Math.min(value, signedInt32Max2));
          } else {
            this.numericValue = value;
          }
          this.text = value.toString();
          this.isNumeric = true;
          this.isDate = false;
        } else if (value instanceof Date) {
          this.dateValue = value;
          this.text = ((date) => {
            let timezoneOffsetTotalMinutes = date.getTimezoneOffset();
            if (timezoneOffsetTotalMinutes === 0) {
              return date.toISOString();
            } else {
              date.setMinutes(date.getMinutes() + timezoneOffsetTotalMinutes);
              let timezoneOffsetHours = Math.abs(Math.trunc(date.getTimezoneOffset() / 60));
              let timezoneOffsetMintues = Math.abs(date.getTimezoneOffset() % 60);
              return date.toISOString().replace("Z", `${timezoneOffsetTotalMinutes >= 0 ? "-" : "+"}${timezoneOffsetHours < 10 ? "0" : ""}${timezoneOffsetHours}:${timezoneOffsetMintues < 10 ? "0" : ""}${timezoneOffsetMintues}`);
            }
          })(new Date(value));
          this.numericValue = Math.floor(value.valueOf() / 1e3);
          this.isNumeric = false;
          this.isDate = true;
        } else {
          this.text = value.text;
          this.isNumeric = value.isNumeric;
          this.numericValue = value.numericValue;
          this.isDate = value.isDate;
        }
      }
      evaluate(evalCtx2) {
        let literal = new kodeine_js_1.Literal(this);
        if (evalCtx2.iReplacement && this.isI) {
          if (evalCtx2.buildEvaluationTree) {
            evalCtx2.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.LiteralReplacement(evalCtx2.iReplacement, literal);
          }
          return evalCtx2.iReplacement;
        } else {
          if (evalCtx2.buildEvaluationTree) {
            evalCtx2.sideEffects.lastEvaluationTreeNode = literal;
          }
          return this;
        }
      }
      equals(other) {
        if (!isNaN(this.numericValue) && !isNaN(other.numericValue))
          return this.numericValue == other.numericValue;
        else if (isNaN(this.numericValue) || isNaN(other.numericValue))
          return false;
        else
          return this.text.trim().toLowerCase() == other.text.trim().toLowerCase();
      }
      toOutputString() {
        if (this.isDate)
          return kustom_date_helper_js_1.KustomDateHelper.toKustomDateString(this.dateValue);
        else
          return this.text;
      }
      static fromToken(token) {
        return new KodeValue6(token.getValue(), new kodeine_js_1.EvaluableSource(token));
      }
    };
    exports.KodeValue = KodeValue6;
  }
});

// engine/dist.node/evaluation/evaluables/unary-operation.js
var require_unary_operation = __commonJS({
  "engine/dist.node/evaluation/evaluables/unary-operation.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnaryOperation = void 0;
    var kodeine_js_1 = require_kodeine();
    var UnaryOperation4 = class extends kodeine_js_1.Evaluable {
      constructor(operator, arg, source) {
        super(source);
        this.operator = operator;
        this.arg = arg;
      }
      evaluate(evalCtx2) {
        if (evalCtx2.buildEvaluationTree) {
          let argResult = this.arg.evaluate(evalCtx2);
          let argNode = evalCtx2.sideEffects.lastEvaluationTreeNode;
          let result = this.operator.operation(evalCtx2, this, argResult);
          evalCtx2.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.EvaluatedUnaryOperation(this, argNode, result);
          return result;
        } else {
          return this.operator.operation(evalCtx2, this, this.arg.evaluate(evalCtx2));
        }
      }
    };
    exports.UnaryOperation = UnaryOperation4;
  }
});

// engine/dist.node/evaluation/evaluables/binary-operation.js
var require_binary_operation = __commonJS({
  "engine/dist.node/evaluation/evaluables/binary-operation.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryOperation = void 0;
    var kodeine_js_1 = require_kodeine();
    var BinaryOperation5 = class extends kodeine_js_1.Evaluable {
      constructor(operator, argA, argB, source) {
        super(source);
        this.operator = operator;
        this.argA = argA;
        this.argB = argB;
      }
      evaluate(evalCtx2) {
        if (evalCtx2.buildEvaluationTree) {
          let argAResult = this.argA.evaluate(evalCtx2);
          let argANode = evalCtx2.sideEffects.lastEvaluationTreeNode;
          let argBResult = this.argB.evaluate(evalCtx2);
          let argBNode = evalCtx2.sideEffects.lastEvaluationTreeNode;
          let result = this.operator.operation(evalCtx2, this, argAResult, argBResult);
          evalCtx2.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.EvaluatedBinaryOperation(this, argANode, argBNode, result);
          return result;
        } else {
          return this.operator.operation(evalCtx2, this, this.argA.evaluate(evalCtx2), this.argB.evaluate(evalCtx2));
        }
      }
    };
    exports.BinaryOperation = BinaryOperation5;
  }
});

// engine/dist.node/evaluation/evaluables/function-call.js
var require_function_call = __commonJS({
  "engine/dist.node/evaluation/evaluables/function-call.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FunctionCall = void 0;
    var kodeine_js_1 = require_kodeine();
    var FunctionCall14 = class extends kodeine_js_1.Evaluable {
      constructor(func, args, source) {
        super(source);
        this.func = func;
        this.args = args;
      }
      evaluate(evalCtx2) {
        try {
          if (evalCtx2.buildEvaluationTree) {
            let argResults = [];
            let argNodes = [];
            for (let i = 0; i < this.args.length; i++) {
              const arg = this.args[i];
              argResults[i] = arg.evaluate(evalCtx2);
              argNodes[i] = evalCtx2.sideEffects.lastEvaluationTreeNode;
            }
            let funcResult = this.func.call(evalCtx2, this, argResults);
            evalCtx2.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.EvaluatedFunctionCall(this, argNodes, funcResult);
            return funcResult;
          } else {
            return this.func.call(evalCtx2, this, this.args.map((a) => a.evaluate(evalCtx2)));
          }
        } catch (err) {
          if (err instanceof kodeine_js_1.EvaluationError) {
            evalCtx2.sideEffects.errors.push(err);
            return new kodeine_js_1.KodeValue("", this.source);
          } else {
            throw err;
          }
        }
      }
    };
    exports.FunctionCall = FunctionCall14;
  }
});

// engine/dist.node/evaluation/evaluables/expression.js
var require_expression = __commonJS({
  "engine/dist.node/evaluation/evaluables/expression.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Expression = void 0;
    var kodeine_js_1 = require_kodeine();
    var Expression3 = class extends kodeine_js_1.Evaluable {
      constructor(evaluable, source) {
        super(source);
        this.evaluable = evaluable;
      }
      evaluate(evalCtx2) {
        let result = this.evaluable.evaluate(evalCtx2);
        if (evalCtx2.buildEvaluationTree) {
          evalCtx2.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.EvaluatedExpression(this, evalCtx2.sideEffects.lastEvaluationTreeNode, result);
        }
        return result;
      }
    };
    exports.Expression = Expression3;
  }
});

// engine/dist.node/evaluation/evaluables/formula.js
var require_formula = __commonJS({
  "engine/dist.node/evaluation/evaluables/formula.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Formula = void 0;
    var kodeine_js_1 = require_kodeine();
    var Formula5 = class extends kodeine_js_1.Evaluable {
      constructor(evaluables) {
        super(kodeine_js_1.EvaluableSource.createByConcatenatingSources(evaluables));
        this.evaluables = [];
        this.evaluables = evaluables;
      }
      evaluate(evalCtx2) {
        let result;
        let parts = [];
        if (this.evaluables.length === 0) {
          result = new kodeine_js_1.KodeValue("", this.source);
        } else {
          let output = "";
          for (var evaluable of this.evaluables) {
            try {
              let partResult = evaluable.evaluate(evalCtx2);
              if (evalCtx2.buildEvaluationTree) {
                parts.push(evalCtx2.sideEffects.lastEvaluationTreeNode);
              }
              output += partResult.toOutputString();
            } catch (err) {
              if (err instanceof kodeine_js_1.EvaluationError) {
                evalCtx2.sideEffects.errors.push(err);
              } else {
                throw err;
              }
            }
          }
          result = new kodeine_js_1.KodeValue(output, this.source);
        }
        if (evalCtx2.buildEvaluationTree) {
          evalCtx2.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.FormulaEvaluationTree(this, parts, result);
        }
        return result;
      }
    };
    exports.Formula = Formula5;
  }
});

// engine/dist.node/evaluation/evaluables/broken-evaluable.js
var require_broken_evaluable = __commonJS({
  "engine/dist.node/evaluation/evaluables/broken-evaluable.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrokenEvaluable = void 0;
    var kodeine_js_1 = require_kodeine();
    var BrokenEvaluable2 = class extends kodeine_js_1.Evaluable {
      constructor(source) {
        super(source);
      }
      evaluate(evalCtx2) {
        let result = new kodeine_js_1.KodeValue("", this.source);
        if (evalCtx2.buildEvaluationTree) {
          evalCtx2.sideEffects.lastEvaluationTreeNode = new kodeine_js_1.CouldNotBeEvaluated(this, result);
        }
        return result;
      }
    };
    exports.BrokenEvaluable = BrokenEvaluable2;
  }
});

// engine/dist.node/evaluation/implementations/base/kode-function-with-modes.js
var require_kode_function_with_modes = __commonJS({
  "engine/dist.node/evaluation/implementations/base/kode-function-with-modes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KodeFunctionWithModes = void 0;
    var kodeine_js_1 = require_kodeine();
    var FunctionMode = class {
      constructor(argumentPatterns, implementationFunction) {
        this.argumentPatterns = argumentPatterns;
        this.implementationFunc = implementationFunction;
      }
    };
    var ModeImplementationFunctionContext = class {
      constructor(evalCtx2, call) {
        this.evalCtx = evalCtx2;
        this.call = call;
      }
    };
    var KodeFunctionWithModes2 = class extends kodeine_js_1.IKodeFunction {
      constructor() {
        super();
        this._modes = {};
      }
      mode(name, argumentPatterns, implementationFunc) {
        this._modes[name] = new FunctionMode(argumentPatterns, implementationFunc);
      }
      _validateAndConvertArg(evalCtx2, call, modeName, i, argValue, argPatternElements) {
        switch (argPatternElements.type) {
          case "any":
            return argValue;
          case "txt":
            return argValue.text;
          case "num":
            if (argValue.isNumeric) {
              return argValue.numericValue;
            } else {
              throw new kodeine_js_1.InvalidArgumentError(`${call.func.getName()}(${modeName})`, argPatternElements.name, i, call.args[i], argValue, `Argument must be numeric.`);
            }
          default:
            throw new Error(`Invalid argument pattern "${argPatternElements.source}" for ${call.func.getName()}(${modeName}), argument #${i + 1}: Unknown type "${argPatternElements.type}".`);
        }
      }
      call(evalCtx2, call, args) {
        if (args.length === 0) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, `${call.func.getName()}() requires at least a mode argument.`);
        }
        let modeName = args[0].text.trim().toLowerCase();
        let mode = this._modes[modeName];
        if (!mode) {
          throw new kodeine_js_1.InvalidArgumentError(`${call.func.getName()}()`, "mode", 0, call.args[0], args[0], `Mode "${modeName}" not found.`);
        }
        let implementationCallArgs = [];
        let optionalArgumentEncountered = false;
        let restParamEncountered = false;
        const argPatternExpr = /^(\S+) ([\S]+?)(\?|\[(\d*)\])?$/;
        for (let i = 0; i < mode.argumentPatterns.length; i++) {
          const argPattern = mode.argumentPatterns[i].trim();
          const argPatternMatch = argPatternExpr.exec(argPattern);
          if (!argPatternMatch) {
            throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1}.`);
          } else {
            const argPatternElements = {
              source: argPattern,
              type: argPatternMatch[1],
              name: argPatternMatch[2],
              isOptional: argPatternMatch[3] === "?",
              isRest: !!argPatternMatch[3] && argPatternMatch[3] !== "?",
              restMinCount: Number(argPatternMatch[4])
            };
            if (argPatternElements.isOptional) {
              optionalArgumentEncountered = true;
            } else if (argPatternElements.isRest) {
              if (i < mode.argumentPatterns.length - 1) {
                throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1} (${argPatternElements.name}): A rest parameter must be the last parameter on the list.`);
              }
              restParamEncountered = true;
            } else {
              if (optionalArgumentEncountered) {
                throw new Error(`Invalid argument pattern "${argPattern}" for ${call.func.getName()}(${modeName}), argument #${i + 1} (${argPatternElements.name}): Cannot have a required parameter after an optional parameter.`);
              } else if (i + 1 >= args.length) {
                throw new kodeine_js_1.InvalidArgumentCountError(call, `Argument #${i + 1} (${argPatternElements.name}) missing.`, `${call.func.getName()}(${modeName})`);
              }
            }
            if (!restParamEncountered && args.length - 1 > mode.argumentPatterns.length) {
              throw new kodeine_js_1.InvalidArgumentCountError(call, `Too many arguments (expected ${mode.argumentPatterns.length} at most).`, `${call.func.getName()}(${modeName})`);
            }
            if (argPatternElements.isRest) {
              let remainingParamCount = args.length - i - 1;
              if (argPatternElements.restMinCount && remainingParamCount < argPatternElements.restMinCount) {
                throw new kodeine_js_1.InvalidArgumentCountError(call, `At least ${argPatternElements.restMinCount} argument${argPatternElements.restMinCount === 1 ? "" : "s"} required.`, `${call.func.getName()}(${modeName})`);
              } else {
                let restParam = [];
                for (let j = i + 1; j < args.length; j++) {
                  restParam.push(this._validateAndConvertArg(evalCtx2, call, modeName, j, args[j], argPatternElements));
                }
                implementationCallArgs.push(restParam);
              }
            } else {
              if (i + 1 < args.length) {
                implementationCallArgs.push(this._validateAndConvertArg(evalCtx2, call, modeName, i + 1, args[i + 1], argPatternElements));
              }
            }
          }
        }
        var modeCtx = new ModeImplementationFunctionContext(evalCtx2, call);
        let val = mode.implementationFunc.call(modeCtx, ...implementationCallArgs);
        return val instanceof kodeine_js_1.KodeValue ? val : new kodeine_js_1.KodeValue(val, call.source);
      }
    };
    exports.KodeFunctionWithModes = KodeFunctionWithModes2;
  }
});

// engine/dist.node/evaluation/implementations/functions/unimplemented-functions.js
var require_unimplemented_functions = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/unimplemented-functions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TuFunction = exports.FdFunction = exports.AiFunction = exports.CiFunction = exports.UcFunction = exports.WfFunction = exports.MiFunction = exports.BrFunction = exports.BpFunction = exports.TsFunction = exports.MqFunction = exports.SiFunction = exports.BiFunction = exports.WiFunction = exports.ShFunction = exports.RmFunction = exports.WgFunction = exports.NiFunction = exports.NcFunction = exports.AqFunction = exports.LiFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var LiFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "li";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.LiFunction = LiFunction2;
    var AqFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "aq";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.AqFunction = AqFunction2;
    var NcFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "nc";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.NcFunction = NcFunction2;
    var NiFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "ni";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.NiFunction = NiFunction2;
    var WgFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "wg";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.WgFunction = WgFunction2;
    var RmFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "rm";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.RmFunction = RmFunction2;
    var ShFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "sh";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.ShFunction = ShFunction2;
    var WiFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "wi";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.WiFunction = WiFunction2;
    var BiFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "bi";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.BiFunction = BiFunction2;
    var SiFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "si";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.SiFunction = SiFunction2;
    var MqFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "mq";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.MqFunction = MqFunction2;
    var TsFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "ts";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.TsFunction = TsFunction2;
    var BpFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "bp";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.BpFunction = BpFunction2;
    var BrFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "br";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.BrFunction = BrFunction2;
    var MiFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "mi";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.MiFunction = MiFunction2;
    var WfFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "wf";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.WfFunction = WfFunction2;
    var UcFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "uc";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.UcFunction = UcFunction2;
    var CiFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "ci";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.CiFunction = CiFunction2;
    var AiFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "ai";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.AiFunction = AiFunction2;
    var FdFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "fd";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.FdFunction = FdFunction2;
    var TuFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "tu";
      }
      call(evalCtx2, call, args) {
        throw new kodeine_js_1.EvaluationError(call, "This function isn't implemented yet.");
      }
    };
    exports.TuFunction = TuFunction2;
  }
});

// engine/dist.node/evaluation/implementations/helpers/argb-color.js
var require_argb_color = __commonJS({
  "engine/dist.node/evaluation/implementations/helpers/argb-color.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArgbColor = void 0;
    var pad = (s) => s.length === 1 ? "0" + s : s;
    var lerp = (a, b, f) => Math.round(a + (b - a) * f);
    var clamp = (value, min, max) => value < min ? min : value > max ? max : value;
    function rgb2hsv(r, g, b) {
      const rf = r / 255;
      const gf = g / 255;
      const bf = b / 255;
      const cmax = Math.max(rf, gf, bf);
      const cmin = Math.min(rf, gf, bf);
      const delta = cmax - cmin;
      let h = 60 * (delta === 0 ? 0 : cmax === rf ? (gf - bf) / delta % 6 : cmax === gf ? (bf - rf) / delta + 2 : (rf - gf) / delta + 4);
      let s = cmax === 0 ? 0 : delta / cmax;
      let v = cmax;
      return [h, s, v];
    }
    function hsv2rgb(h, s, v) {
      const c = v * s;
      const x = c * (1 - Math.abs(h / 60 % 2 - 1));
      const m = v - c;
      const [rf, gf, bf] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
      return [rf, gf, bf].map((c2) => Math.round((c2 + m) * 255));
    }
    var ArgbColor2 = class {
      constructor(a, r, g, b) {
        this.a = a;
        this.r = r;
        this.g = g;
        this.b = b;
      }
      invert() {
        return new ArgbColor2(this.a, 255 - this.r, 255 - this.g, 255 - this.b);
      }
      shiftHue(amount) {
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        return new ArgbColor2(this.a, ...hsv2rgb((h + amount) % 360, s, v));
      }
      setAlpha(newAlpha) {
        return new ArgbColor2(clamp(newAlpha, 0, 255), this.r, this.g, this.b);
      }
      setSaturation(newSaturation) {
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        return new ArgbColor2(this.a, ...hsv2rgb(h, clamp(newSaturation, 0, 1), v));
      }
      addSaturation(amount) {
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        return new ArgbColor2(this.a, ...hsv2rgb(h, clamp(s + amount, 0, 1), v));
      }
      setLuminance(newLuminance) {
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        return new ArgbColor2(this.a, ...hsv2rgb(h, s, clamp(newLuminance, 0, 1)));
      }
      addLuminance(amount) {
        const [h, s, v] = rgb2hsv(this.r, this.g, this.b);
        return new ArgbColor2(this.a, ...hsv2rgb(h, s, clamp(v + amount, 0, 1)));
      }
      toARGBString() {
        let p = (c) => pad(c.toString(16).toUpperCase());
        return `#${p(this.a)}${p(this.r)}${p(this.g)}${p(this.b)}`;
      }
      static fromAHSV(a, h, s, v) {
        return new ArgbColor2(a, ...hsv2rgb(h, s, v));
      }
      static parse(str) {
        const parse2 = (str2) => {
          let val = parseInt(str2, 16);
          if (isNaN(val))
            throw "";
          else
            return val;
        };
        try {
          str = str.replace(/ |#|[^a-zA-Z0-9]/g, "");
          if (str.length === 6) {
            let r = parse2(str.substring(0, 2));
            let g = parse2(str.substring(2, 4));
            let b = parse2(str.substring(4, 6));
            return new ArgbColor2(255, r, g, b);
          } else if (str.length === 8) {
            let a = parse2(str.substring(0, 2));
            let r = parse2(str.substring(2, 4));
            let g = parse2(str.substring(4, 6));
            let b = parse2(str.substring(6, 8));
            return new ArgbColor2(255, r, g, b);
          }
        } catch (e) {
        }
        return ArgbColor2.default();
      }
      static default() {
        return new ArgbColor2(0, 0, 0, 0);
      }
      static mix(color1, color2, factor) {
        if (factor < 0) {
          return new ArgbColor2(lerp(color2.a, color1.a, -factor), lerp(color2.r, color1.r, -factor), lerp(color2.g, color1.g, -factor), lerp(color2.b, color1.b, -factor));
        } else {
          return new ArgbColor2(lerp(color1.a, color2.a, factor), lerp(color1.r, color2.r, factor), lerp(color1.g, color2.g, factor), lerp(color1.b, color2.b, factor));
        }
      }
    };
    exports.ArgbColor = ArgbColor2;
  }
});

// engine/dist.node/evaluation/implementations/functions/ce-function.js
var require_ce_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/ce-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CeFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var argb_color_js_1 = require_argb_color();
    var clamp = (value, min, max) => value < min ? min : value > max ? max : value;
    var simpleModes = {
      invert: (color) => color.invert(),
      comp: (color) => color.shiftHue(180),
      contrast: (color) => {
        const threshold = 149;
        const lum = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
        if (lum < threshold)
          return new argb_color_js_1.ArgbColor(255, 255, 255, 255);
        else
          return new argb_color_js_1.ArgbColor(255, 0, 0, 0);
      }
    };
    var complexModes = {
      alpha: (color, amountMode, amountValue) => amountMode === "s" ? color.setAlpha(amountValue) : amountMode === "a" ? color.setAlpha(color.a + Math.round(amountValue / 100 * 255)) : color.setAlpha(color.a - Math.round(amountValue / 100 * 255)),
      sat: (color, amountMode, amountValue) => amountMode === "s" ? color.setSaturation(amountValue / 100) : amountMode === "a" ? color.addSaturation(amountValue / 100) : color.addSaturation(-amountValue / 100),
      lum: (color, amountMode, amountValue) => amountMode === "s" ? color.setLuminance(amountValue / 100) : amountMode === "a" ? color.addLuminance(amountValue / 100) : color.addLuminance(-amountValue / 100)
    };
    var CeFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "ce";
      }
      call(evalCtx2, call, args) {
        if (args.length < 2) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "Expected at least two arguments.");
        } else if (args.length > 3) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "Expected at most three arguments.");
        } else {
          let color = argb_color_js_1.ArgbColor.parse(args[0].text);
          let mode = args[1].text;
          let simpleModeImplementation = simpleModes[mode];
          if (simpleModeImplementation) {
            return new kodeine_js_1.KodeValue(simpleModeImplementation(color).toARGBString(), call.source);
          } else {
            let complexModeImplementation = complexModes[mode];
            if (complexModeImplementation) {
              if (args.length < 3 || args[2].isNumeric) {
                return new kodeine_js_1.KodeValue(complexModeImplementation(color, "s", args.length < 3 ? 0 : args[2].numericValue).toARGBString(), call.source);
              } else {
                let amountText = args.length < 3 ? "" : args[2].text.trim().toLowerCase();
                if (/^.-?\d+\.?\d*$|^.-?\.\d+$/.test(amountText)) {
                  let amountMode = amountText[0] === "a" ? "a" : amountText[0] === "r" ? "r" : "s";
                  let amountValue = Number(amountText.substring(1));
                  if (amountValue < 0)
                    return new kodeine_js_1.KodeValue(color.toARGBString(), call.source);
                  else
                    return new kodeine_js_1.KodeValue(complexModeImplementation(color, amountMode, amountValue).toARGBString(), call.source);
                } else {
                  throw new kodeine_js_1.InvalidArgumentError(`ce(${mode})`, "amount", 2, call.args[2], args[2], "The amount should be a number optionally preceded by one letter (a or r).");
                }
              }
            } else {
              let amountValue;
              if (args.length < 3) {
                amountValue = 0;
              } else if (args[2].isNumeric) {
                amountValue = args[2].numericValue;
              } else if (/^.-?\d+\.?\d*$|^.-?\.\d+$/.test(args[2].text)) {
                amountValue = Number(args[2].text.substring(1));
              } else {
                throw new kodeine_js_1.InvalidArgumentError(`ce(${mode})`, "amount", 2, call.args[2], args[2], "The amount should be a number optionally preceded by one letter (a or r).");
              }
              return new kodeine_js_1.KodeValue(argb_color_js_1.ArgbColor.mix(color, argb_color_js_1.ArgbColor.parse(args[1].text), clamp(amountValue, -100, 100) / 100).toARGBString(), call.source);
            }
          }
        }
      }
    };
    exports.CeFunction = CeFunction2;
  }
});

// engine/dist.node/evaluation/implementations/functions/cm-function.js
var require_cm_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/cm-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CmFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var argb_color_js_1 = require_argb_color();
    var clamp = (value, min, max) => value < min ? min : value > max ? max : value;
    var CmFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "cm";
      }
      call(evalCtx2, call, args) {
        const checkNumeric = (index, argNames, max = 255) => {
          if (args[index].isNumeric)
            return clamp(Math.round(args[index].numericValue), 0, max);
          else
            throw new kodeine_js_1.InvalidArgumentError("cm()", argNames[index], index, call.args[index], args[index], "Argument must be numeric.");
        };
        let color;
        if (args.length < 3) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "Expected at least 3 arguments.");
        } else if (args.length > 5) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "Expected at most 5 arguments.");
        } else if (args.length === 3) {
          let argNames = ["r", "g", "b"];
          color = new argb_color_js_1.ArgbColor(255, checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames));
        } else if (args.length === 4 || args[4].text !== "h") {
          let argNames = ["a", "r", "g", "b"];
          color = new argb_color_js_1.ArgbColor(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames), checkNumeric(3, argNames));
        } else {
          let argNames = ["a", "h", "s", "v"];
          color = argb_color_js_1.ArgbColor.fromAHSV(checkNumeric(0, argNames), checkNumeric(1, argNames), checkNumeric(2, argNames, 100) / 100, checkNumeric(3, argNames, 100) / 100);
        }
        return new kodeine_js_1.KodeValue(color.toARGBString(), call.source);
      }
    };
    exports.CmFunction = CmFunction2;
  }
});

// engine/dist.node/evaluation/implementations/helpers/number-to-text-converter.js
var require_number_to_text_converter = __commonJS({
  "engine/dist.node/evaluation/implementations/helpers/number-to-text-converter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberToTextConverter = void 0;
    exports.NumberToTextConverter = (() => {
      const maxConvertible = __pow(2, 31) - 1;
      const million = 1e6;
      const billion = 1e9;
      const zeroToNineteen = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen"
      ];
      const tens = ["zero", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
      const _convertUnder20 = (n) => {
        return zeroToNineteen[n];
      };
      const _convertUnderHundred = (n) => {
        if (n < 20) {
          return _convertUnder20(n);
        } else {
          let tenCount = Math.floor(n / 10);
          let output = tens[tenCount];
          let rest = n % 10;
          if (rest > 0) {
            return `${output} ${_convertUnder20(rest)}`;
          } else {
            return output;
          }
        }
      };
      const _convertUnderThousand = (n) => {
        if (n < 100) {
          return _convertUnderHundred(n);
        } else {
          let hundredCount = Math.floor(n / 100);
          let output = _convertUnder20(hundredCount);
          let rest = n % 100;
          if (rest > 0)
            return `${output} hundred ${_convertUnderHundred(rest)}`;
          else
            return output;
        }
      };
      const _convertUnderMillion = (n) => {
        if (n < 1e3) {
          return _convertUnderThousand(n);
        } else {
          let thousandCount = Math.floor(n / 1e3);
          let output = _convertUnderThousand(thousandCount);
          let rest = n % 1e3;
          if (rest > 0)
            return `${output} thousand ${_convertUnderThousand(rest)}`;
          else
            return output;
        }
      };
      const _convertUnderBillion = (n) => {
        if (n < million) {
          return _convertUnderMillion(n);
        } else {
          let millionCount = Math.floor(n / million);
          let output = _convertUnderThousand(millionCount);
          let rest = n % million;
          if (rest > 0)
            return `${output} million ${_convertUnderMillion(rest)}`;
          else
            return `${output} million`;
        }
      };
      return {
        max: maxConvertible,
        convert: (n) => {
          if (n < 0)
            throw new Error(`Can only convert positive numbers.`);
          else if (n > maxConvertible)
            throw new Error(`Number ${n} is too big for conversion. Max is ${maxConvertible}.`);
          if (n < billion) {
            return _convertUnderBillion(n);
          } else {
            let billionCount = Math.floor(n / billion);
            let output = _convertUnder20(billionCount);
            let rest = n % billion;
            if (rest > 0)
              return `${output} billion ${_convertUnderBillion(rest)}`;
            else
              return `${output} billion`;
          }
        }
      };
    })();
  }
});

// engine/dist.node/evaluation/implementations/helpers/text-capitalizer.js
var require_text_capitalizer = __commonJS({
  "engine/dist.node/evaluation/implementations/helpers/text-capitalizer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextCapitalizer = void 0;
    exports.TextCapitalizer = (() => ({
      capitalize: (text) => {
        return text.replace(/(?<=^| )./g, (match) => match.toUpperCase());
      },
      capitalizeFirstLetter: (text) => {
        return text.substring(0, 1).toUpperCase() + text.substring(1);
      }
    }))();
  }
});

// engine/dist.node/evaluation/implementations/functions/df-function.js
var require_df_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/df-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DfFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var kustom_date_helper_js_1 = require_kustom_date_helper();
    var number_to_text_converter_js_1 = require_number_to_text_converter();
    var text_capitalizer_js_1 = require_text_capitalizer();
    var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var weekdaysAbbrev = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthsAbbrev = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    function daysIntoYear(date) {
      return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1e3;
    }
    function pad(source, targetLength) {
      const sourceString = source.toString();
      if (sourceString.length >= targetLength)
        return sourceString;
      else
        return "0".repeat(targetLength - sourceString.length) + sourceString;
    }
    var DfFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "df";
      }
      call(evalCtx2, call, args) {
        if (args.length === 0) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "At least one argument required.");
        } else if (args.length > 2) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "Expected one or two arguments.");
        }
        const resolveClockMode = () => {
          if (evalCtx2.clockMode === "auto") {
            return /am|pm/.test(new Date().toLocaleTimeString()) ? "12h" : "24h";
          } else {
            return evalCtx2.clockMode;
          }
        };
        const simpleTokens = {
          "e": (date) => {
            let day = date.getDay();
            let firstDay = kodeine_js_1.ValidWeekdays.indexOf(evalCtx2.firstDayOfTheWeek);
            return Math.abs((7 + day - firstDay) % 7 + 1);
          },
          "f": (date) => {
            if (date.getDay() === 0)
              return 7;
            else
              return date.getDay();
          },
          "F": (date) => {
            let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            let firstSundayOfMonthNumber = firstDayOfMonth.getDay() === 0 ? 1 : 8 - firstDayOfMonth.getDay();
            if (date.getDate() <= firstSundayOfMonthNumber) {
              return 1;
            } else {
              let sundayBeforeDateNumber = date.getDate() - (date.getDay() || 7);
              let weeksBetweenSundays = Math.floor((sundayBeforeDateNumber - firstSundayOfMonthNumber) / 7);
              return weeksBetweenSundays + 2;
            }
          },
          "o": (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
          "S": (date) => Math.floor(date.valueOf() / 1e3),
          "Z": (date) => date.getTimezoneOffset() * 60,
          "W": (date) => {
            let h = date.getHours();
            let m = date.getMinutes();
            if (m === 0) {
              return `${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))} o'clock`;
            } else if (m === 15) {
              return `quarter past ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))}`;
            } else if (m < 30) {
              return `${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(m))} past ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))}`;
            } else if (m === 30) {
              return `half past ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))}`;
            } else if (m === 45) {
              return `quarter to ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(h))}`;
            } else {
              return `${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert(60 - m))} to ${text_capitalizer_js_1.TextCapitalizer.capitalizeFirstLetter(number_to_text_converter_js_1.NumberToTextConverter.convert((h + 1) % 12 || 12))}`;
            }
          }
        };
        const multiTokens = {
          "H": (date, match) => pad(date.getHours(), match.length),
          "h": (date, match) => {
            if (resolveClockMode() == "12h")
              return pad(date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, match.length);
            else
              return pad(date.getHours(), match.length);
          },
          "m": (date, match) => pad(date.getMinutes(), match.length),
          "s": (date, match) => pad(date.getSeconds(), match.length),
          "a": (date, match) => resolveClockMode() === "24h" ? "" : date.getHours() < 12 ? "am" : "pm",
          "A": (date, match) => date.getHours() < 12 ? "am" : "pm",
          "k": (date, match) => {
            if (resolveClockMode() == "12h")
              return pad(date.getHours() % 12, match.length);
            else
              return pad(date.getHours() === 0 ? 24 : date.getHours(), match.length);
          },
          "d": (date, match) => pad(date.getDate(), match.length),
          "D": (date, match) => pad(daysIntoYear(date), match.length),
          "M": (date, match) => {
            if (match.length < 3)
              return pad(date.getMonth() + 1, match.length);
            else if (match.length === 3)
              return monthsAbbrev[date.getMonth()];
            else
              return monthsFull[date.getMonth()];
          },
          "y": (date, match) => match.length == 2 ? date.getFullYear().toString().substring(2) : pad(date.getFullYear(), match.length),
          "Y": (date, match) => multiTokens["y"](date, match),
          "E": (date, match) => (match.length < 4 ? weekdaysAbbrev : weekdays)[date.getDay()],
          "z": (date, match) => "NOT IMPLEMENTED"
        };
        const format = (date, format2) => {
          let output = "";
          let i = 0;
          let consume = () => format2[i++];
          let peek = () => format2[i];
          let eof = () => i >= format2.length;
          while (!eof()) {
            let char = consume();
            if (char === "'") {
              if (eof()) {
                break;
              } else {
                let nextChar = consume();
                if (nextChar === "'") {
                  output += "'";
                } else {
                  output += nextChar;
                  while (!eof() && peek() !== "'") {
                    output += consume();
                  }
                  if (!eof()) {
                    consume();
                  }
                }
              }
            } else {
              let simpleFunc = simpleTokens[char];
              if (simpleFunc) {
                output += simpleFunc(date);
              } else {
                let mutliFunc = multiTokens[char];
                if (mutliFunc) {
                  let buffer = char;
                  while (!eof() && peek() === char) {
                    buffer += consume();
                  }
                  output += mutliFunc(date, buffer);
                } else {
                  output += char;
                }
              }
            }
          }
          return output;
        };
        let now;
        if (args.length === 1)
          now = evalCtx2.getNow();
        else if (args[0].isDate)
          now = args[0].dateValue;
        else if (args[0].isNumeric)
          now = new Date(args[0].numericValue * 1e3);
        else
          now = kustom_date_helper_js_1.KustomDateHelper.parseKustomDateString(evalCtx2.getNow(), args[1].text);
        return new kodeine_js_1.KodeValue(format(now, args[0].text), call.source);
      }
    };
    exports.DfFunction = DfFunction2;
  }
});

// engine/dist.node/evaluation/implementations/functions/dp-function.js
var require_dp_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/dp-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DpFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var kustom_date_helper_js_1 = require_kustom_date_helper();
    var DpFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "dp";
      }
      call(evalCtx2, call, args) {
        if (args.length === 0) {
          return new kodeine_js_1.KodeValue(evalCtx2.getNow(), call.source);
        } else if (args.length === 1) {
          return new kodeine_js_1.KodeValue(kustom_date_helper_js_1.KustomDateHelper.parseKustomDateString(evalCtx2.getNow(), args[0].text), call.source);
        } else {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "Expected 0 or 1 arguments.");
        }
      }
    };
    exports.DpFunction = DpFunction2;
  }
});

// engine/dist.node/evaluation/implementations/functions/fl-function.js
var require_fl_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/fl-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlFunction = exports.FlEvaluationError = exports.FlEvaluationWarning = exports.FlParsingError = exports.FlParsingWarning = void 0;
    var kodeine_js_1 = require_kodeine();
    var FlParsingWarning = class extends kodeine_js_1.EvaluationWarning {
      constructor(formulaTextSource, inIncrement, internalWarning) {
        super(formulaTextSource, `Warning when parsing ${inIncrement ? "increment" : "evaluation"} formula in fl(): ` + internalWarning.message);
        this.internalWarning = internalWarning;
      }
    };
    exports.FlParsingWarning = FlParsingWarning;
    var FlParsingError = class extends kodeine_js_1.EvaluationError {
      constructor(formulaTextSource, inIncrement, internalError) {
        super(formulaTextSource, `Error when parsing ${inIncrement ? "increment" : "evaluation"} formula in fl(): ` + internalError.message);
        this.internalError = internalError;
      }
    };
    exports.FlParsingError = FlParsingError;
    var FlEvaluationWarning = class extends kodeine_js_1.EvaluationWarning {
      constructor(formulaTextSource, iValue, inIncrement, internalWarning) {
        super(formulaTextSource, `Warning when evaluating ${inIncrement ? "increment" : "evaluation"} formula in fl() with i = ${iValue.text}: ` + internalWarning.message);
        this.internalWarning = internalWarning;
      }
    };
    exports.FlEvaluationWarning = FlEvaluationWarning;
    var FlEvaluationError = class extends kodeine_js_1.EvaluationError {
      constructor(formulaTextSource, iValue, inIncrement, internalError) {
        super(formulaTextSource, `Error when evaluating ${inIncrement ? "increment" : "evaluation"} formula in fl() with i = ${iValue.text}: ` + internalError.message);
        this.internalError = internalError;
      }
    };
    exports.FlEvaluationError = FlEvaluationError;
    var FlFunction2 = class extends kodeine_js_1.IKodeFunction {
      static get maxIterationCount() {
        return 1e3;
      }
      getName() {
        return "fl";
      }
      call(evalCtx2, call, args) {
        if (args.length < 4) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "At least four arguments required (start, end, increment, formula text, optional separator).");
        } else if (args.length > 5) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "At most five arguments allowed (start, end, increment, formula text, optional separator).");
        }
        let iterationCounter = 0;
        let i = args[0];
        let endI = args[1];
        if (!args[2].text) {
          return new kodeine_js_1.KodeValue("", call.source);
        }
        let incrFormulaText = `$${args[2].text}$`;
        let evalFormulaText = `$${args[3].text}$`;
        let separator = args[4] ? args[4].text : "";
        let results = [];
        let parsingCtx2 = kodeine_js_1.ParsingContextBuilder.buildDefault();
        let parser2 = new kodeine_js_1.KodeineParser(parsingCtx2);
        let incrFormula;
        let evalFormula;
        try {
          incrFormula = parser2.parse(incrFormulaText);
        } catch (err) {
          if (err instanceof kodeine_js_1.KodeParsingError) {
            evalCtx2.sideEffects.errors.push(new FlParsingError(call.args[2], true, err));
            incrFormula = null;
          } else {
            throw err;
          }
        }
        parsingCtx2.sideEffects.errors.forEach((err) => {
          evalCtx2.sideEffects.errors.push(new FlParsingError(call.args[2], true, err));
        });
        parsingCtx2.sideEffects.warnings.forEach((warn) => {
          evalCtx2.sideEffects.warnings.push(new FlParsingWarning(call.args[2], true, warn));
        });
        parsingCtx2.clearSideEffects();
        try {
          evalFormula = evalFormulaText === "$$" ? null : parser2.parse(evalFormulaText);
        } catch (err) {
          if (err instanceof kodeine_js_1.KodeParsingError) {
            evalCtx2.sideEffects.errors.push(new FlParsingError(this.call.arguments[3], false, err));
            evalFormula = null;
          } else {
            throw err;
          }
        }
        parsingCtx2.sideEffects.errors.forEach((err) => {
          evalCtx2.sideEffects.errors.push(new FlParsingError(call.args[2], true, err));
        });
        parsingCtx2.sideEffects.warnings.forEach((warn) => {
          evalCtx2.sideEffects.warnings.push(new FlParsingWarning(call.args[2], true, warn));
        });
        let eqOperator = parsingCtx2.findBinaryOperator("=");
        if (eqOperator === null) {
          throw new Error('Operator with symbol "=" was not found.');
        }
        let childEvalCtx = evalCtx2.clone();
        while (iterationCounter++ < FlFunction2.maxIterationCount) {
          childEvalCtx.iReplacement = i;
          if (evalFormula) {
            try {
              let evalResult = evalFormula.evaluate(childEvalCtx);
              results.push(evalResult.text);
            } catch (err) {
              if (err instanceof kodeine_js_1.EvaluationError) {
                evalCtx2.sideEffects.errors.push(new FlEvaluationError(call.args[3], i, false, err));
              } else {
                throw err;
              }
            }
            childEvalCtx.sideEffects.errors.forEach((err) => {
              evalCtx2.sideEffects.errors.push(new FlEvaluationError(call.args[3], i, false, err));
            });
            childEvalCtx.sideEffects.warnings.forEach((warn) => {
              evalCtx2.sideEffects.warnings.push(new FlEvaluationError(call.args[3], i, false, warn));
            });
            childEvalCtx.clearSideEffects();
          } else {
            results.push("");
          }
          if (i.equals(endI)) {
            break;
          }
          if (incrFormula) {
            try {
              i = incrFormula.evaluate(childEvalCtx);
            } catch (err) {
              if (err instanceof kodeine_js_1.EvaluationError) {
                evalCtx2.sideEffects.errors.push(new FlEvaluationError(call.args[2], i, true, err));
              } else {
                throw err;
              }
            }
            childEvalCtx.sideEffects.errors.forEach((err) => {
              evalCtx2.sideEffects.errors.push(new FlEvaluationError(call.args[2], i, true, err));
            });
            childEvalCtx.sideEffects.warnings.forEach((warn) => {
              evalCtx2.sideEffects.warnings.push(new FlEvaluationError(call.args[2], i, true, warn));
            });
            childEvalCtx.clearSideEffects();
          } else {
            i = new kodeine_js_1.KodeValue("");
          }
        }
        return new kodeine_js_1.KodeValue(results.join(separator), call.source);
      }
    };
    exports.FlFunction = FlFunction2;
  }
});

// engine/dist.node/evaluation/implementations/functions/gv-function.js
var require_gv_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/gv-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GvFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var GvFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "gv";
      }
      call(evalCtx2, call, args) {
        if (args.length < 1)
          throw new kodeine_js_1.InvalidArgumentCountError(call, "At least one argument required.");
        else if (args.length > 1)
          throw new kodeine_js_1.InvalidArgumentCountError(call, "Only one-argument gv() calls are currently implemented.");
        let globalName = args[0].text.trim().toLowerCase();
        if (evalCtx2.sideEffects.globalNameStack.indexOf(globalName) >= 0) {
          throw new kodeine_js_1.EvaluationError(call, `Global reference loop detected. Global stack: ${evalCtx2.sideEffects.globalNameStack.join(" > ")}.`);
        } else {
          evalCtx2.sideEffects.globalNameStack.push(globalName);
          let globalFormula = evalCtx2.globals.get(globalName);
          if (globalFormula) {
            let globalValue = globalFormula.evaluate(evalCtx2);
            evalCtx2.sideEffects.globalNameStack.pop();
            return globalValue;
          } else {
            return new kodeine_js_1.KodeValue("", call.source);
          }
        }
      }
    };
    exports.GvFunction = GvFunction2;
  }
});

// engine/dist.node/evaluation/implementations/functions/if-function.js
var require_if_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/if-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IfFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var IfFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "if";
      }
      call(evalCtx2, call, args) {
        if (args.length <= 1) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "At least two arguments required.");
        }
        let lastCondArgI = Math.floor((args.length - 2) / 2) * 2;
        ;
        for (var i = 0; i <= lastCondArgI; i += 2) {
          let condArg = args[i];
          if (!condArg.isNumeric && condArg.text !== "" || condArg.isNumeric && condArg.numericValue !== 0) {
            return new kodeine_js_1.KodeValue(args[i + 1], call.source);
          }
        }
        if (lastCondArgI + 2 < args.length) {
          return new kodeine_js_1.KodeValue(args[lastCondArgI + 2], call.source);
        } else {
          return new kodeine_js_1.KodeValue("", call.source);
        }
      }
    };
    exports.IfFunction = IfFunction2;
  }
});

// engine/dist.node/evaluation/implementations/functions/mu-function.js
var require_mu_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/mu-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MuFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var MuFunction2 = class extends kodeine_js_1.KodeFunctionWithModes {
      getName() {
        return "mu";
      }
      singleArgMode(name, func) {
        this.mode(name, ["num number"], func);
      }
      constructor() {
        super();
        this.singleArgMode("ceil", Math.ceil);
        this.singleArgMode("floor", Math.floor);
        this.singleArgMode("sqrt", Math.sqrt);
        this.mode("round", ["num number", "num decimals?"], function(number, decimals) {
          if (decimals === void 0) {
            return Math.round(number);
          } else {
            if (decimals < 0) {
              throw new kodeine_js_1.InvalidArgumentError("mu(round)", "decimals", 2, this.call.args[2], decimals, 'The number of decimal places cannot be negative. Kustom will throw "mu: 45".');
            } else {
              let powerOf10 = __pow(10, decimals);
              return Math.round(number * powerOf10) / powerOf10;
            }
          }
        });
        this.mode("min", ["num values[2]"], function(values) {
          return Math.min(...values);
        });
        this.mode("max", ["num values[2]"], function(values) {
          return Math.max(...values);
        });
        this.singleArgMode("abs", Math.abs);
        this.singleArgMode("cos", (n) => Math.cos(n / 180 * Math.PI));
        this.singleArgMode("sin", (n) => Math.sin(n / 180 * Math.PI));
        this.singleArgMode("tan", (n) => Math.tan(n / 180 * Math.PI));
        this.singleArgMode("acos", (n) => Math.acos(n) / Math.PI * 180);
        this.singleArgMode("asin", (n) => Math.asin(n) / Math.PI * 180);
        this.singleArgMode("atan", (n) => Math.atan(n) / Math.PI * 180);
        this.singleArgMode("log", Math.log10);
        this.mode("pow", ["num number", "num exponent"], function(number, exponent) {
          return __pow(number, exponent);
        });
        this.singleArgMode("ln", Math.log);
        this.mode("rnd", ["num min", "num max"], function(min, max) {
          return min + Math.floor(Math.random() * (max - min + 1));
        });
        this.mode("h2d", ["txt hex"], function(hex) {
          let output = Number("0x" + hex);
          if (isNaN(output)) {
            throw new kodeine_js_1.InvalidArgumentError("mu(h2d)", "hex", 1, this.call.args[1], hex, `Value "${hex}" could not be parsed as a hexadecimal number.`);
          } else {
            return output;
          }
        });
        this.mode("d2h", ["num number"], function(number) {
          return Math.trunc(number).toString(16);
        });
      }
    };
    exports.MuFunction = MuFunction2;
  }
});

// engine/dist.node/evaluation/implementations/helpers/html-entitity-converter.js
var require_html_entitity_converter = __commonJS({
  "engine/dist.node/evaluation/implementations/helpers/html-entitity-converter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HtmlEntityConverter = void 0;
    exports.HtmlEntityConverter = (() => {
      const namedEntities = {
        "&AElig": "\xC6",
        "&AElig;": "\xC6",
        "&AMP": "&",
        "&AMP;": "&",
        "&Aacute": "\xC1",
        "&Aacute;": "\xC1",
        "&Abreve;": "\u0102",
        "&Acirc": "\xC2",
        "&Acirc;": "\xC2",
        "&Acy;": "\u0410",
        "&Afr;": "\u{1D504}",
        "&Agrave": "\xC0",
        "&Agrave;": "\xC0",
        "&Alpha;": "\u0391",
        "&Amacr;": "\u0100",
        "&And;": "\u2A53",
        "&Aogon;": "\u0104",
        "&Aopf;": "\u{1D538}",
        "&ApplyFunction;": "\u2061",
        "&Aring": "\xC5",
        "&Aring;": "\xC5",
        "&Ascr;": "\u{1D49C}",
        "&Assign;": "\u2254",
        "&Atilde": "\xC3",
        "&Atilde;": "\xC3",
        "&Auml": "\xC4",
        "&Auml;": "\xC4",
        "&Backslash;": "\u2216",
        "&Barv;": "\u2AE7",
        "&Barwed;": "\u2306",
        "&Bcy;": "\u0411",
        "&Because;": "\u2235",
        "&Bernoullis;": "\u212C",
        "&Beta;": "\u0392",
        "&Bfr;": "\u{1D505}",
        "&Bopf;": "\u{1D539}",
        "&Breve;": "\u02D8",
        "&Bscr;": "\u212C",
        "&Bumpeq;": "\u224E",
        "&CHcy;": "\u0427",
        "&COPY": "\xA9",
        "&COPY;": "\xA9",
        "&Cacute;": "\u0106",
        "&Cap;": "\u22D2",
        "&CapitalDifferentialD;": "\u2145",
        "&Cayleys;": "\u212D",
        "&Ccaron;": "\u010C",
        "&Ccedil": "\xC7",
        "&Ccedil;": "\xC7",
        "&Ccirc;": "\u0108",
        "&Cconint;": "\u2230",
        "&Cdot;": "\u010A",
        "&Cedilla;": "\xB8",
        "&CenterDot;": "\xB7",
        "&Cfr;": "\u212D",
        "&Chi;": "\u03A7",
        "&CircleDot;": "\u2299",
        "&CircleMinus;": "\u2296",
        "&CirclePlus;": "\u2295",
        "&CircleTimes;": "\u2297",
        "&ClockwiseContourIntegral;": "\u2232",
        "&CloseCurlyDoubleQuote;": "\u201D",
        "&CloseCurlyQuote;": "\u2019",
        "&Colon;": "\u2237",
        "&Colone;": "\u2A74",
        "&Congruent;": "\u2261",
        "&Conint;": "\u222F",
        "&ContourIntegral;": "\u222E",
        "&Copf;": "\u2102",
        "&Coproduct;": "\u2210",
        "&CounterClockwiseContourIntegral;": "\u2233",
        "&Cross;": "\u2A2F",
        "&Cscr;": "\u{1D49E}",
        "&Cup;": "\u22D3",
        "&CupCap;": "\u224D",
        "&DD;": "\u2145",
        "&DDotrahd;": "\u2911",
        "&DJcy;": "\u0402",
        "&DScy;": "\u0405",
        "&DZcy;": "\u040F",
        "&Dagger;": "\u2021",
        "&Darr;": "\u21A1",
        "&Dashv;": "\u2AE4",
        "&Dcaron;": "\u010E",
        "&Dcy;": "\u0414",
        "&Del;": "\u2207",
        "&Delta;": "\u0394",
        "&Dfr;": "\u{1D507}",
        "&DiacriticalAcute;": "\xB4",
        "&DiacriticalDot;": "\u02D9",
        "&DiacriticalDoubleAcute;": "\u02DD",
        "&DiacriticalGrave;": "`",
        "&DiacriticalTilde;": "\u02DC",
        "&Diamond;": "\u22C4",
        "&DifferentialD;": "\u2146",
        "&Dopf;": "\u{1D53B}",
        "&Dot;": "\xA8",
        "&DotDot;": "\u20DC",
        "&DotEqual;": "\u2250",
        "&DoubleContourIntegral;": "\u222F",
        "&DoubleDot;": "\xA8",
        "&DoubleDownArrow;": "\u21D3",
        "&DoubleLeftArrow;": "\u21D0",
        "&DoubleLeftRightArrow;": "\u21D4",
        "&DoubleLeftTee;": "\u2AE4",
        "&DoubleLongLeftArrow;": "\u27F8",
        "&DoubleLongLeftRightArrow;": "\u27FA",
        "&DoubleLongRightArrow;": "\u27F9",
        "&DoubleRightArrow;": "\u21D2",
        "&DoubleRightTee;": "\u22A8",
        "&DoubleUpArrow;": "\u21D1",
        "&DoubleUpDownArrow;": "\u21D5",
        "&DoubleVerticalBar;": "\u2225",
        "&DownArrow;": "\u2193",
        "&DownArrowBar;": "\u2913",
        "&DownArrowUpArrow;": "\u21F5",
        "&DownBreve;": "\u0311",
        "&DownLeftRightVector;": "\u2950",
        "&DownLeftTeeVector;": "\u295E",
        "&DownLeftVector;": "\u21BD",
        "&DownLeftVectorBar;": "\u2956",
        "&DownRightTeeVector;": "\u295F",
        "&DownRightVector;": "\u21C1",
        "&DownRightVectorBar;": "\u2957",
        "&DownTee;": "\u22A4",
        "&DownTeeArrow;": "\u21A7",
        "&Downarrow;": "\u21D3",
        "&Dscr;": "\u{1D49F}",
        "&Dstrok;": "\u0110",
        "&ENG;": "\u014A",
        "&ETH": "\xD0",
        "&ETH;": "\xD0",
        "&Eacute": "\xC9",
        "&Eacute;": "\xC9",
        "&Ecaron;": "\u011A",
        "&Ecirc": "\xCA",
        "&Ecirc;": "\xCA",
        "&Ecy;": "\u042D",
        "&Edot;": "\u0116",
        "&Efr;": "\u{1D508}",
        "&Egrave": "\xC8",
        "&Egrave;": "\xC8",
        "&Element;": "\u2208",
        "&Emacr;": "\u0112",
        "&EmptySmallSquare;": "\u25FB",
        "&EmptyVerySmallSquare;": "\u25AB",
        "&Eogon;": "\u0118",
        "&Eopf;": "\u{1D53C}",
        "&Epsilon;": "\u0395",
        "&Equal;": "\u2A75",
        "&EqualTilde;": "\u2242",
        "&Equilibrium;": "\u21CC",
        "&Escr;": "\u2130",
        "&Esim;": "\u2A73",
        "&Eta;": "\u0397",
        "&Euml": "\xCB",
        "&Euml;": "\xCB",
        "&Exists;": "\u2203",
        "&ExponentialE;": "\u2147",
        "&Fcy;": "\u0424",
        "&Ffr;": "\u{1D509}",
        "&FilledSmallSquare;": "\u25FC",
        "&FilledVerySmallSquare;": "\u25AA",
        "&Fopf;": "\u{1D53D}",
        "&ForAll;": "\u2200",
        "&Fouriertrf;": "\u2131",
        "&Fscr;": "\u2131",
        "&GJcy;": "\u0403",
        "&GT": ">",
        "&GT;": ">",
        "&Gamma;": "\u0393",
        "&Gammad;": "\u03DC",
        "&Gbreve;": "\u011E",
        "&Gcedil;": "\u0122",
        "&Gcirc;": "\u011C",
        "&Gcy;": "\u0413",
        "&Gdot;": "\u0120",
        "&Gfr;": "\u{1D50A}",
        "&Gg;": "\u22D9",
        "&Gopf;": "\u{1D53E}",
        "&GreaterEqual;": "\u2265",
        "&GreaterEqualLess;": "\u22DB",
        "&GreaterFullEqual;": "\u2267",
        "&GreaterGreater;": "\u2AA2",
        "&GreaterLess;": "\u2277",
        "&GreaterSlantEqual;": "\u2A7E",
        "&GreaterTilde;": "\u2273",
        "&Gscr;": "\u{1D4A2}",
        "&Gt;": "\u226B",
        "&HARDcy;": "\u042A",
        "&Hacek;": "\u02C7",
        "&Hat;": "^",
        "&Hcirc;": "\u0124",
        "&Hfr;": "\u210C",
        "&HilbertSpace;": "\u210B",
        "&Hopf;": "\u210D",
        "&HorizontalLine;": "\u2500",
        "&Hscr;": "\u210B",
        "&Hstrok;": "\u0126",
        "&HumpDownHump;": "\u224E",
        "&HumpEqual;": "\u224F",
        "&IEcy;": "\u0415",
        "&IJlig;": "\u0132",
        "&IOcy;": "\u0401",
        "&Iacute": "\xCD",
        "&Iacute;": "\xCD",
        "&Icirc": "\xCE",
        "&Icirc;": "\xCE",
        "&Icy;": "\u0418",
        "&Idot;": "\u0130",
        "&Ifr;": "\u2111",
        "&Igrave": "\xCC",
        "&Igrave;": "\xCC",
        "&Im;": "\u2111",
        "&Imacr;": "\u012A",
        "&ImaginaryI;": "\u2148",
        "&Implies;": "\u21D2",
        "&Int;": "\u222C",
        "&Integral;": "\u222B",
        "&Intersection;": "\u22C2",
        "&InvisibleComma;": "\u2063",
        "&InvisibleTimes;": "\u2062",
        "&Iogon;": "\u012E",
        "&Iopf;": "\u{1D540}",
        "&Iota;": "\u0399",
        "&Iscr;": "\u2110",
        "&Itilde;": "\u0128",
        "&Iukcy;": "\u0406",
        "&Iuml": "\xCF",
        "&Iuml;": "\xCF",
        "&Jcirc;": "\u0134",
        "&Jcy;": "\u0419",
        "&Jfr;": "\u{1D50D}",
        "&Jopf;": "\u{1D541}",
        "&Jscr;": "\u{1D4A5}",
        "&Jsercy;": "\u0408",
        "&Jukcy;": "\u0404",
        "&KHcy;": "\u0425",
        "&KJcy;": "\u040C",
        "&Kappa;": "\u039A",
        "&Kcedil;": "\u0136",
        "&Kcy;": "\u041A",
        "&Kfr;": "\u{1D50E}",
        "&Kopf;": "\u{1D542}",
        "&Kscr;": "\u{1D4A6}",
        "&LJcy;": "\u0409",
        "&LT": "<",
        "&LT;": "<",
        "&Lacute;": "\u0139",
        "&Lambda;": "\u039B",
        "&Lang;": "\u27EA",
        "&Laplacetrf;": "\u2112",
        "&Larr;": "\u219E",
        "&Lcaron;": "\u013D",
        "&Lcedil;": "\u013B",
        "&Lcy;": "\u041B",
        "&LeftAngleBracket;": "\u27E8",
        "&LeftArrow;": "\u2190",
        "&LeftArrowBar;": "\u21E4",
        "&LeftArrowRightArrow;": "\u21C6",
        "&LeftCeiling;": "\u2308",
        "&LeftDoubleBracket;": "\u27E6",
        "&LeftDownTeeVector;": "\u2961",
        "&LeftDownVector;": "\u21C3",
        "&LeftDownVectorBar;": "\u2959",
        "&LeftFloor;": "\u230A",
        "&LeftRightArrow;": "\u2194",
        "&LeftRightVector;": "\u294E",
        "&LeftTee;": "\u22A3",
        "&LeftTeeArrow;": "\u21A4",
        "&LeftTeeVector;": "\u295A",
        "&LeftTriangle;": "\u22B2",
        "&LeftTriangleBar;": "\u29CF",
        "&LeftTriangleEqual;": "\u22B4",
        "&LeftUpDownVector;": "\u2951",
        "&LeftUpTeeVector;": "\u2960",
        "&LeftUpVector;": "\u21BF",
        "&LeftUpVectorBar;": "\u2958",
        "&LeftVector;": "\u21BC",
        "&LeftVectorBar;": "\u2952",
        "&Leftarrow;": "\u21D0",
        "&Leftrightarrow;": "\u21D4",
        "&LessEqualGreater;": "\u22DA",
        "&LessFullEqual;": "\u2266",
        "&LessGreater;": "\u2276",
        "&LessLess;": "\u2AA1",
        "&LessSlantEqual;": "\u2A7D",
        "&LessTilde;": "\u2272",
        "&Lfr;": "\u{1D50F}",
        "&Ll;": "\u22D8",
        "&Lleftarrow;": "\u21DA",
        "&Lmidot;": "\u013F",
        "&LongLeftArrow;": "\u27F5",
        "&LongLeftRightArrow;": "\u27F7",
        "&LongRightArrow;": "\u27F6",
        "&Longleftarrow;": "\u27F8",
        "&Longleftrightarrow;": "\u27FA",
        "&Longrightarrow;": "\u27F9",
        "&Lopf;": "\u{1D543}",
        "&LowerLeftArrow;": "\u2199",
        "&LowerRightArrow;": "\u2198",
        "&Lscr;": "\u2112",
        "&Lsh;": "\u21B0",
        "&Lstrok;": "\u0141",
        "&Lt;": "\u226A",
        "&Map;": "\u2905",
        "&Mcy;": "\u041C",
        "&MediumSpace;": "\u205F",
        "&Mellintrf;": "\u2133",
        "&Mfr;": "\u{1D510}",
        "&MinusPlus;": "\u2213",
        "&Mopf;": "\u{1D544}",
        "&Mscr;": "\u2133",
        "&Mu;": "\u039C",
        "&NJcy;": "\u040A",
        "&Nacute;": "\u0143",
        "&Ncaron;": "\u0147",
        "&Ncedil;": "\u0145",
        "&Ncy;": "\u041D",
        "&NegativeMediumSpace;": "\u200B",
        "&NegativeThickSpace;": "\u200B",
        "&NegativeThinSpace;": "\u200B",
        "&NegativeVeryThinSpace;": "\u200B",
        "&NestedGreaterGreater;": "\u226B",
        "&NestedLessLess;": "\u226A",
        "&NewLine;": "\n",
        "&Nfr;": "\u{1D511}",
        "&NoBreak;": "\u2060",
        "&NonBreakingSpace;": "\xA0",
        "&Nopf;": "\u2115",
        "&Not;": "\u2AEC",
        "&NotCongruent;": "\u2262",
        "&NotCupCap;": "\u226D",
        "&NotDoubleVerticalBar;": "\u2226",
        "&NotElement;": "\u2209",
        "&NotEqual;": "\u2260",
        "&NotEqualTilde;": "\u2242\u0338",
        "&NotExists;": "\u2204",
        "&NotGreater;": "\u226F",
        "&NotGreaterEqual;": "\u2271",
        "&NotGreaterFullEqual;": "\u2267\u0338",
        "&NotGreaterGreater;": "\u226B\u0338",
        "&NotGreaterLess;": "\u2279",
        "&NotGreaterSlantEqual;": "\u2A7E\u0338",
        "&NotGreaterTilde;": "\u2275",
        "&NotHumpDownHump;": "\u224E\u0338",
        "&NotHumpEqual;": "\u224F\u0338",
        "&NotLeftTriangle;": "\u22EA",
        "&NotLeftTriangleBar;": "\u29CF\u0338",
        "&NotLeftTriangleEqual;": "\u22EC",
        "&NotLess;": "\u226E",
        "&NotLessEqual;": "\u2270",
        "&NotLessGreater;": "\u2278",
        "&NotLessLess;": "\u226A\u0338",
        "&NotLessSlantEqual;": "\u2A7D\u0338",
        "&NotLessTilde;": "\u2274",
        "&NotNestedGreaterGreater;": "\u2AA2\u0338",
        "&NotNestedLessLess;": "\u2AA1\u0338",
        "&NotPrecedes;": "\u2280",
        "&NotPrecedesEqual;": "\u2AAF\u0338",
        "&NotPrecedesSlantEqual;": "\u22E0",
        "&NotReverseElement;": "\u220C",
        "&NotRightTriangle;": "\u22EB",
        "&NotRightTriangleBar;": "\u29D0\u0338",
        "&NotRightTriangleEqual;": "\u22ED",
        "&NotSquareSubset;": "\u228F\u0338",
        "&NotSquareSubsetEqual;": "\u22E2",
        "&NotSquareSuperset;": "\u2290\u0338",
        "&NotSquareSupersetEqual;": "\u22E3",
        "&NotSubset;": "\u2282\u20D2",
        "&NotSubsetEqual;": "\u2288",
        "&NotSucceeds;": "\u2281",
        "&NotSucceedsEqual;": "\u2AB0\u0338",
        "&NotSucceedsSlantEqual;": "\u22E1",
        "&NotSucceedsTilde;": "\u227F\u0338",
        "&NotSuperset;": "\u2283\u20D2",
        "&NotSupersetEqual;": "\u2289",
        "&NotTilde;": "\u2241",
        "&NotTildeEqual;": "\u2244",
        "&NotTildeFullEqual;": "\u2247",
        "&NotTildeTilde;": "\u2249",
        "&NotVerticalBar;": "\u2224",
        "&Nscr;": "\u{1D4A9}",
        "&Ntilde": "\xD1",
        "&Ntilde;": "\xD1",
        "&Nu;": "\u039D",
        "&OElig;": "\u0152",
        "&Oacute": "\xD3",
        "&Oacute;": "\xD3",
        "&Ocirc": "\xD4",
        "&Ocirc;": "\xD4",
        "&Ocy;": "\u041E",
        "&Odblac;": "\u0150",
        "&Ofr;": "\u{1D512}",
        "&Ograve": "\xD2",
        "&Ograve;": "\xD2",
        "&Omacr;": "\u014C",
        "&Omega;": "\u03A9",
        "&Omicron;": "\u039F",
        "&Oopf;": "\u{1D546}",
        "&OpenCurlyDoubleQuote;": "\u201C",
        "&OpenCurlyQuote;": "\u2018",
        "&Or;": "\u2A54",
        "&Oscr;": "\u{1D4AA}",
        "&Oslash": "\xD8",
        "&Oslash;": "\xD8",
        "&Otilde": "\xD5",
        "&Otilde;": "\xD5",
        "&Otimes;": "\u2A37",
        "&Ouml": "\xD6",
        "&Ouml;": "\xD6",
        "&OverBar;": "\u203E",
        "&OverBrace;": "\u23DE",
        "&OverBracket;": "\u23B4",
        "&OverParenthesis;": "\u23DC",
        "&PartialD;": "\u2202",
        "&Pcy;": "\u041F",
        "&Pfr;": "\u{1D513}",
        "&Phi;": "\u03A6",
        "&Pi;": "\u03A0",
        "&PlusMinus;": "\xB1",
        "&Poincareplane;": "\u210C",
        "&Popf;": "\u2119",
        "&Pr;": "\u2ABB",
        "&Precedes;": "\u227A",
        "&PrecedesEqual;": "\u2AAF",
        "&PrecedesSlantEqual;": "\u227C",
        "&PrecedesTilde;": "\u227E",
        "&Prime;": "\u2033",
        "&Product;": "\u220F",
        "&Proportion;": "\u2237",
        "&Proportional;": "\u221D",
        "&Pscr;": "\u{1D4AB}",
        "&Psi;": "\u03A8",
        "&QUOT": '"',
        "&QUOT;": '"',
        "&Qfr;": "\u{1D514}",
        "&Qopf;": "\u211A",
        "&Qscr;": "\u{1D4AC}",
        "&RBarr;": "\u2910",
        "&REG": "\xAE",
        "&REG;": "\xAE",
        "&Racute;": "\u0154",
        "&Rang;": "\u27EB",
        "&Rarr;": "\u21A0",
        "&Rarrtl;": "\u2916",
        "&Rcaron;": "\u0158",
        "&Rcedil;": "\u0156",
        "&Rcy;": "\u0420",
        "&Re;": "\u211C",
        "&ReverseElement;": "\u220B",
        "&ReverseEquilibrium;": "\u21CB",
        "&ReverseUpEquilibrium;": "\u296F",
        "&Rfr;": "\u211C",
        "&Rho;": "\u03A1",
        "&RightAngleBracket;": "\u27E9",
        "&RightArrow;": "\u2192",
        "&RightArrowBar;": "\u21E5",
        "&RightArrowLeftArrow;": "\u21C4",
        "&RightCeiling;": "\u2309",
        "&RightDoubleBracket;": "\u27E7",
        "&RightDownTeeVector;": "\u295D",
        "&RightDownVector;": "\u21C2",
        "&RightDownVectorBar;": "\u2955",
        "&RightFloor;": "\u230B",
        "&RightTee;": "\u22A2",
        "&RightTeeArrow;": "\u21A6",
        "&RightTeeVector;": "\u295B",
        "&RightTriangle;": "\u22B3",
        "&RightTriangleBar;": "\u29D0",
        "&RightTriangleEqual;": "\u22B5",
        "&RightUpDownVector;": "\u294F",
        "&RightUpTeeVector;": "\u295C",
        "&RightUpVector;": "\u21BE",
        "&RightUpVectorBar;": "\u2954",
        "&RightVector;": "\u21C0",
        "&RightVectorBar;": "\u2953",
        "&Rightarrow;": "\u21D2",
        "&Ropf;": "\u211D",
        "&RoundImplies;": "\u2970",
        "&Rrightarrow;": "\u21DB",
        "&Rscr;": "\u211B",
        "&Rsh;": "\u21B1",
        "&RuleDelayed;": "\u29F4",
        "&SHCHcy;": "\u0429",
        "&SHcy;": "\u0428",
        "&SOFTcy;": "\u042C",
        "&Sacute;": "\u015A",
        "&Sc;": "\u2ABC",
        "&Scaron;": "\u0160",
        "&Scedil;": "\u015E",
        "&Scirc;": "\u015C",
        "&Scy;": "\u0421",
        "&Sfr;": "\u{1D516}",
        "&ShortDownArrow;": "\u2193",
        "&ShortLeftArrow;": "\u2190",
        "&ShortRightArrow;": "\u2192",
        "&ShortUpArrow;": "\u2191",
        "&Sigma;": "\u03A3",
        "&SmallCircle;": "\u2218",
        "&Sopf;": "\u{1D54A}",
        "&Sqrt;": "\u221A",
        "&Square;": "\u25A1",
        "&SquareIntersection;": "\u2293",
        "&SquareSubset;": "\u228F",
        "&SquareSubsetEqual;": "\u2291",
        "&SquareSuperset;": "\u2290",
        "&SquareSupersetEqual;": "\u2292",
        "&SquareUnion;": "\u2294",
        "&Sscr;": "\u{1D4AE}",
        "&Star;": "\u22C6",
        "&Sub;": "\u22D0",
        "&Subset;": "\u22D0",
        "&SubsetEqual;": "\u2286",
        "&Succeeds;": "\u227B",
        "&SucceedsEqual;": "\u2AB0",
        "&SucceedsSlantEqual;": "\u227D",
        "&SucceedsTilde;": "\u227F",
        "&SuchThat;": "\u220B",
        "&Sum;": "\u2211",
        "&Sup;": "\u22D1",
        "&Superset;": "\u2283",
        "&SupersetEqual;": "\u2287",
        "&Supset;": "\u22D1",
        "&THORN": "\xDE",
        "&THORN;": "\xDE",
        "&TRADE;": "\u2122",
        "&TSHcy;": "\u040B",
        "&TScy;": "\u0426",
        "&Tab;": "	",
        "&Tau;": "\u03A4",
        "&Tcaron;": "\u0164",
        "&Tcedil;": "\u0162",
        "&Tcy;": "\u0422",
        "&Tfr;": "\u{1D517}",
        "&Therefore;": "\u2234",
        "&Theta;": "\u0398",
        "&ThickSpace;": "\u205F\u200A",
        "&ThinSpace;": "\u2009",
        "&Tilde;": "\u223C",
        "&TildeEqual;": "\u2243",
        "&TildeFullEqual;": "\u2245",
        "&TildeTilde;": "\u2248",
        "&Topf;": "\u{1D54B}",
        "&TripleDot;": "\u20DB",
        "&Tscr;": "\u{1D4AF}",
        "&Tstrok;": "\u0166",
        "&Uacute": "\xDA",
        "&Uacute;": "\xDA",
        "&Uarr;": "\u219F",
        "&Uarrocir;": "\u2949",
        "&Ubrcy;": "\u040E",
        "&Ubreve;": "\u016C",
        "&Ucirc": "\xDB",
        "&Ucirc;": "\xDB",
        "&Ucy;": "\u0423",
        "&Udblac;": "\u0170",
        "&Ufr;": "\u{1D518}",
        "&Ugrave": "\xD9",
        "&Ugrave;": "\xD9",
        "&Umacr;": "\u016A",
        "&UnderBar;": "_",
        "&UnderBrace;": "\u23DF",
        "&UnderBracket;": "\u23B5",
        "&UnderParenthesis;": "\u23DD",
        "&Union;": "\u22C3",
        "&UnionPlus;": "\u228E",
        "&Uogon;": "\u0172",
        "&Uopf;": "\u{1D54C}",
        "&UpArrow;": "\u2191",
        "&UpArrowBar;": "\u2912",
        "&UpArrowDownArrow;": "\u21C5",
        "&UpDownArrow;": "\u2195",
        "&UpEquilibrium;": "\u296E",
        "&UpTee;": "\u22A5",
        "&UpTeeArrow;": "\u21A5",
        "&Uparrow;": "\u21D1",
        "&Updownarrow;": "\u21D5",
        "&UpperLeftArrow;": "\u2196",
        "&UpperRightArrow;": "\u2197",
        "&Upsi;": "\u03D2",
        "&Upsilon;": "\u03A5",
        "&Uring;": "\u016E",
        "&Uscr;": "\u{1D4B0}",
        "&Utilde;": "\u0168",
        "&Uuml": "\xDC",
        "&Uuml;": "\xDC",
        "&VDash;": "\u22AB",
        "&Vbar;": "\u2AEB",
        "&Vcy;": "\u0412",
        "&Vdash;": "\u22A9",
        "&Vdashl;": "\u2AE6",
        "&Vee;": "\u22C1",
        "&Verbar;": "\u2016",
        "&Vert;": "\u2016",
        "&VerticalBar;": "\u2223",
        "&VerticalLine;": "|",
        "&VerticalSeparator;": "\u2758",
        "&VerticalTilde;": "\u2240",
        "&VeryThinSpace;": "\u200A",
        "&Vfr;": "\u{1D519}",
        "&Vopf;": "\u{1D54D}",
        "&Vscr;": "\u{1D4B1}",
        "&Vvdash;": "\u22AA",
        "&Wcirc;": "\u0174",
        "&Wedge;": "\u22C0",
        "&Wfr;": "\u{1D51A}",
        "&Wopf;": "\u{1D54E}",
        "&Wscr;": "\u{1D4B2}",
        "&Xfr;": "\u{1D51B}",
        "&Xi;": "\u039E",
        "&Xopf;": "\u{1D54F}",
        "&Xscr;": "\u{1D4B3}",
        "&YAcy;": "\u042F",
        "&YIcy;": "\u0407",
        "&YUcy;": "\u042E",
        "&Yacute": "\xDD",
        "&Yacute;": "\xDD",
        "&Ycirc;": "\u0176",
        "&Ycy;": "\u042B",
        "&Yfr;": "\u{1D51C}",
        "&Yopf;": "\u{1D550}",
        "&Yscr;": "\u{1D4B4}",
        "&Yuml;": "\u0178",
        "&ZHcy;": "\u0416",
        "&Zacute;": "\u0179",
        "&Zcaron;": "\u017D",
        "&Zcy;": "\u0417",
        "&Zdot;": "\u017B",
        "&ZeroWidthSpace;": "\u200B",
        "&Zeta;": "\u0396",
        "&Zfr;": "\u2128",
        "&Zopf;": "\u2124",
        "&Zscr;": "\u{1D4B5}",
        "&aacute": "\xE1",
        "&aacute;": "\xE1",
        "&abreve;": "\u0103",
        "&ac;": "\u223E",
        "&acE;": "\u223E\u0333",
        "&acd;": "\u223F",
        "&acirc": "\xE2",
        "&acirc;": "\xE2",
        "&acute": "\xB4",
        "&acute;": "\xB4",
        "&acy;": "\u0430",
        "&aelig": "\xE6",
        "&aelig;": "\xE6",
        "&af;": "\u2061",
        "&afr;": "\u{1D51E}",
        "&agrave": "\xE0",
        "&agrave;": "\xE0",
        "&alefsym;": "\u2135",
        "&aleph;": "\u2135",
        "&alpha;": "\u03B1",
        "&amacr;": "\u0101",
        "&amalg;": "\u2A3F",
        "&amp": "&",
        "&amp;": "&",
        "&and;": "\u2227",
        "&andand;": "\u2A55",
        "&andd;": "\u2A5C",
        "&andslope;": "\u2A58",
        "&andv;": "\u2A5A",
        "&ang;": "\u2220",
        "&ange;": "\u29A4",
        "&angle;": "\u2220",
        "&angmsd;": "\u2221",
        "&angmsdaa;": "\u29A8",
        "&angmsdab;": "\u29A9",
        "&angmsdac;": "\u29AA",
        "&angmsdad;": "\u29AB",
        "&angmsdae;": "\u29AC",
        "&angmsdaf;": "\u29AD",
        "&angmsdag;": "\u29AE",
        "&angmsdah;": "\u29AF",
        "&angrt;": "\u221F",
        "&angrtvb;": "\u22BE",
        "&angrtvbd;": "\u299D",
        "&angsph;": "\u2222",
        "&angst;": "\xC5",
        "&angzarr;": "\u237C",
        "&aogon;": "\u0105",
        "&aopf;": "\u{1D552}",
        "&ap;": "\u2248",
        "&apE;": "\u2A70",
        "&apacir;": "\u2A6F",
        "&ape;": "\u224A",
        "&apid;": "\u224B",
        "&apos;": "'",
        "&approx;": "\u2248",
        "&approxeq;": "\u224A",
        "&aring": "\xE5",
        "&aring;": "\xE5",
        "&ascr;": "\u{1D4B6}",
        "&ast;": "*",
        "&asymp;": "\u2248",
        "&asympeq;": "\u224D",
        "&atilde": "\xE3",
        "&atilde;": "\xE3",
        "&auml": "\xE4",
        "&auml;": "\xE4",
        "&awconint;": "\u2233",
        "&awint;": "\u2A11",
        "&bNot;": "\u2AED",
        "&backcong;": "\u224C",
        "&backepsilon;": "\u03F6",
        "&backprime;": "\u2035",
        "&backsim;": "\u223D",
        "&backsimeq;": "\u22CD",
        "&barvee;": "\u22BD",
        "&barwed;": "\u2305",
        "&barwedge;": "\u2305",
        "&bbrk;": "\u23B5",
        "&bbrktbrk;": "\u23B6",
        "&bcong;": "\u224C",
        "&bcy;": "\u0431",
        "&bdquo;": "\u201E",
        "&becaus;": "\u2235",
        "&because;": "\u2235",
        "&bemptyv;": "\u29B0",
        "&bepsi;": "\u03F6",
        "&bernou;": "\u212C",
        "&beta;": "\u03B2",
        "&beth;": "\u2136",
        "&between;": "\u226C",
        "&bfr;": "\u{1D51F}",
        "&bigcap;": "\u22C2",
        "&bigcirc;": "\u25EF",
        "&bigcup;": "\u22C3",
        "&bigodot;": "\u2A00",
        "&bigoplus;": "\u2A01",
        "&bigotimes;": "\u2A02",
        "&bigsqcup;": "\u2A06",
        "&bigstar;": "\u2605",
        "&bigtriangledown;": "\u25BD",
        "&bigtriangleup;": "\u25B3",
        "&biguplus;": "\u2A04",
        "&bigvee;": "\u22C1",
        "&bigwedge;": "\u22C0",
        "&bkarow;": "\u290D",
        "&blacklozenge;": "\u29EB",
        "&blacksquare;": "\u25AA",
        "&blacktriangle;": "\u25B4",
        "&blacktriangledown;": "\u25BE",
        "&blacktriangleleft;": "\u25C2",
        "&blacktriangleright;": "\u25B8",
        "&blank;": "\u2423",
        "&blk12;": "\u2592",
        "&blk14;": "\u2591",
        "&blk34;": "\u2593",
        "&block;": "\u2588",
        "&bne;": "=\u20E5",
        "&bnequiv;": "\u2261\u20E5",
        "&bnot;": "\u2310",
        "&bopf;": "\u{1D553}",
        "&bot;": "\u22A5",
        "&bottom;": "\u22A5",
        "&bowtie;": "\u22C8",
        "&boxDL;": "\u2557",
        "&boxDR;": "\u2554",
        "&boxDl;": "\u2556",
        "&boxDr;": "\u2553",
        "&boxH;": "\u2550",
        "&boxHD;": "\u2566",
        "&boxHU;": "\u2569",
        "&boxHd;": "\u2564",
        "&boxHu;": "\u2567",
        "&boxUL;": "\u255D",
        "&boxUR;": "\u255A",
        "&boxUl;": "\u255C",
        "&boxUr;": "\u2559",
        "&boxV;": "\u2551",
        "&boxVH;": "\u256C",
        "&boxVL;": "\u2563",
        "&boxVR;": "\u2560",
        "&boxVh;": "\u256B",
        "&boxVl;": "\u2562",
        "&boxVr;": "\u255F",
        "&boxbox;": "\u29C9",
        "&boxdL;": "\u2555",
        "&boxdR;": "\u2552",
        "&boxdl;": "\u2510",
        "&boxdr;": "\u250C",
        "&boxh;": "\u2500",
        "&boxhD;": "\u2565",
        "&boxhU;": "\u2568",
        "&boxhd;": "\u252C",
        "&boxhu;": "\u2534",
        "&boxminus;": "\u229F",
        "&boxplus;": "\u229E",
        "&boxtimes;": "\u22A0",
        "&boxuL;": "\u255B",
        "&boxuR;": "\u2558",
        "&boxul;": "\u2518",
        "&boxur;": "\u2514",
        "&boxv;": "\u2502",
        "&boxvH;": "\u256A",
        "&boxvL;": "\u2561",
        "&boxvR;": "\u255E",
        "&boxvh;": "\u253C",
        "&boxvl;": "\u2524",
        "&boxvr;": "\u251C",
        "&bprime;": "\u2035",
        "&breve;": "\u02D8",
        "&brvbar": "\xA6",
        "&brvbar;": "\xA6",
        "&bscr;": "\u{1D4B7}",
        "&bsemi;": "\u204F",
        "&bsim;": "\u223D",
        "&bsime;": "\u22CD",
        "&bsol;": "\\",
        "&bsolb;": "\u29C5",
        "&bsolhsub;": "\u27C8",
        "&bull;": "\u2022",
        "&bullet;": "\u2022",
        "&bump;": "\u224E",
        "&bumpE;": "\u2AAE",
        "&bumpe;": "\u224F",
        "&bumpeq;": "\u224F",
        "&cacute;": "\u0107",
        "&cap;": "\u2229",
        "&capand;": "\u2A44",
        "&capbrcup;": "\u2A49",
        "&capcap;": "\u2A4B",
        "&capcup;": "\u2A47",
        "&capdot;": "\u2A40",
        "&caps;": "\u2229\uFE00",
        "&caret;": "\u2041",
        "&caron;": "\u02C7",
        "&ccaps;": "\u2A4D",
        "&ccaron;": "\u010D",
        "&ccedil": "\xE7",
        "&ccedil;": "\xE7",
        "&ccirc;": "\u0109",
        "&ccups;": "\u2A4C",
        "&ccupssm;": "\u2A50",
        "&cdot;": "\u010B",
        "&cedil": "\xB8",
        "&cedil;": "\xB8",
        "&cemptyv;": "\u29B2",
        "&cent": "\xA2",
        "&cent;": "\xA2",
        "&centerdot;": "\xB7",
        "&cfr;": "\u{1D520}",
        "&chcy;": "\u0447",
        "&check;": "\u2713",
        "&checkmark;": "\u2713",
        "&chi;": "\u03C7",
        "&cir;": "\u25CB",
        "&cirE;": "\u29C3",
        "&circ;": "\u02C6",
        "&circeq;": "\u2257",
        "&circlearrowleft;": "\u21BA",
        "&circlearrowright;": "\u21BB",
        "&circledR;": "\xAE",
        "&circledS;": "\u24C8",
        "&circledast;": "\u229B",
        "&circledcirc;": "\u229A",
        "&circleddash;": "\u229D",
        "&cire;": "\u2257",
        "&cirfnint;": "\u2A10",
        "&cirmid;": "\u2AEF",
        "&cirscir;": "\u29C2",
        "&clubs;": "\u2663",
        "&clubsuit;": "\u2663",
        "&colon;": ":",
        "&colone;": "\u2254",
        "&coloneq;": "\u2254",
        "&comma;": ",",
        "&commat;": "@",
        "&comp;": "\u2201",
        "&compfn;": "\u2218",
        "&complement;": "\u2201",
        "&complexes;": "\u2102",
        "&cong;": "\u2245",
        "&congdot;": "\u2A6D",
        "&conint;": "\u222E",
        "&copf;": "\u{1D554}",
        "&coprod;": "\u2210",
        "&copy": "\xA9",
        "&copy;": "\xA9",
        "&copysr;": "\u2117",
        "&crarr;": "\u21B5",
        "&cross;": "\u2717",
        "&cscr;": "\u{1D4B8}",
        "&csub;": "\u2ACF",
        "&csube;": "\u2AD1",
        "&csup;": "\u2AD0",
        "&csupe;": "\u2AD2",
        "&ctdot;": "\u22EF",
        "&cudarrl;": "\u2938",
        "&cudarrr;": "\u2935",
        "&cuepr;": "\u22DE",
        "&cuesc;": "\u22DF",
        "&cularr;": "\u21B6",
        "&cularrp;": "\u293D",
        "&cup;": "\u222A",
        "&cupbrcap;": "\u2A48",
        "&cupcap;": "\u2A46",
        "&cupcup;": "\u2A4A",
        "&cupdot;": "\u228D",
        "&cupor;": "\u2A45",
        "&cups;": "\u222A\uFE00",
        "&curarr;": "\u21B7",
        "&curarrm;": "\u293C",
        "&curlyeqprec;": "\u22DE",
        "&curlyeqsucc;": "\u22DF",
        "&curlyvee;": "\u22CE",
        "&curlywedge;": "\u22CF",
        "&curren": "\xA4",
        "&curren;": "\xA4",
        "&curvearrowleft;": "\u21B6",
        "&curvearrowright;": "\u21B7",
        "&cuvee;": "\u22CE",
        "&cuwed;": "\u22CF",
        "&cwconint;": "\u2232",
        "&cwint;": "\u2231",
        "&cylcty;": "\u232D",
        "&dArr;": "\u21D3",
        "&dHar;": "\u2965",
        "&dagger;": "\u2020",
        "&daleth;": "\u2138",
        "&darr;": "\u2193",
        "&dash;": "\u2010",
        "&dashv;": "\u22A3",
        "&dbkarow;": "\u290F",
        "&dblac;": "\u02DD",
        "&dcaron;": "\u010F",
        "&dcy;": "\u0434",
        "&dd;": "\u2146",
        "&ddagger;": "\u2021",
        "&ddarr;": "\u21CA",
        "&ddotseq;": "\u2A77",
        "&deg": "\xB0",
        "&deg;": "\xB0",
        "&delta;": "\u03B4",
        "&demptyv;": "\u29B1",
        "&dfisht;": "\u297F",
        "&dfr;": "\u{1D521}",
        "&dharl;": "\u21C3",
        "&dharr;": "\u21C2",
        "&diam;": "\u22C4",
        "&diamond;": "\u22C4",
        "&diamondsuit;": "\u2666",
        "&diams;": "\u2666",
        "&die;": "\xA8",
        "&digamma;": "\u03DD",
        "&disin;": "\u22F2",
        "&div;": "\xF7",
        "&divide": "\xF7",
        "&divide;": "\xF7",
        "&divideontimes;": "\u22C7",
        "&divonx;": "\u22C7",
        "&djcy;": "\u0452",
        "&dlcorn;": "\u231E",
        "&dlcrop;": "\u230D",
        "&dollar;": "$",
        "&dopf;": "\u{1D555}",
        "&dot;": "\u02D9",
        "&doteq;": "\u2250",
        "&doteqdot;": "\u2251",
        "&dotminus;": "\u2238",
        "&dotplus;": "\u2214",
        "&dotsquare;": "\u22A1",
        "&doublebarwedge;": "\u2306",
        "&downarrow;": "\u2193",
        "&downdownarrows;": "\u21CA",
        "&downharpoonleft;": "\u21C3",
        "&downharpoonright;": "\u21C2",
        "&drbkarow;": "\u2910",
        "&drcorn;": "\u231F",
        "&drcrop;": "\u230C",
        "&dscr;": "\u{1D4B9}",
        "&dscy;": "\u0455",
        "&dsol;": "\u29F6",
        "&dstrok;": "\u0111",
        "&dtdot;": "\u22F1",
        "&dtri;": "\u25BF",
        "&dtrif;": "\u25BE",
        "&duarr;": "\u21F5",
        "&duhar;": "\u296F",
        "&dwangle;": "\u29A6",
        "&dzcy;": "\u045F",
        "&dzigrarr;": "\u27FF",
        "&eDDot;": "\u2A77",
        "&eDot;": "\u2251",
        "&eacute": "\xE9",
        "&eacute;": "\xE9",
        "&easter;": "\u2A6E",
        "&ecaron;": "\u011B",
        "&ecir;": "\u2256",
        "&ecirc": "\xEA",
        "&ecirc;": "\xEA",
        "&ecolon;": "\u2255",
        "&ecy;": "\u044D",
        "&edot;": "\u0117",
        "&ee;": "\u2147",
        "&efDot;": "\u2252",
        "&efr;": "\u{1D522}",
        "&eg;": "\u2A9A",
        "&egrave": "\xE8",
        "&egrave;": "\xE8",
        "&egs;": "\u2A96",
        "&egsdot;": "\u2A98",
        "&el;": "\u2A99",
        "&elinters;": "\u23E7",
        "&ell;": "\u2113",
        "&els;": "\u2A95",
        "&elsdot;": "\u2A97",
        "&emacr;": "\u0113",
        "&empty;": "\u2205",
        "&emptyset;": "\u2205",
        "&emptyv;": "\u2205",
        "&emsp13;": "\u2004",
        "&emsp14;": "\u2005",
        "&emsp;": "\u2003",
        "&eng;": "\u014B",
        "&ensp;": "\u2002",
        "&eogon;": "\u0119",
        "&eopf;": "\u{1D556}",
        "&epar;": "\u22D5",
        "&eparsl;": "\u29E3",
        "&eplus;": "\u2A71",
        "&epsi;": "\u03B5",
        "&epsilon;": "\u03B5",
        "&epsiv;": "\u03F5",
        "&eqcirc;": "\u2256",
        "&eqcolon;": "\u2255",
        "&eqsim;": "\u2242",
        "&eqslantgtr;": "\u2A96",
        "&eqslantless;": "\u2A95",
        "&equals;": "=",
        "&equest;": "\u225F",
        "&equiv;": "\u2261",
        "&equivDD;": "\u2A78",
        "&eqvparsl;": "\u29E5",
        "&erDot;": "\u2253",
        "&erarr;": "\u2971",
        "&escr;": "\u212F",
        "&esdot;": "\u2250",
        "&esim;": "\u2242",
        "&eta;": "\u03B7",
        "&eth": "\xF0",
        "&eth;": "\xF0",
        "&euml": "\xEB",
        "&euml;": "\xEB",
        "&euro;": "\u20AC",
        "&excl;": "!",
        "&exist;": "\u2203",
        "&expectation;": "\u2130",
        "&exponentiale;": "\u2147",
        "&fallingdotseq;": "\u2252",
        "&fcy;": "\u0444",
        "&female;": "\u2640",
        "&ffilig;": "\uFB03",
        "&fflig;": "\uFB00",
        "&ffllig;": "\uFB04",
        "&ffr;": "\u{1D523}",
        "&filig;": "\uFB01",
        "&fjlig;": "fj",
        "&flat;": "\u266D",
        "&fllig;": "\uFB02",
        "&fltns;": "\u25B1",
        "&fnof;": "\u0192",
        "&fopf;": "\u{1D557}",
        "&forall;": "\u2200",
        "&fork;": "\u22D4",
        "&forkv;": "\u2AD9",
        "&fpartint;": "\u2A0D",
        "&frac12": "\xBD",
        "&frac12;": "\xBD",
        "&frac13;": "\u2153",
        "&frac14": "\xBC",
        "&frac14;": "\xBC",
        "&frac15;": "\u2155",
        "&frac16;": "\u2159",
        "&frac18;": "\u215B",
        "&frac23;": "\u2154",
        "&frac25;": "\u2156",
        "&frac34": "\xBE",
        "&frac34;": "\xBE",
        "&frac35;": "\u2157",
        "&frac38;": "\u215C",
        "&frac45;": "\u2158",
        "&frac56;": "\u215A",
        "&frac58;": "\u215D",
        "&frac78;": "\u215E",
        "&frasl;": "\u2044",
        "&frown;": "\u2322",
        "&fscr;": "\u{1D4BB}",
        "&gE;": "\u2267",
        "&gEl;": "\u2A8C",
        "&gacute;": "\u01F5",
        "&gamma;": "\u03B3",
        "&gammad;": "\u03DD",
        "&gap;": "\u2A86",
        "&gbreve;": "\u011F",
        "&gcirc;": "\u011D",
        "&gcy;": "\u0433",
        "&gdot;": "\u0121",
        "&ge;": "\u2265",
        "&gel;": "\u22DB",
        "&geq;": "\u2265",
        "&geqq;": "\u2267",
        "&geqslant;": "\u2A7E",
        "&ges;": "\u2A7E",
        "&gescc;": "\u2AA9",
        "&gesdot;": "\u2A80",
        "&gesdoto;": "\u2A82",
        "&gesdotol;": "\u2A84",
        "&gesl;": "\u22DB\uFE00",
        "&gesles;": "\u2A94",
        "&gfr;": "\u{1D524}",
        "&gg;": "\u226B",
        "&ggg;": "\u22D9",
        "&gimel;": "\u2137",
        "&gjcy;": "\u0453",
        "&gl;": "\u2277",
        "&glE;": "\u2A92",
        "&gla;": "\u2AA5",
        "&glj;": "\u2AA4",
        "&gnE;": "\u2269",
        "&gnap;": "\u2A8A",
        "&gnapprox;": "\u2A8A",
        "&gne;": "\u2A88",
        "&gneq;": "\u2A88",
        "&gneqq;": "\u2269",
        "&gnsim;": "\u22E7",
        "&gopf;": "\u{1D558}",
        "&grave;": "`",
        "&gscr;": "\u210A",
        "&gsim;": "\u2273",
        "&gsime;": "\u2A8E",
        "&gsiml;": "\u2A90",
        "&gt": ">",
        "&gt;": ">",
        "&gtcc;": "\u2AA7",
        "&gtcir;": "\u2A7A",
        "&gtdot;": "\u22D7",
        "&gtlPar;": "\u2995",
        "&gtquest;": "\u2A7C",
        "&gtrapprox;": "\u2A86",
        "&gtrarr;": "\u2978",
        "&gtrdot;": "\u22D7",
        "&gtreqless;": "\u22DB",
        "&gtreqqless;": "\u2A8C",
        "&gtrless;": "\u2277",
        "&gtrsim;": "\u2273",
        "&gvertneqq;": "\u2269\uFE00",
        "&gvnE;": "\u2269\uFE00",
        "&hArr;": "\u21D4",
        "&hairsp;": "\u200A",
        "&half;": "\xBD",
        "&hamilt;": "\u210B",
        "&hardcy;": "\u044A",
        "&harr;": "\u2194",
        "&harrcir;": "\u2948",
        "&harrw;": "\u21AD",
        "&hbar;": "\u210F",
        "&hcirc;": "\u0125",
        "&hearts;": "\u2665",
        "&heartsuit;": "\u2665",
        "&hellip;": "\u2026",
        "&hercon;": "\u22B9",
        "&hfr;": "\u{1D525}",
        "&hksearow;": "\u2925",
        "&hkswarow;": "\u2926",
        "&hoarr;": "\u21FF",
        "&homtht;": "\u223B",
        "&hookleftarrow;": "\u21A9",
        "&hookrightarrow;": "\u21AA",
        "&hopf;": "\u{1D559}",
        "&horbar;": "\u2015",
        "&hscr;": "\u{1D4BD}",
        "&hslash;": "\u210F",
        "&hstrok;": "\u0127",
        "&hybull;": "\u2043",
        "&hyphen;": "\u2010",
        "&iacute": "\xED",
        "&iacute;": "\xED",
        "&ic;": "\u2063",
        "&icirc": "\xEE",
        "&icirc;": "\xEE",
        "&icy;": "\u0438",
        "&iecy;": "\u0435",
        "&iexcl": "\xA1",
        "&iexcl;": "\xA1",
        "&iff;": "\u21D4",
        "&ifr;": "\u{1D526}",
        "&igrave": "\xEC",
        "&igrave;": "\xEC",
        "&ii;": "\u2148",
        "&iiiint;": "\u2A0C",
        "&iiint;": "\u222D",
        "&iinfin;": "\u29DC",
        "&iiota;": "\u2129",
        "&ijlig;": "\u0133",
        "&imacr;": "\u012B",
        "&image;": "\u2111",
        "&imagline;": "\u2110",
        "&imagpart;": "\u2111",
        "&imath;": "\u0131",
        "&imof;": "\u22B7",
        "&imped;": "\u01B5",
        "&in;": "\u2208",
        "&incare;": "\u2105",
        "&infin;": "\u221E",
        "&infintie;": "\u29DD",
        "&inodot;": "\u0131",
        "&int;": "\u222B",
        "&intcal;": "\u22BA",
        "&integers;": "\u2124",
        "&intercal;": "\u22BA",
        "&intlarhk;": "\u2A17",
        "&intprod;": "\u2A3C",
        "&iocy;": "\u0451",
        "&iogon;": "\u012F",
        "&iopf;": "\u{1D55A}",
        "&iota;": "\u03B9",
        "&iprod;": "\u2A3C",
        "&iquest": "\xBF",
        "&iquest;": "\xBF",
        "&iscr;": "\u{1D4BE}",
        "&isin;": "\u2208",
        "&isinE;": "\u22F9",
        "&isindot;": "\u22F5",
        "&isins;": "\u22F4",
        "&isinsv;": "\u22F3",
        "&isinv;": "\u2208",
        "&it;": "\u2062",
        "&itilde;": "\u0129",
        "&iukcy;": "\u0456",
        "&iuml": "\xEF",
        "&iuml;": "\xEF",
        "&jcirc;": "\u0135",
        "&jcy;": "\u0439",
        "&jfr;": "\u{1D527}",
        "&jmath;": "\u0237",
        "&jopf;": "\u{1D55B}",
        "&jscr;": "\u{1D4BF}",
        "&jsercy;": "\u0458",
        "&jukcy;": "\u0454",
        "&kappa;": "\u03BA",
        "&kappav;": "\u03F0",
        "&kcedil;": "\u0137",
        "&kcy;": "\u043A",
        "&kfr;": "\u{1D528}",
        "&kgreen;": "\u0138",
        "&khcy;": "\u0445",
        "&kjcy;": "\u045C",
        "&kopf;": "\u{1D55C}",
        "&kscr;": "\u{1D4C0}",
        "&lAarr;": "\u21DA",
        "&lArr;": "\u21D0",
        "&lAtail;": "\u291B",
        "&lBarr;": "\u290E",
        "&lE;": "\u2266",
        "&lEg;": "\u2A8B",
        "&lHar;": "\u2962",
        "&lacute;": "\u013A",
        "&laemptyv;": "\u29B4",
        "&lagran;": "\u2112",
        "&lambda;": "\u03BB",
        "&lang;": "\u27E8",
        "&langd;": "\u2991",
        "&langle;": "\u27E8",
        "&lap;": "\u2A85",
        "&laquo": "\xAB",
        "&laquo;": "\xAB",
        "&larr;": "\u2190",
        "&larrb;": "\u21E4",
        "&larrbfs;": "\u291F",
        "&larrfs;": "\u291D",
        "&larrhk;": "\u21A9",
        "&larrlp;": "\u21AB",
        "&larrpl;": "\u2939",
        "&larrsim;": "\u2973",
        "&larrtl;": "\u21A2",
        "&lat;": "\u2AAB",
        "&latail;": "\u2919",
        "&late;": "\u2AAD",
        "&lates;": "\u2AAD\uFE00",
        "&lbarr;": "\u290C",
        "&lbbrk;": "\u2772",
        "&lbrace;": "{",
        "&lbrack;": "[",
        "&lbrke;": "\u298B",
        "&lbrksld;": "\u298F",
        "&lbrkslu;": "\u298D",
        "&lcaron;": "\u013E",
        "&lcedil;": "\u013C",
        "&lceil;": "\u2308",
        "&lcub;": "{",
        "&lcy;": "\u043B",
        "&ldca;": "\u2936",
        "&ldquo;": "\u201C",
        "&ldquor;": "\u201E",
        "&ldrdhar;": "\u2967",
        "&ldrushar;": "\u294B",
        "&ldsh;": "\u21B2",
        "&le;": "\u2264",
        "&leftarrow;": "\u2190",
        "&leftarrowtail;": "\u21A2",
        "&leftharpoondown;": "\u21BD",
        "&leftharpoonup;": "\u21BC",
        "&leftleftarrows;": "\u21C7",
        "&leftrightarrow;": "\u2194",
        "&leftrightarrows;": "\u21C6",
        "&leftrightharpoons;": "\u21CB",
        "&leftrightsquigarrow;": "\u21AD",
        "&leftthreetimes;": "\u22CB",
        "&leg;": "\u22DA",
        "&leq;": "\u2264",
        "&leqq;": "\u2266",
        "&leqslant;": "\u2A7D",
        "&les;": "\u2A7D",
        "&lescc;": "\u2AA8",
        "&lesdot;": "\u2A7F",
        "&lesdoto;": "\u2A81",
        "&lesdotor;": "\u2A83",
        "&lesg;": "\u22DA\uFE00",
        "&lesges;": "\u2A93",
        "&lessapprox;": "\u2A85",
        "&lessdot;": "\u22D6",
        "&lesseqgtr;": "\u22DA",
        "&lesseqqgtr;": "\u2A8B",
        "&lessgtr;": "\u2276",
        "&lesssim;": "\u2272",
        "&lfisht;": "\u297C",
        "&lfloor;": "\u230A",
        "&lfr;": "\u{1D529}",
        "&lg;": "\u2276",
        "&lgE;": "\u2A91",
        "&lhard;": "\u21BD",
        "&lharu;": "\u21BC",
        "&lharul;": "\u296A",
        "&lhblk;": "\u2584",
        "&ljcy;": "\u0459",
        "&ll;": "\u226A",
        "&llarr;": "\u21C7",
        "&llcorner;": "\u231E",
        "&llhard;": "\u296B",
        "&lltri;": "\u25FA",
        "&lmidot;": "\u0140",
        "&lmoust;": "\u23B0",
        "&lmoustache;": "\u23B0",
        "&lnE;": "\u2268",
        "&lnap;": "\u2A89",
        "&lnapprox;": "\u2A89",
        "&lne;": "\u2A87",
        "&lneq;": "\u2A87",
        "&lneqq;": "\u2268",
        "&lnsim;": "\u22E6",
        "&loang;": "\u27EC",
        "&loarr;": "\u21FD",
        "&lobrk;": "\u27E6",
        "&longleftarrow;": "\u27F5",
        "&longleftrightarrow;": "\u27F7",
        "&longmapsto;": "\u27FC",
        "&longrightarrow;": "\u27F6",
        "&looparrowleft;": "\u21AB",
        "&looparrowright;": "\u21AC",
        "&lopar;": "\u2985",
        "&lopf;": "\u{1D55D}",
        "&loplus;": "\u2A2D",
        "&lotimes;": "\u2A34",
        "&lowast;": "\u2217",
        "&lowbar;": "_",
        "&loz;": "\u25CA",
        "&lozenge;": "\u25CA",
        "&lozf;": "\u29EB",
        "&lpar;": "(",
        "&lparlt;": "\u2993",
        "&lrarr;": "\u21C6",
        "&lrcorner;": "\u231F",
        "&lrhar;": "\u21CB",
        "&lrhard;": "\u296D",
        "&lrm;": "\u200E",
        "&lrtri;": "\u22BF",
        "&lsaquo;": "\u2039",
        "&lscr;": "\u{1D4C1}",
        "&lsh;": "\u21B0",
        "&lsim;": "\u2272",
        "&lsime;": "\u2A8D",
        "&lsimg;": "\u2A8F",
        "&lsqb;": "[",
        "&lsquo;": "\u2018",
        "&lsquor;": "\u201A",
        "&lstrok;": "\u0142",
        "&lt": "<",
        "&lt;": "<",
        "&ltcc;": "\u2AA6",
        "&ltcir;": "\u2A79",
        "&ltdot;": "\u22D6",
        "&lthree;": "\u22CB",
        "&ltimes;": "\u22C9",
        "&ltlarr;": "\u2976",
        "&ltquest;": "\u2A7B",
        "&ltrPar;": "\u2996",
        "&ltri;": "\u25C3",
        "&ltrie;": "\u22B4",
        "&ltrif;": "\u25C2",
        "&lurdshar;": "\u294A",
        "&luruhar;": "\u2966",
        "&lvertneqq;": "\u2268\uFE00",
        "&lvnE;": "\u2268\uFE00",
        "&mDDot;": "\u223A",
        "&macr": "\xAF",
        "&macr;": "\xAF",
        "&male;": "\u2642",
        "&malt;": "\u2720",
        "&maltese;": "\u2720",
        "&map;": "\u21A6",
        "&mapsto;": "\u21A6",
        "&mapstodown;": "\u21A7",
        "&mapstoleft;": "\u21A4",
        "&mapstoup;": "\u21A5",
        "&marker;": "\u25AE",
        "&mcomma;": "\u2A29",
        "&mcy;": "\u043C",
        "&mdash;": "\u2014",
        "&measuredangle;": "\u2221",
        "&mfr;": "\u{1D52A}",
        "&mho;": "\u2127",
        "&micro": "\xB5",
        "&micro;": "\xB5",
        "&mid;": "\u2223",
        "&midast;": "*",
        "&midcir;": "\u2AF0",
        "&middot": "\xB7",
        "&middot;": "\xB7",
        "&minus;": "\u2212",
        "&minusb;": "\u229F",
        "&minusd;": "\u2238",
        "&minusdu;": "\u2A2A",
        "&mlcp;": "\u2ADB",
        "&mldr;": "\u2026",
        "&mnplus;": "\u2213",
        "&models;": "\u22A7",
        "&mopf;": "\u{1D55E}",
        "&mp;": "\u2213",
        "&mscr;": "\u{1D4C2}",
        "&mstpos;": "\u223E",
        "&mu;": "\u03BC",
        "&multimap;": "\u22B8",
        "&mumap;": "\u22B8",
        "&nGg;": "\u22D9\u0338",
        "&nGt;": "\u226B\u20D2",
        "&nGtv;": "\u226B\u0338",
        "&nLeftarrow;": "\u21CD",
        "&nLeftrightarrow;": "\u21CE",
        "&nLl;": "\u22D8\u0338",
        "&nLt;": "\u226A\u20D2",
        "&nLtv;": "\u226A\u0338",
        "&nRightarrow;": "\u21CF",
        "&nVDash;": "\u22AF",
        "&nVdash;": "\u22AE",
        "&nabla;": "\u2207",
        "&nacute;": "\u0144",
        "&nang;": "\u2220\u20D2",
        "&nap;": "\u2249",
        "&napE;": "\u2A70\u0338",
        "&napid;": "\u224B\u0338",
        "&napos;": "\u0149",
        "&napprox;": "\u2249",
        "&natur;": "\u266E",
        "&natural;": "\u266E",
        "&naturals;": "\u2115",
        "&nbsp": "\xA0",
        "&nbsp;": "\xA0",
        "&nbump;": "\u224E\u0338",
        "&nbumpe;": "\u224F\u0338",
        "&ncap;": "\u2A43",
        "&ncaron;": "\u0148",
        "&ncedil;": "\u0146",
        "&ncong;": "\u2247",
        "&ncongdot;": "\u2A6D\u0338",
        "&ncup;": "\u2A42",
        "&ncy;": "\u043D",
        "&ndash;": "\u2013",
        "&ne;": "\u2260",
        "&neArr;": "\u21D7",
        "&nearhk;": "\u2924",
        "&nearr;": "\u2197",
        "&nearrow;": "\u2197",
        "&nedot;": "\u2250\u0338",
        "&nequiv;": "\u2262",
        "&nesear;": "\u2928",
        "&nesim;": "\u2242\u0338",
        "&nexist;": "\u2204",
        "&nexists;": "\u2204",
        "&nfr;": "\u{1D52B}",
        "&ngE;": "\u2267\u0338",
        "&nge;": "\u2271",
        "&ngeq;": "\u2271",
        "&ngeqq;": "\u2267\u0338",
        "&ngeqslant;": "\u2A7E\u0338",
        "&nges;": "\u2A7E\u0338",
        "&ngsim;": "\u2275",
        "&ngt;": "\u226F",
        "&ngtr;": "\u226F",
        "&nhArr;": "\u21CE",
        "&nharr;": "\u21AE",
        "&nhpar;": "\u2AF2",
        "&ni;": "\u220B",
        "&nis;": "\u22FC",
        "&nisd;": "\u22FA",
        "&niv;": "\u220B",
        "&njcy;": "\u045A",
        "&nlArr;": "\u21CD",
        "&nlE;": "\u2266\u0338",
        "&nlarr;": "\u219A",
        "&nldr;": "\u2025",
        "&nle;": "\u2270",
        "&nleftarrow;": "\u219A",
        "&nleftrightarrow;": "\u21AE",
        "&nleq;": "\u2270",
        "&nleqq;": "\u2266\u0338",
        "&nleqslant;": "\u2A7D\u0338",
        "&nles;": "\u2A7D\u0338",
        "&nless;": "\u226E",
        "&nlsim;": "\u2274",
        "&nlt;": "\u226E",
        "&nltri;": "\u22EA",
        "&nltrie;": "\u22EC",
        "&nmid;": "\u2224",
        "&nopf;": "\u{1D55F}",
        "&not": "\xAC",
        "&not;": "\xAC",
        "&notin;": "\u2209",
        "&notinE;": "\u22F9\u0338",
        "&notindot;": "\u22F5\u0338",
        "&notinva;": "\u2209",
        "&notinvb;": "\u22F7",
        "&notinvc;": "\u22F6",
        "&notni;": "\u220C",
        "&notniva;": "\u220C",
        "&notnivb;": "\u22FE",
        "&notnivc;": "\u22FD",
        "&npar;": "\u2226",
        "&nparallel;": "\u2226",
        "&nparsl;": "\u2AFD\u20E5",
        "&npart;": "\u2202\u0338",
        "&npolint;": "\u2A14",
        "&npr;": "\u2280",
        "&nprcue;": "\u22E0",
        "&npre;": "\u2AAF\u0338",
        "&nprec;": "\u2280",
        "&npreceq;": "\u2AAF\u0338",
        "&nrArr;": "\u21CF",
        "&nrarr;": "\u219B",
        "&nrarrc;": "\u2933\u0338",
        "&nrarrw;": "\u219D\u0338",
        "&nrightarrow;": "\u219B",
        "&nrtri;": "\u22EB",
        "&nrtrie;": "\u22ED",
        "&nsc;": "\u2281",
        "&nsccue;": "\u22E1",
        "&nsce;": "\u2AB0\u0338",
        "&nscr;": "\u{1D4C3}",
        "&nshortmid;": "\u2224",
        "&nshortparallel;": "\u2226",
        "&nsim;": "\u2241",
        "&nsime;": "\u2244",
        "&nsimeq;": "\u2244",
        "&nsmid;": "\u2224",
        "&nspar;": "\u2226",
        "&nsqsube;": "\u22E2",
        "&nsqsupe;": "\u22E3",
        "&nsub;": "\u2284",
        "&nsubE;": "\u2AC5\u0338",
        "&nsube;": "\u2288",
        "&nsubset;": "\u2282\u20D2",
        "&nsubseteq;": "\u2288",
        "&nsubseteqq;": "\u2AC5\u0338",
        "&nsucc;": "\u2281",
        "&nsucceq;": "\u2AB0\u0338",
        "&nsup;": "\u2285",
        "&nsupE;": "\u2AC6\u0338",
        "&nsupe;": "\u2289",
        "&nsupset;": "\u2283\u20D2",
        "&nsupseteq;": "\u2289",
        "&nsupseteqq;": "\u2AC6\u0338",
        "&ntgl;": "\u2279",
        "&ntilde": "\xF1",
        "&ntilde;": "\xF1",
        "&ntlg;": "\u2278",
        "&ntriangleleft;": "\u22EA",
        "&ntrianglelefteq;": "\u22EC",
        "&ntriangleright;": "\u22EB",
        "&ntrianglerighteq;": "\u22ED",
        "&nu;": "\u03BD",
        "&num;": "#",
        "&numero;": "\u2116",
        "&numsp;": "\u2007",
        "&nvDash;": "\u22AD",
        "&nvHarr;": "\u2904",
        "&nvap;": "\u224D\u20D2",
        "&nvdash;": "\u22AC",
        "&nvge;": "\u2265\u20D2",
        "&nvgt;": ">\u20D2",
        "&nvinfin;": "\u29DE",
        "&nvlArr;": "\u2902",
        "&nvle;": "\u2264\u20D2",
        "&nvlt;": "<\u20D2",
        "&nvltrie;": "\u22B4\u20D2",
        "&nvrArr;": "\u2903",
        "&nvrtrie;": "\u22B5\u20D2",
        "&nvsim;": "\u223C\u20D2",
        "&nwArr;": "\u21D6",
        "&nwarhk;": "\u2923",
        "&nwarr;": "\u2196",
        "&nwarrow;": "\u2196",
        "&nwnear;": "\u2927",
        "&oS;": "\u24C8",
        "&oacute": "\xF3",
        "&oacute;": "\xF3",
        "&oast;": "\u229B",
        "&ocir;": "\u229A",
        "&ocirc": "\xF4",
        "&ocirc;": "\xF4",
        "&ocy;": "\u043E",
        "&odash;": "\u229D",
        "&odblac;": "\u0151",
        "&odiv;": "\u2A38",
        "&odot;": "\u2299",
        "&odsold;": "\u29BC",
        "&oelig;": "\u0153",
        "&ofcir;": "\u29BF",
        "&ofr;": "\u{1D52C}",
        "&ogon;": "\u02DB",
        "&ograve": "\xF2",
        "&ograve;": "\xF2",
        "&ogt;": "\u29C1",
        "&ohbar;": "\u29B5",
        "&ohm;": "\u03A9",
        "&oint;": "\u222E",
        "&olarr;": "\u21BA",
        "&olcir;": "\u29BE",
        "&olcross;": "\u29BB",
        "&oline;": "\u203E",
        "&olt;": "\u29C0",
        "&omacr;": "\u014D",
        "&omega;": "\u03C9",
        "&omicron;": "\u03BF",
        "&omid;": "\u29B6",
        "&ominus;": "\u2296",
        "&oopf;": "\u{1D560}",
        "&opar;": "\u29B7",
        "&operp;": "\u29B9",
        "&oplus;": "\u2295",
        "&or;": "\u2228",
        "&orarr;": "\u21BB",
        "&ord;": "\u2A5D",
        "&order;": "\u2134",
        "&orderof;": "\u2134",
        "&ordf": "\xAA",
        "&ordf;": "\xAA",
        "&ordm": "\xBA",
        "&ordm;": "\xBA",
        "&origof;": "\u22B6",
        "&oror;": "\u2A56",
        "&orslope;": "\u2A57",
        "&orv;": "\u2A5B",
        "&oscr;": "\u2134",
        "&oslash": "\xF8",
        "&oslash;": "\xF8",
        "&osol;": "\u2298",
        "&otilde": "\xF5",
        "&otilde;": "\xF5",
        "&otimes;": "\u2297",
        "&otimesas;": "\u2A36",
        "&ouml": "\xF6",
        "&ouml;": "\xF6",
        "&ovbar;": "\u233D",
        "&par;": "\u2225",
        "&para": "\xB6",
        "&para;": "\xB6",
        "&parallel;": "\u2225",
        "&parsim;": "\u2AF3",
        "&parsl;": "\u2AFD",
        "&part;": "\u2202",
        "&pcy;": "\u043F",
        "&percnt;": "%",
        "&period;": ".",
        "&permil;": "\u2030",
        "&perp;": "\u22A5",
        "&pertenk;": "\u2031",
        "&pfr;": "\u{1D52D}",
        "&phi;": "\u03C6",
        "&phiv;": "\u03D5",
        "&phmmat;": "\u2133",
        "&phone;": "\u260E",
        "&pi;": "\u03C0",
        "&pitchfork;": "\u22D4",
        "&piv;": "\u03D6",
        "&planck;": "\u210F",
        "&planckh;": "\u210E",
        "&plankv;": "\u210F",
        "&plus;": "+",
        "&plusacir;": "\u2A23",
        "&plusb;": "\u229E",
        "&pluscir;": "\u2A22",
        "&plusdo;": "\u2214",
        "&plusdu;": "\u2A25",
        "&pluse;": "\u2A72",
        "&plusmn": "\xB1",
        "&plusmn;": "\xB1",
        "&plussim;": "\u2A26",
        "&plustwo;": "\u2A27",
        "&pm;": "\xB1",
        "&pointint;": "\u2A15",
        "&popf;": "\u{1D561}",
        "&pound": "\xA3",
        "&pound;": "\xA3",
        "&pr;": "\u227A",
        "&prE;": "\u2AB3",
        "&prap;": "\u2AB7",
        "&prcue;": "\u227C",
        "&pre;": "\u2AAF",
        "&prec;": "\u227A",
        "&precapprox;": "\u2AB7",
        "&preccurlyeq;": "\u227C",
        "&preceq;": "\u2AAF",
        "&precnapprox;": "\u2AB9",
        "&precneqq;": "\u2AB5",
        "&precnsim;": "\u22E8",
        "&precsim;": "\u227E",
        "&prime;": "\u2032",
        "&primes;": "\u2119",
        "&prnE;": "\u2AB5",
        "&prnap;": "\u2AB9",
        "&prnsim;": "\u22E8",
        "&prod;": "\u220F",
        "&profalar;": "\u232E",
        "&profline;": "\u2312",
        "&profsurf;": "\u2313",
        "&prop;": "\u221D",
        "&propto;": "\u221D",
        "&prsim;": "\u227E",
        "&prurel;": "\u22B0",
        "&pscr;": "\u{1D4C5}",
        "&psi;": "\u03C8",
        "&puncsp;": "\u2008",
        "&qfr;": "\u{1D52E}",
        "&qint;": "\u2A0C",
        "&qopf;": "\u{1D562}",
        "&qprime;": "\u2057",
        "&qscr;": "\u{1D4C6}",
        "&quaternions;": "\u210D",
        "&quatint;": "\u2A16",
        "&quest;": "?",
        "&questeq;": "\u225F",
        "&quot": '"',
        "&quot;": '"',
        "&rAarr;": "\u21DB",
        "&rArr;": "\u21D2",
        "&rAtail;": "\u291C",
        "&rBarr;": "\u290F",
        "&rHar;": "\u2964",
        "&race;": "\u223D\u0331",
        "&racute;": "\u0155",
        "&radic;": "\u221A",
        "&raemptyv;": "\u29B3",
        "&rang;": "\u27E9",
        "&rangd;": "\u2992",
        "&range;": "\u29A5",
        "&rangle;": "\u27E9",
        "&raquo": "\xBB",
        "&raquo;": "\xBB",
        "&rarr;": "\u2192",
        "&rarrap;": "\u2975",
        "&rarrb;": "\u21E5",
        "&rarrbfs;": "\u2920",
        "&rarrc;": "\u2933",
        "&rarrfs;": "\u291E",
        "&rarrhk;": "\u21AA",
        "&rarrlp;": "\u21AC",
        "&rarrpl;": "\u2945",
        "&rarrsim;": "\u2974",
        "&rarrtl;": "\u21A3",
        "&rarrw;": "\u219D",
        "&ratail;": "\u291A",
        "&ratio;": "\u2236",
        "&rationals;": "\u211A",
        "&rbarr;": "\u290D",
        "&rbbrk;": "\u2773",
        "&rbrace;": "}",
        "&rbrack;": "]",
        "&rbrke;": "\u298C",
        "&rbrksld;": "\u298E",
        "&rbrkslu;": "\u2990",
        "&rcaron;": "\u0159",
        "&rcedil;": "\u0157",
        "&rceil;": "\u2309",
        "&rcub;": "}",
        "&rcy;": "\u0440",
        "&rdca;": "\u2937",
        "&rdldhar;": "\u2969",
        "&rdquo;": "\u201D",
        "&rdquor;": "\u201D",
        "&rdsh;": "\u21B3",
        "&real;": "\u211C",
        "&realine;": "\u211B",
        "&realpart;": "\u211C",
        "&reals;": "\u211D",
        "&rect;": "\u25AD",
        "&reg": "\xAE",
        "&reg;": "\xAE",
        "&rfisht;": "\u297D",
        "&rfloor;": "\u230B",
        "&rfr;": "\u{1D52F}",
        "&rhard;": "\u21C1",
        "&rharu;": "\u21C0",
        "&rharul;": "\u296C",
        "&rho;": "\u03C1",
        "&rhov;": "\u03F1",
        "&rightarrow;": "\u2192",
        "&rightarrowtail;": "\u21A3",
        "&rightharpoondown;": "\u21C1",
        "&rightharpoonup;": "\u21C0",
        "&rightleftarrows;": "\u21C4",
        "&rightleftharpoons;": "\u21CC",
        "&rightrightarrows;": "\u21C9",
        "&rightsquigarrow;": "\u219D",
        "&rightthreetimes;": "\u22CC",
        "&ring;": "\u02DA",
        "&risingdotseq;": "\u2253",
        "&rlarr;": "\u21C4",
        "&rlhar;": "\u21CC",
        "&rlm;": "\u200F",
        "&rmoust;": "\u23B1",
        "&rmoustache;": "\u23B1",
        "&rnmid;": "\u2AEE",
        "&roang;": "\u27ED",
        "&roarr;": "\u21FE",
        "&robrk;": "\u27E7",
        "&ropar;": "\u2986",
        "&ropf;": "\u{1D563}",
        "&roplus;": "\u2A2E",
        "&rotimes;": "\u2A35",
        "&rpar;": ")",
        "&rpargt;": "\u2994",
        "&rppolint;": "\u2A12",
        "&rrarr;": "\u21C9",
        "&rsaquo;": "\u203A",
        "&rscr;": "\u{1D4C7}",
        "&rsh;": "\u21B1",
        "&rsqb;": "]",
        "&rsquo;": "\u2019",
        "&rsquor;": "\u2019",
        "&rthree;": "\u22CC",
        "&rtimes;": "\u22CA",
        "&rtri;": "\u25B9",
        "&rtrie;": "\u22B5",
        "&rtrif;": "\u25B8",
        "&rtriltri;": "\u29CE",
        "&ruluhar;": "\u2968",
        "&rx;": "\u211E",
        "&sacute;": "\u015B",
        "&sbquo;": "\u201A",
        "&sc;": "\u227B",
        "&scE;": "\u2AB4",
        "&scap;": "\u2AB8",
        "&scaron;": "\u0161",
        "&sccue;": "\u227D",
        "&sce;": "\u2AB0",
        "&scedil;": "\u015F",
        "&scirc;": "\u015D",
        "&scnE;": "\u2AB6",
        "&scnap;": "\u2ABA",
        "&scnsim;": "\u22E9",
        "&scpolint;": "\u2A13",
        "&scsim;": "\u227F",
        "&scy;": "\u0441",
        "&sdot;": "\u22C5",
        "&sdotb;": "\u22A1",
        "&sdote;": "\u2A66",
        "&seArr;": "\u21D8",
        "&searhk;": "\u2925",
        "&searr;": "\u2198",
        "&searrow;": "\u2198",
        "&sect": "\xA7",
        "&sect;": "\xA7",
        "&semi;": ";",
        "&seswar;": "\u2929",
        "&setminus;": "\u2216",
        "&setmn;": "\u2216",
        "&sext;": "\u2736",
        "&sfr;": "\u{1D530}",
        "&sfrown;": "\u2322",
        "&sharp;": "\u266F",
        "&shchcy;": "\u0449",
        "&shcy;": "\u0448",
        "&shortmid;": "\u2223",
        "&shortparallel;": "\u2225",
        "&shy": "\xAD",
        "&shy;": "\xAD",
        "&sigma;": "\u03C3",
        "&sigmaf;": "\u03C2",
        "&sigmav;": "\u03C2",
        "&sim;": "\u223C",
        "&simdot;": "\u2A6A",
        "&sime;": "\u2243",
        "&simeq;": "\u2243",
        "&simg;": "\u2A9E",
        "&simgE;": "\u2AA0",
        "&siml;": "\u2A9D",
        "&simlE;": "\u2A9F",
        "&simne;": "\u2246",
        "&simplus;": "\u2A24",
        "&simrarr;": "\u2972",
        "&slarr;": "\u2190",
        "&smallsetminus;": "\u2216",
        "&smashp;": "\u2A33",
        "&smeparsl;": "\u29E4",
        "&smid;": "\u2223",
        "&smile;": "\u2323",
        "&smt;": "\u2AAA",
        "&smte;": "\u2AAC",
        "&smtes;": "\u2AAC\uFE00",
        "&softcy;": "\u044C",
        "&sol;": "/",
        "&solb;": "\u29C4",
        "&solbar;": "\u233F",
        "&sopf;": "\u{1D564}",
        "&spades;": "\u2660",
        "&spadesuit;": "\u2660",
        "&spar;": "\u2225",
        "&sqcap;": "\u2293",
        "&sqcaps;": "\u2293\uFE00",
        "&sqcup;": "\u2294",
        "&sqcups;": "\u2294\uFE00",
        "&sqsub;": "\u228F",
        "&sqsube;": "\u2291",
        "&sqsubset;": "\u228F",
        "&sqsubseteq;": "\u2291",
        "&sqsup;": "\u2290",
        "&sqsupe;": "\u2292",
        "&sqsupset;": "\u2290",
        "&sqsupseteq;": "\u2292",
        "&squ;": "\u25A1",
        "&square;": "\u25A1",
        "&squarf;": "\u25AA",
        "&squf;": "\u25AA",
        "&srarr;": "\u2192",
        "&sscr;": "\u{1D4C8}",
        "&ssetmn;": "\u2216",
        "&ssmile;": "\u2323",
        "&sstarf;": "\u22C6",
        "&star;": "\u2606",
        "&starf;": "\u2605",
        "&straightepsilon;": "\u03F5",
        "&straightphi;": "\u03D5",
        "&strns;": "\xAF",
        "&sub;": "\u2282",
        "&subE;": "\u2AC5",
        "&subdot;": "\u2ABD",
        "&sube;": "\u2286",
        "&subedot;": "\u2AC3",
        "&submult;": "\u2AC1",
        "&subnE;": "\u2ACB",
        "&subne;": "\u228A",
        "&subplus;": "\u2ABF",
        "&subrarr;": "\u2979",
        "&subset;": "\u2282",
        "&subseteq;": "\u2286",
        "&subseteqq;": "\u2AC5",
        "&subsetneq;": "\u228A",
        "&subsetneqq;": "\u2ACB",
        "&subsim;": "\u2AC7",
        "&subsub;": "\u2AD5",
        "&subsup;": "\u2AD3",
        "&succ;": "\u227B",
        "&succapprox;": "\u2AB8",
        "&succcurlyeq;": "\u227D",
        "&succeq;": "\u2AB0",
        "&succnapprox;": "\u2ABA",
        "&succneqq;": "\u2AB6",
        "&succnsim;": "\u22E9",
        "&succsim;": "\u227F",
        "&sum;": "\u2211",
        "&sung;": "\u266A",
        "&sup1": "\xB9",
        "&sup1;": "\xB9",
        "&sup2": "\xB2",
        "&sup2;": "\xB2",
        "&sup3": "\xB3",
        "&sup3;": "\xB3",
        "&sup;": "\u2283",
        "&supE;": "\u2AC6",
        "&supdot;": "\u2ABE",
        "&supdsub;": "\u2AD8",
        "&supe;": "\u2287",
        "&supedot;": "\u2AC4",
        "&suphsol;": "\u27C9",
        "&suphsub;": "\u2AD7",
        "&suplarr;": "\u297B",
        "&supmult;": "\u2AC2",
        "&supnE;": "\u2ACC",
        "&supne;": "\u228B",
        "&supplus;": "\u2AC0",
        "&supset;": "\u2283",
        "&supseteq;": "\u2287",
        "&supseteqq;": "\u2AC6",
        "&supsetneq;": "\u228B",
        "&supsetneqq;": "\u2ACC",
        "&supsim;": "\u2AC8",
        "&supsub;": "\u2AD4",
        "&supsup;": "\u2AD6",
        "&swArr;": "\u21D9",
        "&swarhk;": "\u2926",
        "&swarr;": "\u2199",
        "&swarrow;": "\u2199",
        "&swnwar;": "\u292A",
        "&szlig": "\xDF",
        "&szlig;": "\xDF",
        "&target;": "\u2316",
        "&tau;": "\u03C4",
        "&tbrk;": "\u23B4",
        "&tcaron;": "\u0165",
        "&tcedil;": "\u0163",
        "&tcy;": "\u0442",
        "&tdot;": "\u20DB",
        "&telrec;": "\u2315",
        "&tfr;": "\u{1D531}",
        "&there4;": "\u2234",
        "&therefore;": "\u2234",
        "&theta;": "\u03B8",
        "&thetasym;": "\u03D1",
        "&thetav;": "\u03D1",
        "&thickapprox;": "\u2248",
        "&thicksim;": "\u223C",
        "&thinsp;": "\u2009",
        "&thkap;": "\u2248",
        "&thksim;": "\u223C",
        "&thorn": "\xFE",
        "&thorn;": "\xFE",
        "&tilde;": "\u02DC",
        "&times": "\xD7",
        "&times;": "\xD7",
        "&timesb;": "\u22A0",
        "&timesbar;": "\u2A31",
        "&timesd;": "\u2A30",
        "&tint;": "\u222D",
        "&toea;": "\u2928",
        "&top;": "\u22A4",
        "&topbot;": "\u2336",
        "&topcir;": "\u2AF1",
        "&topf;": "\u{1D565}",
        "&topfork;": "\u2ADA",
        "&tosa;": "\u2929",
        "&tprime;": "\u2034",
        "&trade;": "\u2122",
        "&triangle;": "\u25B5",
        "&triangledown;": "\u25BF",
        "&triangleleft;": "\u25C3",
        "&trianglelefteq;": "\u22B4",
        "&triangleq;": "\u225C",
        "&triangleright;": "\u25B9",
        "&trianglerighteq;": "\u22B5",
        "&tridot;": "\u25EC",
        "&trie;": "\u225C",
        "&triminus;": "\u2A3A",
        "&triplus;": "\u2A39",
        "&trisb;": "\u29CD",
        "&tritime;": "\u2A3B",
        "&trpezium;": "\u23E2",
        "&tscr;": "\u{1D4C9}",
        "&tscy;": "\u0446",
        "&tshcy;": "\u045B",
        "&tstrok;": "\u0167",
        "&twixt;": "\u226C",
        "&twoheadleftarrow;": "\u219E",
        "&twoheadrightarrow;": "\u21A0",
        "&uArr;": "\u21D1",
        "&uHar;": "\u2963",
        "&uacute": "\xFA",
        "&uacute;": "\xFA",
        "&uarr;": "\u2191",
        "&ubrcy;": "\u045E",
        "&ubreve;": "\u016D",
        "&ucirc": "\xFB",
        "&ucirc;": "\xFB",
        "&ucy;": "\u0443",
        "&udarr;": "\u21C5",
        "&udblac;": "\u0171",
        "&udhar;": "\u296E",
        "&ufisht;": "\u297E",
        "&ufr;": "\u{1D532}",
        "&ugrave": "\xF9",
        "&ugrave;": "\xF9",
        "&uharl;": "\u21BF",
        "&uharr;": "\u21BE",
        "&uhblk;": "\u2580",
        "&ulcorn;": "\u231C",
        "&ulcorner;": "\u231C",
        "&ulcrop;": "\u230F",
        "&ultri;": "\u25F8",
        "&umacr;": "\u016B",
        "&uml": "\xA8",
        "&uml;": "\xA8",
        "&uogon;": "\u0173",
        "&uopf;": "\u{1D566}",
        "&uparrow;": "\u2191",
        "&updownarrow;": "\u2195",
        "&upharpoonleft;": "\u21BF",
        "&upharpoonright;": "\u21BE",
        "&uplus;": "\u228E",
        "&upsi;": "\u03C5",
        "&upsih;": "\u03D2",
        "&upsilon;": "\u03C5",
        "&upuparrows;": "\u21C8",
        "&urcorn;": "\u231D",
        "&urcorner;": "\u231D",
        "&urcrop;": "\u230E",
        "&uring;": "\u016F",
        "&urtri;": "\u25F9",
        "&uscr;": "\u{1D4CA}",
        "&utdot;": "\u22F0",
        "&utilde;": "\u0169",
        "&utri;": "\u25B5",
        "&utrif;": "\u25B4",
        "&uuarr;": "\u21C8",
        "&uuml": "\xFC",
        "&uuml;": "\xFC",
        "&uwangle;": "\u29A7",
        "&vArr;": "\u21D5",
        "&vBar;": "\u2AE8",
        "&vBarv;": "\u2AE9",
        "&vDash;": "\u22A8",
        "&vangrt;": "\u299C",
        "&varepsilon;": "\u03F5",
        "&varkappa;": "\u03F0",
        "&varnothing;": "\u2205",
        "&varphi;": "\u03D5",
        "&varpi;": "\u03D6",
        "&varpropto;": "\u221D",
        "&varr;": "\u2195",
        "&varrho;": "\u03F1",
        "&varsigma;": "\u03C2",
        "&varsubsetneq;": "\u228A\uFE00",
        "&varsubsetneqq;": "\u2ACB\uFE00",
        "&varsupsetneq;": "\u228B\uFE00",
        "&varsupsetneqq;": "\u2ACC\uFE00",
        "&vartheta;": "\u03D1",
        "&vartriangleleft;": "\u22B2",
        "&vartriangleright;": "\u22B3",
        "&vcy;": "\u0432",
        "&vdash;": "\u22A2",
        "&vee;": "\u2228",
        "&veebar;": "\u22BB",
        "&veeeq;": "\u225A",
        "&vellip;": "\u22EE",
        "&verbar;": "|",
        "&vert;": "|",
        "&vfr;": "\u{1D533}",
        "&vltri;": "\u22B2",
        "&vnsub;": "\u2282\u20D2",
        "&vnsup;": "\u2283\u20D2",
        "&vopf;": "\u{1D567}",
        "&vprop;": "\u221D",
        "&vrtri;": "\u22B3",
        "&vscr;": "\u{1D4CB}",
        "&vsubnE;": "\u2ACB\uFE00",
        "&vsubne;": "\u228A\uFE00",
        "&vsupnE;": "\u2ACC\uFE00",
        "&vsupne;": "\u228B\uFE00",
        "&vzigzag;": "\u299A",
        "&wcirc;": "\u0175",
        "&wedbar;": "\u2A5F",
        "&wedge;": "\u2227",
        "&wedgeq;": "\u2259",
        "&weierp;": "\u2118",
        "&wfr;": "\u{1D534}",
        "&wopf;": "\u{1D568}",
        "&wp;": "\u2118",
        "&wr;": "\u2240",
        "&wreath;": "\u2240",
        "&wscr;": "\u{1D4CC}",
        "&xcap;": "\u22C2",
        "&xcirc;": "\u25EF",
        "&xcup;": "\u22C3",
        "&xdtri;": "\u25BD",
        "&xfr;": "\u{1D535}",
        "&xhArr;": "\u27FA",
        "&xharr;": "\u27F7",
        "&xi;": "\u03BE",
        "&xlArr;": "\u27F8",
        "&xlarr;": "\u27F5",
        "&xmap;": "\u27FC",
        "&xnis;": "\u22FB",
        "&xodot;": "\u2A00",
        "&xopf;": "\u{1D569}",
        "&xoplus;": "\u2A01",
        "&xotime;": "\u2A02",
        "&xrArr;": "\u27F9",
        "&xrarr;": "\u27F6",
        "&xscr;": "\u{1D4CD}",
        "&xsqcup;": "\u2A06",
        "&xuplus;": "\u2A04",
        "&xutri;": "\u25B3",
        "&xvee;": "\u22C1",
        "&xwedge;": "\u22C0",
        "&yacute": "\xFD",
        "&yacute;": "\xFD",
        "&yacy;": "\u044F",
        "&ycirc;": "\u0177",
        "&ycy;": "\u044B",
        "&yen": "\xA5",
        "&yen;": "\xA5",
        "&yfr;": "\u{1D536}",
        "&yicy;": "\u0457",
        "&yopf;": "\u{1D56A}",
        "&yscr;": "\u{1D4CE}",
        "&yucy;": "\u044E",
        "&yuml": "\xFF",
        "&yuml;": "\xFF",
        "&zacute;": "\u017A",
        "&zcaron;": "\u017E",
        "&zcy;": "\u0437",
        "&zdot;": "\u017C",
        "&zeetrf;": "\u2128",
        "&zeta;": "\u03B6",
        "&zfr;": "\u{1D537}",
        "&zhcy;": "\u0436",
        "&zigrarr;": "\u21DD",
        "&zopf;": "\u{1D56B}",
        "&zscr;": "\u{1D4CF}",
        "&zwj;": "\u200D",
        "&zwnj;": "\u200C"
      };
      return {
        convert: (entity) => {
          var _a;
          if (!/^&.*;$/.test(entity)) {
            return entity;
          } else {
            let decCodeMatch = /^&#(\d+);$/.exec(entity);
            if (decCodeMatch) {
              return String.fromCodePoint(Number(decCodeMatch[1]));
            } else {
              let hexCodeMatch = /^&#x([\da-f]+);/.exec(entity);
              if (hexCodeMatch) {
                return String.fromCodePoint(Number("0x" + hexCodeMatch[1]));
              } else {
                return (_a = namedEntities[entity]) != null ? _a : entity;
              }
            }
          }
        }
      };
    })();
  }
});

// engine/dist.node/evaluation/implementations/helpers/number-to-roman-converter.js
var require_number_to_roman_converter = __commonJS({
  "engine/dist.node/evaluation/implementations/helpers/number-to-roman-converter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberToRomanConverter = void 0;
    exports.NumberToRomanConverter = (() => {
      const maxConvertible = 1e3 * 1e3;
      const ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
      const tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
      const hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
      return {
        max: maxConvertible,
        convert: (n) => {
          if (n < 0)
            throw new Error(`Can only convert positive numbers.`);
          else if (n > maxConvertible)
            throw new Error(`Number ${n} is too big for conversion. Max is ${maxConvertible}.`);
          const thousandsCount = Math.floor(n / 1e3);
          const hundredsCount = Math.floor(n % 1e3 / 100);
          const tensCount = Math.floor(n % 100 / 10);
          const onesCount = Math.floor(n % 10);
          return "M".repeat(thousandsCount) + hundreds[hundredsCount] + tens[tensCount] + ones[onesCount];
        }
      };
    })();
  }
});

// engine/dist.node/evaluation/implementations/helpers/ordinal-suffix-helper.js
var require_ordinal_suffix_helper = __commonJS({
  "engine/dist.node/evaluation/implementations/helpers/ordinal-suffix-helper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrdinalSuffixHelper = void 0;
    exports.OrdinalSuffixHelper = (() => {
      const suffixForDigit = (digit) => {
        if (digit === 1)
          return "st";
        else if (digit === 2)
          return "nd";
        else if (digit === 3)
          return "rd";
        else
          return "th";
      };
      return {
        getSuffix: (number) => {
          number = Math.abs(number);
          if (number <= 9)
            return suffixForDigit(number);
          else if (number < 20)
            return "th";
          else
            return suffixForDigit(number % 10);
        }
      };
    })();
  }
});

// engine/dist.node/evaluation/implementations/functions/tc-function.js
var require_tc_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/tc-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TcFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var html_entitity_converter_js_1 = require_html_entitity_converter();
    var number_to_roman_converter_js_1 = require_number_to_roman_converter();
    var number_to_text_converter_js_1 = require_number_to_text_converter();
    var ordinal_suffix_helper_js_1 = require_ordinal_suffix_helper();
    var text_capitalizer_js_1 = require_text_capitalizer();
    var TcFunction2 = class extends kodeine_js_1.KodeFunctionWithModes {
      getName() {
        return "tc";
      }
      static _cut(text, startOrLength, length) {
        if (length) {
          if (length === 0)
            return "";
          else if (length > 0)
            if (startOrLength >= 0)
              return text.substring(startOrLength, startOrLength + length);
            else if (length >= Math.abs(startOrLength))
              return "";
            else
              return text.substring(text.length + startOrLength, length);
          else if (startOrLength > 0)
            if (length === -1 || Math.abs(length) <= startOrLength)
              return "";
            else
              return text.substring(startOrLength, startOrLength + text.length + length);
          else if (startOrLength === 0)
            return text.substring(0, text.length + length);
          else
            return "";
        } else {
          if (startOrLength >= 0)
            return text.substring(0, startOrLength);
          else
            return text.substring(text.length + startOrLength);
        }
      }
      constructor() {
        super();
        this.mode("low", ["txt text"], function(text) {
          return text.toLowerCase();
        });
        this.mode("up", ["txt text"], function(text) {
          return text.toUpperCase();
        });
        this.mode("cap", ["txt text"], function(text) {
          if (text === "") {
            throw new kodeine_js_1.InvalidArgumentError("tc(cap)", "text", 1, this.call.args[1], text, 'Kustom will throw "string index out of range: 1" when attempting to capitalize an empty string. This does not seem to affect function evaluation.');
          }
          return text_capitalizer_js_1.TextCapitalizer.capitalize(text);
        });
        this.mode("cut", ["txt text", "num startOrLength", "num length?"], function(text, startOrLength, length) {
          return TcFunction2._cut(text, startOrLength, length);
        });
        this.mode("ell", ["txt text", "num startOrLength", "num length?"], function(text, startOrLength, length) {
          let output = TcFunction2._cut(text, startOrLength, length);
          if (output != "" && output.length < text.length)
            return output + "...";
          else
            return output;
        });
        this.mode("count", ["txt text", "txt searchFor"], function(text, searchFor) {
          let count = 0;
          for (let i = 0; i < text.length - searchFor.length + 1; i++) {
            if (text[i] == searchFor[0] && text.substring(i, i + searchFor.length) == searchFor) {
              count++;
              i += searchFor.length - 1;
            }
          }
          return count;
        });
        this.mode("utf", ["txt hexCode"], function(hexCode) {
          let parsedCode = Number("0x" + hexCode);
          if (isNaN(parsedCode)) {
            throw new kodeine_js_1.InvalidArgumentError(`tc(utf)`, "hexCode", 1, this.call.args[1], hexCode, "Value could not be parsed as a hexadecimal number.");
          } else {
            try {
              return String.fromCodePoint(parsedCode);
            } catch (err) {
              throw new kodeine_js_1.InvalidArgumentError(`tc(utf)`, "hexCode", 1, this.call.args[1], hexCode, "Value is not a valid character code: " + err.message);
            }
          }
        });
        this.mode("len", ["txt text"], function(text) {
          return text.length;
        });
        this.mode("n2w", ["txt text"], function(text) {
          let expr = /-?\d+/g;
          return text.replace(expr, (match) => {
            let num = Number(match);
            if (isNaN(num)) {
              this.evalCtx.sideEffects.warnings.push(new kodeine_js_1.EvaluationWarning(this.call.args[1], `Number ${match} could not be parsed.`));
              return match;
            } else {
              if (-num > number_to_text_converter_js_1.NumberToTextConverter.max) {
                throw new kodeine_js_1.InvalidArgumentError("tc(n2w)", "text", 1, this.call.args[1], match, `Negative numbers throw an error when their absolute value is greater than the max value for a signed 32 bit integer (${number_to_text_converter_js_1.NumberToTextConverter.max}).`);
              }
              return (num < 0 ? "-" : "") + number_to_text_converter_js_1.NumberToTextConverter.convert(Math.min(Math.abs(num), number_to_text_converter_js_1.NumberToTextConverter.max));
            }
          });
        });
        this.mode("ord", ["num number"], function(number) {
          return ordinal_suffix_helper_js_1.OrdinalSuffixHelper.getSuffix(number);
        });
        this.mode("roman", ["txt text"], function(text) {
          let expr = /-?\d+/g;
          return text.replace(expr, (match) => {
            let num = Number(match);
            if (isNaN(num)) {
              this.evalCtx.sideEffects.warnings.push(new kodeine_js_1.EvaluationWarning(this.call.args[1], `Number ${match} could not be parsed.`));
              return match;
            } else {
              if (Math.abs(num) > number_to_roman_converter_js_1.NumberToRomanConverter.max) {
                throw new kodeine_js_1.InvalidArgumentError("tc(roman)", "text", 1, this.call.args[1], match, `Number ${match} is greater than the maximum for tc(roman) (${number_to_text_converter_js_1.NumberToTextConverter.max}). Each decimal digit you add to your number increases the number of Ms (roman numeral for 1,000) in the output exponentially. To illustrate, 1,000,000 results in 1,000 Ms, 10,000,000 results in 10,000 Ms and 100,000,000 results in 100,000 Ms. TL;DR: Kustom will crash.`);
              }
              return (num < 0 ? "-" : "") + number_to_roman_converter_js_1.NumberToRomanConverter.convert(Math.abs(num));
            }
          });
        });
        this.mode("lpad", ["txt text", "num targetLength", "txt padWith?"], function(text, targetLength, padWith) {
          if (text.length >= targetLength) {
            return text;
          } else {
            padWith != null ? padWith : padWith = "0";
            let fullRepeatCount = Math.floor((targetLength - text.length) / padWith.length);
            let additionalCharCount = targetLength - text.length - fullRepeatCount * padWith.length;
            return padWith.repeat(fullRepeatCount) + padWith.substring(0, additionalCharCount) + text;
          }
        });
        this.mode("rpad", ["txt text", "num targetLength", "txt padWith?"], function(text, targetLength, padWith) {
          if (text.length >= targetLength) {
            return text;
          } else {
            padWith != null ? padWith : padWith = "0";
            let fullRepeatCount = Math.floor((targetLength - text.length) / padWith.length);
            let additionalCharCount = targetLength - text.length - fullRepeatCount * padWith.length;
            return text + padWith.repeat(fullRepeatCount) + padWith.substring(0, additionalCharCount);
          }
        });
        this.mode("split", ["txt text", "txt splitBy", "num index"], function(text, splitBy, index) {
          var _a;
          if (index < 0) {
            throw new kodeine_js_1.InvalidArgumentError("tc(split)", "index", 3, this.call.args[3], index, 'Kustom will throw "length=[split element count]; index=[passed index];" when passing a negative index to tc(split). Note that this does not happen when the passed index is greater than or equal to [split element count].');
          }
          return (_a = text.split(splitBy).filter((s) => s !== "")[index]) != null ? _a : "";
        });
        this.mode("reg", ["txt text", "txt pattern", "txt replacement"], function(text, pattern, replacement) {
          try {
            let expr = new RegExp(pattern, "g");
            let hadErrors = false;
            let result = text.replace(expr, (...sourceMatchArgs) => {
              let sourceMatchGroupCount = sourceMatchArgs.length - 3;
              return replacement.replace(/(\\*)\$(\d)|(\\+)/g, (groupMatch, backslashes, digit) => {
                backslashes != null ? backslashes : backslashes = groupMatch;
                let outBackslashes = "\\".repeat(Math.floor((backslashes != null ? backslashes : groupMatch).length / 2));
                if (backslashes.length % 2 === 0) {
                  if (digit) {
                    let groupNumber = Number(digit);
                    if (groupNumber > sourceMatchGroupCount) {
                      this.evalCtx.sideEffects.errors.push(new kodeine_js_1.EvaluationError(this.call.args[3], `Replacement contains a reference to a group index that wasn't captured (captured ${sourceMatchGroupCount} group${sourceMatchGroupCount === 1 ? "" : "s"}, referenced group $${digit}). tc(reg) will return an empty string.`));
                      hadErrors = true;
                      return outBackslashes + `$${digit}`;
                    } else {
                      return outBackslashes + sourceMatchArgs[groupNumber];
                    }
                  } else {
                    return outBackslashes;
                  }
                } else {
                  if (digit)
                    return outBackslashes + `$${digit}`;
                  else
                    return outBackslashes;
                }
              });
            });
            return hadErrors ? "" : result;
          } catch (err) {
            throw new kodeine_js_1.RegexEvaluationError(this.call.args[2], err.message);
          }
        });
        this.mode("html", ["txt text"], function(text) {
          this.evalCtx.sideEffects.warnings.push(new kodeine_js_1.EvaluationWarning(this.call, "tc(html) is not implemented accurately. You might see significant differences when running your formula in Kustom."));
          return text.replace(/<[^>]+?>/g, "").replace(/&.*?;/g, (match) => html_entitity_converter_js_1.HtmlEntityConverter.convert(match));
        });
        this.mode("url", ["txt text", "txt encoding?"], function(text, encoding) {
          if (encoding) {
            this.evalCtx.sideEffects.warnings.push(new kodeine_js_1.EvaluationWarning(this.call.args[2], "This argument currently does nothing in kodeine. Known values accepted by Kustom are ascii, unicode, utf8, utf16 and utf32, other values throw an error."));
          }
          return encodeURIComponent(text);
        });
        this.mode("nfmt", ["txt text"], function(text) {
          if (/\.\.+/.test(text)) {
            throw new kodeine_js_1.InvalidArgumentError("tc(nmft)", "text", 1, this.call.args[1], text, 'Kustom throws "tc: multiple points" when there are two or more consecutive points (.) anywhere in the input string.');
          }
          let expr = /-?(\d+\.?\d*|\d*\.?\d+)/g;
          return text.replace(expr, (match) => {
            let num = Number(match);
            if (isNaN(num)) {
              this.evalCtx.sideEffects.warnings.push(new kodeine_js_1.EvaluationWarning(this.call.args[1], `Number ${match} could not be parsed.`));
              return match;
            } else {
              return num.toLocaleString();
            }
          });
        });
        this.mode("lines", ["txt text"], function(text) {
          let count = 1;
          let currentPos = 0;
          while (currentPos != -1) {
            currentPos = text.indexOf("\n", currentPos);
            if (currentPos >= 0) {
              count++;
              currentPos++;
            }
          }
          return count;
        });
        this.mode("type", ["txt text"], function(text) {
          if (!text || !text.trim()) {
            return "LATIN";
          } else {
            let num = Number(text);
            if (!isNaN(num)) {
              return "NUMBER";
            } else if (/[\u0600-\u06FF]/.test(text)) {
              return "ARABIC";
            } else if (/[\u0400-\u04FF]/.test(text)) {
              return "CYRILLIC";
            } else if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(text)) {
              return "GREEK";
            } else if (/[\u3040-\u309f]/.test(text)) {
              return "HIRAGANA";
            } else if (/[\u30a0-\u30ff\uff00-\uff9f]/.test(text)) {
              return "KATAKANA";
            } else if (/[\u4e00-\u9faf\u3400-\u4dbf]/.test(text)) {
              return "CJK";
            } else {
              return "LATIN";
            }
          }
        });
      }
    };
    exports.TcFunction = TcFunction2;
  }
});

// engine/dist.node/evaluation/implementations/helpers/timespan.js
var require_timespan = __commonJS({
  "engine/dist.node/evaluation/implementations/helpers/timespan.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeSpan = void 0;
    function floorAndPad(source, targetLength) {
      const sourceString = Math.floor(source).toString();
      if (sourceString.length >= targetLength)
        return sourceString;
      else
        return "0".repeat(targetLength - sourceString.length) + sourceString;
    }
    var formatTokens = {
      "D": (timespan, match) => floorAndPad(timespan.totalDays, match.length),
      "H": (timespan, match) => floorAndPad(timespan.totalHours, match.length),
      "M": (timespan, match) => floorAndPad(timespan.totalMinutes, match.length),
      "S": (timespan, match) => floorAndPad(timespan.totalSeconds, match.length),
      "h": (timespan, match) => floorAndPad(timespan.totalHours % 24, match.length),
      "m": (timespan, match) => floorAndPad(timespan.totalMinutes % 60, match.length),
      "s": (timespan, match) => floorAndPad(timespan.totalSeconds % 60, match.length)
    };
    var unitBoundaries2 = [
      [60, "minute"],
      [60 * 60, "hour"],
      [60 * 60 * 24, "day"],
      [60 * 60 * 24 * 29, "month"],
      [60 * 60 * 24 * 365, "year"],
      [60 * 60 * 24 * 365 * 10, "decade"]
    ];
    var TimeSpan2 = class {
      constructor(totalSeconds) {
        this.totalSeconds = totalSeconds;
      }
      get totalMinutes() {
        return this.totalSeconds / 60;
      }
      get totalHours() {
        return this.totalMinutes / 60;
      }
      get totalDays() {
        return this.totalHours / 24;
      }
      format(format) {
        let output = "";
        let i = 0;
        let consume = () => format[i++];
        let peek = () => format[i];
        let eof = () => i >= format.length;
        while (!eof()) {
          let char = consume();
          if (char === "'") {
            if (eof()) {
              break;
            } else {
              let nextChar = consume();
              if (nextChar === "'") {
                output += "'";
              } else {
                output += nextChar;
                while (!eof() && peek() !== "'") {
                  output += consume();
                }
                if (!eof()) {
                  consume();
                }
              }
            }
          } else {
            let mutliFunc = formatTokens[char];
            if (mutliFunc) {
              let buffer = char;
              while (!eof() && peek() === char) {
                buffer += consume();
              }
              output += mutliFunc(this, buffer);
            } else {
              output += char;
            }
          }
        }
        return output;
      }
      prettyPrintAbsolute() {
        const max = 8 * 10 * 356 * 24 * 60 * 60;
        let dur = Math.min(Math.abs(this.totalSeconds), max);
        let boundaryI = 0;
        for (let i = 0; i < unitBoundaries2.length; i++) {
          let boundary2 = unitBoundaries2[i];
          if (dur >= boundary2[0]) {
            boundaryI = i;
          } else {
            break;
          }
        }
        let boundary = unitBoundaries2[boundaryI];
        let boundaryCount = Math.floor(dur / boundary[0]);
        return `${boundaryCount} ${boundary[1]}${boundaryCount === 1 ? "" : "s"}`;
      }
      prettyPrintRelative() {
        const max = 8 * 10 * 356 * 24 * 60 * 60;
        let dur = Math.min(Math.abs(this.totalSeconds), max);
        if (dur <= 60) {
          return `moments ${this.totalSeconds > 0 ? "from now" : "ago"}`;
        } else {
          let boundaryI = 0;
          for (let i = 0; i < unitBoundaries2.length; i++) {
            let boundary2 = unitBoundaries2[i];
            if (dur > boundary2[0]) {
              boundaryI = i;
            } else {
              break;
            }
          }
          let boundary = unitBoundaries2[boundaryI];
          let boundaryCount = Math.floor(dur / boundary[0]);
          return `${boundaryCount} ${boundary[1]}${boundaryCount === 1 ? "" : "s"} ${this.totalSeconds > 0 ? "from now" : "ago"}`;
        }
      }
    };
    exports.TimeSpan = TimeSpan2;
  }
});

// engine/dist.node/evaluation/implementations/functions/tf-function.js
var require_tf_function = __commonJS({
  "engine/dist.node/evaluation/implementations/functions/tf-function.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TfFunction = void 0;
    var kodeine_js_1 = require_kodeine();
    var kustom_date_helper_js_1 = require_kustom_date_helper();
    var timespan_js_1 = require_timespan();
    var TfFunction2 = class extends kodeine_js_1.IKodeFunction {
      getName() {
        return "tf";
      }
      call(evalCtx2, call, args) {
        if (args.length == 0) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "At least one argument required.");
        } else if (args.length > 2) {
          throw new kodeine_js_1.InvalidArgumentCountError(call, "Expected one or two arguments.");
        }
        if (args[0].isDate || !args[0].isNumeric) {
          let date = args[0].isDate ? args[0].dateValue : kustom_date_helper_js_1.KustomDateHelper.parseKustomDateString(evalCtx2.getNow(), args[0].text);
          let timespan = new timespan_js_1.TimeSpan(Math.trunc((date.valueOf() - evalCtx2.getNow().valueOf()) / 1e3));
          if (args.length === 2) {
            let format = args[1].text;
            return new kodeine_js_1.KodeValue(timespan.format(format), call.source);
          } else {
            return new kodeine_js_1.KodeValue(timespan.prettyPrintRelative(), call.source);
          }
        } else {
          let duration = args[0].numericValue;
          let timespan = new timespan_js_1.TimeSpan(duration);
          if (args.length === 2) {
            let format = args[1].text;
            return new kodeine_js_1.KodeValue(timespan.format(format), call.source);
          } else {
            return new kodeine_js_1.KodeValue(timespan.prettyPrintAbsolute(), call.source);
          }
        }
      }
    };
    exports.TfFunction = TfFunction2;
  }
});

// engine/dist.node/evaluation/implementations/operators/unary-operators.js
var require_unary_operators = __commonJS({
  "engine/dist.node/evaluation/implementations/operators/unary-operators.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NegationOperator = void 0;
    var kodeine_js_1 = require_kodeine();
    var NegationOperator2 = class extends kodeine_js_1.IUnaryOperator {
      getSymbol() {
        return "-";
      }
      operation(evalCtx2, operation, a) {
        if (a.isNumeric) {
          let value = -a.numericValue;
          if (Number.isInteger(value))
            return new kodeine_js_1.KodeValue(value + ".0");
          else
            return new kodeine_js_1.KodeValue(value);
        } else {
          evalCtx2.sideEffects.warnings.push(new kodeine_js_1.UnaryMinusStringModeWarning(operation));
          return new kodeine_js_1.KodeValue(a.text + "-null", operation.source);
        }
      }
    };
    exports.NegationOperator = NegationOperator2;
  }
});

// engine/dist.node/evaluation/implementations/base/two-mode-binary-operator.js
var require_two_mode_binary_operator = __commonJS({
  "engine/dist.node/evaluation/implementations/base/two-mode-binary-operator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TwoModeBinaryOperator = void 0;
    var kodeine_js_1 = require_kodeine();
    var TwoModeBinaryOperator2 = class extends kodeine_js_1.IBinaryOperator {
      operation(evalCtx2, operation, a, b) {
        if (!isNaN(a.numericValue) && !isNaN(b.numericValue)) {
          return new kodeine_js_1.KodeValue(this.numericMode(a.numericValue, b.numericValue), operation.source);
        } else {
          return new kodeine_js_1.KodeValue(this.textMode(a, b), operation.source);
        }
      }
      textMode(a, b) {
        if (!isNaN(a.numericValue))
          return a.numericValue + this.getSymbol() + b.text;
        else if (!isNaN(b.numericValue))
          return a.text + this.getSymbol() + b.numericValue;
        else
          return a.text + this.getSymbol() + b.text;
      }
    };
    exports.TwoModeBinaryOperator = TwoModeBinaryOperator2;
  }
});

// engine/dist.node/evaluation/implementations/operators/binary-operators.js
var require_binary_operators = __commonJS({
  "engine/dist.node/evaluation/implementations/operators/binary-operators.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogicalAndOperator = exports.LogicalOrOperator = exports.RegexMatchOperator = exports.GreaterThanOrEqualToOperator = exports.LesserThanOrEqualToOperator = exports.GreaterThanOperator = exports.LesserThanOperator = exports.InequalityOperator = exports.EqualityOperator = exports.SubtractionOperator = exports.AdditionOperator = exports.ModuloOperator = exports.DivisionOperator = exports.MultiplicationOperator = exports.ExponentiationOperator = void 0;
    var kodeine_js_1 = require_kodeine();
    var ExponentiationOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return "^";
      }
      getPrecedence() {
        return 5;
      }
      numericMode(a, b) {
        return __pow(a, b);
      }
    };
    exports.ExponentiationOperator = ExponentiationOperator2;
    var MultiplicationOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return "*";
      }
      getPrecedence() {
        return 4;
      }
      numericMode(a, b) {
        return a * b;
      }
    };
    exports.MultiplicationOperator = MultiplicationOperator2;
    var DivisionOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return "/";
      }
      getPrecedence() {
        return 4;
      }
      numericMode(a, b) {
        return a / b;
      }
    };
    exports.DivisionOperator = DivisionOperator2;
    var ModuloOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return "%";
      }
      getPrecedence() {
        return 4;
      }
      numericMode(a, b) {
        return a % b;
      }
    };
    exports.ModuloOperator = ModuloOperator2;
    var AdditionOperator2 = class extends kodeine_js_1.IBinaryOperator {
      getSymbol() {
        return "+";
      }
      getPrecedence() {
        return 3;
      }
      operation(evalCtx2, operation, a, b) {
        if (!isNaN(a.numericValue) && !isNaN(b.numericValue)) {
          return new kodeine_js_1.KodeValue(a.numericValue + b.numericValue);
        } else {
          if (!isNaN(a.numericValue))
            return new kodeine_js_1.KodeValue(a.numericValue + b.text, operation.source);
          else if (!isNaN(b.numericValue))
            return new kodeine_js_1.KodeValue(a.text + b.numericValue, operation.source);
          else
            return new kodeine_js_1.KodeValue(a.text + b.text, operation.source);
        }
      }
    };
    exports.AdditionOperator = AdditionOperator2;
    var SubtractionOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return "-";
      }
      getPrecedence() {
        return 3;
      }
      numericMode(a, b) {
        return a - b;
      }
    };
    exports.SubtractionOperator = SubtractionOperator2;
    var EqualityOperator2 = class extends kodeine_js_1.IBinaryOperator {
      getSymbol() {
        return "=";
      }
      getPrecedence() {
        return 2;
      }
      operation(evalCtx2, operation, a, b) {
        return new kodeine_js_1.KodeValue(a.equals(b), operation.source);
      }
    };
    exports.EqualityOperator = EqualityOperator2;
    var InequalityOperator2 = class extends kodeine_js_1.IBinaryOperator {
      getSymbol() {
        return "!=";
      }
      getPrecedence() {
        return 2;
      }
      operation(evalCtx2, operation, a, b) {
        return new kodeine_js_1.KodeValue(!a.equals(b), operation.source);
      }
    };
    exports.InequalityOperator = InequalityOperator2;
    var LesserThanOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return "<";
      }
      getPrecedence() {
        return 2;
      }
      numericMode(a, b) {
        return a < b;
      }
    };
    exports.LesserThanOperator = LesserThanOperator2;
    var GreaterThanOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return ">";
      }
      getPrecedence() {
        return 2;
      }
      numericMode(a, b) {
        return a > b;
      }
    };
    exports.GreaterThanOperator = GreaterThanOperator2;
    var LesserThanOrEqualToOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return "<=";
      }
      getPrecedence() {
        return 2;
      }
      numericMode(a, b) {
        return a <= b;
      }
    };
    exports.LesserThanOrEqualToOperator = LesserThanOrEqualToOperator2;
    var GreaterThanOrEqualToOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return ">=";
      }
      getPrecedence() {
        return 2;
      }
      numericMode(a, b) {
        return a >= b;
      }
    };
    exports.GreaterThanOrEqualToOperator = GreaterThanOrEqualToOperator2;
    var RegexMatchOperator2 = class extends kodeine_js_1.IBinaryOperator {
      getSymbol() {
        return "~=";
      }
      getPrecedence() {
        return 2;
      }
      operation(evalCtx2, operation, a, b) {
        try {
          return new kodeine_js_1.KodeValue(new RegExp(b.text).test(a.text), operation.source);
        } catch (err) {
          throw new kodeine_js_1.RegexEvaluationError(operation.argB, err == null ? void 0 : err.toString());
        }
      }
    };
    exports.RegexMatchOperator = RegexMatchOperator2;
    var LogicalOrOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return "|";
      }
      getPrecedence() {
        return 1;
      }
      numericMode(a, b) {
        return a == 1 || b == 1 ? 1 : 0;
      }
    };
    exports.LogicalOrOperator = LogicalOrOperator2;
    var LogicalAndOperator2 = class extends kodeine_js_1.TwoModeBinaryOperator {
      getSymbol() {
        return "&";
      }
      getPrecedence() {
        return 1;
      }
      numericMode(a, b) {
        return a == 1 && b == 1 ? 1 : 0;
      }
    };
    exports.LogicalAndOperator = LogicalAndOperator2;
  }
});

// engine/dist.node/kodeine-lexer/formula-token.js
var require_formula_token = __commonJS({
  "engine/dist.node/kodeine-lexer/formula-token.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormulaToken = void 0;
    var FormulaToken8 = class {
      getPlainTextOutput() {
        return this.getSourceText();
      }
    };
    exports.FormulaToken = FormulaToken8;
  }
});

// engine/dist.node/kodeine-lexer/formula-tokens.js
var require_formula_tokens = __commonJS({
  "engine/dist.node/kodeine-lexer/formula-tokens.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OperatorToken = exports.UnquotedValueToken = exports.QuotedValueToken = exports.UnclosedQuotedValueToken = exports.CommaToken = exports.ClosingParenthesisToken = exports.OpeningParenthesisToken = exports.WhitespaceToken = exports.DollarSignToken = exports.EscapedDollarSignToken = exports.PlainTextToken = exports.SimpleToken = void 0;
    var kodeine_js_1 = require_kodeine();
    var SimpleToken2 = class extends kodeine_js_1.FormulaToken {
      constructor(text, startIndex) {
        super();
        this._text = text;
        this._startIndex = startIndex;
      }
      getSourceText() {
        return this._text;
      }
      getStartIndex() {
        return this._startIndex;
      }
      getEndIndex() {
        return this._startIndex + this._text.length;
      }
    };
    exports.SimpleToken = SimpleToken2;
    var PlainTextToken2 = class extends SimpleToken2 {
      constructor(text, startIndex) {
        super(text, startIndex);
      }
      getName() {
        return "plain text";
      }
    };
    exports.PlainTextToken = PlainTextToken2;
    var EscapedDollarSignToken2 = class extends SimpleToken2 {
      constructor(startIndex) {
        super("$$", startIndex);
      }
      getName() {
        return "escaped dollar sign";
      }
      getPlainTextOutput() {
        return "$";
      }
    };
    exports.EscapedDollarSignToken = EscapedDollarSignToken2;
    var DollarSignToken2 = class extends SimpleToken2 {
      constructor(startIndex) {
        super("$", startIndex);
      }
      getName() {
        return "dollar sign";
      }
    };
    exports.DollarSignToken = DollarSignToken2;
    var WhitespaceToken2 = class extends SimpleToken2 {
      constructor(text, startIndex) {
        super(text, startIndex);
      }
      getName() {
        return "whitespace";
      }
    };
    exports.WhitespaceToken = WhitespaceToken2;
    var OpeningParenthesisToken2 = class extends SimpleToken2 {
      constructor(startIndex) {
        super("(", startIndex);
      }
      getName() {
        return "opening parenthesis";
      }
    };
    exports.OpeningParenthesisToken = OpeningParenthesisToken2;
    var ClosingParenthesisToken2 = class extends SimpleToken2 {
      constructor(startIndex) {
        super(")", startIndex);
      }
      getName() {
        return "closing parenthesis";
      }
    };
    exports.ClosingParenthesisToken = ClosingParenthesisToken2;
    var CommaToken3 = class extends SimpleToken2 {
      constructor(startIndex) {
        super(",", startIndex);
      }
      getName() {
        return "comma";
      }
    };
    exports.CommaToken = CommaToken3;
    var UnclosedQuotedValueToken2 = class extends kodeine_js_1.FormulaToken {
      constructor(textFollowingQuotationMark, quotationMarkIndex) {
        super();
        this._textFollowingQuotationMark = textFollowingQuotationMark;
        this._quotationMarkIndex = quotationMarkIndex;
      }
      getStartIndex() {
        return this._quotationMarkIndex;
      }
      getEndIndex() {
        return this._quotationMarkIndex + 1 + this._textFollowingQuotationMark.length;
      }
      getSourceText() {
        return `"${this._textFollowingQuotationMark}`;
      }
      getName() {
        return "unclosed quoted value";
      }
    };
    exports.UnclosedQuotedValueToken = UnclosedQuotedValueToken2;
    var QuotedValueToken5 = class extends kodeine_js_1.FormulaToken {
      constructor(valueText, openingQuotationMarkIndex) {
        super();
        this._innerText = valueText;
        this._openingQuotationMarkIndex = openingQuotationMarkIndex;
      }
      getValue() {
        return this._innerText;
      }
      getStartIndex() {
        return this._openingQuotationMarkIndex;
      }
      getEndIndex() {
        return this._openingQuotationMarkIndex + 1 + this._innerText.length + 1;
      }
      getSourceText() {
        return `"${this._innerText}"`;
      }
      getName() {
        return "quoted value";
      }
    };
    exports.QuotedValueToken = QuotedValueToken5;
    var UnquotedValueToken5 = class extends SimpleToken2 {
      constructor(text, startIndex) {
        super(text, startIndex);
      }
      getValue() {
        return this._text;
      }
      getName() {
        return "unquoted value";
      }
    };
    exports.UnquotedValueToken = UnquotedValueToken5;
    var OperatorToken4 = class extends SimpleToken2 {
      constructor(symbol, startIndex) {
        super(symbol, startIndex);
      }
      getSymbol() {
        return this._text;
      }
      is(symbol) {
        return this._text === symbol;
      }
      getName() {
        return "operator";
      }
    };
    exports.OperatorToken = OperatorToken4;
  }
});

// engine/dist.node/kodeine-lexer/kodeine-lexer.js
var require_kodeine_lexer = __commonJS({
  "engine/dist.node/kodeine-lexer/kodeine-lexer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KodeineLexer = exports.KodeineLexerState = void 0;
    var kodeine_js_1 = require_kodeine();
    var KodeineLexerState;
    (function(KodeineLexerState2) {
      KodeineLexerState2[KodeineLexerState2["Default"] = 0] = "Default";
      KodeineLexerState2[KodeineLexerState2["Kode"] = 1] = "Kode";
    })(KodeineLexerState = exports.KodeineLexerState || (exports.KodeineLexerState = {}));
    var KodeineLexer2 = class {
      constructor(charReader, operatorSymbols) {
        this._state = KodeineLexerState.Default;
        this._tokenQueue = [];
        this._charReader = charReader;
        this._operatorSymbols = operatorSymbols;
      }
      peek(tokenCount, offset = 0) {
        let outTokens;
        if (this._tokenQueue.length > 0) {
          outTokens = this._tokenQueue.slice(offset, tokenCount);
        } else {
          outTokens = [];
        }
        while (outTokens.length < tokenCount && !this._charReader.EOF()) {
          let nextToken = this._readNextToken();
          this._tokenQueue.push(nextToken);
          outTokens.push(nextToken);
        }
        return outTokens;
      }
      consume(tokenCount) {
        let outTokens;
        if (this._tokenQueue.length > 0) {
          outTokens = this._tokenQueue.splice(0, tokenCount);
        } else {
          outTokens = [];
        }
        while (outTokens.length < tokenCount && !this._charReader.EOF()) {
          let nextToken = this._readNextToken();
          outTokens.push(nextToken);
        }
        return outTokens;
      }
      EOF() {
        return this._charReader.EOF() && this._tokenQueue.length === 0;
      }
      _readNextToken() {
        let startIndex = this._charReader.getPosition();
        let char = this._charReader.consume(1);
        if (this._state === KodeineLexerState.Default) {
          if (char === "$") {
            let nextChar = this._charReader.peek(1);
            if (nextChar === "$") {
              this._charReader.consume(1);
              return new kodeine_js_1.EscapedDollarSignToken(startIndex);
            } else {
              this._state = KodeineLexerState.Kode;
              return new kodeine_js_1.DollarSignToken(startIndex);
            }
          } else {
            let buffer = char;
            while (!this._charReader.EOF() && this._charReader.peek(1) !== "$") {
              buffer += this._charReader.consume(1);
            }
            return new kodeine_js_1.PlainTextToken(buffer, startIndex);
          }
        } else if (this._state === KodeineLexerState.Kode) {
          if (this._isWhitespace(char)) {
            let buffer = char;
            while (!this._charReader.EOF() && this._isWhitespace(this._charReader.peek(1))) {
              buffer += this._charReader.consume(1);
            }
            return new kodeine_js_1.WhitespaceToken(buffer, startIndex);
          } else if (char === "(") {
            return new kodeine_js_1.OpeningParenthesisToken(startIndex);
          } else if (char === ")") {
            return new kodeine_js_1.ClosingParenthesisToken(startIndex);
          } else if (char === ",") {
            return new kodeine_js_1.CommaToken(startIndex);
          } else if (char === '"') {
            let buffer = "";
            while (!this._charReader.EOF() && this._charReader.peek(1) !== '"') {
              buffer += this._charReader.consume(1);
            }
            if (this._charReader.EOF()) {
              return new kodeine_js_1.UnclosedQuotedValueToken(buffer, startIndex);
            } else {
              this._charReader.consume(1);
              return new kodeine_js_1.QuotedValueToken(buffer, startIndex);
            }
          } else if (char === "$") {
            this._state = KodeineLexerState.Default;
            return new kodeine_js_1.DollarSignToken(startIndex);
          } else {
            let initiallyMatchingOperatorSymbols = this._operatorSymbols.filter((op) => op.startsWith(char));
            if (initiallyMatchingOperatorSymbols.length > 0) {
              let longestMatchingOperatorSymbol = "";
              for (var multiCharOperatorSymbol of initiallyMatchingOperatorSymbols) {
                if (multiCharOperatorSymbol.length > longestMatchingOperatorSymbol.length && char + this._charReader.peek(multiCharOperatorSymbol.length - 1) === multiCharOperatorSymbol) {
                  longestMatchingOperatorSymbol = multiCharOperatorSymbol;
                }
              }
              if (longestMatchingOperatorSymbol) {
                this._charReader.consume(longestMatchingOperatorSymbol.length - 1);
                return new kodeine_js_1.OperatorToken(longestMatchingOperatorSymbol, startIndex);
              } else {
                return new kodeine_js_1.UnquotedValueToken(char, startIndex);
              }
            } else {
              let buffer = char;
              let whitespaceBuffer = "";
              let offset = 0;
              let foundTrailingWhitespace = false;
              while (true) {
                let nextChar = this._charReader.peek(1, offset++);
                if (this._isWhitespace(nextChar)) {
                  whitespaceBuffer = nextChar;
                  while (true) {
                    nextChar = this._charReader.peek(1, offset++);
                    if (this._isWhitespace(nextChar)) {
                      whitespaceBuffer += nextChar;
                    } else if (this._isUnquotedTextChar(nextChar)) {
                      buffer += whitespaceBuffer + nextChar;
                      break;
                    } else {
                      foundTrailingWhitespace = true;
                      break;
                    }
                  }
                  if (foundTrailingWhitespace) {
                    break;
                  }
                } else if (this._isUnquotedTextChar(nextChar)) {
                  buffer += nextChar;
                } else {
                  break;
                }
              }
              this._charReader.consume(buffer.length - 1);
              return new kodeine_js_1.UnquotedValueToken(buffer, startIndex);
            }
          }
        } else {
          throw new Error("Invalid lexer state: " + this._state);
        }
      }
      _isWhitespace(char) {
        return char !== "" && char.trim().length === 0;
      }
      _isUnquotedTextChar(char) {
        let isSpecialChar = char == "" || char === "(" || char === ")" || char === '"' || char === "," || char === "$" || this._operatorSymbols.some((op) => op.startsWith(char));
        return !isSpecialChar;
      }
    };
    exports.KodeineLexer = KodeineLexer2;
  }
});

// engine/dist.node/kodeine-parser/expressions/i-expression-builder.js
var require_i_expression_builder = __commonJS({
  "engine/dist.node/kodeine-parser/expressions/i-expression-builder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IExpressionBuilder = void 0;
    var IExpressionBuilder3 = class {
    };
    exports.IExpressionBuilder = IExpressionBuilder3;
  }
});

// engine/src/abstractions.ts
var init_abstractions = __esm({
  "engine/src/abstractions.ts"() {
  }
});

// engine/src/errors.ts
var init_errors = __esm({
  "engine/src/errors.ts"() {
    init_kodeine();
  }
});

// engine/src/string-char-reader.ts
var init_string_char_reader = __esm({
  "engine/src/string-char-reader.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/evaluation-context.ts
var init_evaluation_context = __esm({
  "engine/src/evaluation/evaluation-context.ts"() {
  }
});

// engine/src/evaluation/evaluation-tree.ts
var init_evaluation_tree = __esm({
  "engine/src/evaluation/evaluation-tree.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/evaluables/evaluable.ts
var init_evaluable = __esm({
  "engine/src/evaluation/evaluables/evaluable.ts"() {
  }
});

// engine/src/evaluation/implementations/helpers/kustom-date-helper.ts
var KustomDateHelper;
var init_kustom_date_helper = __esm({
  "engine/src/evaluation/implementations/helpers/kustom-date-helper.ts"() {
    KustomDateHelper = (() => {
      let padYear = (num) => num < 1e3 ? 2e3 + num : num;
      let pad2 = (num) => num < 10 ? `0${num}` : num;
      return {
        toKustomDateString: (date) => {
          return `${padYear(date.getFullYear())}y${pad2(date.getMonth() + 1)}M${pad2(date.getDate())}d${pad2(date.getHours())}h${pad2(date.getMinutes())}m${pad2(date.getSeconds())}s`;
        },
        parseKustomDateString: (now, kustomDateString) => {
          let getMonthDayCount = (year, month) => new Date(year, month + 1, 0).getDate();
          let handlers = {
            y: {
              canSet: (val) => true,
              set: (val) => now = new Date(val, now.getMonth(), Math.min(now.getDate(), getMonthDayCount(val, now.getMonth())), now.getHours(), now.getMinutes(), now.getSeconds()),
              add: (val) => now = new Date(now.getFullYear() + val, now.getMonth(), Math.min(now.getDate(), getMonthDayCount(val, now.getMonth())), now.getHours(), now.getMinutes(), now.getSeconds())
            },
            M: {
              canSet: (val) => val >= 1 && val <= 12,
              set: (val) => now = new Date(now.getFullYear(), val - 1, Math.min(now.getDate(), getMonthDayCount(now.getFullYear(), val - 1)), now.getHours(), now.getMinutes(), now.getSeconds()),
              add: (val) => now = new Date(now.getFullYear() + Math.trunc(val / 12), now.getMonth() + val % 12, Math.min(now.getDate(), getMonthDayCount(val, now.getMonth() + val % 12)), now.getHours(), now.getMinutes(), now.getSeconds())
            },
            d: {
              canSet: (val) => val >= 1 && val <= getMonthDayCount(now.getFullYear(), now.getMonth()),
              set: (val) => now = new Date(now.getFullYear(), now.getMonth(), val, now.getHours(), now.getMinutes(), now.getSeconds()),
              add: (val) => now.setDate(now.getDate() + val)
            },
            h: {
              canSet: (val) => val >= 0 && val < 24,
              set: (val) => now.setHours(val),
              add: (val) => now.setHours(now.getHours() + val)
            },
            m: {
              canSet: (val) => val >= 0 && val < 60,
              set: (val) => now.setMinutes(val),
              add: (val) => now.setMinutes(now.getMinutes() + val)
            },
            s: {
              canSet: (val) => val >= 0 && val < 60,
              set: (val) => now.setSeconds(val),
              add: (val) => now.setSeconds(now.getSeconds() + val)
            }
          };
          let state = null;
          let numberBuffer = 0;
          for (const char of kustomDateString) {
            let digit = "0123456789".indexOf(char);
            if (digit >= 0) {
              numberBuffer = (numberBuffer != null ? numberBuffer : 0) * 10 + digit;
            } else {
              if (char === "a" || char === "r") {
                state = char;
              } else if (char in handlers) {
                if (state === null) {
                  if (handlers[char].canSet(numberBuffer))
                    handlers[char].set(numberBuffer);
                } else if (state === "a") {
                  handlers[char].add(numberBuffer);
                } else if (state === "r") {
                  handlers[char].add(-numberBuffer);
                }
              }
              numberBuffer = 0;
            }
          }
          return now;
        }
      };
    })();
  }
});

// engine/src/evaluation/evaluables/kode-value.ts
var signedInt32Max, signedInt32Min;
var init_kode_value = __esm({
  "engine/src/evaluation/evaluables/kode-value.ts"() {
    init_kodeine();
    init_kustom_date_helper();
    signedInt32Max = __pow(2, 31) - 1;
    signedInt32Min = -__pow(2, 31);
  }
});

// engine/src/evaluation/evaluables/unary-operation.ts
var init_unary_operation = __esm({
  "engine/src/evaluation/evaluables/unary-operation.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/evaluables/binary-operation.ts
var init_binary_operation = __esm({
  "engine/src/evaluation/evaluables/binary-operation.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/evaluables/function-call.ts
var init_function_call = __esm({
  "engine/src/evaluation/evaluables/function-call.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/evaluables/expression.ts
var init_expression = __esm({
  "engine/src/evaluation/evaluables/expression.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/evaluables/formula.ts
var init_formula = __esm({
  "engine/src/evaluation/evaluables/formula.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/evaluables/broken-evaluable.ts
var init_broken_evaluable = __esm({
  "engine/src/evaluation/evaluables/broken-evaluable.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/implementations/base/kode-function-with-modes.ts
var init_kode_function_with_modes = __esm({
  "engine/src/evaluation/implementations/base/kode-function-with-modes.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/implementations/functions/unimplemented-functions.ts
var init_unimplemented_functions = __esm({
  "engine/src/evaluation/implementations/functions/unimplemented-functions.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/implementations/helpers/argb-color.ts
var init_argb_color = __esm({
  "engine/src/evaluation/implementations/helpers/argb-color.ts"() {
  }
});

// engine/src/evaluation/implementations/functions/ce-function.ts
var init_ce_function = __esm({
  "engine/src/evaluation/implementations/functions/ce-function.ts"() {
    init_kodeine();
    init_argb_color();
  }
});

// engine/src/evaluation/implementations/functions/cm-function.ts
var init_cm_function = __esm({
  "engine/src/evaluation/implementations/functions/cm-function.ts"() {
    init_kodeine();
    init_argb_color();
  }
});

// engine/src/evaluation/implementations/helpers/number-to-text-converter.ts
var NumberToTextConverter;
var init_number_to_text_converter = __esm({
  "engine/src/evaluation/implementations/helpers/number-to-text-converter.ts"() {
    NumberToTextConverter = (() => {
      const maxConvertible = __pow(2, 31) - 1;
      const million = 1e6;
      const billion = 1e9;
      const zeroToNineteen = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen"
      ];
      const tens = ["zero", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
      const _convertUnder20 = (n) => {
        return zeroToNineteen[n];
      };
      const _convertUnderHundred = (n) => {
        if (n < 20) {
          return _convertUnder20(n);
        } else {
          let tenCount = Math.floor(n / 10);
          let output = tens[tenCount];
          let rest = n % 10;
          if (rest > 0) {
            return `${output} ${_convertUnder20(rest)}`;
          } else {
            return output;
          }
        }
      };
      const _convertUnderThousand = (n) => {
        if (n < 100) {
          return _convertUnderHundred(n);
        } else {
          let hundredCount = Math.floor(n / 100);
          let output = _convertUnder20(hundredCount);
          let rest = n % 100;
          if (rest > 0)
            return `${output} hundred ${_convertUnderHundred(rest)}`;
          else
            return output;
        }
      };
      const _convertUnderMillion = (n) => {
        if (n < 1e3) {
          return _convertUnderThousand(n);
        } else {
          let thousandCount = Math.floor(n / 1e3);
          let output = _convertUnderThousand(thousandCount);
          let rest = n % 1e3;
          if (rest > 0)
            return `${output} thousand ${_convertUnderThousand(rest)}`;
          else
            return output;
        }
      };
      const _convertUnderBillion = (n) => {
        if (n < million) {
          return _convertUnderMillion(n);
        } else {
          let millionCount = Math.floor(n / million);
          let output = _convertUnderThousand(millionCount);
          let rest = n % million;
          if (rest > 0)
            return `${output} million ${_convertUnderMillion(rest)}`;
          else
            return `${output} million`;
        }
      };
      return {
        max: maxConvertible,
        convert: (n) => {
          if (n < 0)
            throw new Error(`Can only convert positive numbers.`);
          else if (n > maxConvertible)
            throw new Error(`Number ${n} is too big for conversion. Max is ${maxConvertible}.`);
          if (n < billion) {
            return _convertUnderBillion(n);
          } else {
            let billionCount = Math.floor(n / billion);
            let output = _convertUnder20(billionCount);
            let rest = n % billion;
            if (rest > 0)
              return `${output} billion ${_convertUnderBillion(rest)}`;
            else
              return `${output} billion`;
          }
        }
      };
    })();
  }
});

// engine/src/evaluation/implementations/helpers/text-capitalizer.ts
var TextCapitalizer;
var init_text_capitalizer = __esm({
  "engine/src/evaluation/implementations/helpers/text-capitalizer.ts"() {
    TextCapitalizer = (() => ({
      capitalize: (text) => {
        return text.replace(/(?<=^| )./g, (match) => match.toUpperCase());
      },
      capitalizeFirstLetter: (text) => {
        return text.substring(0, 1).toUpperCase() + text.substring(1);
      }
    }))();
  }
});

// engine/src/evaluation/implementations/functions/df-function.ts
var init_df_function = __esm({
  "engine/src/evaluation/implementations/functions/df-function.ts"() {
    init_kodeine();
    init_kustom_date_helper();
    init_number_to_text_converter();
    init_text_capitalizer();
  }
});

// engine/src/evaluation/implementations/functions/dp-function.ts
var init_dp_function = __esm({
  "engine/src/evaluation/implementations/functions/dp-function.ts"() {
    init_kodeine();
    init_kustom_date_helper();
  }
});

// engine/src/evaluation/implementations/functions/fl-function.ts
var init_fl_function = __esm({
  "engine/src/evaluation/implementations/functions/fl-function.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/implementations/functions/gv-function.ts
var init_gv_function = __esm({
  "engine/src/evaluation/implementations/functions/gv-function.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/implementations/functions/if-function.ts
var init_if_function = __esm({
  "engine/src/evaluation/implementations/functions/if-function.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/implementations/functions/mu-function.ts
var init_mu_function = __esm({
  "engine/src/evaluation/implementations/functions/mu-function.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/implementations/helpers/html-entitity-converter.ts
var HtmlEntityConverter;
var init_html_entitity_converter = __esm({
  "engine/src/evaluation/implementations/helpers/html-entitity-converter.ts"() {
    HtmlEntityConverter = (() => {
      const namedEntities = {
        "&AElig": "\xC6",
        "&AElig;": "\xC6",
        "&AMP": "&",
        "&AMP;": "&",
        "&Aacute": "\xC1",
        "&Aacute;": "\xC1",
        "&Abreve;": "\u0102",
        "&Acirc": "\xC2",
        "&Acirc;": "\xC2",
        "&Acy;": "\u0410",
        "&Afr;": "\u{1D504}",
        "&Agrave": "\xC0",
        "&Agrave;": "\xC0",
        "&Alpha;": "\u0391",
        "&Amacr;": "\u0100",
        "&And;": "\u2A53",
        "&Aogon;": "\u0104",
        "&Aopf;": "\u{1D538}",
        "&ApplyFunction;": "\u2061",
        "&Aring": "\xC5",
        "&Aring;": "\xC5",
        "&Ascr;": "\u{1D49C}",
        "&Assign;": "\u2254",
        "&Atilde": "\xC3",
        "&Atilde;": "\xC3",
        "&Auml": "\xC4",
        "&Auml;": "\xC4",
        "&Backslash;": "\u2216",
        "&Barv;": "\u2AE7",
        "&Barwed;": "\u2306",
        "&Bcy;": "\u0411",
        "&Because;": "\u2235",
        "&Bernoullis;": "\u212C",
        "&Beta;": "\u0392",
        "&Bfr;": "\u{1D505}",
        "&Bopf;": "\u{1D539}",
        "&Breve;": "\u02D8",
        "&Bscr;": "\u212C",
        "&Bumpeq;": "\u224E",
        "&CHcy;": "\u0427",
        "&COPY": "\xA9",
        "&COPY;": "\xA9",
        "&Cacute;": "\u0106",
        "&Cap;": "\u22D2",
        "&CapitalDifferentialD;": "\u2145",
        "&Cayleys;": "\u212D",
        "&Ccaron;": "\u010C",
        "&Ccedil": "\xC7",
        "&Ccedil;": "\xC7",
        "&Ccirc;": "\u0108",
        "&Cconint;": "\u2230",
        "&Cdot;": "\u010A",
        "&Cedilla;": "\xB8",
        "&CenterDot;": "\xB7",
        "&Cfr;": "\u212D",
        "&Chi;": "\u03A7",
        "&CircleDot;": "\u2299",
        "&CircleMinus;": "\u2296",
        "&CirclePlus;": "\u2295",
        "&CircleTimes;": "\u2297",
        "&ClockwiseContourIntegral;": "\u2232",
        "&CloseCurlyDoubleQuote;": "\u201D",
        "&CloseCurlyQuote;": "\u2019",
        "&Colon;": "\u2237",
        "&Colone;": "\u2A74",
        "&Congruent;": "\u2261",
        "&Conint;": "\u222F",
        "&ContourIntegral;": "\u222E",
        "&Copf;": "\u2102",
        "&Coproduct;": "\u2210",
        "&CounterClockwiseContourIntegral;": "\u2233",
        "&Cross;": "\u2A2F",
        "&Cscr;": "\u{1D49E}",
        "&Cup;": "\u22D3",
        "&CupCap;": "\u224D",
        "&DD;": "\u2145",
        "&DDotrahd;": "\u2911",
        "&DJcy;": "\u0402",
        "&DScy;": "\u0405",
        "&DZcy;": "\u040F",
        "&Dagger;": "\u2021",
        "&Darr;": "\u21A1",
        "&Dashv;": "\u2AE4",
        "&Dcaron;": "\u010E",
        "&Dcy;": "\u0414",
        "&Del;": "\u2207",
        "&Delta;": "\u0394",
        "&Dfr;": "\u{1D507}",
        "&DiacriticalAcute;": "\xB4",
        "&DiacriticalDot;": "\u02D9",
        "&DiacriticalDoubleAcute;": "\u02DD",
        "&DiacriticalGrave;": "`",
        "&DiacriticalTilde;": "\u02DC",
        "&Diamond;": "\u22C4",
        "&DifferentialD;": "\u2146",
        "&Dopf;": "\u{1D53B}",
        "&Dot;": "\xA8",
        "&DotDot;": "\u20DC",
        "&DotEqual;": "\u2250",
        "&DoubleContourIntegral;": "\u222F",
        "&DoubleDot;": "\xA8",
        "&DoubleDownArrow;": "\u21D3",
        "&DoubleLeftArrow;": "\u21D0",
        "&DoubleLeftRightArrow;": "\u21D4",
        "&DoubleLeftTee;": "\u2AE4",
        "&DoubleLongLeftArrow;": "\u27F8",
        "&DoubleLongLeftRightArrow;": "\u27FA",
        "&DoubleLongRightArrow;": "\u27F9",
        "&DoubleRightArrow;": "\u21D2",
        "&DoubleRightTee;": "\u22A8",
        "&DoubleUpArrow;": "\u21D1",
        "&DoubleUpDownArrow;": "\u21D5",
        "&DoubleVerticalBar;": "\u2225",
        "&DownArrow;": "\u2193",
        "&DownArrowBar;": "\u2913",
        "&DownArrowUpArrow;": "\u21F5",
        "&DownBreve;": "\u0311",
        "&DownLeftRightVector;": "\u2950",
        "&DownLeftTeeVector;": "\u295E",
        "&DownLeftVector;": "\u21BD",
        "&DownLeftVectorBar;": "\u2956",
        "&DownRightTeeVector;": "\u295F",
        "&DownRightVector;": "\u21C1",
        "&DownRightVectorBar;": "\u2957",
        "&DownTee;": "\u22A4",
        "&DownTeeArrow;": "\u21A7",
        "&Downarrow;": "\u21D3",
        "&Dscr;": "\u{1D49F}",
        "&Dstrok;": "\u0110",
        "&ENG;": "\u014A",
        "&ETH": "\xD0",
        "&ETH;": "\xD0",
        "&Eacute": "\xC9",
        "&Eacute;": "\xC9",
        "&Ecaron;": "\u011A",
        "&Ecirc": "\xCA",
        "&Ecirc;": "\xCA",
        "&Ecy;": "\u042D",
        "&Edot;": "\u0116",
        "&Efr;": "\u{1D508}",
        "&Egrave": "\xC8",
        "&Egrave;": "\xC8",
        "&Element;": "\u2208",
        "&Emacr;": "\u0112",
        "&EmptySmallSquare;": "\u25FB",
        "&EmptyVerySmallSquare;": "\u25AB",
        "&Eogon;": "\u0118",
        "&Eopf;": "\u{1D53C}",
        "&Epsilon;": "\u0395",
        "&Equal;": "\u2A75",
        "&EqualTilde;": "\u2242",
        "&Equilibrium;": "\u21CC",
        "&Escr;": "\u2130",
        "&Esim;": "\u2A73",
        "&Eta;": "\u0397",
        "&Euml": "\xCB",
        "&Euml;": "\xCB",
        "&Exists;": "\u2203",
        "&ExponentialE;": "\u2147",
        "&Fcy;": "\u0424",
        "&Ffr;": "\u{1D509}",
        "&FilledSmallSquare;": "\u25FC",
        "&FilledVerySmallSquare;": "\u25AA",
        "&Fopf;": "\u{1D53D}",
        "&ForAll;": "\u2200",
        "&Fouriertrf;": "\u2131",
        "&Fscr;": "\u2131",
        "&GJcy;": "\u0403",
        "&GT": ">",
        "&GT;": ">",
        "&Gamma;": "\u0393",
        "&Gammad;": "\u03DC",
        "&Gbreve;": "\u011E",
        "&Gcedil;": "\u0122",
        "&Gcirc;": "\u011C",
        "&Gcy;": "\u0413",
        "&Gdot;": "\u0120",
        "&Gfr;": "\u{1D50A}",
        "&Gg;": "\u22D9",
        "&Gopf;": "\u{1D53E}",
        "&GreaterEqual;": "\u2265",
        "&GreaterEqualLess;": "\u22DB",
        "&GreaterFullEqual;": "\u2267",
        "&GreaterGreater;": "\u2AA2",
        "&GreaterLess;": "\u2277",
        "&GreaterSlantEqual;": "\u2A7E",
        "&GreaterTilde;": "\u2273",
        "&Gscr;": "\u{1D4A2}",
        "&Gt;": "\u226B",
        "&HARDcy;": "\u042A",
        "&Hacek;": "\u02C7",
        "&Hat;": "^",
        "&Hcirc;": "\u0124",
        "&Hfr;": "\u210C",
        "&HilbertSpace;": "\u210B",
        "&Hopf;": "\u210D",
        "&HorizontalLine;": "\u2500",
        "&Hscr;": "\u210B",
        "&Hstrok;": "\u0126",
        "&HumpDownHump;": "\u224E",
        "&HumpEqual;": "\u224F",
        "&IEcy;": "\u0415",
        "&IJlig;": "\u0132",
        "&IOcy;": "\u0401",
        "&Iacute": "\xCD",
        "&Iacute;": "\xCD",
        "&Icirc": "\xCE",
        "&Icirc;": "\xCE",
        "&Icy;": "\u0418",
        "&Idot;": "\u0130",
        "&Ifr;": "\u2111",
        "&Igrave": "\xCC",
        "&Igrave;": "\xCC",
        "&Im;": "\u2111",
        "&Imacr;": "\u012A",
        "&ImaginaryI;": "\u2148",
        "&Implies;": "\u21D2",
        "&Int;": "\u222C",
        "&Integral;": "\u222B",
        "&Intersection;": "\u22C2",
        "&InvisibleComma;": "\u2063",
        "&InvisibleTimes;": "\u2062",
        "&Iogon;": "\u012E",
        "&Iopf;": "\u{1D540}",
        "&Iota;": "\u0399",
        "&Iscr;": "\u2110",
        "&Itilde;": "\u0128",
        "&Iukcy;": "\u0406",
        "&Iuml": "\xCF",
        "&Iuml;": "\xCF",
        "&Jcirc;": "\u0134",
        "&Jcy;": "\u0419",
        "&Jfr;": "\u{1D50D}",
        "&Jopf;": "\u{1D541}",
        "&Jscr;": "\u{1D4A5}",
        "&Jsercy;": "\u0408",
        "&Jukcy;": "\u0404",
        "&KHcy;": "\u0425",
        "&KJcy;": "\u040C",
        "&Kappa;": "\u039A",
        "&Kcedil;": "\u0136",
        "&Kcy;": "\u041A",
        "&Kfr;": "\u{1D50E}",
        "&Kopf;": "\u{1D542}",
        "&Kscr;": "\u{1D4A6}",
        "&LJcy;": "\u0409",
        "&LT": "<",
        "&LT;": "<",
        "&Lacute;": "\u0139",
        "&Lambda;": "\u039B",
        "&Lang;": "\u27EA",
        "&Laplacetrf;": "\u2112",
        "&Larr;": "\u219E",
        "&Lcaron;": "\u013D",
        "&Lcedil;": "\u013B",
        "&Lcy;": "\u041B",
        "&LeftAngleBracket;": "\u27E8",
        "&LeftArrow;": "\u2190",
        "&LeftArrowBar;": "\u21E4",
        "&LeftArrowRightArrow;": "\u21C6",
        "&LeftCeiling;": "\u2308",
        "&LeftDoubleBracket;": "\u27E6",
        "&LeftDownTeeVector;": "\u2961",
        "&LeftDownVector;": "\u21C3",
        "&LeftDownVectorBar;": "\u2959",
        "&LeftFloor;": "\u230A",
        "&LeftRightArrow;": "\u2194",
        "&LeftRightVector;": "\u294E",
        "&LeftTee;": "\u22A3",
        "&LeftTeeArrow;": "\u21A4",
        "&LeftTeeVector;": "\u295A",
        "&LeftTriangle;": "\u22B2",
        "&LeftTriangleBar;": "\u29CF",
        "&LeftTriangleEqual;": "\u22B4",
        "&LeftUpDownVector;": "\u2951",
        "&LeftUpTeeVector;": "\u2960",
        "&LeftUpVector;": "\u21BF",
        "&LeftUpVectorBar;": "\u2958",
        "&LeftVector;": "\u21BC",
        "&LeftVectorBar;": "\u2952",
        "&Leftarrow;": "\u21D0",
        "&Leftrightarrow;": "\u21D4",
        "&LessEqualGreater;": "\u22DA",
        "&LessFullEqual;": "\u2266",
        "&LessGreater;": "\u2276",
        "&LessLess;": "\u2AA1",
        "&LessSlantEqual;": "\u2A7D",
        "&LessTilde;": "\u2272",
        "&Lfr;": "\u{1D50F}",
        "&Ll;": "\u22D8",
        "&Lleftarrow;": "\u21DA",
        "&Lmidot;": "\u013F",
        "&LongLeftArrow;": "\u27F5",
        "&LongLeftRightArrow;": "\u27F7",
        "&LongRightArrow;": "\u27F6",
        "&Longleftarrow;": "\u27F8",
        "&Longleftrightarrow;": "\u27FA",
        "&Longrightarrow;": "\u27F9",
        "&Lopf;": "\u{1D543}",
        "&LowerLeftArrow;": "\u2199",
        "&LowerRightArrow;": "\u2198",
        "&Lscr;": "\u2112",
        "&Lsh;": "\u21B0",
        "&Lstrok;": "\u0141",
        "&Lt;": "\u226A",
        "&Map;": "\u2905",
        "&Mcy;": "\u041C",
        "&MediumSpace;": "\u205F",
        "&Mellintrf;": "\u2133",
        "&Mfr;": "\u{1D510}",
        "&MinusPlus;": "\u2213",
        "&Mopf;": "\u{1D544}",
        "&Mscr;": "\u2133",
        "&Mu;": "\u039C",
        "&NJcy;": "\u040A",
        "&Nacute;": "\u0143",
        "&Ncaron;": "\u0147",
        "&Ncedil;": "\u0145",
        "&Ncy;": "\u041D",
        "&NegativeMediumSpace;": "\u200B",
        "&NegativeThickSpace;": "\u200B",
        "&NegativeThinSpace;": "\u200B",
        "&NegativeVeryThinSpace;": "\u200B",
        "&NestedGreaterGreater;": "\u226B",
        "&NestedLessLess;": "\u226A",
        "&NewLine;": "\n",
        "&Nfr;": "\u{1D511}",
        "&NoBreak;": "\u2060",
        "&NonBreakingSpace;": "\xA0",
        "&Nopf;": "\u2115",
        "&Not;": "\u2AEC",
        "&NotCongruent;": "\u2262",
        "&NotCupCap;": "\u226D",
        "&NotDoubleVerticalBar;": "\u2226",
        "&NotElement;": "\u2209",
        "&NotEqual;": "\u2260",
        "&NotEqualTilde;": "\u2242\u0338",
        "&NotExists;": "\u2204",
        "&NotGreater;": "\u226F",
        "&NotGreaterEqual;": "\u2271",
        "&NotGreaterFullEqual;": "\u2267\u0338",
        "&NotGreaterGreater;": "\u226B\u0338",
        "&NotGreaterLess;": "\u2279",
        "&NotGreaterSlantEqual;": "\u2A7E\u0338",
        "&NotGreaterTilde;": "\u2275",
        "&NotHumpDownHump;": "\u224E\u0338",
        "&NotHumpEqual;": "\u224F\u0338",
        "&NotLeftTriangle;": "\u22EA",
        "&NotLeftTriangleBar;": "\u29CF\u0338",
        "&NotLeftTriangleEqual;": "\u22EC",
        "&NotLess;": "\u226E",
        "&NotLessEqual;": "\u2270",
        "&NotLessGreater;": "\u2278",
        "&NotLessLess;": "\u226A\u0338",
        "&NotLessSlantEqual;": "\u2A7D\u0338",
        "&NotLessTilde;": "\u2274",
        "&NotNestedGreaterGreater;": "\u2AA2\u0338",
        "&NotNestedLessLess;": "\u2AA1\u0338",
        "&NotPrecedes;": "\u2280",
        "&NotPrecedesEqual;": "\u2AAF\u0338",
        "&NotPrecedesSlantEqual;": "\u22E0",
        "&NotReverseElement;": "\u220C",
        "&NotRightTriangle;": "\u22EB",
        "&NotRightTriangleBar;": "\u29D0\u0338",
        "&NotRightTriangleEqual;": "\u22ED",
        "&NotSquareSubset;": "\u228F\u0338",
        "&NotSquareSubsetEqual;": "\u22E2",
        "&NotSquareSuperset;": "\u2290\u0338",
        "&NotSquareSupersetEqual;": "\u22E3",
        "&NotSubset;": "\u2282\u20D2",
        "&NotSubsetEqual;": "\u2288",
        "&NotSucceeds;": "\u2281",
        "&NotSucceedsEqual;": "\u2AB0\u0338",
        "&NotSucceedsSlantEqual;": "\u22E1",
        "&NotSucceedsTilde;": "\u227F\u0338",
        "&NotSuperset;": "\u2283\u20D2",
        "&NotSupersetEqual;": "\u2289",
        "&NotTilde;": "\u2241",
        "&NotTildeEqual;": "\u2244",
        "&NotTildeFullEqual;": "\u2247",
        "&NotTildeTilde;": "\u2249",
        "&NotVerticalBar;": "\u2224",
        "&Nscr;": "\u{1D4A9}",
        "&Ntilde": "\xD1",
        "&Ntilde;": "\xD1",
        "&Nu;": "\u039D",
        "&OElig;": "\u0152",
        "&Oacute": "\xD3",
        "&Oacute;": "\xD3",
        "&Ocirc": "\xD4",
        "&Ocirc;": "\xD4",
        "&Ocy;": "\u041E",
        "&Odblac;": "\u0150",
        "&Ofr;": "\u{1D512}",
        "&Ograve": "\xD2",
        "&Ograve;": "\xD2",
        "&Omacr;": "\u014C",
        "&Omega;": "\u03A9",
        "&Omicron;": "\u039F",
        "&Oopf;": "\u{1D546}",
        "&OpenCurlyDoubleQuote;": "\u201C",
        "&OpenCurlyQuote;": "\u2018",
        "&Or;": "\u2A54",
        "&Oscr;": "\u{1D4AA}",
        "&Oslash": "\xD8",
        "&Oslash;": "\xD8",
        "&Otilde": "\xD5",
        "&Otilde;": "\xD5",
        "&Otimes;": "\u2A37",
        "&Ouml": "\xD6",
        "&Ouml;": "\xD6",
        "&OverBar;": "\u203E",
        "&OverBrace;": "\u23DE",
        "&OverBracket;": "\u23B4",
        "&OverParenthesis;": "\u23DC",
        "&PartialD;": "\u2202",
        "&Pcy;": "\u041F",
        "&Pfr;": "\u{1D513}",
        "&Phi;": "\u03A6",
        "&Pi;": "\u03A0",
        "&PlusMinus;": "\xB1",
        "&Poincareplane;": "\u210C",
        "&Popf;": "\u2119",
        "&Pr;": "\u2ABB",
        "&Precedes;": "\u227A",
        "&PrecedesEqual;": "\u2AAF",
        "&PrecedesSlantEqual;": "\u227C",
        "&PrecedesTilde;": "\u227E",
        "&Prime;": "\u2033",
        "&Product;": "\u220F",
        "&Proportion;": "\u2237",
        "&Proportional;": "\u221D",
        "&Pscr;": "\u{1D4AB}",
        "&Psi;": "\u03A8",
        "&QUOT": '"',
        "&QUOT;": '"',
        "&Qfr;": "\u{1D514}",
        "&Qopf;": "\u211A",
        "&Qscr;": "\u{1D4AC}",
        "&RBarr;": "\u2910",
        "&REG": "\xAE",
        "&REG;": "\xAE",
        "&Racute;": "\u0154",
        "&Rang;": "\u27EB",
        "&Rarr;": "\u21A0",
        "&Rarrtl;": "\u2916",
        "&Rcaron;": "\u0158",
        "&Rcedil;": "\u0156",
        "&Rcy;": "\u0420",
        "&Re;": "\u211C",
        "&ReverseElement;": "\u220B",
        "&ReverseEquilibrium;": "\u21CB",
        "&ReverseUpEquilibrium;": "\u296F",
        "&Rfr;": "\u211C",
        "&Rho;": "\u03A1",
        "&RightAngleBracket;": "\u27E9",
        "&RightArrow;": "\u2192",
        "&RightArrowBar;": "\u21E5",
        "&RightArrowLeftArrow;": "\u21C4",
        "&RightCeiling;": "\u2309",
        "&RightDoubleBracket;": "\u27E7",
        "&RightDownTeeVector;": "\u295D",
        "&RightDownVector;": "\u21C2",
        "&RightDownVectorBar;": "\u2955",
        "&RightFloor;": "\u230B",
        "&RightTee;": "\u22A2",
        "&RightTeeArrow;": "\u21A6",
        "&RightTeeVector;": "\u295B",
        "&RightTriangle;": "\u22B3",
        "&RightTriangleBar;": "\u29D0",
        "&RightTriangleEqual;": "\u22B5",
        "&RightUpDownVector;": "\u294F",
        "&RightUpTeeVector;": "\u295C",
        "&RightUpVector;": "\u21BE",
        "&RightUpVectorBar;": "\u2954",
        "&RightVector;": "\u21C0",
        "&RightVectorBar;": "\u2953",
        "&Rightarrow;": "\u21D2",
        "&Ropf;": "\u211D",
        "&RoundImplies;": "\u2970",
        "&Rrightarrow;": "\u21DB",
        "&Rscr;": "\u211B",
        "&Rsh;": "\u21B1",
        "&RuleDelayed;": "\u29F4",
        "&SHCHcy;": "\u0429",
        "&SHcy;": "\u0428",
        "&SOFTcy;": "\u042C",
        "&Sacute;": "\u015A",
        "&Sc;": "\u2ABC",
        "&Scaron;": "\u0160",
        "&Scedil;": "\u015E",
        "&Scirc;": "\u015C",
        "&Scy;": "\u0421",
        "&Sfr;": "\u{1D516}",
        "&ShortDownArrow;": "\u2193",
        "&ShortLeftArrow;": "\u2190",
        "&ShortRightArrow;": "\u2192",
        "&ShortUpArrow;": "\u2191",
        "&Sigma;": "\u03A3",
        "&SmallCircle;": "\u2218",
        "&Sopf;": "\u{1D54A}",
        "&Sqrt;": "\u221A",
        "&Square;": "\u25A1",
        "&SquareIntersection;": "\u2293",
        "&SquareSubset;": "\u228F",
        "&SquareSubsetEqual;": "\u2291",
        "&SquareSuperset;": "\u2290",
        "&SquareSupersetEqual;": "\u2292",
        "&SquareUnion;": "\u2294",
        "&Sscr;": "\u{1D4AE}",
        "&Star;": "\u22C6",
        "&Sub;": "\u22D0",
        "&Subset;": "\u22D0",
        "&SubsetEqual;": "\u2286",
        "&Succeeds;": "\u227B",
        "&SucceedsEqual;": "\u2AB0",
        "&SucceedsSlantEqual;": "\u227D",
        "&SucceedsTilde;": "\u227F",
        "&SuchThat;": "\u220B",
        "&Sum;": "\u2211",
        "&Sup;": "\u22D1",
        "&Superset;": "\u2283",
        "&SupersetEqual;": "\u2287",
        "&Supset;": "\u22D1",
        "&THORN": "\xDE",
        "&THORN;": "\xDE",
        "&TRADE;": "\u2122",
        "&TSHcy;": "\u040B",
        "&TScy;": "\u0426",
        "&Tab;": "	",
        "&Tau;": "\u03A4",
        "&Tcaron;": "\u0164",
        "&Tcedil;": "\u0162",
        "&Tcy;": "\u0422",
        "&Tfr;": "\u{1D517}",
        "&Therefore;": "\u2234",
        "&Theta;": "\u0398",
        "&ThickSpace;": "\u205F\u200A",
        "&ThinSpace;": "\u2009",
        "&Tilde;": "\u223C",
        "&TildeEqual;": "\u2243",
        "&TildeFullEqual;": "\u2245",
        "&TildeTilde;": "\u2248",
        "&Topf;": "\u{1D54B}",
        "&TripleDot;": "\u20DB",
        "&Tscr;": "\u{1D4AF}",
        "&Tstrok;": "\u0166",
        "&Uacute": "\xDA",
        "&Uacute;": "\xDA",
        "&Uarr;": "\u219F",
        "&Uarrocir;": "\u2949",
        "&Ubrcy;": "\u040E",
        "&Ubreve;": "\u016C",
        "&Ucirc": "\xDB",
        "&Ucirc;": "\xDB",
        "&Ucy;": "\u0423",
        "&Udblac;": "\u0170",
        "&Ufr;": "\u{1D518}",
        "&Ugrave": "\xD9",
        "&Ugrave;": "\xD9",
        "&Umacr;": "\u016A",
        "&UnderBar;": "_",
        "&UnderBrace;": "\u23DF",
        "&UnderBracket;": "\u23B5",
        "&UnderParenthesis;": "\u23DD",
        "&Union;": "\u22C3",
        "&UnionPlus;": "\u228E",
        "&Uogon;": "\u0172",
        "&Uopf;": "\u{1D54C}",
        "&UpArrow;": "\u2191",
        "&UpArrowBar;": "\u2912",
        "&UpArrowDownArrow;": "\u21C5",
        "&UpDownArrow;": "\u2195",
        "&UpEquilibrium;": "\u296E",
        "&UpTee;": "\u22A5",
        "&UpTeeArrow;": "\u21A5",
        "&Uparrow;": "\u21D1",
        "&Updownarrow;": "\u21D5",
        "&UpperLeftArrow;": "\u2196",
        "&UpperRightArrow;": "\u2197",
        "&Upsi;": "\u03D2",
        "&Upsilon;": "\u03A5",
        "&Uring;": "\u016E",
        "&Uscr;": "\u{1D4B0}",
        "&Utilde;": "\u0168",
        "&Uuml": "\xDC",
        "&Uuml;": "\xDC",
        "&VDash;": "\u22AB",
        "&Vbar;": "\u2AEB",
        "&Vcy;": "\u0412",
        "&Vdash;": "\u22A9",
        "&Vdashl;": "\u2AE6",
        "&Vee;": "\u22C1",
        "&Verbar;": "\u2016",
        "&Vert;": "\u2016",
        "&VerticalBar;": "\u2223",
        "&VerticalLine;": "|",
        "&VerticalSeparator;": "\u2758",
        "&VerticalTilde;": "\u2240",
        "&VeryThinSpace;": "\u200A",
        "&Vfr;": "\u{1D519}",
        "&Vopf;": "\u{1D54D}",
        "&Vscr;": "\u{1D4B1}",
        "&Vvdash;": "\u22AA",
        "&Wcirc;": "\u0174",
        "&Wedge;": "\u22C0",
        "&Wfr;": "\u{1D51A}",
        "&Wopf;": "\u{1D54E}",
        "&Wscr;": "\u{1D4B2}",
        "&Xfr;": "\u{1D51B}",
        "&Xi;": "\u039E",
        "&Xopf;": "\u{1D54F}",
        "&Xscr;": "\u{1D4B3}",
        "&YAcy;": "\u042F",
        "&YIcy;": "\u0407",
        "&YUcy;": "\u042E",
        "&Yacute": "\xDD",
        "&Yacute;": "\xDD",
        "&Ycirc;": "\u0176",
        "&Ycy;": "\u042B",
        "&Yfr;": "\u{1D51C}",
        "&Yopf;": "\u{1D550}",
        "&Yscr;": "\u{1D4B4}",
        "&Yuml;": "\u0178",
        "&ZHcy;": "\u0416",
        "&Zacute;": "\u0179",
        "&Zcaron;": "\u017D",
        "&Zcy;": "\u0417",
        "&Zdot;": "\u017B",
        "&ZeroWidthSpace;": "\u200B",
        "&Zeta;": "\u0396",
        "&Zfr;": "\u2128",
        "&Zopf;": "\u2124",
        "&Zscr;": "\u{1D4B5}",
        "&aacute": "\xE1",
        "&aacute;": "\xE1",
        "&abreve;": "\u0103",
        "&ac;": "\u223E",
        "&acE;": "\u223E\u0333",
        "&acd;": "\u223F",
        "&acirc": "\xE2",
        "&acirc;": "\xE2",
        "&acute": "\xB4",
        "&acute;": "\xB4",
        "&acy;": "\u0430",
        "&aelig": "\xE6",
        "&aelig;": "\xE6",
        "&af;": "\u2061",
        "&afr;": "\u{1D51E}",
        "&agrave": "\xE0",
        "&agrave;": "\xE0",
        "&alefsym;": "\u2135",
        "&aleph;": "\u2135",
        "&alpha;": "\u03B1",
        "&amacr;": "\u0101",
        "&amalg;": "\u2A3F",
        "&amp": "&",
        "&amp;": "&",
        "&and;": "\u2227",
        "&andand;": "\u2A55",
        "&andd;": "\u2A5C",
        "&andslope;": "\u2A58",
        "&andv;": "\u2A5A",
        "&ang;": "\u2220",
        "&ange;": "\u29A4",
        "&angle;": "\u2220",
        "&angmsd;": "\u2221",
        "&angmsdaa;": "\u29A8",
        "&angmsdab;": "\u29A9",
        "&angmsdac;": "\u29AA",
        "&angmsdad;": "\u29AB",
        "&angmsdae;": "\u29AC",
        "&angmsdaf;": "\u29AD",
        "&angmsdag;": "\u29AE",
        "&angmsdah;": "\u29AF",
        "&angrt;": "\u221F",
        "&angrtvb;": "\u22BE",
        "&angrtvbd;": "\u299D",
        "&angsph;": "\u2222",
        "&angst;": "\xC5",
        "&angzarr;": "\u237C",
        "&aogon;": "\u0105",
        "&aopf;": "\u{1D552}",
        "&ap;": "\u2248",
        "&apE;": "\u2A70",
        "&apacir;": "\u2A6F",
        "&ape;": "\u224A",
        "&apid;": "\u224B",
        "&apos;": "'",
        "&approx;": "\u2248",
        "&approxeq;": "\u224A",
        "&aring": "\xE5",
        "&aring;": "\xE5",
        "&ascr;": "\u{1D4B6}",
        "&ast;": "*",
        "&asymp;": "\u2248",
        "&asympeq;": "\u224D",
        "&atilde": "\xE3",
        "&atilde;": "\xE3",
        "&auml": "\xE4",
        "&auml;": "\xE4",
        "&awconint;": "\u2233",
        "&awint;": "\u2A11",
        "&bNot;": "\u2AED",
        "&backcong;": "\u224C",
        "&backepsilon;": "\u03F6",
        "&backprime;": "\u2035",
        "&backsim;": "\u223D",
        "&backsimeq;": "\u22CD",
        "&barvee;": "\u22BD",
        "&barwed;": "\u2305",
        "&barwedge;": "\u2305",
        "&bbrk;": "\u23B5",
        "&bbrktbrk;": "\u23B6",
        "&bcong;": "\u224C",
        "&bcy;": "\u0431",
        "&bdquo;": "\u201E",
        "&becaus;": "\u2235",
        "&because;": "\u2235",
        "&bemptyv;": "\u29B0",
        "&bepsi;": "\u03F6",
        "&bernou;": "\u212C",
        "&beta;": "\u03B2",
        "&beth;": "\u2136",
        "&between;": "\u226C",
        "&bfr;": "\u{1D51F}",
        "&bigcap;": "\u22C2",
        "&bigcirc;": "\u25EF",
        "&bigcup;": "\u22C3",
        "&bigodot;": "\u2A00",
        "&bigoplus;": "\u2A01",
        "&bigotimes;": "\u2A02",
        "&bigsqcup;": "\u2A06",
        "&bigstar;": "\u2605",
        "&bigtriangledown;": "\u25BD",
        "&bigtriangleup;": "\u25B3",
        "&biguplus;": "\u2A04",
        "&bigvee;": "\u22C1",
        "&bigwedge;": "\u22C0",
        "&bkarow;": "\u290D",
        "&blacklozenge;": "\u29EB",
        "&blacksquare;": "\u25AA",
        "&blacktriangle;": "\u25B4",
        "&blacktriangledown;": "\u25BE",
        "&blacktriangleleft;": "\u25C2",
        "&blacktriangleright;": "\u25B8",
        "&blank;": "\u2423",
        "&blk12;": "\u2592",
        "&blk14;": "\u2591",
        "&blk34;": "\u2593",
        "&block;": "\u2588",
        "&bne;": "=\u20E5",
        "&bnequiv;": "\u2261\u20E5",
        "&bnot;": "\u2310",
        "&bopf;": "\u{1D553}",
        "&bot;": "\u22A5",
        "&bottom;": "\u22A5",
        "&bowtie;": "\u22C8",
        "&boxDL;": "\u2557",
        "&boxDR;": "\u2554",
        "&boxDl;": "\u2556",
        "&boxDr;": "\u2553",
        "&boxH;": "\u2550",
        "&boxHD;": "\u2566",
        "&boxHU;": "\u2569",
        "&boxHd;": "\u2564",
        "&boxHu;": "\u2567",
        "&boxUL;": "\u255D",
        "&boxUR;": "\u255A",
        "&boxUl;": "\u255C",
        "&boxUr;": "\u2559",
        "&boxV;": "\u2551",
        "&boxVH;": "\u256C",
        "&boxVL;": "\u2563",
        "&boxVR;": "\u2560",
        "&boxVh;": "\u256B",
        "&boxVl;": "\u2562",
        "&boxVr;": "\u255F",
        "&boxbox;": "\u29C9",
        "&boxdL;": "\u2555",
        "&boxdR;": "\u2552",
        "&boxdl;": "\u2510",
        "&boxdr;": "\u250C",
        "&boxh;": "\u2500",
        "&boxhD;": "\u2565",
        "&boxhU;": "\u2568",
        "&boxhd;": "\u252C",
        "&boxhu;": "\u2534",
        "&boxminus;": "\u229F",
        "&boxplus;": "\u229E",
        "&boxtimes;": "\u22A0",
        "&boxuL;": "\u255B",
        "&boxuR;": "\u2558",
        "&boxul;": "\u2518",
        "&boxur;": "\u2514",
        "&boxv;": "\u2502",
        "&boxvH;": "\u256A",
        "&boxvL;": "\u2561",
        "&boxvR;": "\u255E",
        "&boxvh;": "\u253C",
        "&boxvl;": "\u2524",
        "&boxvr;": "\u251C",
        "&bprime;": "\u2035",
        "&breve;": "\u02D8",
        "&brvbar": "\xA6",
        "&brvbar;": "\xA6",
        "&bscr;": "\u{1D4B7}",
        "&bsemi;": "\u204F",
        "&bsim;": "\u223D",
        "&bsime;": "\u22CD",
        "&bsol;": "\\",
        "&bsolb;": "\u29C5",
        "&bsolhsub;": "\u27C8",
        "&bull;": "\u2022",
        "&bullet;": "\u2022",
        "&bump;": "\u224E",
        "&bumpE;": "\u2AAE",
        "&bumpe;": "\u224F",
        "&bumpeq;": "\u224F",
        "&cacute;": "\u0107",
        "&cap;": "\u2229",
        "&capand;": "\u2A44",
        "&capbrcup;": "\u2A49",
        "&capcap;": "\u2A4B",
        "&capcup;": "\u2A47",
        "&capdot;": "\u2A40",
        "&caps;": "\u2229\uFE00",
        "&caret;": "\u2041",
        "&caron;": "\u02C7",
        "&ccaps;": "\u2A4D",
        "&ccaron;": "\u010D",
        "&ccedil": "\xE7",
        "&ccedil;": "\xE7",
        "&ccirc;": "\u0109",
        "&ccups;": "\u2A4C",
        "&ccupssm;": "\u2A50",
        "&cdot;": "\u010B",
        "&cedil": "\xB8",
        "&cedil;": "\xB8",
        "&cemptyv;": "\u29B2",
        "&cent": "\xA2",
        "&cent;": "\xA2",
        "&centerdot;": "\xB7",
        "&cfr;": "\u{1D520}",
        "&chcy;": "\u0447",
        "&check;": "\u2713",
        "&checkmark;": "\u2713",
        "&chi;": "\u03C7",
        "&cir;": "\u25CB",
        "&cirE;": "\u29C3",
        "&circ;": "\u02C6",
        "&circeq;": "\u2257",
        "&circlearrowleft;": "\u21BA",
        "&circlearrowright;": "\u21BB",
        "&circledR;": "\xAE",
        "&circledS;": "\u24C8",
        "&circledast;": "\u229B",
        "&circledcirc;": "\u229A",
        "&circleddash;": "\u229D",
        "&cire;": "\u2257",
        "&cirfnint;": "\u2A10",
        "&cirmid;": "\u2AEF",
        "&cirscir;": "\u29C2",
        "&clubs;": "\u2663",
        "&clubsuit;": "\u2663",
        "&colon;": ":",
        "&colone;": "\u2254",
        "&coloneq;": "\u2254",
        "&comma;": ",",
        "&commat;": "@",
        "&comp;": "\u2201",
        "&compfn;": "\u2218",
        "&complement;": "\u2201",
        "&complexes;": "\u2102",
        "&cong;": "\u2245",
        "&congdot;": "\u2A6D",
        "&conint;": "\u222E",
        "&copf;": "\u{1D554}",
        "&coprod;": "\u2210",
        "&copy": "\xA9",
        "&copy;": "\xA9",
        "&copysr;": "\u2117",
        "&crarr;": "\u21B5",
        "&cross;": "\u2717",
        "&cscr;": "\u{1D4B8}",
        "&csub;": "\u2ACF",
        "&csube;": "\u2AD1",
        "&csup;": "\u2AD0",
        "&csupe;": "\u2AD2",
        "&ctdot;": "\u22EF",
        "&cudarrl;": "\u2938",
        "&cudarrr;": "\u2935",
        "&cuepr;": "\u22DE",
        "&cuesc;": "\u22DF",
        "&cularr;": "\u21B6",
        "&cularrp;": "\u293D",
        "&cup;": "\u222A",
        "&cupbrcap;": "\u2A48",
        "&cupcap;": "\u2A46",
        "&cupcup;": "\u2A4A",
        "&cupdot;": "\u228D",
        "&cupor;": "\u2A45",
        "&cups;": "\u222A\uFE00",
        "&curarr;": "\u21B7",
        "&curarrm;": "\u293C",
        "&curlyeqprec;": "\u22DE",
        "&curlyeqsucc;": "\u22DF",
        "&curlyvee;": "\u22CE",
        "&curlywedge;": "\u22CF",
        "&curren": "\xA4",
        "&curren;": "\xA4",
        "&curvearrowleft;": "\u21B6",
        "&curvearrowright;": "\u21B7",
        "&cuvee;": "\u22CE",
        "&cuwed;": "\u22CF",
        "&cwconint;": "\u2232",
        "&cwint;": "\u2231",
        "&cylcty;": "\u232D",
        "&dArr;": "\u21D3",
        "&dHar;": "\u2965",
        "&dagger;": "\u2020",
        "&daleth;": "\u2138",
        "&darr;": "\u2193",
        "&dash;": "\u2010",
        "&dashv;": "\u22A3",
        "&dbkarow;": "\u290F",
        "&dblac;": "\u02DD",
        "&dcaron;": "\u010F",
        "&dcy;": "\u0434",
        "&dd;": "\u2146",
        "&ddagger;": "\u2021",
        "&ddarr;": "\u21CA",
        "&ddotseq;": "\u2A77",
        "&deg": "\xB0",
        "&deg;": "\xB0",
        "&delta;": "\u03B4",
        "&demptyv;": "\u29B1",
        "&dfisht;": "\u297F",
        "&dfr;": "\u{1D521}",
        "&dharl;": "\u21C3",
        "&dharr;": "\u21C2",
        "&diam;": "\u22C4",
        "&diamond;": "\u22C4",
        "&diamondsuit;": "\u2666",
        "&diams;": "\u2666",
        "&die;": "\xA8",
        "&digamma;": "\u03DD",
        "&disin;": "\u22F2",
        "&div;": "\xF7",
        "&divide": "\xF7",
        "&divide;": "\xF7",
        "&divideontimes;": "\u22C7",
        "&divonx;": "\u22C7",
        "&djcy;": "\u0452",
        "&dlcorn;": "\u231E",
        "&dlcrop;": "\u230D",
        "&dollar;": "$",
        "&dopf;": "\u{1D555}",
        "&dot;": "\u02D9",
        "&doteq;": "\u2250",
        "&doteqdot;": "\u2251",
        "&dotminus;": "\u2238",
        "&dotplus;": "\u2214",
        "&dotsquare;": "\u22A1",
        "&doublebarwedge;": "\u2306",
        "&downarrow;": "\u2193",
        "&downdownarrows;": "\u21CA",
        "&downharpoonleft;": "\u21C3",
        "&downharpoonright;": "\u21C2",
        "&drbkarow;": "\u2910",
        "&drcorn;": "\u231F",
        "&drcrop;": "\u230C",
        "&dscr;": "\u{1D4B9}",
        "&dscy;": "\u0455",
        "&dsol;": "\u29F6",
        "&dstrok;": "\u0111",
        "&dtdot;": "\u22F1",
        "&dtri;": "\u25BF",
        "&dtrif;": "\u25BE",
        "&duarr;": "\u21F5",
        "&duhar;": "\u296F",
        "&dwangle;": "\u29A6",
        "&dzcy;": "\u045F",
        "&dzigrarr;": "\u27FF",
        "&eDDot;": "\u2A77",
        "&eDot;": "\u2251",
        "&eacute": "\xE9",
        "&eacute;": "\xE9",
        "&easter;": "\u2A6E",
        "&ecaron;": "\u011B",
        "&ecir;": "\u2256",
        "&ecirc": "\xEA",
        "&ecirc;": "\xEA",
        "&ecolon;": "\u2255",
        "&ecy;": "\u044D",
        "&edot;": "\u0117",
        "&ee;": "\u2147",
        "&efDot;": "\u2252",
        "&efr;": "\u{1D522}",
        "&eg;": "\u2A9A",
        "&egrave": "\xE8",
        "&egrave;": "\xE8",
        "&egs;": "\u2A96",
        "&egsdot;": "\u2A98",
        "&el;": "\u2A99",
        "&elinters;": "\u23E7",
        "&ell;": "\u2113",
        "&els;": "\u2A95",
        "&elsdot;": "\u2A97",
        "&emacr;": "\u0113",
        "&empty;": "\u2205",
        "&emptyset;": "\u2205",
        "&emptyv;": "\u2205",
        "&emsp13;": "\u2004",
        "&emsp14;": "\u2005",
        "&emsp;": "\u2003",
        "&eng;": "\u014B",
        "&ensp;": "\u2002",
        "&eogon;": "\u0119",
        "&eopf;": "\u{1D556}",
        "&epar;": "\u22D5",
        "&eparsl;": "\u29E3",
        "&eplus;": "\u2A71",
        "&epsi;": "\u03B5",
        "&epsilon;": "\u03B5",
        "&epsiv;": "\u03F5",
        "&eqcirc;": "\u2256",
        "&eqcolon;": "\u2255",
        "&eqsim;": "\u2242",
        "&eqslantgtr;": "\u2A96",
        "&eqslantless;": "\u2A95",
        "&equals;": "=",
        "&equest;": "\u225F",
        "&equiv;": "\u2261",
        "&equivDD;": "\u2A78",
        "&eqvparsl;": "\u29E5",
        "&erDot;": "\u2253",
        "&erarr;": "\u2971",
        "&escr;": "\u212F",
        "&esdot;": "\u2250",
        "&esim;": "\u2242",
        "&eta;": "\u03B7",
        "&eth": "\xF0",
        "&eth;": "\xF0",
        "&euml": "\xEB",
        "&euml;": "\xEB",
        "&euro;": "\u20AC",
        "&excl;": "!",
        "&exist;": "\u2203",
        "&expectation;": "\u2130",
        "&exponentiale;": "\u2147",
        "&fallingdotseq;": "\u2252",
        "&fcy;": "\u0444",
        "&female;": "\u2640",
        "&ffilig;": "\uFB03",
        "&fflig;": "\uFB00",
        "&ffllig;": "\uFB04",
        "&ffr;": "\u{1D523}",
        "&filig;": "\uFB01",
        "&fjlig;": "fj",
        "&flat;": "\u266D",
        "&fllig;": "\uFB02",
        "&fltns;": "\u25B1",
        "&fnof;": "\u0192",
        "&fopf;": "\u{1D557}",
        "&forall;": "\u2200",
        "&fork;": "\u22D4",
        "&forkv;": "\u2AD9",
        "&fpartint;": "\u2A0D",
        "&frac12": "\xBD",
        "&frac12;": "\xBD",
        "&frac13;": "\u2153",
        "&frac14": "\xBC",
        "&frac14;": "\xBC",
        "&frac15;": "\u2155",
        "&frac16;": "\u2159",
        "&frac18;": "\u215B",
        "&frac23;": "\u2154",
        "&frac25;": "\u2156",
        "&frac34": "\xBE",
        "&frac34;": "\xBE",
        "&frac35;": "\u2157",
        "&frac38;": "\u215C",
        "&frac45;": "\u2158",
        "&frac56;": "\u215A",
        "&frac58;": "\u215D",
        "&frac78;": "\u215E",
        "&frasl;": "\u2044",
        "&frown;": "\u2322",
        "&fscr;": "\u{1D4BB}",
        "&gE;": "\u2267",
        "&gEl;": "\u2A8C",
        "&gacute;": "\u01F5",
        "&gamma;": "\u03B3",
        "&gammad;": "\u03DD",
        "&gap;": "\u2A86",
        "&gbreve;": "\u011F",
        "&gcirc;": "\u011D",
        "&gcy;": "\u0433",
        "&gdot;": "\u0121",
        "&ge;": "\u2265",
        "&gel;": "\u22DB",
        "&geq;": "\u2265",
        "&geqq;": "\u2267",
        "&geqslant;": "\u2A7E",
        "&ges;": "\u2A7E",
        "&gescc;": "\u2AA9",
        "&gesdot;": "\u2A80",
        "&gesdoto;": "\u2A82",
        "&gesdotol;": "\u2A84",
        "&gesl;": "\u22DB\uFE00",
        "&gesles;": "\u2A94",
        "&gfr;": "\u{1D524}",
        "&gg;": "\u226B",
        "&ggg;": "\u22D9",
        "&gimel;": "\u2137",
        "&gjcy;": "\u0453",
        "&gl;": "\u2277",
        "&glE;": "\u2A92",
        "&gla;": "\u2AA5",
        "&glj;": "\u2AA4",
        "&gnE;": "\u2269",
        "&gnap;": "\u2A8A",
        "&gnapprox;": "\u2A8A",
        "&gne;": "\u2A88",
        "&gneq;": "\u2A88",
        "&gneqq;": "\u2269",
        "&gnsim;": "\u22E7",
        "&gopf;": "\u{1D558}",
        "&grave;": "`",
        "&gscr;": "\u210A",
        "&gsim;": "\u2273",
        "&gsime;": "\u2A8E",
        "&gsiml;": "\u2A90",
        "&gt": ">",
        "&gt;": ">",
        "&gtcc;": "\u2AA7",
        "&gtcir;": "\u2A7A",
        "&gtdot;": "\u22D7",
        "&gtlPar;": "\u2995",
        "&gtquest;": "\u2A7C",
        "&gtrapprox;": "\u2A86",
        "&gtrarr;": "\u2978",
        "&gtrdot;": "\u22D7",
        "&gtreqless;": "\u22DB",
        "&gtreqqless;": "\u2A8C",
        "&gtrless;": "\u2277",
        "&gtrsim;": "\u2273",
        "&gvertneqq;": "\u2269\uFE00",
        "&gvnE;": "\u2269\uFE00",
        "&hArr;": "\u21D4",
        "&hairsp;": "\u200A",
        "&half;": "\xBD",
        "&hamilt;": "\u210B",
        "&hardcy;": "\u044A",
        "&harr;": "\u2194",
        "&harrcir;": "\u2948",
        "&harrw;": "\u21AD",
        "&hbar;": "\u210F",
        "&hcirc;": "\u0125",
        "&hearts;": "\u2665",
        "&heartsuit;": "\u2665",
        "&hellip;": "\u2026",
        "&hercon;": "\u22B9",
        "&hfr;": "\u{1D525}",
        "&hksearow;": "\u2925",
        "&hkswarow;": "\u2926",
        "&hoarr;": "\u21FF",
        "&homtht;": "\u223B",
        "&hookleftarrow;": "\u21A9",
        "&hookrightarrow;": "\u21AA",
        "&hopf;": "\u{1D559}",
        "&horbar;": "\u2015",
        "&hscr;": "\u{1D4BD}",
        "&hslash;": "\u210F",
        "&hstrok;": "\u0127",
        "&hybull;": "\u2043",
        "&hyphen;": "\u2010",
        "&iacute": "\xED",
        "&iacute;": "\xED",
        "&ic;": "\u2063",
        "&icirc": "\xEE",
        "&icirc;": "\xEE",
        "&icy;": "\u0438",
        "&iecy;": "\u0435",
        "&iexcl": "\xA1",
        "&iexcl;": "\xA1",
        "&iff;": "\u21D4",
        "&ifr;": "\u{1D526}",
        "&igrave": "\xEC",
        "&igrave;": "\xEC",
        "&ii;": "\u2148",
        "&iiiint;": "\u2A0C",
        "&iiint;": "\u222D",
        "&iinfin;": "\u29DC",
        "&iiota;": "\u2129",
        "&ijlig;": "\u0133",
        "&imacr;": "\u012B",
        "&image;": "\u2111",
        "&imagline;": "\u2110",
        "&imagpart;": "\u2111",
        "&imath;": "\u0131",
        "&imof;": "\u22B7",
        "&imped;": "\u01B5",
        "&in;": "\u2208",
        "&incare;": "\u2105",
        "&infin;": "\u221E",
        "&infintie;": "\u29DD",
        "&inodot;": "\u0131",
        "&int;": "\u222B",
        "&intcal;": "\u22BA",
        "&integers;": "\u2124",
        "&intercal;": "\u22BA",
        "&intlarhk;": "\u2A17",
        "&intprod;": "\u2A3C",
        "&iocy;": "\u0451",
        "&iogon;": "\u012F",
        "&iopf;": "\u{1D55A}",
        "&iota;": "\u03B9",
        "&iprod;": "\u2A3C",
        "&iquest": "\xBF",
        "&iquest;": "\xBF",
        "&iscr;": "\u{1D4BE}",
        "&isin;": "\u2208",
        "&isinE;": "\u22F9",
        "&isindot;": "\u22F5",
        "&isins;": "\u22F4",
        "&isinsv;": "\u22F3",
        "&isinv;": "\u2208",
        "&it;": "\u2062",
        "&itilde;": "\u0129",
        "&iukcy;": "\u0456",
        "&iuml": "\xEF",
        "&iuml;": "\xEF",
        "&jcirc;": "\u0135",
        "&jcy;": "\u0439",
        "&jfr;": "\u{1D527}",
        "&jmath;": "\u0237",
        "&jopf;": "\u{1D55B}",
        "&jscr;": "\u{1D4BF}",
        "&jsercy;": "\u0458",
        "&jukcy;": "\u0454",
        "&kappa;": "\u03BA",
        "&kappav;": "\u03F0",
        "&kcedil;": "\u0137",
        "&kcy;": "\u043A",
        "&kfr;": "\u{1D528}",
        "&kgreen;": "\u0138",
        "&khcy;": "\u0445",
        "&kjcy;": "\u045C",
        "&kopf;": "\u{1D55C}",
        "&kscr;": "\u{1D4C0}",
        "&lAarr;": "\u21DA",
        "&lArr;": "\u21D0",
        "&lAtail;": "\u291B",
        "&lBarr;": "\u290E",
        "&lE;": "\u2266",
        "&lEg;": "\u2A8B",
        "&lHar;": "\u2962",
        "&lacute;": "\u013A",
        "&laemptyv;": "\u29B4",
        "&lagran;": "\u2112",
        "&lambda;": "\u03BB",
        "&lang;": "\u27E8",
        "&langd;": "\u2991",
        "&langle;": "\u27E8",
        "&lap;": "\u2A85",
        "&laquo": "\xAB",
        "&laquo;": "\xAB",
        "&larr;": "\u2190",
        "&larrb;": "\u21E4",
        "&larrbfs;": "\u291F",
        "&larrfs;": "\u291D",
        "&larrhk;": "\u21A9",
        "&larrlp;": "\u21AB",
        "&larrpl;": "\u2939",
        "&larrsim;": "\u2973",
        "&larrtl;": "\u21A2",
        "&lat;": "\u2AAB",
        "&latail;": "\u2919",
        "&late;": "\u2AAD",
        "&lates;": "\u2AAD\uFE00",
        "&lbarr;": "\u290C",
        "&lbbrk;": "\u2772",
        "&lbrace;": "{",
        "&lbrack;": "[",
        "&lbrke;": "\u298B",
        "&lbrksld;": "\u298F",
        "&lbrkslu;": "\u298D",
        "&lcaron;": "\u013E",
        "&lcedil;": "\u013C",
        "&lceil;": "\u2308",
        "&lcub;": "{",
        "&lcy;": "\u043B",
        "&ldca;": "\u2936",
        "&ldquo;": "\u201C",
        "&ldquor;": "\u201E",
        "&ldrdhar;": "\u2967",
        "&ldrushar;": "\u294B",
        "&ldsh;": "\u21B2",
        "&le;": "\u2264",
        "&leftarrow;": "\u2190",
        "&leftarrowtail;": "\u21A2",
        "&leftharpoondown;": "\u21BD",
        "&leftharpoonup;": "\u21BC",
        "&leftleftarrows;": "\u21C7",
        "&leftrightarrow;": "\u2194",
        "&leftrightarrows;": "\u21C6",
        "&leftrightharpoons;": "\u21CB",
        "&leftrightsquigarrow;": "\u21AD",
        "&leftthreetimes;": "\u22CB",
        "&leg;": "\u22DA",
        "&leq;": "\u2264",
        "&leqq;": "\u2266",
        "&leqslant;": "\u2A7D",
        "&les;": "\u2A7D",
        "&lescc;": "\u2AA8",
        "&lesdot;": "\u2A7F",
        "&lesdoto;": "\u2A81",
        "&lesdotor;": "\u2A83",
        "&lesg;": "\u22DA\uFE00",
        "&lesges;": "\u2A93",
        "&lessapprox;": "\u2A85",
        "&lessdot;": "\u22D6",
        "&lesseqgtr;": "\u22DA",
        "&lesseqqgtr;": "\u2A8B",
        "&lessgtr;": "\u2276",
        "&lesssim;": "\u2272",
        "&lfisht;": "\u297C",
        "&lfloor;": "\u230A",
        "&lfr;": "\u{1D529}",
        "&lg;": "\u2276",
        "&lgE;": "\u2A91",
        "&lhard;": "\u21BD",
        "&lharu;": "\u21BC",
        "&lharul;": "\u296A",
        "&lhblk;": "\u2584",
        "&ljcy;": "\u0459",
        "&ll;": "\u226A",
        "&llarr;": "\u21C7",
        "&llcorner;": "\u231E",
        "&llhard;": "\u296B",
        "&lltri;": "\u25FA",
        "&lmidot;": "\u0140",
        "&lmoust;": "\u23B0",
        "&lmoustache;": "\u23B0",
        "&lnE;": "\u2268",
        "&lnap;": "\u2A89",
        "&lnapprox;": "\u2A89",
        "&lne;": "\u2A87",
        "&lneq;": "\u2A87",
        "&lneqq;": "\u2268",
        "&lnsim;": "\u22E6",
        "&loang;": "\u27EC",
        "&loarr;": "\u21FD",
        "&lobrk;": "\u27E6",
        "&longleftarrow;": "\u27F5",
        "&longleftrightarrow;": "\u27F7",
        "&longmapsto;": "\u27FC",
        "&longrightarrow;": "\u27F6",
        "&looparrowleft;": "\u21AB",
        "&looparrowright;": "\u21AC",
        "&lopar;": "\u2985",
        "&lopf;": "\u{1D55D}",
        "&loplus;": "\u2A2D",
        "&lotimes;": "\u2A34",
        "&lowast;": "\u2217",
        "&lowbar;": "_",
        "&loz;": "\u25CA",
        "&lozenge;": "\u25CA",
        "&lozf;": "\u29EB",
        "&lpar;": "(",
        "&lparlt;": "\u2993",
        "&lrarr;": "\u21C6",
        "&lrcorner;": "\u231F",
        "&lrhar;": "\u21CB",
        "&lrhard;": "\u296D",
        "&lrm;": "\u200E",
        "&lrtri;": "\u22BF",
        "&lsaquo;": "\u2039",
        "&lscr;": "\u{1D4C1}",
        "&lsh;": "\u21B0",
        "&lsim;": "\u2272",
        "&lsime;": "\u2A8D",
        "&lsimg;": "\u2A8F",
        "&lsqb;": "[",
        "&lsquo;": "\u2018",
        "&lsquor;": "\u201A",
        "&lstrok;": "\u0142",
        "&lt": "<",
        "&lt;": "<",
        "&ltcc;": "\u2AA6",
        "&ltcir;": "\u2A79",
        "&ltdot;": "\u22D6",
        "&lthree;": "\u22CB",
        "&ltimes;": "\u22C9",
        "&ltlarr;": "\u2976",
        "&ltquest;": "\u2A7B",
        "&ltrPar;": "\u2996",
        "&ltri;": "\u25C3",
        "&ltrie;": "\u22B4",
        "&ltrif;": "\u25C2",
        "&lurdshar;": "\u294A",
        "&luruhar;": "\u2966",
        "&lvertneqq;": "\u2268\uFE00",
        "&lvnE;": "\u2268\uFE00",
        "&mDDot;": "\u223A",
        "&macr": "\xAF",
        "&macr;": "\xAF",
        "&male;": "\u2642",
        "&malt;": "\u2720",
        "&maltese;": "\u2720",
        "&map;": "\u21A6",
        "&mapsto;": "\u21A6",
        "&mapstodown;": "\u21A7",
        "&mapstoleft;": "\u21A4",
        "&mapstoup;": "\u21A5",
        "&marker;": "\u25AE",
        "&mcomma;": "\u2A29",
        "&mcy;": "\u043C",
        "&mdash;": "\u2014",
        "&measuredangle;": "\u2221",
        "&mfr;": "\u{1D52A}",
        "&mho;": "\u2127",
        "&micro": "\xB5",
        "&micro;": "\xB5",
        "&mid;": "\u2223",
        "&midast;": "*",
        "&midcir;": "\u2AF0",
        "&middot": "\xB7",
        "&middot;": "\xB7",
        "&minus;": "\u2212",
        "&minusb;": "\u229F",
        "&minusd;": "\u2238",
        "&minusdu;": "\u2A2A",
        "&mlcp;": "\u2ADB",
        "&mldr;": "\u2026",
        "&mnplus;": "\u2213",
        "&models;": "\u22A7",
        "&mopf;": "\u{1D55E}",
        "&mp;": "\u2213",
        "&mscr;": "\u{1D4C2}",
        "&mstpos;": "\u223E",
        "&mu;": "\u03BC",
        "&multimap;": "\u22B8",
        "&mumap;": "\u22B8",
        "&nGg;": "\u22D9\u0338",
        "&nGt;": "\u226B\u20D2",
        "&nGtv;": "\u226B\u0338",
        "&nLeftarrow;": "\u21CD",
        "&nLeftrightarrow;": "\u21CE",
        "&nLl;": "\u22D8\u0338",
        "&nLt;": "\u226A\u20D2",
        "&nLtv;": "\u226A\u0338",
        "&nRightarrow;": "\u21CF",
        "&nVDash;": "\u22AF",
        "&nVdash;": "\u22AE",
        "&nabla;": "\u2207",
        "&nacute;": "\u0144",
        "&nang;": "\u2220\u20D2",
        "&nap;": "\u2249",
        "&napE;": "\u2A70\u0338",
        "&napid;": "\u224B\u0338",
        "&napos;": "\u0149",
        "&napprox;": "\u2249",
        "&natur;": "\u266E",
        "&natural;": "\u266E",
        "&naturals;": "\u2115",
        "&nbsp": "\xA0",
        "&nbsp;": "\xA0",
        "&nbump;": "\u224E\u0338",
        "&nbumpe;": "\u224F\u0338",
        "&ncap;": "\u2A43",
        "&ncaron;": "\u0148",
        "&ncedil;": "\u0146",
        "&ncong;": "\u2247",
        "&ncongdot;": "\u2A6D\u0338",
        "&ncup;": "\u2A42",
        "&ncy;": "\u043D",
        "&ndash;": "\u2013",
        "&ne;": "\u2260",
        "&neArr;": "\u21D7",
        "&nearhk;": "\u2924",
        "&nearr;": "\u2197",
        "&nearrow;": "\u2197",
        "&nedot;": "\u2250\u0338",
        "&nequiv;": "\u2262",
        "&nesear;": "\u2928",
        "&nesim;": "\u2242\u0338",
        "&nexist;": "\u2204",
        "&nexists;": "\u2204",
        "&nfr;": "\u{1D52B}",
        "&ngE;": "\u2267\u0338",
        "&nge;": "\u2271",
        "&ngeq;": "\u2271",
        "&ngeqq;": "\u2267\u0338",
        "&ngeqslant;": "\u2A7E\u0338",
        "&nges;": "\u2A7E\u0338",
        "&ngsim;": "\u2275",
        "&ngt;": "\u226F",
        "&ngtr;": "\u226F",
        "&nhArr;": "\u21CE",
        "&nharr;": "\u21AE",
        "&nhpar;": "\u2AF2",
        "&ni;": "\u220B",
        "&nis;": "\u22FC",
        "&nisd;": "\u22FA",
        "&niv;": "\u220B",
        "&njcy;": "\u045A",
        "&nlArr;": "\u21CD",
        "&nlE;": "\u2266\u0338",
        "&nlarr;": "\u219A",
        "&nldr;": "\u2025",
        "&nle;": "\u2270",
        "&nleftarrow;": "\u219A",
        "&nleftrightarrow;": "\u21AE",
        "&nleq;": "\u2270",
        "&nleqq;": "\u2266\u0338",
        "&nleqslant;": "\u2A7D\u0338",
        "&nles;": "\u2A7D\u0338",
        "&nless;": "\u226E",
        "&nlsim;": "\u2274",
        "&nlt;": "\u226E",
        "&nltri;": "\u22EA",
        "&nltrie;": "\u22EC",
        "&nmid;": "\u2224",
        "&nopf;": "\u{1D55F}",
        "&not": "\xAC",
        "&not;": "\xAC",
        "&notin;": "\u2209",
        "&notinE;": "\u22F9\u0338",
        "&notindot;": "\u22F5\u0338",
        "&notinva;": "\u2209",
        "&notinvb;": "\u22F7",
        "&notinvc;": "\u22F6",
        "&notni;": "\u220C",
        "&notniva;": "\u220C",
        "&notnivb;": "\u22FE",
        "&notnivc;": "\u22FD",
        "&npar;": "\u2226",
        "&nparallel;": "\u2226",
        "&nparsl;": "\u2AFD\u20E5",
        "&npart;": "\u2202\u0338",
        "&npolint;": "\u2A14",
        "&npr;": "\u2280",
        "&nprcue;": "\u22E0",
        "&npre;": "\u2AAF\u0338",
        "&nprec;": "\u2280",
        "&npreceq;": "\u2AAF\u0338",
        "&nrArr;": "\u21CF",
        "&nrarr;": "\u219B",
        "&nrarrc;": "\u2933\u0338",
        "&nrarrw;": "\u219D\u0338",
        "&nrightarrow;": "\u219B",
        "&nrtri;": "\u22EB",
        "&nrtrie;": "\u22ED",
        "&nsc;": "\u2281",
        "&nsccue;": "\u22E1",
        "&nsce;": "\u2AB0\u0338",
        "&nscr;": "\u{1D4C3}",
        "&nshortmid;": "\u2224",
        "&nshortparallel;": "\u2226",
        "&nsim;": "\u2241",
        "&nsime;": "\u2244",
        "&nsimeq;": "\u2244",
        "&nsmid;": "\u2224",
        "&nspar;": "\u2226",
        "&nsqsube;": "\u22E2",
        "&nsqsupe;": "\u22E3",
        "&nsub;": "\u2284",
        "&nsubE;": "\u2AC5\u0338",
        "&nsube;": "\u2288",
        "&nsubset;": "\u2282\u20D2",
        "&nsubseteq;": "\u2288",
        "&nsubseteqq;": "\u2AC5\u0338",
        "&nsucc;": "\u2281",
        "&nsucceq;": "\u2AB0\u0338",
        "&nsup;": "\u2285",
        "&nsupE;": "\u2AC6\u0338",
        "&nsupe;": "\u2289",
        "&nsupset;": "\u2283\u20D2",
        "&nsupseteq;": "\u2289",
        "&nsupseteqq;": "\u2AC6\u0338",
        "&ntgl;": "\u2279",
        "&ntilde": "\xF1",
        "&ntilde;": "\xF1",
        "&ntlg;": "\u2278",
        "&ntriangleleft;": "\u22EA",
        "&ntrianglelefteq;": "\u22EC",
        "&ntriangleright;": "\u22EB",
        "&ntrianglerighteq;": "\u22ED",
        "&nu;": "\u03BD",
        "&num;": "#",
        "&numero;": "\u2116",
        "&numsp;": "\u2007",
        "&nvDash;": "\u22AD",
        "&nvHarr;": "\u2904",
        "&nvap;": "\u224D\u20D2",
        "&nvdash;": "\u22AC",
        "&nvge;": "\u2265\u20D2",
        "&nvgt;": ">\u20D2",
        "&nvinfin;": "\u29DE",
        "&nvlArr;": "\u2902",
        "&nvle;": "\u2264\u20D2",
        "&nvlt;": "<\u20D2",
        "&nvltrie;": "\u22B4\u20D2",
        "&nvrArr;": "\u2903",
        "&nvrtrie;": "\u22B5\u20D2",
        "&nvsim;": "\u223C\u20D2",
        "&nwArr;": "\u21D6",
        "&nwarhk;": "\u2923",
        "&nwarr;": "\u2196",
        "&nwarrow;": "\u2196",
        "&nwnear;": "\u2927",
        "&oS;": "\u24C8",
        "&oacute": "\xF3",
        "&oacute;": "\xF3",
        "&oast;": "\u229B",
        "&ocir;": "\u229A",
        "&ocirc": "\xF4",
        "&ocirc;": "\xF4",
        "&ocy;": "\u043E",
        "&odash;": "\u229D",
        "&odblac;": "\u0151",
        "&odiv;": "\u2A38",
        "&odot;": "\u2299",
        "&odsold;": "\u29BC",
        "&oelig;": "\u0153",
        "&ofcir;": "\u29BF",
        "&ofr;": "\u{1D52C}",
        "&ogon;": "\u02DB",
        "&ograve": "\xF2",
        "&ograve;": "\xF2",
        "&ogt;": "\u29C1",
        "&ohbar;": "\u29B5",
        "&ohm;": "\u03A9",
        "&oint;": "\u222E",
        "&olarr;": "\u21BA",
        "&olcir;": "\u29BE",
        "&olcross;": "\u29BB",
        "&oline;": "\u203E",
        "&olt;": "\u29C0",
        "&omacr;": "\u014D",
        "&omega;": "\u03C9",
        "&omicron;": "\u03BF",
        "&omid;": "\u29B6",
        "&ominus;": "\u2296",
        "&oopf;": "\u{1D560}",
        "&opar;": "\u29B7",
        "&operp;": "\u29B9",
        "&oplus;": "\u2295",
        "&or;": "\u2228",
        "&orarr;": "\u21BB",
        "&ord;": "\u2A5D",
        "&order;": "\u2134",
        "&orderof;": "\u2134",
        "&ordf": "\xAA",
        "&ordf;": "\xAA",
        "&ordm": "\xBA",
        "&ordm;": "\xBA",
        "&origof;": "\u22B6",
        "&oror;": "\u2A56",
        "&orslope;": "\u2A57",
        "&orv;": "\u2A5B",
        "&oscr;": "\u2134",
        "&oslash": "\xF8",
        "&oslash;": "\xF8",
        "&osol;": "\u2298",
        "&otilde": "\xF5",
        "&otilde;": "\xF5",
        "&otimes;": "\u2297",
        "&otimesas;": "\u2A36",
        "&ouml": "\xF6",
        "&ouml;": "\xF6",
        "&ovbar;": "\u233D",
        "&par;": "\u2225",
        "&para": "\xB6",
        "&para;": "\xB6",
        "&parallel;": "\u2225",
        "&parsim;": "\u2AF3",
        "&parsl;": "\u2AFD",
        "&part;": "\u2202",
        "&pcy;": "\u043F",
        "&percnt;": "%",
        "&period;": ".",
        "&permil;": "\u2030",
        "&perp;": "\u22A5",
        "&pertenk;": "\u2031",
        "&pfr;": "\u{1D52D}",
        "&phi;": "\u03C6",
        "&phiv;": "\u03D5",
        "&phmmat;": "\u2133",
        "&phone;": "\u260E",
        "&pi;": "\u03C0",
        "&pitchfork;": "\u22D4",
        "&piv;": "\u03D6",
        "&planck;": "\u210F",
        "&planckh;": "\u210E",
        "&plankv;": "\u210F",
        "&plus;": "+",
        "&plusacir;": "\u2A23",
        "&plusb;": "\u229E",
        "&pluscir;": "\u2A22",
        "&plusdo;": "\u2214",
        "&plusdu;": "\u2A25",
        "&pluse;": "\u2A72",
        "&plusmn": "\xB1",
        "&plusmn;": "\xB1",
        "&plussim;": "\u2A26",
        "&plustwo;": "\u2A27",
        "&pm;": "\xB1",
        "&pointint;": "\u2A15",
        "&popf;": "\u{1D561}",
        "&pound": "\xA3",
        "&pound;": "\xA3",
        "&pr;": "\u227A",
        "&prE;": "\u2AB3",
        "&prap;": "\u2AB7",
        "&prcue;": "\u227C",
        "&pre;": "\u2AAF",
        "&prec;": "\u227A",
        "&precapprox;": "\u2AB7",
        "&preccurlyeq;": "\u227C",
        "&preceq;": "\u2AAF",
        "&precnapprox;": "\u2AB9",
        "&precneqq;": "\u2AB5",
        "&precnsim;": "\u22E8",
        "&precsim;": "\u227E",
        "&prime;": "\u2032",
        "&primes;": "\u2119",
        "&prnE;": "\u2AB5",
        "&prnap;": "\u2AB9",
        "&prnsim;": "\u22E8",
        "&prod;": "\u220F",
        "&profalar;": "\u232E",
        "&profline;": "\u2312",
        "&profsurf;": "\u2313",
        "&prop;": "\u221D",
        "&propto;": "\u221D",
        "&prsim;": "\u227E",
        "&prurel;": "\u22B0",
        "&pscr;": "\u{1D4C5}",
        "&psi;": "\u03C8",
        "&puncsp;": "\u2008",
        "&qfr;": "\u{1D52E}",
        "&qint;": "\u2A0C",
        "&qopf;": "\u{1D562}",
        "&qprime;": "\u2057",
        "&qscr;": "\u{1D4C6}",
        "&quaternions;": "\u210D",
        "&quatint;": "\u2A16",
        "&quest;": "?",
        "&questeq;": "\u225F",
        "&quot": '"',
        "&quot;": '"',
        "&rAarr;": "\u21DB",
        "&rArr;": "\u21D2",
        "&rAtail;": "\u291C",
        "&rBarr;": "\u290F",
        "&rHar;": "\u2964",
        "&race;": "\u223D\u0331",
        "&racute;": "\u0155",
        "&radic;": "\u221A",
        "&raemptyv;": "\u29B3",
        "&rang;": "\u27E9",
        "&rangd;": "\u2992",
        "&range;": "\u29A5",
        "&rangle;": "\u27E9",
        "&raquo": "\xBB",
        "&raquo;": "\xBB",
        "&rarr;": "\u2192",
        "&rarrap;": "\u2975",
        "&rarrb;": "\u21E5",
        "&rarrbfs;": "\u2920",
        "&rarrc;": "\u2933",
        "&rarrfs;": "\u291E",
        "&rarrhk;": "\u21AA",
        "&rarrlp;": "\u21AC",
        "&rarrpl;": "\u2945",
        "&rarrsim;": "\u2974",
        "&rarrtl;": "\u21A3",
        "&rarrw;": "\u219D",
        "&ratail;": "\u291A",
        "&ratio;": "\u2236",
        "&rationals;": "\u211A",
        "&rbarr;": "\u290D",
        "&rbbrk;": "\u2773",
        "&rbrace;": "}",
        "&rbrack;": "]",
        "&rbrke;": "\u298C",
        "&rbrksld;": "\u298E",
        "&rbrkslu;": "\u2990",
        "&rcaron;": "\u0159",
        "&rcedil;": "\u0157",
        "&rceil;": "\u2309",
        "&rcub;": "}",
        "&rcy;": "\u0440",
        "&rdca;": "\u2937",
        "&rdldhar;": "\u2969",
        "&rdquo;": "\u201D",
        "&rdquor;": "\u201D",
        "&rdsh;": "\u21B3",
        "&real;": "\u211C",
        "&realine;": "\u211B",
        "&realpart;": "\u211C",
        "&reals;": "\u211D",
        "&rect;": "\u25AD",
        "&reg": "\xAE",
        "&reg;": "\xAE",
        "&rfisht;": "\u297D",
        "&rfloor;": "\u230B",
        "&rfr;": "\u{1D52F}",
        "&rhard;": "\u21C1",
        "&rharu;": "\u21C0",
        "&rharul;": "\u296C",
        "&rho;": "\u03C1",
        "&rhov;": "\u03F1",
        "&rightarrow;": "\u2192",
        "&rightarrowtail;": "\u21A3",
        "&rightharpoondown;": "\u21C1",
        "&rightharpoonup;": "\u21C0",
        "&rightleftarrows;": "\u21C4",
        "&rightleftharpoons;": "\u21CC",
        "&rightrightarrows;": "\u21C9",
        "&rightsquigarrow;": "\u219D",
        "&rightthreetimes;": "\u22CC",
        "&ring;": "\u02DA",
        "&risingdotseq;": "\u2253",
        "&rlarr;": "\u21C4",
        "&rlhar;": "\u21CC",
        "&rlm;": "\u200F",
        "&rmoust;": "\u23B1",
        "&rmoustache;": "\u23B1",
        "&rnmid;": "\u2AEE",
        "&roang;": "\u27ED",
        "&roarr;": "\u21FE",
        "&robrk;": "\u27E7",
        "&ropar;": "\u2986",
        "&ropf;": "\u{1D563}",
        "&roplus;": "\u2A2E",
        "&rotimes;": "\u2A35",
        "&rpar;": ")",
        "&rpargt;": "\u2994",
        "&rppolint;": "\u2A12",
        "&rrarr;": "\u21C9",
        "&rsaquo;": "\u203A",
        "&rscr;": "\u{1D4C7}",
        "&rsh;": "\u21B1",
        "&rsqb;": "]",
        "&rsquo;": "\u2019",
        "&rsquor;": "\u2019",
        "&rthree;": "\u22CC",
        "&rtimes;": "\u22CA",
        "&rtri;": "\u25B9",
        "&rtrie;": "\u22B5",
        "&rtrif;": "\u25B8",
        "&rtriltri;": "\u29CE",
        "&ruluhar;": "\u2968",
        "&rx;": "\u211E",
        "&sacute;": "\u015B",
        "&sbquo;": "\u201A",
        "&sc;": "\u227B",
        "&scE;": "\u2AB4",
        "&scap;": "\u2AB8",
        "&scaron;": "\u0161",
        "&sccue;": "\u227D",
        "&sce;": "\u2AB0",
        "&scedil;": "\u015F",
        "&scirc;": "\u015D",
        "&scnE;": "\u2AB6",
        "&scnap;": "\u2ABA",
        "&scnsim;": "\u22E9",
        "&scpolint;": "\u2A13",
        "&scsim;": "\u227F",
        "&scy;": "\u0441",
        "&sdot;": "\u22C5",
        "&sdotb;": "\u22A1",
        "&sdote;": "\u2A66",
        "&seArr;": "\u21D8",
        "&searhk;": "\u2925",
        "&searr;": "\u2198",
        "&searrow;": "\u2198",
        "&sect": "\xA7",
        "&sect;": "\xA7",
        "&semi;": ";",
        "&seswar;": "\u2929",
        "&setminus;": "\u2216",
        "&setmn;": "\u2216",
        "&sext;": "\u2736",
        "&sfr;": "\u{1D530}",
        "&sfrown;": "\u2322",
        "&sharp;": "\u266F",
        "&shchcy;": "\u0449",
        "&shcy;": "\u0448",
        "&shortmid;": "\u2223",
        "&shortparallel;": "\u2225",
        "&shy": "\xAD",
        "&shy;": "\xAD",
        "&sigma;": "\u03C3",
        "&sigmaf;": "\u03C2",
        "&sigmav;": "\u03C2",
        "&sim;": "\u223C",
        "&simdot;": "\u2A6A",
        "&sime;": "\u2243",
        "&simeq;": "\u2243",
        "&simg;": "\u2A9E",
        "&simgE;": "\u2AA0",
        "&siml;": "\u2A9D",
        "&simlE;": "\u2A9F",
        "&simne;": "\u2246",
        "&simplus;": "\u2A24",
        "&simrarr;": "\u2972",
        "&slarr;": "\u2190",
        "&smallsetminus;": "\u2216",
        "&smashp;": "\u2A33",
        "&smeparsl;": "\u29E4",
        "&smid;": "\u2223",
        "&smile;": "\u2323",
        "&smt;": "\u2AAA",
        "&smte;": "\u2AAC",
        "&smtes;": "\u2AAC\uFE00",
        "&softcy;": "\u044C",
        "&sol;": "/",
        "&solb;": "\u29C4",
        "&solbar;": "\u233F",
        "&sopf;": "\u{1D564}",
        "&spades;": "\u2660",
        "&spadesuit;": "\u2660",
        "&spar;": "\u2225",
        "&sqcap;": "\u2293",
        "&sqcaps;": "\u2293\uFE00",
        "&sqcup;": "\u2294",
        "&sqcups;": "\u2294\uFE00",
        "&sqsub;": "\u228F",
        "&sqsube;": "\u2291",
        "&sqsubset;": "\u228F",
        "&sqsubseteq;": "\u2291",
        "&sqsup;": "\u2290",
        "&sqsupe;": "\u2292",
        "&sqsupset;": "\u2290",
        "&sqsupseteq;": "\u2292",
        "&squ;": "\u25A1",
        "&square;": "\u25A1",
        "&squarf;": "\u25AA",
        "&squf;": "\u25AA",
        "&srarr;": "\u2192",
        "&sscr;": "\u{1D4C8}",
        "&ssetmn;": "\u2216",
        "&ssmile;": "\u2323",
        "&sstarf;": "\u22C6",
        "&star;": "\u2606",
        "&starf;": "\u2605",
        "&straightepsilon;": "\u03F5",
        "&straightphi;": "\u03D5",
        "&strns;": "\xAF",
        "&sub;": "\u2282",
        "&subE;": "\u2AC5",
        "&subdot;": "\u2ABD",
        "&sube;": "\u2286",
        "&subedot;": "\u2AC3",
        "&submult;": "\u2AC1",
        "&subnE;": "\u2ACB",
        "&subne;": "\u228A",
        "&subplus;": "\u2ABF",
        "&subrarr;": "\u2979",
        "&subset;": "\u2282",
        "&subseteq;": "\u2286",
        "&subseteqq;": "\u2AC5",
        "&subsetneq;": "\u228A",
        "&subsetneqq;": "\u2ACB",
        "&subsim;": "\u2AC7",
        "&subsub;": "\u2AD5",
        "&subsup;": "\u2AD3",
        "&succ;": "\u227B",
        "&succapprox;": "\u2AB8",
        "&succcurlyeq;": "\u227D",
        "&succeq;": "\u2AB0",
        "&succnapprox;": "\u2ABA",
        "&succneqq;": "\u2AB6",
        "&succnsim;": "\u22E9",
        "&succsim;": "\u227F",
        "&sum;": "\u2211",
        "&sung;": "\u266A",
        "&sup1": "\xB9",
        "&sup1;": "\xB9",
        "&sup2": "\xB2",
        "&sup2;": "\xB2",
        "&sup3": "\xB3",
        "&sup3;": "\xB3",
        "&sup;": "\u2283",
        "&supE;": "\u2AC6",
        "&supdot;": "\u2ABE",
        "&supdsub;": "\u2AD8",
        "&supe;": "\u2287",
        "&supedot;": "\u2AC4",
        "&suphsol;": "\u27C9",
        "&suphsub;": "\u2AD7",
        "&suplarr;": "\u297B",
        "&supmult;": "\u2AC2",
        "&supnE;": "\u2ACC",
        "&supne;": "\u228B",
        "&supplus;": "\u2AC0",
        "&supset;": "\u2283",
        "&supseteq;": "\u2287",
        "&supseteqq;": "\u2AC6",
        "&supsetneq;": "\u228B",
        "&supsetneqq;": "\u2ACC",
        "&supsim;": "\u2AC8",
        "&supsub;": "\u2AD4",
        "&supsup;": "\u2AD6",
        "&swArr;": "\u21D9",
        "&swarhk;": "\u2926",
        "&swarr;": "\u2199",
        "&swarrow;": "\u2199",
        "&swnwar;": "\u292A",
        "&szlig": "\xDF",
        "&szlig;": "\xDF",
        "&target;": "\u2316",
        "&tau;": "\u03C4",
        "&tbrk;": "\u23B4",
        "&tcaron;": "\u0165",
        "&tcedil;": "\u0163",
        "&tcy;": "\u0442",
        "&tdot;": "\u20DB",
        "&telrec;": "\u2315",
        "&tfr;": "\u{1D531}",
        "&there4;": "\u2234",
        "&therefore;": "\u2234",
        "&theta;": "\u03B8",
        "&thetasym;": "\u03D1",
        "&thetav;": "\u03D1",
        "&thickapprox;": "\u2248",
        "&thicksim;": "\u223C",
        "&thinsp;": "\u2009",
        "&thkap;": "\u2248",
        "&thksim;": "\u223C",
        "&thorn": "\xFE",
        "&thorn;": "\xFE",
        "&tilde;": "\u02DC",
        "&times": "\xD7",
        "&times;": "\xD7",
        "&timesb;": "\u22A0",
        "&timesbar;": "\u2A31",
        "&timesd;": "\u2A30",
        "&tint;": "\u222D",
        "&toea;": "\u2928",
        "&top;": "\u22A4",
        "&topbot;": "\u2336",
        "&topcir;": "\u2AF1",
        "&topf;": "\u{1D565}",
        "&topfork;": "\u2ADA",
        "&tosa;": "\u2929",
        "&tprime;": "\u2034",
        "&trade;": "\u2122",
        "&triangle;": "\u25B5",
        "&triangledown;": "\u25BF",
        "&triangleleft;": "\u25C3",
        "&trianglelefteq;": "\u22B4",
        "&triangleq;": "\u225C",
        "&triangleright;": "\u25B9",
        "&trianglerighteq;": "\u22B5",
        "&tridot;": "\u25EC",
        "&trie;": "\u225C",
        "&triminus;": "\u2A3A",
        "&triplus;": "\u2A39",
        "&trisb;": "\u29CD",
        "&tritime;": "\u2A3B",
        "&trpezium;": "\u23E2",
        "&tscr;": "\u{1D4C9}",
        "&tscy;": "\u0446",
        "&tshcy;": "\u045B",
        "&tstrok;": "\u0167",
        "&twixt;": "\u226C",
        "&twoheadleftarrow;": "\u219E",
        "&twoheadrightarrow;": "\u21A0",
        "&uArr;": "\u21D1",
        "&uHar;": "\u2963",
        "&uacute": "\xFA",
        "&uacute;": "\xFA",
        "&uarr;": "\u2191",
        "&ubrcy;": "\u045E",
        "&ubreve;": "\u016D",
        "&ucirc": "\xFB",
        "&ucirc;": "\xFB",
        "&ucy;": "\u0443",
        "&udarr;": "\u21C5",
        "&udblac;": "\u0171",
        "&udhar;": "\u296E",
        "&ufisht;": "\u297E",
        "&ufr;": "\u{1D532}",
        "&ugrave": "\xF9",
        "&ugrave;": "\xF9",
        "&uharl;": "\u21BF",
        "&uharr;": "\u21BE",
        "&uhblk;": "\u2580",
        "&ulcorn;": "\u231C",
        "&ulcorner;": "\u231C",
        "&ulcrop;": "\u230F",
        "&ultri;": "\u25F8",
        "&umacr;": "\u016B",
        "&uml": "\xA8",
        "&uml;": "\xA8",
        "&uogon;": "\u0173",
        "&uopf;": "\u{1D566}",
        "&uparrow;": "\u2191",
        "&updownarrow;": "\u2195",
        "&upharpoonleft;": "\u21BF",
        "&upharpoonright;": "\u21BE",
        "&uplus;": "\u228E",
        "&upsi;": "\u03C5",
        "&upsih;": "\u03D2",
        "&upsilon;": "\u03C5",
        "&upuparrows;": "\u21C8",
        "&urcorn;": "\u231D",
        "&urcorner;": "\u231D",
        "&urcrop;": "\u230E",
        "&uring;": "\u016F",
        "&urtri;": "\u25F9",
        "&uscr;": "\u{1D4CA}",
        "&utdot;": "\u22F0",
        "&utilde;": "\u0169",
        "&utri;": "\u25B5",
        "&utrif;": "\u25B4",
        "&uuarr;": "\u21C8",
        "&uuml": "\xFC",
        "&uuml;": "\xFC",
        "&uwangle;": "\u29A7",
        "&vArr;": "\u21D5",
        "&vBar;": "\u2AE8",
        "&vBarv;": "\u2AE9",
        "&vDash;": "\u22A8",
        "&vangrt;": "\u299C",
        "&varepsilon;": "\u03F5",
        "&varkappa;": "\u03F0",
        "&varnothing;": "\u2205",
        "&varphi;": "\u03D5",
        "&varpi;": "\u03D6",
        "&varpropto;": "\u221D",
        "&varr;": "\u2195",
        "&varrho;": "\u03F1",
        "&varsigma;": "\u03C2",
        "&varsubsetneq;": "\u228A\uFE00",
        "&varsubsetneqq;": "\u2ACB\uFE00",
        "&varsupsetneq;": "\u228B\uFE00",
        "&varsupsetneqq;": "\u2ACC\uFE00",
        "&vartheta;": "\u03D1",
        "&vartriangleleft;": "\u22B2",
        "&vartriangleright;": "\u22B3",
        "&vcy;": "\u0432",
        "&vdash;": "\u22A2",
        "&vee;": "\u2228",
        "&veebar;": "\u22BB",
        "&veeeq;": "\u225A",
        "&vellip;": "\u22EE",
        "&verbar;": "|",
        "&vert;": "|",
        "&vfr;": "\u{1D533}",
        "&vltri;": "\u22B2",
        "&vnsub;": "\u2282\u20D2",
        "&vnsup;": "\u2283\u20D2",
        "&vopf;": "\u{1D567}",
        "&vprop;": "\u221D",
        "&vrtri;": "\u22B3",
        "&vscr;": "\u{1D4CB}",
        "&vsubnE;": "\u2ACB\uFE00",
        "&vsubne;": "\u228A\uFE00",
        "&vsupnE;": "\u2ACC\uFE00",
        "&vsupne;": "\u228B\uFE00",
        "&vzigzag;": "\u299A",
        "&wcirc;": "\u0175",
        "&wedbar;": "\u2A5F",
        "&wedge;": "\u2227",
        "&wedgeq;": "\u2259",
        "&weierp;": "\u2118",
        "&wfr;": "\u{1D534}",
        "&wopf;": "\u{1D568}",
        "&wp;": "\u2118",
        "&wr;": "\u2240",
        "&wreath;": "\u2240",
        "&wscr;": "\u{1D4CC}",
        "&xcap;": "\u22C2",
        "&xcirc;": "\u25EF",
        "&xcup;": "\u22C3",
        "&xdtri;": "\u25BD",
        "&xfr;": "\u{1D535}",
        "&xhArr;": "\u27FA",
        "&xharr;": "\u27F7",
        "&xi;": "\u03BE",
        "&xlArr;": "\u27F8",
        "&xlarr;": "\u27F5",
        "&xmap;": "\u27FC",
        "&xnis;": "\u22FB",
        "&xodot;": "\u2A00",
        "&xopf;": "\u{1D569}",
        "&xoplus;": "\u2A01",
        "&xotime;": "\u2A02",
        "&xrArr;": "\u27F9",
        "&xrarr;": "\u27F6",
        "&xscr;": "\u{1D4CD}",
        "&xsqcup;": "\u2A06",
        "&xuplus;": "\u2A04",
        "&xutri;": "\u25B3",
        "&xvee;": "\u22C1",
        "&xwedge;": "\u22C0",
        "&yacute": "\xFD",
        "&yacute;": "\xFD",
        "&yacy;": "\u044F",
        "&ycirc;": "\u0177",
        "&ycy;": "\u044B",
        "&yen": "\xA5",
        "&yen;": "\xA5",
        "&yfr;": "\u{1D536}",
        "&yicy;": "\u0457",
        "&yopf;": "\u{1D56A}",
        "&yscr;": "\u{1D4CE}",
        "&yucy;": "\u044E",
        "&yuml": "\xFF",
        "&yuml;": "\xFF",
        "&zacute;": "\u017A",
        "&zcaron;": "\u017E",
        "&zcy;": "\u0437",
        "&zdot;": "\u017C",
        "&zeetrf;": "\u2128",
        "&zeta;": "\u03B6",
        "&zfr;": "\u{1D537}",
        "&zhcy;": "\u0436",
        "&zigrarr;": "\u21DD",
        "&zopf;": "\u{1D56B}",
        "&zscr;": "\u{1D4CF}",
        "&zwj;": "\u200D",
        "&zwnj;": "\u200C"
      };
      return {
        convert: (entity) => {
          var _a;
          if (!/^&.*;$/.test(entity)) {
            return entity;
          } else {
            let decCodeMatch = /^&#(\d+);$/.exec(entity);
            if (decCodeMatch) {
              return String.fromCodePoint(Number(decCodeMatch[1]));
            } else {
              let hexCodeMatch = /^&#x([\da-f]+);/.exec(entity);
              if (hexCodeMatch) {
                return String.fromCodePoint(Number("0x" + hexCodeMatch[1]));
              } else {
                return (_a = namedEntities[entity]) != null ? _a : entity;
              }
            }
          }
        }
      };
    })();
  }
});

// engine/src/evaluation/implementations/helpers/number-to-roman-converter.ts
var NumberToRomanConverter;
var init_number_to_roman_converter = __esm({
  "engine/src/evaluation/implementations/helpers/number-to-roman-converter.ts"() {
    NumberToRomanConverter = (() => {
      const maxConvertible = 1e3 * 1e3;
      const ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
      const tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
      const hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
      return {
        max: maxConvertible,
        convert: (n) => {
          if (n < 0)
            throw new Error(`Can only convert positive numbers.`);
          else if (n > maxConvertible)
            throw new Error(`Number ${n} is too big for conversion. Max is ${maxConvertible}.`);
          const thousandsCount = Math.floor(n / 1e3);
          const hundredsCount = Math.floor(n % 1e3 / 100);
          const tensCount = Math.floor(n % 100 / 10);
          const onesCount = Math.floor(n % 10);
          return "M".repeat(thousandsCount) + hundreds[hundredsCount] + tens[tensCount] + ones[onesCount];
        }
      };
    })();
  }
});

// engine/src/evaluation/implementations/helpers/ordinal-suffix-helper.ts
var OrdinalSuffixHelper;
var init_ordinal_suffix_helper = __esm({
  "engine/src/evaluation/implementations/helpers/ordinal-suffix-helper.ts"() {
    OrdinalSuffixHelper = (() => {
      const suffixForDigit = (digit) => {
        if (digit === 1)
          return "st";
        else if (digit === 2)
          return "nd";
        else if (digit === 3)
          return "rd";
        else
          return "th";
      };
      return {
        getSuffix: (number) => {
          number = Math.abs(number);
          if (number <= 9)
            return suffixForDigit(number);
          else if (number < 20)
            return "th";
          else
            return suffixForDigit(number % 10);
        }
      };
    })();
  }
});

// engine/src/evaluation/implementations/functions/tc-function.ts
var init_tc_function = __esm({
  "engine/src/evaluation/implementations/functions/tc-function.ts"() {
    init_kodeine();
    init_html_entitity_converter();
    init_number_to_roman_converter();
    init_number_to_text_converter();
    init_ordinal_suffix_helper();
    init_text_capitalizer();
  }
});

// engine/src/evaluation/implementations/helpers/timespan.ts
var unitBoundaries;
var init_timespan = __esm({
  "engine/src/evaluation/implementations/helpers/timespan.ts"() {
    unitBoundaries = [
      [60, "minute"],
      [60 * 60, "hour"],
      [60 * 60 * 24, "day"],
      [60 * 60 * 24 * 29, "month"],
      [60 * 60 * 24 * 365, "year"],
      [60 * 60 * 24 * 365 * 10, "decade"]
    ];
  }
});

// engine/src/evaluation/implementations/functions/tf-function.ts
var init_tf_function = __esm({
  "engine/src/evaluation/implementations/functions/tf-function.ts"() {
    init_kodeine();
    init_kustom_date_helper();
    init_timespan();
  }
});

// engine/src/evaluation/implementations/operators/unary-operators.ts
var init_unary_operators = __esm({
  "engine/src/evaluation/implementations/operators/unary-operators.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/implementations/base/two-mode-binary-operator.ts
var init_two_mode_binary_operator = __esm({
  "engine/src/evaluation/implementations/base/two-mode-binary-operator.ts"() {
    init_kodeine();
  }
});

// engine/src/evaluation/implementations/operators/binary-operators.ts
var init_binary_operators = __esm({
  "engine/src/evaluation/implementations/operators/binary-operators.ts"() {
    init_kodeine();
  }
});

// engine/src/kodeine-lexer/formula-token.ts
var FormulaToken2;
var init_formula_token = __esm({
  "engine/src/kodeine-lexer/formula-token.ts"() {
    FormulaToken2 = class {
      getPlainTextOutput() {
        return this.getSourceText();
      }
    };
  }
});

// engine/src/kodeine-lexer/kodeine-lexer.ts
var init_kodeine_lexer = __esm({
  "engine/src/kodeine-lexer/kodeine-lexer.ts"() {
    init_kodeine();
  }
});

// engine/src/kodeine-parser/expressions/i-expression-builder.ts
var init_i_expression_builder = __esm({
  "engine/src/kodeine-parser/expressions/i-expression-builder.ts"() {
  }
});

// engine/src/kodeine-parser/expressions/expression-builder.ts
var init_expression_builder = __esm({
  "engine/src/kodeine-parser/expressions/expression-builder.ts"() {
    init_formula_tokens();
    init_kodeine();
  }
});

// engine/src/kodeine-parser/expressions/function-call-builder.ts
var init_function_call_builder = __esm({
  "engine/src/kodeine-parser/expressions/function-call-builder.ts"() {
    init_kodeine();
  }
});

// engine/src/kodeine-parser/expressions/function-occurence.ts
var init_function_occurence = __esm({
  "engine/src/kodeine-parser/expressions/function-occurence.ts"() {
  }
});

// engine/src/kodeine-parser/expressions/operator-occurences.ts
var init_operator_occurences = __esm({
  "engine/src/kodeine-parser/expressions/operator-occurences.ts"() {
  }
});

// engine/src/kodeine-parser/kodeine-parser.ts
var init_kodeine_parser = __esm({
  "engine/src/kodeine-parser/kodeine-parser.ts"() {
    init_kodeine();
  }
});

// engine/src/kodeine-parser/parsing-context.ts
var init_parsing_context = __esm({
  "engine/src/kodeine-parser/parsing-context.ts"() {
    init_kodeine();
  }
});

// engine/src/kodeine.ts
var init_kodeine = __esm({
  "engine/src/kodeine.ts"() {
    init_abstractions();
    init_errors();
    init_string_char_reader();
    init_evaluation_context();
    init_evaluation_tree();
    init_evaluable();
    init_kode_value();
    init_unary_operation();
    init_binary_operation();
    init_function_call();
    init_expression();
    init_formula();
    init_broken_evaluable();
    init_kode_function_with_modes();
    init_unimplemented_functions();
    init_ce_function();
    init_cm_function();
    init_df_function();
    init_dp_function();
    init_fl_function();
    init_gv_function();
    init_if_function();
    init_mu_function();
    init_tc_function();
    init_tf_function();
    init_unary_operators();
    init_two_mode_binary_operator();
    init_binary_operators();
    init_formula_token();
    init_formula_tokens();
    init_kodeine_lexer();
    init_i_expression_builder();
    init_expression_builder();
    init_function_call_builder();
    init_function_occurence();
    init_operator_occurences();
    init_kodeine_parser();
    init_parsing_context();
  }
});

// engine/src/kodeine-lexer/formula-tokens.ts
var formula_tokens_exports = {};
__export(formula_tokens_exports, {
  ClosingParenthesisToken: () => ClosingParenthesisToken,
  CommaToken: () => CommaToken,
  DollarSignToken: () => DollarSignToken,
  EscapedDollarSignToken: () => EscapedDollarSignToken,
  OpeningParenthesisToken: () => OpeningParenthesisToken,
  OperatorToken: () => OperatorToken,
  PlainTextToken: () => PlainTextToken,
  QuotedValueToken: () => QuotedValueToken2,
  SimpleToken: () => SimpleToken,
  UnclosedQuotedValueToken: () => UnclosedQuotedValueToken,
  UnquotedValueToken: () => UnquotedValueToken3,
  WhitespaceToken: () => WhitespaceToken
});
var SimpleToken, PlainTextToken, EscapedDollarSignToken, DollarSignToken, WhitespaceToken, OpeningParenthesisToken, ClosingParenthesisToken, CommaToken, UnclosedQuotedValueToken, QuotedValueToken2, UnquotedValueToken3, OperatorToken;
var init_formula_tokens = __esm({
  "engine/src/kodeine-lexer/formula-tokens.ts"() {
    init_kodeine();
    SimpleToken = class extends FormulaToken2 {
      constructor(text, startIndex) {
        super();
        this._text = text;
        this._startIndex = startIndex;
      }
      getSourceText() {
        return this._text;
      }
      getStartIndex() {
        return this._startIndex;
      }
      getEndIndex() {
        return this._startIndex + this._text.length;
      }
    };
    PlainTextToken = class extends SimpleToken {
      constructor(text, startIndex) {
        super(text, startIndex);
      }
      getName() {
        return "plain text";
      }
    };
    EscapedDollarSignToken = class extends SimpleToken {
      constructor(startIndex) {
        super("$$", startIndex);
      }
      getName() {
        return "escaped dollar sign";
      }
      getPlainTextOutput() {
        return "$";
      }
    };
    DollarSignToken = class extends SimpleToken {
      constructor(startIndex) {
        super("$", startIndex);
      }
      getName() {
        return "dollar sign";
      }
    };
    WhitespaceToken = class extends SimpleToken {
      constructor(text, startIndex) {
        super(text, startIndex);
      }
      getName() {
        return "whitespace";
      }
    };
    OpeningParenthesisToken = class extends SimpleToken {
      constructor(startIndex) {
        super("(", startIndex);
      }
      getName() {
        return "opening parenthesis";
      }
    };
    ClosingParenthesisToken = class extends SimpleToken {
      constructor(startIndex) {
        super(")", startIndex);
      }
      getName() {
        return "closing parenthesis";
      }
    };
    CommaToken = class extends SimpleToken {
      constructor(startIndex) {
        super(",", startIndex);
      }
      getName() {
        return "comma";
      }
    };
    UnclosedQuotedValueToken = class extends FormulaToken2 {
      constructor(textFollowingQuotationMark, quotationMarkIndex) {
        super();
        this._textFollowingQuotationMark = textFollowingQuotationMark;
        this._quotationMarkIndex = quotationMarkIndex;
      }
      getStartIndex() {
        return this._quotationMarkIndex;
      }
      getEndIndex() {
        return this._quotationMarkIndex + 1 + this._textFollowingQuotationMark.length;
      }
      getSourceText() {
        return `"${this._textFollowingQuotationMark}`;
      }
      getName() {
        return "unclosed quoted value";
      }
    };
    QuotedValueToken2 = class extends FormulaToken2 {
      constructor(valueText, openingQuotationMarkIndex) {
        super();
        this._innerText = valueText;
        this._openingQuotationMarkIndex = openingQuotationMarkIndex;
      }
      getValue() {
        return this._innerText;
      }
      getStartIndex() {
        return this._openingQuotationMarkIndex;
      }
      getEndIndex() {
        return this._openingQuotationMarkIndex + 1 + this._innerText.length + 1;
      }
      getSourceText() {
        return `"${this._innerText}"`;
      }
      getName() {
        return "quoted value";
      }
    };
    UnquotedValueToken3 = class extends SimpleToken {
      constructor(text, startIndex) {
        super(text, startIndex);
      }
      getValue() {
        return this._text;
      }
      getName() {
        return "unquoted value";
      }
    };
    OperatorToken = class extends SimpleToken {
      constructor(symbol, startIndex) {
        super(symbol, startIndex);
      }
      getSymbol() {
        return this._text;
      }
      is(symbol) {
        return this._text === symbol;
      }
      getName() {
        return "operator";
      }
    };
  }
});

// engine/dist.node/kodeine-parser/expressions/expression-builder.js
var require_expression_builder = __commonJS({
  "engine/dist.node/kodeine-parser/expressions/expression-builder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExpressionBuilder = void 0;
    var formula_tokens_js_1 = (init_formula_tokens(), __toCommonJS(formula_tokens_exports));
    var kodeine_js_1 = require_kodeine();
    var ExpressionBuilder2 = class extends kodeine_js_1.IExpressionBuilder {
      constructor(parsingCtx2, includeSurroundingTokens, ...startingTokens) {
        super();
        this._elements = [];
        this._parsingCtx = parsingCtx2;
        this._includeSurroundingTokens = includeSurroundingTokens;
        this._startingTokens = startingTokens;
        this._innerTokens = [];
      }
      _getLastElement() {
        return this._elements[this._elements.length - 1];
      }
      addValue(token) {
        var _a;
        let lastElement = this._getLastElement();
        if (lastElement instanceof kodeine_js_1.Evaluable) {
          if (token instanceof kodeine_js_1.UnquotedValueToken && (token.getSourceText() == "~" || token.getSourceText() == "!") || lastElement instanceof kodeine_js_1.KodeValue && ((_a = lastElement.source) == null ? void 0 : _a.tokens.length) === 1 && lastElement.source.tokens[0] instanceof kodeine_js_1.UnquotedValueToken && (lastElement.text == "~" || lastElement.text == "!")) {
            throw new kodeine_js_1.KodeSyntaxError(token, "A value cannot follow another value. Kustom treats first characters of binary operators as standalone unquoted values when they are not a part of a full operator symbols. ! and ~ both behave this way (first characters of != and ~= respectively).");
          } else {
            throw new kodeine_js_1.KodeSyntaxError(token, "A value cannot follow another value.");
          }
        }
        this._elements.push(kodeine_js_1.KodeValue.fromToken(token));
        this._innerTokens.push(token);
      }
      addEvaluable(evaluable) {
        let lastElement = this._getLastElement();
        if (lastElement instanceof kodeine_js_1.Evaluable) {
          throw new kodeine_js_1.KodeSyntaxError(evaluable.source.tokens[0], "A value cannot follow another value.");
        }
        this._elements.push(evaluable);
        this._innerTokens.push(...evaluable.source.tokens);
      }
      addOperator(token) {
        let lastElement = this._getLastElement();
        let tokenShouldBeUnaryOperator = !lastElement || lastElement instanceof kodeine_js_1.BinaryOperatorOccurence || lastElement instanceof kodeine_js_1.UnaryOperatorOccurence;
        if (tokenShouldBeUnaryOperator) {
          let unaryOperator = this._parsingCtx.findUnaryOperator(token.getSymbol());
          if (unaryOperator) {
            this._elements.push(new kodeine_js_1.UnaryOperatorOccurence(unaryOperator, token));
          } else {
            let binaryOperator = this._parsingCtx.findBinaryOperator(token.getSymbol());
            if (binaryOperator) {
              throw new kodeine_js_1.KodeSyntaxError(token, `Left hand side argument for binary operator "${token.getSymbol()}" missing.`);
            } else {
              throw new kodeine_js_1.KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);
            }
          }
        } else {
          let binaryOperator = this._parsingCtx.findBinaryOperator(token.getSymbol());
          if (binaryOperator) {
            let binaryOperatorOccurence = new kodeine_js_1.BinaryOperatorOccurence(binaryOperator, token);
            let i = this._innerTokens.length - 1;
            while (this._innerTokens[i] instanceof formula_tokens_js_1.WhitespaceToken) {
              binaryOperatorOccurence.precedingWhitespaceTokens.unshift(this._innerTokens[i]);
              i--;
            }
            this._elements.push(binaryOperatorOccurence);
          } else {
            let unaryOperator = this._parsingCtx.findUnaryOperator(token.getSymbol());
            if (unaryOperator) {
              throw new kodeine_js_1.KodeSyntaxError(token, `Unary operator "${token.getSymbol()}" cannot have a left hand side argument.`);
            } else {
              throw new kodeine_js_1.KodeSyntaxError(token, `Unrecognized operator "${token.getSymbol()}".`);
            }
          }
        }
        this._innerTokens.push(token);
      }
      addWhitespace(token) {
        let lastElement = this._elements[this._elements.length - 1];
        if (lastElement instanceof kodeine_js_1.UnaryOperatorOccurence || lastElement instanceof kodeine_js_1.BinaryOperatorOccurence) {
          lastElement.followingWhitespaceTokens.push(token);
        }
        this._innerTokens.push(token);
      }
      getIsEmpty() {
        return this._elements.length === 0;
      }
      build(closingToken) {
        if (this._elements.length === 0) {
          throw new kodeine_js_1.KodeSyntaxError(closingToken, "Empty expression.");
        } else {
          let finalElement;
          if (this._elements.length === 1) {
            finalElement = this._elements[0];
          } else {
            for (var i = 0; i < this._elements.length; i++) {
              let element = this._elements[i];
              if (element instanceof kodeine_js_1.UnaryOperatorOccurence) {
                let firstElI = i;
                let unaryOpStack = [element];
                for (i = i + 1; i < this._elements.length; i++) {
                  element = this._elements[i];
                  if (element instanceof kodeine_js_1.UnaryOperatorOccurence) {
                    unaryOpStack.push(element);
                  } else if (element instanceof kodeine_js_1.Evaluable) {
                    let unaryOpCount = unaryOpStack.length;
                    let evaluable = element;
                    while (unaryOpStack.length > 0) {
                      let unaryOpOccurence = unaryOpStack.pop();
                      evaluable = new kodeine_js_1.UnaryOperation(unaryOpOccurence.operator, evaluable, new kodeine_js_1.EvaluableSource(unaryOpOccurence.token, ...unaryOpOccurence.followingWhitespaceTokens, ...evaluable.source.tokens));
                    }
                    this._elements.splice(firstElI, unaryOpCount + 1, evaluable);
                    i = firstElI;
                    break;
                  } else {
                    throw new kodeine_js_1.KodeSyntaxError(closingToken, `Binary operator cannot follow a unary operator.`);
                  }
                }
              }
            }
            while (this._elements.length > 1) {
              let maxPrecedence = -1;
              let maxPrecedenceI = -1;
              for (var i = 0; i < this._elements.length; i++) {
                let element = this._elements[i];
                if (element instanceof kodeine_js_1.BinaryOperatorOccurence) {
                  if (element.operator.getPrecedence() > maxPrecedence) {
                    maxPrecedence = element.operator.getPrecedence();
                    maxPrecedenceI = i;
                  }
                }
              }
              if (maxPrecedenceI === -1) {
                throw new kodeine_js_1.KodeSyntaxError(closingToken, "No binary operators found in the expression.");
              } else {
                let opOccurence = this._elements[maxPrecedenceI];
                if (maxPrecedenceI === 0 || !(this._elements[maxPrecedenceI - 1] instanceof kodeine_js_1.Evaluable)) {
                  throw new kodeine_js_1.KodeSyntaxError(closingToken, `Left hand side argument for binary operator "${opOccurence.operator.getSymbol()}" missing.`);
                } else if (maxPrecedenceI === this._elements.length - 1 || !(this._elements[maxPrecedenceI + 1] instanceof kodeine_js_1.Evaluable)) {
                  throw new kodeine_js_1.KodeSyntaxError(closingToken, `Right hand side argument for binary operator "${opOccurence.operator.getSymbol()}" missing.`);
                } else {
                  let a = this._elements[maxPrecedenceI - 1];
                  let b = this._elements[maxPrecedenceI + 1];
                  let operation = new kodeine_js_1.BinaryOperation(opOccurence.operator, a, b, new kodeine_js_1.EvaluableSource(...a.source.tokens, ...opOccurence.precedingWhitespaceTokens, opOccurence.token, ...opOccurence.followingWhitespaceTokens, ...b.source.tokens));
                  this._elements.splice(maxPrecedenceI - 1, 3, operation);
                  i = maxPrecedenceI - 1;
                }
              }
            }
            finalElement = this._elements[0];
          }
          if (finalElement instanceof kodeine_js_1.Evaluable) {
            if (this._includeSurroundingTokens) {
              return new kodeine_js_1.Expression(finalElement, new kodeine_js_1.EvaluableSource(...this._startingTokens, ...this._innerTokens, closingToken));
            } else {
              return finalElement;
            }
          } else {
            throw new kodeine_js_1.KodeSyntaxError(closingToken, `Expression cannot consist of only the "${finalElement.operator.getSymbol()}" operator.`);
          }
        }
      }
    };
    exports.ExpressionBuilder = ExpressionBuilder2;
  }
});

// engine/dist.node/kodeine-parser/expressions/function-call-builder.js
var require_function_call_builder = __commonJS({
  "engine/dist.node/kodeine-parser/expressions/function-call-builder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FunctionCallBuilder = void 0;
    var kodeine_js_1 = require_kodeine();
    var FunctionCallBuilder2 = class extends kodeine_js_1.IExpressionBuilder {
      constructor(parsingCtx2, functionOccurence) {
        super();
        this._innerTokens = [];
        this._args = [];
        this._parsingCtx = parsingCtx2;
        this._functionOccurence = functionOccurence;
        this._currentArgumentBuilder = new kodeine_js_1.ExpressionBuilder(parsingCtx2, false, ...functionOccurence.openingTokens);
      }
      addEvaluable(evaluable) {
        this._innerTokens.push(...evaluable.source.tokens);
        this._currentArgumentBuilder.addEvaluable(evaluable);
      }
      addValue(token) {
        this._innerTokens.push(token);
        this._currentArgumentBuilder.addValue(token);
      }
      addOperator(token) {
        this._innerTokens.push(token);
        this._currentArgumentBuilder.addOperator(token);
      }
      addWhitespace(token) {
        this._innerTokens.push(token);
        this._currentArgumentBuilder.addWhitespace(token);
      }
      nextArgument(comma) {
        if (this._currentArgumentBuilder.getIsEmpty()) {
          throw new kodeine_js_1.KodeSyntaxError(comma, "Argument missing.");
        } else {
          this._innerTokens.push(comma);
          this._args.push(this._currentArgumentBuilder.build(comma));
          this._currentArgumentBuilder = new kodeine_js_1.ExpressionBuilder(this._parsingCtx, false, comma);
        }
      }
      build(closingToken) {
        if (this._args.length === 0 && this._currentArgumentBuilder.getIsEmpty()) {
          return new kodeine_js_1.FunctionCall(this._functionOccurence.func, this._args, new kodeine_js_1.EvaluableSource(...this._functionOccurence.openingTokens, ...this._innerTokens, closingToken));
        } else {
          this._args.push(this._currentArgumentBuilder.build(closingToken));
          return new kodeine_js_1.FunctionCall(this._functionOccurence.func, this._args, new kodeine_js_1.EvaluableSource(...this._functionOccurence.openingTokens, ...this._innerTokens, closingToken));
        }
      }
    };
    exports.FunctionCallBuilder = FunctionCallBuilder2;
  }
});

// engine/dist.node/kodeine-parser/expressions/function-occurence.js
var require_function_occurence = __commonJS({
  "engine/dist.node/kodeine-parser/expressions/function-occurence.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FunctionOccurence = void 0;
    var FunctionOccurence3 = class {
      constructor(func, ...openingTokens) {
        this.openingTokens = openingTokens;
        this.func = func;
      }
    };
    exports.FunctionOccurence = FunctionOccurence3;
  }
});

// engine/dist.node/kodeine-parser/expressions/operator-occurences.js
var require_operator_occurences = __commonJS({
  "engine/dist.node/kodeine-parser/expressions/operator-occurences.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryOperatorOccurence = exports.UnaryOperatorOccurence = exports.OperatorOccurence = void 0;
    var OperatorOccurence = class {
      constructor(token) {
        this.token = token;
      }
    };
    exports.OperatorOccurence = OperatorOccurence;
    var UnaryOperatorOccurence2 = class extends OperatorOccurence {
      constructor(operator, token) {
        super(token);
        this.operator = operator;
        this.followingWhitespaceTokens = [];
      }
    };
    exports.UnaryOperatorOccurence = UnaryOperatorOccurence2;
    var BinaryOperatorOccurence2 = class extends OperatorOccurence {
      constructor(operator, token) {
        super(token);
        this.operator = operator;
        this.precedingWhitespaceTokens = [];
        this.followingWhitespaceTokens = [];
      }
    };
    exports.BinaryOperatorOccurence = BinaryOperatorOccurence2;
  }
});

// engine/dist.node/kodeine-parser/kodeine-parser.js
var require_kodeine_parser = __commonJS({
  "engine/dist.node/kodeine-parser/kodeine-parser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KodeineParser = exports.KodeineParserState = void 0;
    var kodeine_js_1 = require_kodeine();
    var KodeineParserState;
    (function(KodeineParserState2) {
      KodeineParserState2[KodeineParserState2["Default"] = 0] = "Default";
      KodeineParserState2[KodeineParserState2["Kode"] = 1] = "Kode";
    })(KodeineParserState = exports.KodeineParserState || (exports.KodeineParserState = {}));
    var KodeineParser3 = class {
      constructor(parsingCtx2) {
        this._parsingCtx = parsingCtx2;
      }
      parse(source) {
        if (typeof source === "string") {
          let charReader = new kodeine_js_1.StringCharReader(source);
          let lexer = new kodeine_js_1.KodeineLexer(charReader, this._parsingCtx.getOperatorSymbolsLongestFirst());
          return this._parseCore(lexer);
        } else if (source instanceof kodeine_js_1.ICharReader) {
          let lexer = new kodeine_js_1.KodeineLexer(source, this._parsingCtx.getOperatorSymbolsLongestFirst());
          return this._parseCore(lexer);
        } else if (source instanceof kodeine_js_1.IFormulaTokenLexer) {
          return this._parseCore(source);
        } else {
          throw new Error("Cannot parse the given source.");
        }
      }
      _parseCore(lexer) {
        this._parsingCtx.clearSideEffects();
        let state = KodeineParserState.Default;
        let formulaEvaluables = [];
        let tokenBuffer = [];
        let exprBuilderStack = [];
        function getPrevNonWhitespaceToken() {
          if (tokenBuffer.length === 0) {
            return null;
          } else {
            let index = tokenBuffer.length - 1;
            let token = tokenBuffer[index];
            while (token && token instanceof kodeine_js_1.WhitespaceToken) {
              index--;
              token = tokenBuffer[index];
            }
            return token != null ? token : null;
          }
        }
        ;
        function peekLastExprBuilder() {
          return exprBuilderStack[exprBuilderStack.length - 1];
        }
        while (!lexer.EOF()) {
          let token = lexer.consume(1)[0];
          let skipPushingToBuffer = false;
          if (state === KodeineParserState.Default) {
            if (token instanceof kodeine_js_1.DollarSignToken) {
              state = KodeineParserState.Kode;
              exprBuilderStack = [new kodeine_js_1.ExpressionBuilder(this._parsingCtx, true, token)];
              if (tokenBuffer.length > 0) {
                formulaEvaluables.push(new kodeine_js_1.KodeValue(tokenBuffer.map((t) => t.getPlainTextOutput()).join(""), new kodeine_js_1.EvaluableSource(...tokenBuffer)));
              }
              tokenBuffer = [token];
            } else {
              tokenBuffer.push(token);
            }
          } else if (state === KodeineParserState.Kode) {
            try {
              if (token instanceof kodeine_js_1.UnquotedValueToken) {
                let offset = 0;
                let nextToken = lexer.peek(1, offset++)[0];
                if (nextToken instanceof kodeine_js_1.WhitespaceToken) {
                  while (nextToken && nextToken instanceof kodeine_js_1.WhitespaceToken) {
                    nextToken = lexer.peek(1, offset++)[0];
                  }
                }
                if (nextToken instanceof kodeine_js_1.OpeningParenthesisToken) {
                  skipPushingToBuffer = true;
                  tokenBuffer.push(token);
                  let whitespaceTokens = [];
                  if (offset > 1) {
                    whitespaceTokens = lexer.consume(offset - 1);
                    tokenBuffer.push(...whitespaceTokens);
                  }
                  lexer.consume(1);
                  tokenBuffer.push(nextToken);
                  let funcName = token.getValue();
                  let func = this._parsingCtx.findFunction(funcName);
                  if (func) {
                    exprBuilderStack.push(new kodeine_js_1.FunctionCallBuilder(this._parsingCtx, new kodeine_js_1.FunctionOccurence(func, token, ...whitespaceTokens, nextToken)));
                  } else {
                    throw new kodeine_js_1.KodeFunctionNotFoundError(token);
                  }
                } else {
                  if (token.getValue().length === 2 && this._parsingCtx.findFunction(token.getValue())) {
                    throw new kodeine_js_1.UnquotedValueAndFunctionNameCollisionError(token);
                  } else {
                  }
                  peekLastExprBuilder().addValue(token);
                }
              } else if (token instanceof kodeine_js_1.QuotedValueToken) {
                peekLastExprBuilder().addValue(token);
              } else if (token instanceof kodeine_js_1.OperatorToken) {
                peekLastExprBuilder().addOperator(token);
              } else if (token instanceof kodeine_js_1.OpeningParenthesisToken) {
                let prevToken = getPrevNonWhitespaceToken();
                if (prevToken === null || prevToken instanceof kodeine_js_1.OperatorToken || prevToken instanceof kodeine_js_1.OpeningParenthesisToken || prevToken instanceof kodeine_js_1.DollarSignToken || prevToken instanceof kodeine_js_1.CommaToken) {
                  exprBuilderStack.push(new kodeine_js_1.ExpressionBuilder(this._parsingCtx, true, token));
                } else if (prevToken instanceof kodeine_js_1.UnquotedValueToken) {
                  throw new kodeine_js_1.KodeSyntaxError(token, `Unquoted value followed by an opening parenthesis wasn't picked up as a function call.`);
                } else {
                  throw new kodeine_js_1.KodeSyntaxError(token, `An opening parenthesis cannot follow a(n) ${prevToken.getName()}.`);
                }
              } else if (token instanceof kodeine_js_1.CommaToken) {
                let lastExprBuilder = peekLastExprBuilder();
                if (lastExprBuilder instanceof kodeine_js_1.FunctionCallBuilder) {
                  lastExprBuilder.nextArgument(token);
                } else {
                  throw new kodeine_js_1.KodeSyntaxError(token, `A comma cannot appear outside of function calls.`);
                }
              } else if (token instanceof kodeine_js_1.ClosingParenthesisToken) {
                if (exprBuilderStack.length <= 1) {
                  throw new kodeine_js_1.KodeSyntaxError(token, `Too many closing parentheses.`);
                } else {
                  let evaluable = exprBuilderStack.pop().build(token);
                  peekLastExprBuilder().addEvaluable(evaluable);
                }
              } else if (token instanceof kodeine_js_1.DollarSignToken) {
                skipPushingToBuffer = true;
                if (exprBuilderStack.length > 1) {
                  throw new kodeine_js_1.KodeSyntaxError(token, `Unclosed parentheses (${exprBuilderStack.length - 1}).`);
                }
                let evaluable = exprBuilderStack.pop().build(token);
                formulaEvaluables.push(evaluable);
                state = KodeineParserState.Default;
                tokenBuffer = [];
              } else if (token instanceof kodeine_js_1.UnclosedQuotedValueToken) {
                state = KodeineParserState.Default;
                skipPushingToBuffer = true;
                if (tokenBuffer.length > 0) {
                  tokenBuffer.push(token);
                  this._parsingCtx.sideEffects.warnings.push(new kodeine_js_1.UnclosedQuotedValueWarning(...tokenBuffer));
                  formulaEvaluables.push(new kodeine_js_1.KodeValue(tokenBuffer.slice(1).map((t) => t.getSourceText()).join(""), new kodeine_js_1.EvaluableSource(...tokenBuffer)));
                }
                tokenBuffer = [];
              } else if (token instanceof kodeine_js_1.WhitespaceToken) {
                peekLastExprBuilder().addWhitespace(token);
              } else {
                throw new kodeine_js_1.UnrecognizedTokenError(token);
              }
              if (!skipPushingToBuffer) {
                tokenBuffer.push(token);
              }
            } catch (err) {
              if (err instanceof kodeine_js_1.KodeParsingError) {
                this._parsingCtx.sideEffects.errors.push(err);
                tokenBuffer.push(token);
                if (token instanceof kodeine_js_1.DollarSignToken) {
                  state = KodeineParserState.Default;
                } else {
                  let nextToken;
                  do {
                    nextToken = lexer.consume(1)[0];
                    if (nextToken) {
                      tokenBuffer.push(nextToken);
                      if (nextToken instanceof kodeine_js_1.DollarSignToken) {
                        state = KodeineParserState.Default;
                        break;
                      }
                    }
                  } while (!lexer.EOF() && nextToken && !(nextToken instanceof kodeine_js_1.DollarSignToken));
                }
                formulaEvaluables.push(new kodeine_js_1.BrokenEvaluable(new kodeine_js_1.EvaluableSource(...tokenBuffer)));
                tokenBuffer = [];
              } else {
                throw err;
              }
            }
          } else {
            throw new Error("Invalid parser state.");
          }
        }
        if (tokenBuffer.length > 0) {
          if (state === KodeineParserState.Default) {
            formulaEvaluables.push(new kodeine_js_1.KodeValue(tokenBuffer.map((t) => t.getPlainTextOutput()).join(""), new kodeine_js_1.EvaluableSource(...tokenBuffer)));
          } else {
            this._parsingCtx.sideEffects.warnings.push(new kodeine_js_1.UnclosedDollarSignWarning(...tokenBuffer));
            formulaEvaluables.push(new kodeine_js_1.KodeValue(tokenBuffer.slice(1).map((t) => t.getSourceText()).join(""), new kodeine_js_1.EvaluableSource(...tokenBuffer)));
          }
        }
        let formula = new kodeine_js_1.Formula(formulaEvaluables);
        return formula;
      }
    };
    exports.KodeineParser = KodeineParser3;
  }
});

// engine/dist.node/kodeine-parser/parsing-context.js
var require_parsing_context = __commonJS({
  "engine/dist.node/kodeine-parser/parsing-context.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnclosedQuotedValueWarning = exports.UnclosedDollarSignWarning = exports.ParsingWarning = exports.ParsingSideEffects = exports.ParsingContextBuilder = exports.ParsingContext = void 0;
    var kodeine_js_1 = require_kodeine();
    var ParsingContext5 = class {
      constructor(functions, unaryOperators, binaryOperators) {
        this._operatorSymbols = /* @__PURE__ */ new Set();
        this._functions = functions;
        this._unaryOperators = unaryOperators;
        this._binaryOperators = binaryOperators;
        for (const opSymbol in unaryOperators)
          this._operatorSymbols.add(opSymbol);
        for (const opSymbol in binaryOperators)
          this._operatorSymbols.add(opSymbol);
        this.sideEffects = new ParsingSideEffects();
      }
      findFunction(funcName) {
        var _a;
        return (_a = this._functions[funcName]) != null ? _a : null;
      }
      findUnaryOperator(symbol) {
        var _a;
        return (_a = this._unaryOperators[symbol]) != null ? _a : null;
      }
      findBinaryOperator(symbol) {
        var _a;
        return (_a = this._binaryOperators[symbol]) != null ? _a : null;
      }
      getOperatorSymbolsLongestFirst() {
        return Array.from(this._operatorSymbols).sort((a, b) => b.length - a.length);
      }
      getFunctionNames() {
        return Object.keys(this._functions);
      }
      clearSideEffects() {
        this.sideEffects = new ParsingSideEffects();
      }
    };
    exports.ParsingContext = ParsingContext5;
    var ParsingContextBuilder3 = class {
      constructor() {
        this._functions = {};
        this._unaryOperators = {};
        this._binaryOperators = {};
      }
      _addFunction(func) {
        this._functions[func.getName()] = func;
      }
      _addUnaryOperator(operator) {
        this._unaryOperators[operator.getSymbol()] = operator;
      }
      _addBinaryOperator(operator) {
        this._binaryOperators[operator.getSymbol()] = operator;
      }
      add(obj) {
        if (obj instanceof kodeine_js_1.IKodeFunction)
          this._addFunction(obj);
        else if (obj instanceof kodeine_js_1.IUnaryOperator)
          this._addUnaryOperator(obj);
        else if (obj instanceof kodeine_js_1.IBinaryOperator)
          this._addBinaryOperator(obj);
        else
          this.add(new obj());
        return this;
      }
      addAll(...objs) {
        objs.forEach((obj) => {
          try {
            this.add(obj);
          } catch (err) {
            let a = obj;
            throw err;
          }
        });
        return this;
      }
      addFromModule(moduleNamespace) {
        for (const className in moduleNamespace) {
          let classFunc = moduleNamespace[className];
          if (classFunc) {
            try {
              this.add(classFunc);
            } catch (err) {
              throw new Error(`Error when adding ${className} from module ${moduleNamespace.name}: ${err}. Perhaps you left an abstract class in the module?`);
            }
          }
        }
        return this;
      }
      addDefaults() {
        return this.addAll(kodeine_js_1.NegationOperator, kodeine_js_1.ExponentiationOperator, kodeine_js_1.MultiplicationOperator, kodeine_js_1.DivisionOperator, kodeine_js_1.ModuloOperator, kodeine_js_1.AdditionOperator, kodeine_js_1.SubtractionOperator, kodeine_js_1.EqualityOperator, kodeine_js_1.InequalityOperator, kodeine_js_1.LesserThanOperator, kodeine_js_1.GreaterThanOperator, kodeine_js_1.LesserThanOrEqualToOperator, kodeine_js_1.GreaterThanOrEqualToOperator, kodeine_js_1.RegexMatchOperator, kodeine_js_1.LogicalOrOperator, kodeine_js_1.LogicalAndOperator).addAll(kodeine_js_1.IfFunction, kodeine_js_1.TcFunction, kodeine_js_1.MuFunction, kodeine_js_1.FlFunction, kodeine_js_1.GvFunction).addAll(kodeine_js_1.LiFunction, kodeine_js_1.AqFunction, kodeine_js_1.NcFunction, kodeine_js_1.NiFunction, kodeine_js_1.WgFunction, kodeine_js_1.RmFunction, kodeine_js_1.CiFunction, kodeine_js_1.ShFunction, kodeine_js_1.WiFunction, kodeine_js_1.BiFunction, kodeine_js_1.SiFunction, kodeine_js_1.MqFunction, kodeine_js_1.TsFunction, kodeine_js_1.BpFunction, kodeine_js_1.CmFunction, kodeine_js_1.BrFunction, kodeine_js_1.DfFunction, kodeine_js_1.MiFunction, kodeine_js_1.WfFunction, kodeine_js_1.TfFunction, kodeine_js_1.UcFunction, kodeine_js_1.CeFunction, kodeine_js_1.AiFunction, kodeine_js_1.FdFunction, kodeine_js_1.DpFunction, kodeine_js_1.TuFunction);
      }
      build() {
        return new ParsingContext5(this._functions, this._unaryOperators, this._binaryOperators);
      }
      static buildDefault() {
        return new ParsingContextBuilder3().addDefaults().build();
      }
    };
    exports.ParsingContextBuilder = ParsingContextBuilder3;
    var ParsingSideEffects = class {
      constructor() {
        this.warnings = [];
        this.errors = [];
      }
    };
    exports.ParsingSideEffects = ParsingSideEffects;
    var ParsingWarning2 = class {
      constructor(message, ...tokens) {
        this.tokens = tokens;
        this.message = message;
      }
    };
    exports.ParsingWarning = ParsingWarning2;
    var UnclosedDollarSignWarning2 = class extends ParsingWarning2 {
      constructor(...tokens) {
        super("Unclosed dollar sign. The $ will be ignored and everything after it will be printed as plain text.", ...tokens);
      }
    };
    exports.UnclosedDollarSignWarning = UnclosedDollarSignWarning2;
    var UnclosedQuotedValueWarning2 = class extends ParsingWarning2 {
      constructor(...tokens) {
        super("Unclosed quotation mark. The $ that started this evaluable part will be ignored, and everything after it will be printed as plain text.", ...tokens);
      }
    };
    exports.UnclosedQuotedValueWarning = UnclosedQuotedValueWarning2;
  }
});

// engine/dist.node/kodeine.js
var require_kodeine = __commonJS({
  "engine/dist.node/kodeine.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_abstractions(), exports);
    __exportStar(require_errors(), exports);
    __exportStar(require_string_char_reader(), exports);
    __exportStar(require_evaluation_context(), exports);
    __exportStar(require_evaluation_tree(), exports);
    __exportStar(require_evaluable(), exports);
    __exportStar(require_kode_value(), exports);
    __exportStar(require_unary_operation(), exports);
    __exportStar(require_binary_operation(), exports);
    __exportStar(require_function_call(), exports);
    __exportStar(require_expression(), exports);
    __exportStar(require_formula(), exports);
    __exportStar(require_broken_evaluable(), exports);
    __exportStar(require_kode_function_with_modes(), exports);
    __exportStar(require_unimplemented_functions(), exports);
    __exportStar(require_ce_function(), exports);
    __exportStar(require_cm_function(), exports);
    __exportStar(require_df_function(), exports);
    __exportStar(require_dp_function(), exports);
    __exportStar(require_fl_function(), exports);
    __exportStar(require_gv_function(), exports);
    __exportStar(require_if_function(), exports);
    __exportStar(require_mu_function(), exports);
    __exportStar(require_tc_function(), exports);
    __exportStar(require_tf_function(), exports);
    __exportStar(require_unary_operators(), exports);
    __exportStar(require_two_mode_binary_operator(), exports);
    __exportStar(require_binary_operators(), exports);
    __exportStar(require_formula_token(), exports);
    __exportStar(require_formula_tokens(), exports);
    __exportStar(require_kodeine_lexer(), exports);
    __exportStar(require_i_expression_builder(), exports);
    __exportStar(require_expression_builder(), exports);
    __exportStar(require_function_call_builder(), exports);
    __exportStar(require_function_occurence(), exports);
    __exportStar(require_operator_occurences(), exports);
    __exportStar(require_kodeine_parser(), exports);
    __exportStar(require_parsing_context(), exports);
  }
});

// extension/src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(extension_exports);
var vscode6 = __toESM(require("vscode"));
var import_kodeine33 = __toESM(require_kodeine());

// extension/src/evaluation-tree-document-manager.ts
var vscode3 = __toESM(require("vscode"));

// extension/src/evaluation-steps-text-document-content-provider.ts
var vscode = __toESM(require("vscode"));
var _EvaluationStepsTextDocumentContentProvider = class {
  constructor() {
    this._onDidChangeEmitter = new vscode.EventEmitter();
    this.onDidChange = this._onDidChangeEmitter.event;
    this._sourceUriToEvaluationTreeMap = /* @__PURE__ */ new Map();
  }
  _getSourceDocUriFrom(stepsUri) {
    return vscode.Uri.parse(decodeURIComponent(stepsUri.query.split("=")[1]));
  }
  provideTextDocumentContent(stepsUri, token) {
    var _a;
    let sourceUriString = this._getSourceDocUriFrom(stepsUri).toString();
    let evaluationTree = this._sourceUriToEvaluationTreeMap.get(sourceUriString);
    return (_a = evaluationTree == null ? void 0 : evaluationTree.printEvaluationSteps()) != null ? _a : "";
  }
  getStepsDocumentUriFor(sourceDoc) {
    return vscode.Uri.parse(`${_EvaluationStepsTextDocumentContentProvider.scheme}:${sourceDoc.fileName}.steps?for=${encodeURIComponent(sourceDoc.uri.toString())}`);
  }
  updateEvaluationTreeFor(sourceDoc, tree) {
    this._sourceUriToEvaluationTreeMap.set(sourceDoc.uri.toString(), tree);
    this._onDidChangeEmitter.fire(this.getStepsDocumentUriFor(sourceDoc));
  }
  removeEvaluationTreeFor(sourceDoc) {
    this._sourceUriToEvaluationTreeMap.delete(sourceDoc.uri.toString());
  }
};
var EvaluationStepsTextDocumentContentProvider = _EvaluationStepsTextDocumentContentProvider;
EvaluationStepsTextDocumentContentProvider.scheme = "formulaevaluationsteps";

// extension/src/evaluation-tree-data-provider.ts
var vscode2 = __toESM(require("vscode"));
var import_kodeine32 = __toESM(require_kodeine());
var EvaluationTreeDataProvider = class {
  constructor() {
    this._evaluationTree = null;
    this._onDidChangeTreeData = new vscode2.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  getChildren(element) {
    if (!element) {
      if (this._evaluationTree) {
        return [this._evaluationTree];
      } else {
        return void 0;
      }
    } else if (element instanceof import_kodeine32.FormulaEvaluationTree) {
      return element.parts;
    } else if (element instanceof import_kodeine32.EvaluatedUnaryOperation) {
      return [element.arg];
    } else if (element instanceof import_kodeine32.EvaluatedBinaryOperation) {
      return [element.argA, element.argB];
    } else if (element instanceof import_kodeine32.EvaluatedFunctionCall) {
      return element.args;
    } else if (element instanceof import_kodeine32.EvaluatedExpression) {
      return [element.child];
    } else {
      return void 0;
    }
  }
  getTreeItem(element) {
    let treeItem = new vscode2.TreeItem(`${element.result.toOutputString()}`, element instanceof import_kodeine32.Literal ? vscode2.TreeItemCollapsibleState.None : vscode2.TreeItemCollapsibleState.Collapsed);
    treeItem.description = element.getDescription();
    return treeItem;
  }
  setEvaluationTree(evaluationTree) {
    this._evaluationTree = evaluationTree;
    this._onDidChangeTreeData.fire(void 0);
  }
};

// extension/src/evaluation-tree-document-manager.ts
var _EvaluationTreeDocumentManager = class {
  constructor(extCtx) {
    this._sourceDocToEvalTreeMap = /* @__PURE__ */ new Map();
    this._evalTreeDataProvider = new EvaluationTreeDataProvider();
    this._evalStepsTextDocContentProvider = new EvaluationStepsTextDocumentContentProvider();
    this._commands = {
      showEvaluationSteps: () => {
        var _a;
        if (((_a = vscode3.window.activeTextEditor) == null ? void 0 : _a.document.languageId) === "kode" && vscode3.window.activeTextEditor.document.uri.scheme !== EvaluationStepsTextDocumentContentProvider.scheme) {
          let sourceDoc = vscode3.window.activeTextEditor.document;
          let stepsUri = this._evalStepsTextDocContentProvider.getStepsDocumentUriFor(sourceDoc);
          vscode3.workspace.openTextDocument(stepsUri).then((doc) => vscode3.languages.setTextDocumentLanguage(doc, "kode")).then((doc) => vscode3.window.showTextDocument(doc, {
            viewColumn: vscode3.ViewColumn.Beside,
            preserveFocus: true,
            preview: false
          }));
        }
      }
    };
    this.initCommands(extCtx);
    this.initEvalTreeView(extCtx);
    this.initEvalStepsTextDocContentProvider(extCtx);
    this.initEvents(extCtx);
  }
  initCommands(extCtx) {
    for (const commandName in this._commands) {
      extCtx.subscriptions.push(vscode3.commands.registerCommand(`kodeine.${commandName}`, this._commands[commandName]));
    }
  }
  initEvalTreeView(extCtx) {
    extCtx.subscriptions.push(vscode3.window.registerTreeDataProvider(_EvaluationTreeDocumentManager.evalTreeViewId, this._evalTreeDataProvider));
  }
  initEvalStepsTextDocContentProvider(extCtx) {
    extCtx.subscriptions.push(vscode3.workspace.registerTextDocumentContentProvider(EvaluationStepsTextDocumentContentProvider.scheme, this._evalStepsTextDocContentProvider));
  }
  initEvents(extCtx) {
    extCtx.subscriptions.push(vscode3.workspace.onDidCloseTextDocument((doc) => this.onDidCloseTextDocument(doc)));
  }
  onDidCloseTextDocument(doc) {
    if (doc.languageId === "kode" && doc.uri.scheme === EvaluationStepsTextDocumentContentProvider.scheme) {
      this.removeEvaluationTreeFor(doc);
    }
  }
  updateEvaluationTreeFor(doc, tree) {
    this._sourceDocToEvalTreeMap.set(doc, tree);
    this._evalStepsTextDocContentProvider.updateEvaluationTreeFor(doc, tree);
    this._evalTreeDataProvider.setEvaluationTree(tree);
  }
  removeEvaluationTreeFor(doc) {
    this._sourceDocToEvalTreeMap.delete(doc);
    this._evalStepsTextDocContentProvider.removeEvaluationTreeFor(doc);
  }
};
var EvaluationTreeDocumentManager = _EvaluationTreeDocumentManager;
EvaluationTreeDocumentManager.evalTreeViewId = "formulaEvaluationTree";

// extension/src/global-document-manager.ts
var vscode5 = __toESM(require("vscode"));

// extension/src/bidirectional-map.ts
var BidirectionalMap = class {
  constructor() {
    this._AToBMap = /* @__PURE__ */ new Map();
    this._BToAMap = /* @__PURE__ */ new Map();
  }
  clear() {
    this._AToBMap.clear();
    this._BToAMap.clear();
  }
  deleteByA(a) {
    let b = this._AToBMap.get(a);
    if (b) {
      this._AToBMap.delete(a);
      this._BToAMap.delete(b);
      return true;
    } else {
      return false;
    }
  }
  deleteByB(b) {
    let a = this._BToAMap.get(b);
    if (a) {
      this._AToBMap.delete(a);
      this._BToAMap.delete(b);
      return true;
    } else {
      return false;
    }
  }
  forEachA(callbackfn, thisArg) {
    this._AToBMap.forEach(callbackfn);
  }
  forEachB(callbackfn, thisArg) {
    this._BToAMap.forEach(callbackfn);
  }
  getByA(a) {
    return this._AToBMap.get(a);
  }
  getByB(b) {
    return this._BToAMap.get(b);
  }
  hasA(a) {
    return this._AToBMap.has(a);
  }
  hasB(b) {
    return this._BToAMap.has(b);
  }
  add(a, b) {
    this.deleteByA(a);
    this.deleteByB(b);
    this._AToBMap.set(a, b);
    this._BToAMap.set(b, a);
    return this;
  }
  get size() {
    return this._AToBMap.size;
  }
  entries() {
    return this._AToBMap.entries();
  }
  aEntries() {
    return this._AToBMap.keys();
  }
  bEntries() {
    return this._AToBMap.values();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get [Symbol.toStringTag]() {
    return "BidirectionalMap";
  }
};

// extension/src/global-tree-data-provider.ts
var vscode4 = __toESM(require("vscode"));
var GlobalTreeDataProvider = class {
  constructor() {
    this.openGlobalDocumentCommand = "kodeine.openGlobalDocument";
    this.openGlobalDocumentCommandTitle = "Open global document";
    this._globalDocuments = [];
    this._onDidChangeTreeData = new vscode4.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  getTreeItem(element) {
    return {
      label: element.globalName,
      description: decodeURIComponent(element.doc.uri.toString()),
      collapsibleState: vscode4.TreeItemCollapsibleState.None,
      command: {
        title: this.openGlobalDocumentCommandTitle,
        command: this.openGlobalDocumentCommand,
        arguments: [element.doc.uri]
      }
    };
  }
  getChildren(element) {
    if (!element)
      return this._globalDocuments;
    else
      return void 0;
  }
  updateGlobalDocuments(globalDocuments) {
    this._globalDocuments = globalDocuments;
    this._onDidChangeTreeData.fire(void 0);
  }
};

// extension/src/global-document-manager.ts
var _GlobalDocumentManager = class {
  constructor(extCtx, operatorSymbols, functionNames) {
    this._globalsMap = new BidirectionalMap();
    this._globalTreeDataProvider = new GlobalTreeDataProvider();
    this._onGlobalRemoved = new vscode5.EventEmitter();
    this.onGlobalRemoved = this._onGlobalRemoved.event;
    this._onGlobalAdded = new vscode5.EventEmitter();
    this.onGlobalAdded = this._onGlobalAdded.event;
    this._onGlobalsCleared = new vscode5.EventEmitter();
    this.onGlobalsCleared = this._onGlobalsCleared.event;
    this._commands = {
      addGlobal: () => {
        var _a;
        if (!this.getIsValidGlobalDocument((_a = vscode5.window.activeTextEditor) == null ? void 0 : _a.document)) {
          return;
        }
        vscode5.window.showInputBox({
          title: "Name the global",
          prompt: "Remember that Kustom limits this name to 8 characters.",
          validateInput: (text) => {
            if (!text) {
              return "Global name cannot be empty.";
            } else if (text.endsWith("!")) {
              return null;
            } else {
              let segments = text.split("/");
              let segmentIssues = [];
              let quotationMarksEncountered = false;
              for (let i = 0; i < segments.length; i++) {
                const seg = segments[i];
                let addIssue = (msg) => {
                  segmentIssues.push({ i, seg, msg });
                };
                if (seg === "") {
                  addIssue("is empty.");
                } else {
                  if (seg.trimStart().length !== seg.length)
                    addIssue("has leading whitespace.");
                  if (seg.trimEnd().length !== seg.length)
                    addIssue("has trailing whitespace.");
                  if (seg.trim().length === 2 && this._functionNames.includes(seg.trim())) {
                    addIssue('collides with function name. Kustom will throw "err: null".');
                  } else {
                    if (seg.trim().length > 8)
                      addIssue("is longer than 8 characters.");
                    this._operatorSymbols.forEach((symbol) => {
                      if (seg.startsWith(symbol))
                        addIssue(`starts or ends with operator "${symbol}".`);
                      if (seg.endsWith(symbol))
                        addIssue(`ends with operator "${symbol}".`);
                    });
                    ["+", "=", "!=", "~="].forEach((symbol) => {
                      if (seg.includes(symbol))
                        addIssue(`contains operator "${symbol}" that doesn't have a generic string mode.`);
                    });
                    ["(", ")", "$", ",", "!", "~"].forEach((char) => {
                      if (seg.includes(char))
                        addIssue(`contains a special character "${char}".`);
                    });
                    if (seg.includes('"')) {
                      quotationMarksEncountered = true;
                      addIssue("contains a quotation mark.");
                    }
                  }
                }
              }
              if (segmentIssues.length > 0) {
                return `${segmentIssues.length} ${segmentIssues.length === 1 ? "issue" : "issues"} detected:
${segmentIssues.map((iss) => `- ${segments.length > 1 ? `Segment #${iss.i + 1} (${iss.seg})` : "Name"} ${iss.msg}`).join("\n")}
` + (quotationMarksEncountered ? `This name contains at least one quotation mark. You should only continue if you know what you are doing.
` : `This name should be used as a quoted string (ex. gv("${text}")).
`) + `Type ! after the global name to bypass this warning.`;
              }
              return null;
            }
          }
        }).then((globalName) => {
          if (globalName) {
            globalName = globalName.trim().toLowerCase();
            if (globalName.endsWith("!"))
              globalName = globalName.substring(0, globalName.length - 1);
            this.addGlobal(globalName, vscode5.window.activeTextEditor.document);
            vscode5.window.setStatusBarMessage(`gv(${globalName}) has been added.`, _GlobalDocumentManager.statusBarMessageTimeout);
          }
        });
      },
      removeGlobal: (globalDocument) => {
        if (globalDocument) {
          this.removeGlobal(globalDocument.globalName);
        } else {
          vscode5.window.showQuickPick(this.getGlobalDocuments().map((globalDocument2) => ({
            label: globalDocument2.globalName,
            description: globalDocument2.doc.uri.toString(),
            globalDocument: globalDocument2
          }))).then((pickedItem) => {
            if (pickedItem) {
              this.removeGlobal(pickedItem.globalDocument.globalName);
              vscode5.window.setStatusBarMessage(`gv(${pickedItem.globalDocument.globalName}) has been removed.`, _GlobalDocumentManager.statusBarMessageTimeout);
            }
          });
        }
      },
      clearGlobals: () => {
        this.clearGlobals();
        vscode5.window.setStatusBarMessage(`All globals have been removed.`, _GlobalDocumentManager.statusBarMessageTimeout);
      },
      openGlobalDocument: (uri) => {
        vscode5.window.showTextDocument(uri);
      }
    };
    this._operatorSymbols = operatorSymbols;
    this._functionNames = functionNames;
    this.initGlobalsMap(extCtx);
    this.initCommands(extCtx);
    this.initGlobalListUI(extCtx);
    this.initEvents(extCtx);
  }
  initGlobalsMap(extCtx) {
  }
  initCommands(extCtx) {
    for (const commandName in this._commands) {
      extCtx.subscriptions.push(vscode5.commands.registerCommand(`kodeine.${commandName}`, this._commands[commandName]));
    }
  }
  initGlobalListUI(extCtx) {
    this._globalTreeDataProvider.updateGlobalDocuments(this.getGlobalDocuments());
    extCtx.subscriptions.push(vscode5.window.registerTreeDataProvider(_GlobalDocumentManager.globalListViewId, this._globalTreeDataProvider));
  }
  initEvents(extCtx) {
    extCtx.subscriptions.push(vscode5.workspace.onDidCloseTextDocument((doc) => this.onDidCloseTextDocument(doc)));
  }
  onDidCloseTextDocument(doc) {
    if (doc.isUntitled && doc.languageId === "kode" && this._globalsMap.hasB(doc)) {
      let globalName = this.getGlobalNameFor(doc);
      this.removeGlobal(doc);
      vscode5.window.showWarningMessage(`gv(${globalName}) has been removed.`, {
        detail: `The untitled document gv(${globalName}) was linked to was closed.`,
        modal: true
      });
    }
  }
  getGlobalNameFor(doc) {
    return this._globalsMap.getByB(doc);
  }
  getGlobalDocuments() {
    return Array.from(this._globalsMap.entries()).map((e) => ({ globalName: e[0], doc: e[1] }));
  }
  getIsValidGlobalDocument(doc) {
    return !!doc && doc.languageId === "kode" && doc.uri.scheme !== EvaluationStepsTextDocumentContentProvider.scheme;
  }
  addGlobal(globalName, doc) {
    this._globalsMap.add(globalName, doc);
    this._onGlobalAdded.fire({ globalName, doc });
    this._notifyGlobalsChanged();
  }
  removeGlobal(globalNameOrDoc) {
    if (typeof globalNameOrDoc === "string") {
      let doc = this._globalsMap.getByA(globalNameOrDoc);
      if (doc) {
        this._globalsMap.deleteByA(globalNameOrDoc);
        this._onGlobalRemoved.fire({ globalName: globalNameOrDoc, doc });
        this._notifyGlobalsChanged();
      }
    } else {
      let globalName = this._globalsMap.getByB(globalNameOrDoc);
      if (globalName) {
        this._globalsMap.deleteByB(globalNameOrDoc);
        this._onGlobalRemoved.fire({ globalName, doc: globalNameOrDoc });
        this._notifyGlobalsChanged();
      }
    }
  }
  clearGlobals() {
    this._globalsMap.clear();
    this._onGlobalsCleared.fire();
    this._notifyGlobalsChanged();
  }
  _notifyGlobalsChanged() {
    this._globalTreeDataProvider.updateGlobalDocuments(this.getGlobalDocuments());
  }
};
var GlobalDocumentManager = _GlobalDocumentManager;
GlobalDocumentManager.statusBarMessageTimeout = 5e3;
GlobalDocumentManager.globalListViewId = "globalList";

// extension/src/extension.ts
var outChannel;
var diagColl;
var parsingCtx;
var parser;
var evalCtx;
var lastFormula;
var lastEvaluatedDoc;
var globalDocManager;
var evalTreeDocManager;
function activate(extCtx) {
  var _a;
  parsingCtx = import_kodeine33.ParsingContextBuilder.buildDefault();
  parser = new import_kodeine33.KodeineParser(parsingCtx);
  evalCtx = new import_kodeine33.EvaluationContext();
  evalCtx.buildEvaluationTree = true;
  outChannel = vscode6.window.createOutputChannel("Formula Result");
  extCtx.subscriptions.push(outChannel);
  outChannel.show(true);
  diagColl = vscode6.languages.createDiagnosticCollection("Formula diagnostics");
  extCtx.subscriptions.push(diagColl);
  extCtx.subscriptions.push(vscode6.commands.registerCommand("kodeine.formulaResult", command_formulaResult), vscode6.window.onDidChangeActiveTextEditor((ev) => onSomethingDocumentRelated(ev == null ? void 0 : ev.document)), vscode6.workspace.onDidChangeTextDocument((ev) => onSomethingDocumentRelated(ev.document)), vscode6.workspace.onDidOpenTextDocument((doc) => onSomethingDocumentRelated(doc)), vscode6.workspace.onDidChangeConfiguration((ev) => onConfigurationChanged(ev)));
  globalDocManager = new GlobalDocumentManager(extCtx, parsingCtx.getOperatorSymbolsLongestFirst(), parsingCtx.getFunctionNames());
  globalDocManager.onGlobalAdded((globalDocument) => evalCtx.globals.set(globalDocument.globalName, parser.parse(globalDocument.doc.getText())));
  globalDocManager.onGlobalRemoved((globalDocument) => evalCtx.globals.delete(globalDocument.globalName));
  globalDocManager.onGlobalsCleared(() => evalCtx.globals.clear());
  evalTreeDocManager = new EvaluationTreeDocumentManager(extCtx);
  onSomethingDocumentRelated((_a = vscode6.window.activeTextEditor) == null ? void 0 : _a.document);
}
function onSomethingDocumentRelated(document) {
  if (document && document.languageId === "kode" && document.uri.scheme !== EvaluationStepsTextDocumentContentProvider.scheme) {
    evaluateToOutput(document);
  }
}
function onConfigurationChanged(ev) {
  if (lastEvaluatedDoc && ev.affectsConfiguration("kodeine"))
    evaluateToOutput(lastEvaluatedDoc);
}
function enforceValue(validValues, value, defaultIndex = 0) {
  if (typeof value === "undefined") {
    return validValues[defaultIndex];
  } else {
    let i = validValues.indexOf(value.trim().toLowerCase());
    if (i >= 0)
      return validValues[i];
    else
      return validValues[defaultIndex];
  }
}
function evaluateToOutput(document) {
  let diags = [];
  let formulaText = document.getText();
  lastEvaluatedDoc = document;
  let config = vscode6.workspace.getConfiguration("kodeine", vscode6.window.activeTextEditor.document.uri);
  evalCtx.clockMode = enforceValue(import_kodeine33.ValidClockModes, config.get("clockMode"));
  evalCtx.firstDayOfTheWeek = enforceValue(import_kodeine33.ValidWeekdays, config.get("firstDayOfTheWeek"), 1);
  try {
    lastFormula = parser.parse(formulaText);
    evalCtx.clearSideEffects();
    let globalName = globalDocManager.getGlobalNameFor(document);
    if (globalName) {
      evalCtx.sideEffects.globalNameStack.push(globalName);
      evalCtx.globals.set(globalName, lastFormula);
    }
    let result = lastFormula.evaluate(evalCtx);
    let resultOutputString = result.toOutputString();
    let errCount = parsingCtx.sideEffects.errors.length + evalCtx.sideEffects.errors.length;
    if (errCount > 0) {
      let errorMessages = [];
      let pi = 0;
      let ei = 0;
      for (let i = 0; i < errCount; i++) {
        if (pi < parsingCtx.sideEffects.errors.length && (ei >= evalCtx.sideEffects.errors.length || parsingCtx.sideEffects.errors[pi].token.getStartIndex() < evalCtx.sideEffects.errors[ei].evaluable.source.getStartIndex())) {
          errorMessages.push(parsingCtx.sideEffects.errors[pi].message);
          pi++;
        } else {
          errorMessages.push(evalCtx.sideEffects.errors[ei].message);
          ei++;
        }
      }
      if (resultOutputString) {
        outChannel.replace(`${resultOutputString}

Formula contains ${errCount} error${errCount === 1 ? "" : "s"}:
${errorMessages.join("\n")}`);
      } else {
        outChannel.replace(errorMessages.join("\n"));
      }
    } else {
      outChannel.replace(resultOutputString);
    }
  } catch (err) {
    outChannel.replace("kodeine crashed: " + (err == null ? void 0 : err.toString()));
    lastFormula = null;
  }
  if (parsingCtx.sideEffects.warnings.length > 0) {
    parsingCtx.sideEffects.warnings.forEach((warning) => {
      diags.push({
        severity: vscode6.DiagnosticSeverity.Warning,
        range: new vscode6.Range(document.positionAt(warning.tokens[0].getStartIndex()), document.positionAt(warning.tokens[warning.tokens.length - 1].getEndIndex())),
        message: warning.message,
        code: "",
        source: ""
      });
    });
  }
  if (parsingCtx.sideEffects.errors.length > 0) {
    parsingCtx.sideEffects.errors.forEach((error) => {
      diags.push({
        severity: vscode6.DiagnosticSeverity.Error,
        range: new vscode6.Range(document.positionAt(error.token.getStartIndex()), document.positionAt(error.token.getEndIndex())),
        message: error.message,
        code: "",
        source: ""
      });
    });
  }
  if (evalCtx.sideEffects.warnings.length > 0) {
    evalCtx.sideEffects.warnings.forEach((warning) => {
      diags.push({
        severity: vscode6.DiagnosticSeverity.Warning,
        range: new vscode6.Range(document.positionAt(warning.evaluable.source.getStartIndex()), document.positionAt(warning.evaluable.source.getEndIndex())),
        message: warning.message,
        code: "",
        source: ""
      });
    });
  }
  if (evalCtx.sideEffects.errors.length > 0) {
    evalCtx.sideEffects.errors.forEach((error) => {
      diags.push({
        severity: vscode6.DiagnosticSeverity.Error,
        range: new vscode6.Range(document.positionAt(error.evaluable.source.getStartIndex()), document.positionAt(error.evaluable.source.getEndIndex())),
        message: error.message,
        code: "",
        source: ""
      });
    });
  }
  diagColl.set(vscode6.window.activeTextEditor.document.uri, diags);
  evalTreeDocManager.updateEvaluationTreeFor(document, evalCtx.sideEffects.lastEvaluationTreeNode);
}
function command_formulaResult() {
  outChannel.show(true);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
//# sourceMappingURL=extension.js.map
