import * as vscode from 'vscode';
import { registerUnusedVarChecker } from './unusedVarChecker/unusedVarManager';

export function activate(context: vscode.ExtensionContext) {
	console.log("Starting extension...");
	registerUnusedVarChecker(context);
}

export function deactivate() { }
