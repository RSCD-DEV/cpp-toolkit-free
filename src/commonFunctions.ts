import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

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

export async function findFilesByRegex(dir: string, regex: RegExp, baseDir?: string): Promise<string[]> {
    const results: string[] = [];
    const rootDir = baseDir || dir;

    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const nested = await findFilesByRegex(fullPath, regex, rootDir);
            results.push(...nested);
        } else {
            const relativePath = path.relative(rootDir, fullPath);
            if (regex.test(relativePath)) {
                results.push(fullPath);
            }
        }
    }

    return results;
}
