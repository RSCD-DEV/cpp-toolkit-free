// diagnosticsManager.ts
import * as vscode from 'vscode';

// Eine Sammlung pro "Check-Typ"
const collections: Record<string, vscode.DiagnosticCollection> = {};

/**
 * Gibt eine DiagnosticCollection für einen bestimmten Typ zurück (z. B. "unusedVariables")
 * und erstellt sie bei Bedarf.
 */
function getCollection(type: string): vscode.DiagnosticCollection {
    if (!collections[type]) {
        collections[type] = vscode.languages.createDiagnosticCollection(type);
    }
    return collections[type];
}

/**
 * Aktualisiert alle Diagnostics eines bestimmten Typs (z. B. für ein Dokument)
 */
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

/**
 * Löscht alle Diagnostics eines bestimmten Typs für das Dokument
 */
export function clearDiagnostics(type: string, document: vscode.TextDocument) {
    getCollection(type).delete(document.uri);
}

/**
 * Löscht alle DiagnosticCollections (z. B. beim Deaktivieren der Extension)
 */
export function clearAllDiagnostics() {
    for (const key in collections) {
        collections[key].clear();
        collections[key].dispose();
    }
}
