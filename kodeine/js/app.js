const initialFormula = '$2 + 2$';
var formulaInputEl;
var formulaOutputEl;
var btnDoIt;
var tmplTokenRow;
document.addEventListener('DOMContentLoaded', () => {
    formulaInputEl = document.getElementById('formula_input');
    formulaInputEl.value = localStorage.getItem('formula') || initialFormula;
    btnDoIt = document.getElementById('btn_doit');
    btnDoIt.addEventListener('click', formulaInputEl_input);
    tmplTokenRow = document.getElementById('tmpl_token_row');
    formulaOutputEl = document.getElementById('evaluation_output');
});
function formulaInputEl_input(ev) {
    let formulaText = formulaInputEl.value;
    localStorage.setItem('formula', formulaText);
    let parsingEnv = ParsingEnvironment.createDefault();
    let charReader = new StringCharReader(formulaText);
    let lexer = new KodeineLexer(charReader, parsingEnv.getSortedOperatorSymbols());
    let parser = new KodeineParser(lexer, parsingEnv);
    let formula = parser.parse();
    console.log('input text: ', formulaText);
    console.log('parsed formula: ', formula);
    let evaluationEnv = new EvaluationEnvironment();
    formulaOutputEl.value = formula.evaluateToString(evaluationEnv);
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