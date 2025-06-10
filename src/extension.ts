import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileStructureParser } from './fileStructureParser';
import { CustomExpressionManager } from './customExpressionManager';
import { ExpressionUIManager } from './expressionUIManager';

// Main extension activation function
export function activate(context: vscode.ExtensionContext) {
    const parser = new FileStructureParser();
    const customExpressionManager = new CustomExpressionManager(context);
    const expressionUIManager = new ExpressionUIManager(customExpressionManager);

    // Register enhanced command to create file structure with UI
    const createStructureWithUICommand = vscode.commands.registerCommand(
        'filemet.createStructureWithUI',
        async (uri: vscode.Uri) => {
            // Determine the target directory
            let targetPath: string;
            
            if (uri) {
                // Called from context menu
                const stat = await vscode.workspace.fs.stat(uri);
                if (stat.type === vscode.FileType.Directory) {
                    // Right-clicked on a folder
                    targetPath = uri.fsPath;
                } else {
                    // Right-clicked on a file, use its parent directory
                    targetPath = path.dirname(uri.fsPath);
                }
            } else {
                // Fallback to workspace root
                const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
                if (!workspaceFolder) {
                    vscode.window.showErrorMessage('No workspace folder found');
                    return;
                }
                targetPath = workspaceFolder.uri.fsPath;
            }

            // Use the new UI manager to select expression
            const expression = await expressionUIManager.selectExpression();

            if (!expression) {
                return;
            }

            await createFileStructureFromExpression(expression, targetPath);
        }
    );

    // Register original command to create file structure from context menu (backward compatibility)
    const createStructureCommand = vscode.commands.registerCommand(
        'filemet.createStructure',
        async (uri: vscode.Uri) => {
            // Determine the target directory and folder context
            let targetPath: string;
            let isContextFolder: boolean = false;
            let folderName: string = '';
            
            if (uri) {
                // Called from context menu
                const stat = await vscode.workspace.fs.stat(uri);
                if (stat.type === vscode.FileType.Directory) {
                    // Right-clicked on a folder
                    targetPath = uri.fsPath;
                    isContextFolder = true;
                    folderName = path.basename(uri.fsPath);
                } else {
                    // Right-clicked on a file, use its parent directory
                    targetPath = path.dirname(uri.fsPath);
                }
            } else {
                // Fallback to workspace root
                const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
                if (!workspaceFolder) {
                    vscode.window.showErrorMessage('No workspace folder found');
                    return;
                }
                targetPath = workspaceFolder.uri.fsPath;
            }

            // Prepare input box configuration
            const inputConfig = {
                prompt: isContextFolder 
                    ? `📁 Creating in '${folderName}' folder - Enter file structure expression:`
                    : 'Enter file structure expression',
                placeHolder: isContextFolder 
                    ? `Files will be created in '${folderName}/' - e.g., Header.jsx, {Header.jsx,Footer.jsx}, components/{Nav.jsx,Button.jsx}`
                    : 'e.g., components/{Header.jsx,Footer.jsx} + utils/helpers.js',
                title: 'Create File Structure'
            };

            // Show input box for the expression
            const expression = await vscode.window.showInputBox(inputConfig);

            if (!expression) {
                return;
            }

            await createFileStructureFromExpression(expression, targetPath);
        }
    );

    // Register command to manage custom expressions
    const manageExpressionsCommand = vscode.commands.registerCommand(
        'filemet.manageExpressions',
        async () => {
            const actions = [
                { label: '$(add) Create New Expression', action: 'create' },
                { label: '$(list-flat) View All Expressions', action: 'view' },
                { label: '$(export) Export Expressions', action: 'export' },
                { label: '$(import) Import Expressions', action: 'import' }
            ];

            const selected = await vscode.window.showQuickPick(actions, {
                title: 'Manage Custom Expressions',
                placeHolder: 'Select an action'
            });

            if (!selected) {
                return;
            }

            switch (selected.action) {
                case 'create':
                    await createNewCustomExpression(customExpressionManager);
                    break;
                case 'view':
                    await viewCustomExpressions(customExpressionManager);
                    break;
                case 'export':
                    await exportExpressions(customExpressionManager);
                    break;
                case 'import':
                    await importExpressions(customExpressionManager);
                    break;
            }
        }
    );

    // Register command palette command for creating structures
    const createFromPaletteCommand = vscode.commands.registerCommand(
        'filemet.createFiles',
        async () => {
            // Use workspace root as target
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder found');
                return;
            }

            const expression = await expressionUIManager.selectExpression();
            if (!expression) {
                return;
            }

            await createFileStructureFromExpression(expression, workspaceFolder.uri.fsPath);
        }
    );

    // Helper function to create file structure from expression
    async function createFileStructureFromExpression(expression: string, targetPath: string) {
        // Parse the expression
        const result = parser.parse(expression);
        
        if (typeof result === 'string') {
            vscode.window.showErrorMessage(result);
            return;
        }

        // Create the files and folders
        try {
            const createdFiles: string[] = [];
            const createdFolders: string[] = [];

            for (const filePath of result) {
                const fullPath = path.join(targetPath, filePath);
                const dirPath = path.dirname(fullPath);

                // Create directory if it doesn't exist
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                    
                    // Track created folders
                    const relativeDirPath = path.relative(targetPath, dirPath);
                    if (relativeDirPath && !createdFolders.includes(relativeDirPath)) {
                        createdFolders.push(relativeDirPath);
                    }
                }

                // Create file if it doesn't exist
                if (!fs.existsSync(fullPath)) {
                    fs.writeFileSync(fullPath, '');
                    createdFiles.push(filePath);
                }
            }

            // Show success message
            let message = '';
            if (createdFiles.length > 0) {
                message += `Created ${createdFiles.length} files`;
            }
            if (createdFolders.length > 0) {
                if (message) {
                    message += ' and ';
                }
                message += `${createdFolders.length} folders`;
            }
            
            if (message) {
                vscode.window.showInformationMessage(message);
            } else {
                vscode.window.showWarningMessage('All files and folders already exist');
            }

            // Refresh the explorer
            vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');

        } catch (error) {
            vscode.window.showErrorMessage(`Error creating files: ${error}`);
        }
    }

    // Helper function to create new custom expression
    async function createNewCustomExpression(manager: CustomExpressionManager) {
        const name = await vscode.window.showInputBox({
            title: 'Create Custom Expression - Name',
            prompt: 'Enter a name for your custom expression',
            placeHolder: 'e.g., My React Component Structure'
        });

        if (!name) {
            return;
        }

        const expression = await vscode.window.showInputBox({
            title: 'Create Custom Expression - Expression',
            prompt: 'Enter the file structure expression',
            placeHolder: 'e.g., components/{Header.jsx,Footer.jsx} + utils/helpers.js'
        });

        if (!expression) {
            return;
        }

        const description = await vscode.window.showInputBox({
            title: 'Create Custom Expression - Description (Optional)',
            prompt: 'Enter a description for your expression',
            placeHolder: 'Brief description of what this expression creates'
        });

        const category = await vscode.window.showInputBox({
            title: 'Create Custom Expression - Category (Optional)',
            prompt: 'Enter a category for organization',
            placeHolder: 'e.g., react, components, api, etc.',
            value: 'custom'
        });

        try {
            await manager.saveCustomExpression({
                name: name.trim(),
                expression: expression.trim(),
                description: description?.trim() || '',
                category: category?.trim() || 'custom',
                tags: []
            });

            vscode.window.showInformationMessage(`Custom expression "${name}" saved successfully!`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to save custom expression: ${error}`);
        }
    }

    // Helper function to view custom expressions
    async function viewCustomExpressions(manager: CustomExpressionManager) {
        const expressions = await manager.getCustomExpressions();
        
        if (expressions.length === 0) {
            vscode.window.showInformationMessage('No custom expressions found.');
            return;
        }

        const items = expressions.map((expr: any) => ({
            label: expr.name,
            description: expr.description,
            detail: `Category: ${expr.category} | Expression: ${expr.expression.length > 50 ? expr.expression.substring(0, 50) + '...' : expr.expression}`
        }));

        await vscode.window.showQuickPick(items, {
            title: 'Custom Expressions',
            placeHolder: 'View your saved expressions'
        });
    }

    // Helper function to export expressions
    async function exportExpressions(manager: CustomExpressionManager) {
        try {
            const jsonData = await manager.exportCustomExpressions();
            
            const saveUri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file('filemet-expressions.json'),
                filters: {
                    'JSON Files': ['json']
                }
            });

            if (saveUri) {
                await vscode.workspace.fs.writeFile(saveUri, Buffer.from(jsonData, 'utf8'));
                vscode.window.showInformationMessage('Expressions exported successfully!');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to export expressions: ${error}`);
        }
    }

    // Helper function to import expressions
    async function importExpressions(manager: CustomExpressionManager) {
        try {
            const fileUri = await vscode.window.showOpenDialog({
                canSelectMany: false,
                filters: {
                    'JSON Files': ['json']
                }
            });

            if (!fileUri || fileUri.length === 0) {
                return;
            }

            const jsonData = await vscode.workspace.fs.readFile(fileUri[0]);
            const jsonString = Buffer.from(jsonData).toString('utf8');

            const mergeMode = await vscode.window.showQuickPick(['merge', 'replace'], {
                title: 'Import Mode',
                placeHolder: 'How should imported expressions be handled?'
            });

            if (!mergeMode) {
                return;
            }

            const count = await manager.importCustomExpressions(
                jsonString, 
                mergeMode as 'merge' | 'replace'
            );

            vscode.window.showInformationMessage(`Successfully imported ${count} expressions!`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to import expressions: ${error}`);
        }
    }

    // Register all commands
    context.subscriptions.push(
        createStructureWithUICommand,
        createStructureCommand,
        manageExpressionsCommand,
        createFromPaletteCommand
    );
}

export function deactivate() {}