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
    let charReader = new StringCharReader(formulaText);
    let lexer = new KodeineLexer(charReader);
    let tokens = [];
    while (!lexer.EOF()) {
        tokens.push(lexer.consume(1)[0]);
    }
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    for (var token of tokens) {
        let tr = tmplTokenRow.content.firstElementChild.cloneNode(true);
        tr.innerHTML = tr.innerHTML
            .replace('[token_type]', token.constructor.name.replace('Token', ''))
            .replace('[token_text]', token.getStringRepresentation())
            .replace('[start_index]', token.getStartIndex().toString())
            .replace('[end_index]', token.getEndIndex().toString());
        tbody.appendChild(tr);
    }
    console.log(tokens);
}
//# sourceMappingURL=app.js.map