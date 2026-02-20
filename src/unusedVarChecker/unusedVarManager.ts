import * as vscode from 'vscode';
import { UnusedVarLensProvider } from './unusedVarLensProvider';

export function registerUnusedVarChecker(context: vscode.ExtensionContext): vscode.Disposable[] {
    console.log("Register unused var command");
    const disposables: vscode.Disposable[] = [];

    const deleteUnusedVarDisposable = vscode.commands.registerCommand('cpp-toolkit.deleteUnusedVar', (uri: vscode.Uri, line: number) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.uri.toString() !== uri.toString()) {
            vscode.window.showErrorMessage('No active editor or wrong file.');
            return;
        }
        editor.edit(editBuilder => {
            const lineRange = editor.document.lineAt(line).rangeIncludingLineBreak;
            editBuilder.delete(lineRange);
        });
    });
    disposables.push(deleteUnusedVarDisposable);
    context.subscriptions.push(deleteUnusedVarDisposable);

    const codeLensDisposable = vscode.languages.registerCodeLensProvider(
        { language: 'cpp', scheme: 'file' },
        new UnusedVarLensProvider()
    );
    disposables.push(codeLensDisposable);
    context.subscriptions.push(codeLensDisposable);

    return disposables;
}