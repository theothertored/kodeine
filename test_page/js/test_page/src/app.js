import { EvaluationContext } from "../../kodeine_engine/src/base.js";
import { EvaluationError, KodeParseError } from "../../kodeine_engine/src/errors.js";
import { KodeineParser } from "../../kodeine_engine/src/kodeine-parser/kodeine-parser.js";
import { ParsingContextBuilder } from "../../kodeine_engine/src/kodeine-parser/parsing-context.js";
const initialFormula = '$2 + 2$';
var formulaInputEl;
var formulaErrorEl;
var evaluationOutputEl;
var evaluationStepsEl;
var btnDoIt;
var tmplTokenRow;
document.addEventListener('DOMContentLoaded', () => {
    formulaInputEl = document.getElementById('formula_input');
    formulaInputEl.value = localStorage.getItem('formula') || initialFormula;
    formulaErrorEl = document.getElementById('formula_error');
    btnDoIt = document.getElementById('btn_doit');
    btnDoIt.addEventListener('click', formulaInputEl_input);
    tmplTokenRow = document.getElementById('tmpl_token_row');
    evaluationOutputEl = document.getElementById('evaluation_output');
    evaluationStepsEl = document.getElementById('evaluation_steps');
});
function formulaInputEl_input(ev) {
    let formulaText = formulaInputEl.value;
    localStorage.setItem('formula', formulaText);
    let parsingEnv = ParsingContextBuilder.buildDefault();
    let parser = new KodeineParser(parsingEnv);
    try {
        let formula = parser.parse(formulaText);
        console.log('input text: ', formulaText);
        console.log('parsed formula: ', formula);
        let evaluationEnv = new EvaluationContext();
        evaluationOutputEl.value = formula.evaluate(evaluationEnv).text;
        formulaErrorEl.innerText = '';
    }
    catch (error) {
        if (error instanceof KodeParseError || error instanceof EvaluationError) {
            formulaErrorEl.innerText = error.message;
        }
        else {
            formulaErrorEl.innerText = 'kodeine crashed: ' + error.message;
        }
        console.error(error);
    }
    //let tokens: IFormulaToken[] = [];
    //while (!lexer.EOF()) {
    //    tokens.push(lexer.consume(1)[0]);
    //}
    //let tbody = document.querySelector('tbody');
    //tbody.innerHTML = '';
    //for (var token of tokens) {
    //    let tr = tmplTokenRow.content.firstElementChild.cloneNode(true) as HTMLTableRowElement;
    //    tr.innerHTML = tr.innerHTML
    //        .replace('[token_type]', token.constructor.name.replace('Token', ''))
    //        .replace('[token_text]', token.getSourceText())
    //        .replace('[start_index]', token.getStartIndex().toString())
    //        .replace('[end_index]', token.getEndIndex().toString());
    //    tbody.appendChild(tr);
    //}
    //console.log(tokens);
}
//# sourceMappingURL=app.js.map