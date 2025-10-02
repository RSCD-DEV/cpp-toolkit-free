import * as vscode from 'vscode';
import { findUnusedIncludes } from './unusedIncludeFunctions';

export class UnusedIncludeLensProvider implements vscode.CodeLensProvider {
    async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        console.log("Check for unused includes");
        const findings = findUnusedIncludes(document);

        if (findings.size === 0) return codeLenses;

        for (const finding of findings) {
            const headerName = finding[0];
            const headerRange = finding[1];
            const line = headerRange.start.line;
            const lens = new vscode.CodeLens(headerRange, {
                title: `Delete unused include: ${headerName}`,
                command: 'cpp-toolkit.deleteUnusedInclude',
                arguments: [document.uri, line]
            });
            codeLenses.push(lens);
        }

        return codeLenses;
    }
}