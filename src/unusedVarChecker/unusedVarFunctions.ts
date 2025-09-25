import * as vscode from 'vscode'

export function findPossibleDeclarations(document: vscode.TextDocument, rangesToOmit: vscode.Range[]) {
    console.log("search for declarations");
    const documentText = document.getText();
    var regExString = /(?<=^\s*)\b([\w:<>]+\s+(?:[\w:<>]+\s+)*)\s*(\w+)\s*(?:=[^;]*)?;/gmd;
    // var regExString = /\b([\w:<>]+\s+(?:[\w:<>]+\s+)*)\s*(\w+)\s*(?:=[^;]*)?;/gmd;
    const regExDeclarations = RegExp(regExString);
    const possibleDeclarations = documentText.matchAll(regExDeclarations);
    let foundDeclarations: Declaration[] = [];
    for (const declaration of possibleDeclarations) {
        const [start, end] = declaration.indices![2];
        const declarationRange = new vscode.Range(document.positionAt(start), document.positionAt(end));

        if (rangesToOmit && rangesToOmit.some(range =>
        (range.start.isBeforeOrEqual(declarationRange.start) &&
            range.end.isAfterOrEqual(declarationRange.end)))) {
            continue;
        }
        const foundDeclaration = new Declaration(declaration[2], declaration[1].trim(), declarationRange);
        foundDeclarations.push(foundDeclaration);
    }
    return foundDeclarations;
}

function findUsage(document: vscode.TextDocument, declarations: Declaration[], rangesToOmit: vscode.Range[]) {
    const documentText = document.getText();
    const usages: { declaration: Declaration, locations: vscode.Range[] }[] = [];

    for (const declaration of declarations) {
        const regex = new RegExp(`\\b${declaration.name}\\b`, 'g');
        const matches = Array.from(documentText.matchAll(regex));
        const locations: vscode.Range[] = [];

        for (const match of matches) {
            if (match.index) {
                const start = document.positionAt(match.index);
                const end = document.positionAt(match.index + declaration.name.length);
                const range = new vscode.Range(start, end);

                if (!rangesEqual(range, declaration.range) && !rangesToOmit.includes(range)) {
                    locations.push(range);
                }
            }
        }
        usages.push({ declaration, locations });
    }

    return usages;
}

export function findRangesToOmit(document: vscode.TextDocument) {

    function addRange(index: number, length: number) {
        const start = document.positionAt(index);
        const end = document.positionAt(index + length);

        const range = new vscode.Range(start, end);
        rangesToOmit.push(range);
    }

    function checkRegExAndAddRanges(regEx: RegExp) {
        let foundMatches = documentText.matchAll(regEx);
        for (const match of foundMatches) {
            if (match.index) {
                addRange(match.index, match[0].toString().length);
            }
        }
    }

    let rangesToOmit: vscode.Range[] = [];
    const documentText = document.getText();

    // Single Line Comments
    const singleLineCommnetRegEx = /\/\/.*$/gmd;
    checkRegExAndAddRanges(singleLineCommnetRegEx);

    // Muliline Comments
    const multilineCommentRegEx = /\/\*[\s\S]*?\*\//g;
    checkRegExAndAddRanges(multilineCommentRegEx);

    // Strings (C/C++-style, single line, handles escapes)
    const cppStringRegex = /"((?:\\.|[^"\\\r\n])*)"|'((?:\\.|[^'\\\r\n])*)'/gd;



    checkRegExAndAddRanges(cppStringRegex);

    return rangesToOmit;
}

function cleanDeclarations(declarations: Declaration[], rangesToOmit: vscode.Range[]) {
    let cleanedDeclarations = declarations.filter(possibleDeclaration => possibleDeclaration.type !== 'return');
    cleanedDeclarations = cleanedDeclarations.filter(possibleDeclaration => !rangesToOmit.includes(possibleDeclaration.range));
    return cleanedDeclarations;
}

export function findUnusedDeclarations(document: vscode.TextDocument) {
    const rangesToOmit = findRangesToOmit(document);
    const declarations = cleanDeclarations(findPossibleDeclarations(document, rangesToOmit), rangesToOmit);
    const usages = findUsage(document, declarations, rangesToOmit);

    return usages.filter(usage => usage.locations.length === 0)
        .map(usage => usage.declaration);
}

function rangesEqual(a: vscode.Range, b: vscode.Range): boolean {
    return a.start.line === b.start.line &&
        a.start.character === b.start.character &&
        a.end.line === b.end.line &&
        a.end.character === b.end.character;
}

export class Declaration {
    name: string;
    type: string;
    range: vscode.Range;

    constructor(name: string, type: string, start: vscode.Position, end: vscode.Position);
    constructor(name: string, type: string, range: vscode.Range);
    constructor(name: string, type: string, a: vscode.Position | vscode.Range, b?: vscode.Position) {
        this.name = name;
        this.type = type;
        if (a instanceof vscode.Range) {
            this.range = a;
        } else if (a instanceof vscode.Position && b instanceof vscode.Position) {
            this.range = new vscode.Range(a, b);
        } else {
            throw new Error("Invalid constructor arguments for Declaration");
        }
    }
}
