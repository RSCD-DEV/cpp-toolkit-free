import * as vscode from 'vscode';
import { UnusedVarLensProvider } from './unusedVarLensProvider';

export function registerUnusedVarChecker(context: vscode.ExtensionContext) {
    console.log("Register unused var command");
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
    context.subscriptions.push(deleteUnusedVarDisposable);


    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            { language: 'cpp', scheme: 'file' },
            new UnusedVarLensProvider()
        )
    );
}