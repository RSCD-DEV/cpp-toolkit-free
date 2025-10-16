import * as vscode from 'vscode';

const collections: Record<string, vscode.DiagnosticCollection> = {};

function getCollection(type: string): vscode.DiagnosticCollection {
    if (!collections[type]) {
        collections[type] = vscode.languages.createDiagnosticCollection(type);
    }
    return collections[type];
}

export function updateDiagnostics(
    type: string,
    document: vscode.TextDocument,
    findings: Set<[string, vscode.Range]>,
    messagePrefix: string,
    severity: vscode.DiagnosticSeverity
) {
    const diagnostics: vscode.Diagnostic[] = [];

    for (const [name, range] of findings) {
        const diagnostic = new vscode.Diagnostic(
            range,
            `${messagePrefix}: ${name}`,
            severity
        );
        diagnostic.source = 'C++ Toolkit';
        diagnostics.push(diagnostic);
    }

    getCollection(type).set(document.uri, diagnostics);
}

export function clearDiagnostics(type: string, document: vscode.TextDocument) {
    getCollection(type).delete(document.uri);
}

export function clearAllDiagnostics() {
    for (const key in collections) {
        collections[key].clear();
        collections[key].dispose();
    }
}
