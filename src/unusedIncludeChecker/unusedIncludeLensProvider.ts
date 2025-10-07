import * as vscode from 'vscode';
import { findUnusedIncludes } from './unusedIncludeFunctions';
import { updateDiagnostics, clearDiagnostics } from '../diagnosticsManager';

export class UnusedIncludeLensProvider implements vscode.CodeLensProvider {
    private static readonly diagnosticsName = "unusedIncludes";
    private static readonly diagnosticsMessage = "unusedIncludes";

    async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        const findings = findUnusedIncludes(document);

        if (findings.size === 0) {
            clearDiagnostics(UnusedIncludeLensProvider.diagnosticsName, document);
            return codeLenses;
        }
        for (const [headerName, headerRange] of findings) {
            const line = headerRange.start.line;
            const lens = new vscode.CodeLens(headerRange, {
                title: `Delete unused include: ${headerName}`,
                command: 'cpp-toolkit.deleteUnusedInclude',
                arguments: [document.uri, line]
            });
            codeLenses.push(lens);
        }

        updateDiagnostics(
            UnusedIncludeLensProvider.diagnosticsName,
            document,
            findings,
            UnusedIncludeLensProvider.diagnosticsMessage,
            vscode.DiagnosticSeverity.Error);

        return codeLenses;
    }
}