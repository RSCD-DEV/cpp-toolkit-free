import * as assert from 'assert';
import * as vscode from 'vscode';
import { findPossibleDeclarations, findUnusedDeclarations, Declaration } from '../src/unusedVarChecker/unusedVarFunctions';
import { findRangesToOmit } from '../src/commonFunctions';

async function createDocFromString(code: string): Promise<vscode.TextDocument> {
    const doc = await vscode.workspace.openTextDocument({
        content: code,
        language: "cpp"
    });
    return doc;
}

suite('UnusedVarFunctions Tests', () => {
    test('findPossibleDeclarations', async () => {
        const code =
            `int TestName;
            int y;
            TestName = 5;
            y = 5;
            auto assigned = 10;
            return returnValue;

            // single comment;
            //

            /* open multiline;
                comment
            */

           /** doxygen style;
            * comment
            */ `
            ;

        const doc = await createDocFromString(code);
        const result = findPossibleDeclarations(doc, findRangesToOmit(doc));
        const testNameIndex = code.search("TestName");
        const yIndex = code.search("y;");
        const assignedIndex = code.search("assigned");
        const returnValueIndex = code.search("returnValue;");
        assert.deepStrictEqual(result, [
            new Declaration("TestName", "int", doc.positionAt(testNameIndex), doc.positionAt(testNameIndex + "TestName".length)),
            new Declaration("y", "int", doc.positionAt(yIndex), doc.positionAt(yIndex + "y".length)),
            new Declaration("assigned", "auto", doc.positionAt(assignedIndex), doc.positionAt(assignedIndex + "assigned".length)),
            new Declaration("returnValue", "return", doc.positionAt(returnValueIndex), doc.positionAt(returnValueIndex + "returnValue".length))
        ]);
    });
    test('findUnusedDeclarations', async () => {
        const code =
            `int testVar;
            std::make_shared<int>(testVar);
            return testVar;

            abc notUsed;

            auto unusedVar;
            std::shared_ptr<UINT32> unusedPointer;
            return returnValue;`;

        const doc = await createDocFromString(code);
        const unusedDeclarations = findUnusedDeclarations(doc);

        const unusedVarIndex = code.search("unusedVar");
        const unusedPointerIndex = code.search("unusedPointer");
        const notUsedIndex = code.search("notUsed");

        assert.deepStrictEqual(unusedDeclarations, [
            new Declaration("notUsed", "abc", doc.positionAt(notUsedIndex), doc.positionAt(notUsedIndex + "notUsed".length)),
            new Declaration("unusedVar", "auto", doc.positionAt(unusedVarIndex), doc.positionAt(unusedVarIndex + "unusedVar".length)),
            new Declaration("unusedPointer", "std::shared_ptr<UINT32>", doc.positionAt(unusedPointerIndex), doc.positionAt(unusedPointerIndex + "unusedPointer".length))
        ]);
    });
});
