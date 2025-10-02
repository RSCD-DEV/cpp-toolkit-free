import * as vscode from 'vscode';
import * as path from 'path';
import { repoHeaderMaps } from "./unusedIncludeManager";

function extractIncludedHeaderFiles(document: vscode.TextDocument): Array<[string, vscode.Range]> {
    const documentText = document.getText();
    const includeRegex = /#include\s*["<](.*?)[">]/gd;
    const foundIncludes = documentText.matchAll(includeRegex);
    const foundHeaders = new Array<[string, vscode.Range]>;
    for (const include of foundIncludes) {
        const [start, end] = include.indices![1];
        const includeRange = new vscode.Range(document.positionAt(start), document.positionAt(end));
        const headerName = path.normalize(include[1]);
        foundHeaders.push([headerName, includeRange]);
    }
    return foundHeaders;
}

export function extractCppSymbols(headerContent: string): Set<string> {
    const symbolSet = new Set<string>();

    let match: RegExpExecArray | null;

    function executeRegExAndAddSymbols(regex: RegExp) {
        while ((match = regex.exec(headerContent)) !== null) {
            symbolSet.add(match[1]);

        }
    }

    // Match function declarations
    const functionRegex = /\b(?:static|virtual|inline|explicit|friend)?\s*(?:template\s*<[^>]+>\s*)?(?:[\w:<>]+\s+)?([\w:]+|operator\s*[^\s(]+)\s*\([^;{]*\)\s*(?:const)?\s*(?:->\s*[\w:<>]+)?\s*[;{]/g;
    executeRegExAndAddSymbols(functionRegex);
    // Match member variables
    const memberRegex = /^(?:\s*(?:public|private|protected)\s*:\s*)?\s*(?:static\s+|const\s+|mutable\s+)?(?:[\w:<>]+(?:\s*[*&])?\s+)+([\w:]+)\s*(?:\[.*\])?\s*;/gm;
    executeRegExAndAddSymbols(memberRegex);
    // Match class names
    const classRegex = /\bclass\s+(\w+)/g;
    executeRegExAndAddSymbols(classRegex);
    // Match struct names
    const structRegex = /\bstruct\s+(\w+)/g;
    executeRegExAndAddSymbols(structRegex);
    // Match enum names
    const enumRegex = /\benum\s+(?:class\s+)?(\w+)/g;
    executeRegExAndAddSymbols(enumRegex);
    // Match typedefs and using aliases
    const typedefRegex = /\btypedef\s+.*?\s+(\w+)\s*;/g;
    executeRegExAndAddSymbols(typedefRegex);
    const usingRegex = /\busing\s+(\w+)\s*=\s*.*?;/g;
    executeRegExAndAddSymbols(usingRegex);
    // Match macros
    const macroRegex = /#define\s+(\w+)/g;
    executeRegExAndAddSymbols(macroRegex);
    // Match namespace names
    const namespaceRegex = /\bnamespace\s+(\w+)/g;
    executeRegExAndAddSymbols(namespaceRegex);

    return symbolSet;
}

export function findUnusedIncludes(document: vscode.TextDocument): Set<[string, vscode.Range]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.find(f =>
        document.uri.fsPath.startsWith(f.uri.fsPath)
    );

    if (!workspaceRoot) {
        return new Set<[string, vscode.Range]>();
    }

    const headerMap = repoHeaderMaps.get(workspaceRoot.uri.fsPath);
    if (!headerMap) return new Set<[string, vscode.Range]>();

    const unusedHeaders = new Set<[string, vscode.Range]>();

    const includes = extractIncludedHeaderFiles(document);

    console.log("found includes: ", includes);

    for (const include of includes) {
        const headerName = include[0];
        const headerRange = include[1];
        const headerPaths = [...headerMap.keys()].filter(headerPath => {
            const normalizedPath = path.normalize(headerPath);
            return normalizedPath.endsWith(headerName);
        });

        if (headerPaths.length === 0) {

            console.log("header not found in headerMap", headerName);
            unusedHeaders.add([headerName, headerRange]);
            continue;
        }

        for (const header of headerPaths) {
            const symbols = headerMap.get(header)!.symbols;

            let isUsed = false;
            for (const sym of symbols) {
                if (document.getText().includes(sym)) {
                    console.log("header is used: ", header);
                    isUsed = true;
                }
            }
            if (!isUsed) {
                console.log("add unused header: ", header);
                unusedHeaders.add([headerName, headerRange]);
            }
        }
    }
    return unusedHeaders;
}