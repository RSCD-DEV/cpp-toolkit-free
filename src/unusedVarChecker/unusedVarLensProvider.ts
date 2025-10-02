import * as vscode from 'vscode';
import { findUnusedDeclarations } from './unusedVarFunctions';

export class UnusedVarLensProvider implements vscode.CodeLensProvider {
    async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        // Only check source files, not headers
        const sourceExtensions = ['.cpp', '.c', '.cc', '.cxx', '.c++', '.C'];
        const fileName = document.uri.fsPath;
        if ((document.languageId !== 'cpp' && document.languageId !== 'c') ||
            !sourceExtensions.some(ext => fileName.endsWith(ext))
        ) {
            return codeLenses;
        }
        const findings = findUnusedDeclarations(document);

        for (const finding of findings) {
            const line = finding.range.start.line;
            const lens = new vscode.CodeLens(finding.range, {
                title: `Delete unused variable: ${finding.name}`,
                command: 'cpp-toolkit.deleteUnusedVar',
                arguments: [document.uri, line]
            });
            codeLenses.push(lens);
        }

        return codeLenses;
    }
}