import * as vscode from 'vscode';
import { findUnusedDeclarations } from './unusedVarFunctions';

export class UnusedVarLensProvider implements vscode.CodeLensProvider {
    async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
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