import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileStructureParser } from './fileStructureParser';

// Main extension activation function
export function activate(context: vscode.ExtensionContext) {
    const parser = new FileStructureParser();

    // Register command to create file structure from context menu
    const createStructureCommand = vscode.commands.registerCommand(
        'filemet.createStructure',
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

            // Show input box for the expression
            const expression = await vscode.window.showInputBox({
                prompt: 'Enter file structure expression',
                placeHolder: 'e.g., components/{Header.jsx,Footer.jsx} + utils/helpers.js',
                value: '',
                title: 'Create File Structure'
            });

            if (!expression) {
                return;
            }

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
                    if (message) message += ' and ';
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
    );

    context.subscriptions.push(createStructureCommand);
}

export function deactivate() {}