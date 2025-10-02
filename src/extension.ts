import * as vscode from 'vscode';
import { registerUnusedVarChecker } from './unusedVarChecker/unusedVarManager';
import { registerUnusedIncludeChecker } from './unusedIncludeChecker/unusedIncludeManager';

export function activate(context: vscode.ExtensionContext) {
	console.log("Starting extension...");
	registerUnusedVarChecker(context);
	registerUnusedIncludeChecker(context);
}

export function deactivate() { }
