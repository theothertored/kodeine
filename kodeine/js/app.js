const initialFormula = '$2 + 2$';
var formulaInputEl;
var btnParse;
var tmplTokenRow;
document.addEventListener('DOMContentLoaded', () => {
    formulaInputEl = document.getElementById('formula_input');
    formulaInputEl.value = initialFormula;
    btnParse = document.getElementById('btn_parse');
    btnParse.addEventListener('click', formulaInputEl_input);
    tmplTokenRow = document.getElementById('tmpl_token_row');
});
function formulaInputEl_input(ev) {
    let formulaText = formulaInputEl.value;
    let parsingEnv = ParsingEnvironment.createDefault();
    let charReader = new StringCharReader(formulaText);
    let lexer = new KodeineLexer(charReader, parsingEnv.getSortedOperatorSymbols());
    let parser = new KodeineParser(lexer, parsingEnv);
    let formula = parser.parse();
    console.log('parsed formula: ', formula);
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