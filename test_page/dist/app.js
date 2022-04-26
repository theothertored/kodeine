import { EvaluationContext } from "../../engine/dist.browser/evaluables/evaluation-context.js";
import { EvaluationError, KodeParsingError } from "../../engine/dist.browser/errors.js";
import { KodeineParser } from "../../engine/dist.browser/kodeine-parser/kodeine-parser.js";
import { ParsingContextBuilder } from "../../engine/dist.browser/kodeine-parser/parsing-context.js";
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
    let parsingCtx = ParsingContextBuilder.buildDefault();
    let parser = new KodeineParser(parsingCtx);
    try {
        let formula = parser.parse(formulaText);
        console.log('input text: ', formulaText);
        console.log('parsed formula: ', formula);
        let evalCtx = new EvaluationContext();
        evaluationOutputEl.value = formula.evaluate(evalCtx).text;
        formulaErrorEl.innerText = '';
    }
    catch (error) {
        if (error instanceof KodeParsingError || error instanceof EvaluationError) {
            formulaErrorEl.innerText = error.message;
        }
        else {
            formulaErrorEl.innerText = 'kodeine crashed: ' + error.message;
        }
        console.error(error);
    }
    //let tokens: FormulaToken[] = [];
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