import * as vscode from 'vscode';
import { registerUnusedVarChecker } from './unusedVarChecker/unusedVarManager';
import { registerUnusedIncludeChecker } from './unusedIncludeChecker/unusedIncludeManager';

export function registerFeatures(context: vscode.ExtensionContext): vscode.Disposable {
	console.log("Starting extension...");

	const varDisposables = registerUnusedVarChecker(context);
	const includeDisposables = registerUnusedIncludeChecker(context);

	return vscode.Disposable.from(
		...(Array.isArray(varDisposables) ? varDisposables : []),
		...(Array.isArray(includeDisposables) ? includeDisposables : [])
	);
}
