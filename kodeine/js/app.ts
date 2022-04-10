const initialFormula = '$2 + 2$';

var formulaInputEl: HTMLTextAreaElement;
var formulaErrorEl: HTMLElement;
var evaluationOutputEl: HTMLOutputElement;
var evaluationStepsEl: HTMLOutputElement;
var btnDoIt: HTMLButtonElement;
var tmplTokenRow: HTMLTemplateElement;

document.addEventListener('DOMContentLoaded', () => {

    formulaInputEl = document.getElementById('formula_input') as HTMLTextAreaElement;
    formulaInputEl.value = localStorage.getItem('formula') || initialFormula;

    formulaErrorEl = document.getElementById('formula_error');

    btnDoIt = document.getElementById('btn_doit') as HTMLButtonElement;
    btnDoIt.addEventListener('click', formulaInputEl_input);

    tmplTokenRow = document.getElementById('tmpl_token_row') as HTMLTemplateElement;

    evaluationOutputEl = document.getElementById('evaluation_output') as HTMLOutputElement;
    evaluationStepsEl = document.getElementById('evaluation_steps') as HTMLOutputElement;
});

function formulaInputEl_input(ev: InputEvent) {

    let formulaText = formulaInputEl.value;
    localStorage.setItem('formula', formulaText);

    let parsingEnv = ParsingEnvironment.createDefault();
    let charReader = new StringCharReader(formulaText);
    let lexer = new KodeineLexer(charReader, parsingEnv.getSortedOperatorSymbols());
    let parser = new KodeineParser(lexer, parsingEnv);

    try {

        let formula = parser.parse();
        console.log('input text: ', formulaText);
        console.log('parsed formula: ', formula);

        let evaluationEnv = new EvaluationEnvironment();
        evaluationOutputEl.value = formula.evaluateToString(evaluationEnv);

        let log = '';

        function logLine(line: string = '') {
            log += line + '\n';
            console.log(line);
        }

        console.groupCollapsed('EVALUATION STEPS:')

        for (var formulaPart of formula.parts) {

            if (formulaPart instanceof PlainTextPart) {

                logLine(`Output text: "${formulaPart.evaluateToString(evaluationEnv)}"`)

            } else if (formulaPart instanceof EvaluatedPart) {

                let evaluatedPartStartIndex = formulaPart.tokens[0].getStartIndex();
                let evaluatedPartEndIndex = formulaPart.tokens[formulaPart.tokens.length - 1].getEndIndex();
                let evaluatedPartText = formulaText.substring(evaluatedPartStartIndex, evaluatedPartEndIndex);

                logLine();
                logLine(`Evaluate kode:`);
                logLine(`  Step ${0}/${formulaPart.lastEvaluationSteps.length - 1}: ${evaluatedPartText}`);

                for (var i = 0; i < formulaPart.lastEvaluationSteps.length - 1; i++) {

                    let step = formulaPart.lastEvaluationSteps[i];

                    let beforeEvaluableFormulaText = evaluatedPartText.substr(0, step.evaluable.source.startIndex - evaluatedPartStartIndex);
                    let afterEvaluableFormulaText = evaluatedPartText.substr(step.evaluable.source.endIndex - evaluatedPartStartIndex);

                    logLine(`  Step ${i + 1}/${formulaPart.lastEvaluationSteps.length - 1}: ${beforeEvaluableFormulaText + step.value.text + afterEvaluableFormulaText}`);

                }

                let finalStep = formulaPart.lastEvaluationSteps[formulaPart.lastEvaluationSteps.length - 1];
                logLine(`Output kode result: ${finalStep.value.text}`);
                logLine();

            }

        }

        console.groupEnd();
        evaluationStepsEl.value = log;

    } catch (error) {

        if (error instanceof KodeParseError || error instanceof EvaluationError) {
            formulaErrorEl.innerText = error.message;
        } else {
            formulaErrorEl.innerText = 'crash: ' + error.message;
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