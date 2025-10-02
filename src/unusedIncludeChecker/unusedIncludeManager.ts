import * as vscode from 'vscode';
import * as fs from 'fs';
import { findFilesByRegex } from '../commonFunctions';
import { UnusedIncludeLensProvider } from './unusedIncludeLensProvider';
import { extractCppSymbols } from './unusedIncludeFunctions';

interface HeaderSymbols {
    symbols: Set<string>;
}

export const repoHeaderMaps = new Map<string, Map<string, HeaderSymbols>>();

export function registerUnusedIncludeChecker(context: vscode.ExtensionContext) {
    console.log("Register unused include command");
    const deleteUnusedVarDisposable = vscode.commands.registerCommand('cpp-toolkit.deleteUnusedInclude', (uri: vscode.Uri, line: number) => {
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
            new UnusedIncludeLensProvider()
        )
    );

    vscode.workspace.workspaceFolders?.forEach(folder => {
        indexHeadersForFolder(folder.uri.fsPath);
    });
}

async function indexHeadersForFolder(rootPath: string) {
    const headerMap = new Map<string, HeaderSymbols>();
    repoHeaderMaps.set(rootPath, headerMap);

    const uris = await vscode.workspace.findFiles(new vscode.RelativePattern(rootPath, '**/*.{h,hpp}'));

    console.log(uris);

    for (const uri of uris) {
        const content = fs.readFileSync(uri.fsPath, 'utf-8');
        const symbols = extractCppSymbols(content);
        headerMap.set(uri.fsPath, { symbols });
    }

    const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(rootPath, '**/*.{h,hpp}'));
    watcher.onDidChange(uri => updateHeader(uri, headerMap));
    watcher.onDidCreate(uri => updateHeader(uri, headerMap));
    watcher.onDidDelete(uri => headerMap.delete(uri.fsPath));
}

function updateHeader(uri: vscode.Uri, map: Map<string, HeaderSymbols>) {
    const content = fs.readFileSync(uri.fsPath, 'utf-8');
    const symbols = extractCppSymbols(content);
    map.set(uri.fsPath, { symbols });
}

function checkIncludes(fileContent: string, rootPath: string) {
    const headerMap = repoHeaderMaps.get(rootPath);
    if (!headerMap) return;

    const includeRegex = /#include\s+[<"]([^">]+)[">]/g;
    const includes = [...fileContent.matchAll(includeRegex)].map(m => m[1]);

    for (const inc of includes) {
        const headerPaths = [...headerMap.keys()].filter(p => p.endsWith(inc));
        for (const hp of headerPaths) {
            const symbols = headerMap.get(hp)?.symbols;
            if (!symbols) continue;

            for (const sym of symbols) {
                if (fileContent.includes(sym)) {
                    console.log(`Symbol "${sym}" from "${inc}" is used.`);
                } else {
                    console.log(`Symbol "${sym}" from "${inc}" seems unused.`);
                }
            }
        }
    }
}
