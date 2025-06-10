import * as vscode from 'vscode';
import { FrameworkTemplate, getFrameworkTemplatesByCategory, getCategories, getFrameworkTemplateById } from './frameworkTemplates';
import { CustomExpression, CustomExpressionManager } from './customExpressionManager';

export interface ExpressionQuickPickItem extends vscode.QuickPickItem {
    type: 'framework' | 'custom' | 'manual' | 'category';
    template?: FrameworkTemplate;
    customExpression?: CustomExpression;
    category?: string;
}

export class ExpressionUIManager {
    constructor(
        private customExpressionManager: CustomExpressionManager
    ) {}

    // Main entry point for selecting an expression
    async selectExpression(): Promise<string | null> {
        const choice = await this.showMainMenu();
        
        if (!choice) {
            return null;
        }

        switch (choice.type) {
            case 'framework':
                return await this.selectFrameworkTemplate();
            case 'custom':
                return await this.selectCustomExpression();
            case 'manual':
                return await this.showManualInput();
            default:
                return null;
        }
    }

    // Show the main menu for choosing expression type
    private async showMainMenu(): Promise<ExpressionQuickPickItem | undefined> {
        const items: ExpressionQuickPickItem[] = [
            {
                label: '$(symbol-class) Framework Templates',
                description: 'Pre-built structures for popular frameworks',
                detail: 'Choose from React, Next.js, Go, Python, Django, and more',
                type: 'framework'
            },
            {
                label: '$(bookmark) Custom Expressions',
                description: 'Your saved custom expressions',
                detail: 'Access and manage your personal file structure templates',
                type: 'custom'
            },
            {
                label: '$(edit) Manual Input',
                description: 'Enter a custom expression manually',
                detail: 'Type your own file structure expression',
                type: 'manual'
            }
        ];

        return await vscode.window.showQuickPick(items, {
            title: 'Select Expression Type',
            placeHolder: 'Choose how you want to create your file structure'
        });
    }

    // Show framework template selection
    private async selectFrameworkTemplate(): Promise<string | null> {
        const categories = getCategories();
        
        // Show category selection first
        const categoryItems: ExpressionQuickPickItem[] = [
            {
                label: '$(list-flat) All Templates',
                description: 'View all framework templates',
                type: 'category',
                category: 'all'
            },
            ...categories.map(category => ({
                label: `$(folder) ${this.capitalizeFirst(category)}`,
                description: `${category} templates`,
                type: 'category' as const,
                category
            }))
        ];

        const selectedCategory = await vscode.window.showQuickPick(categoryItems, {
            title: 'Select Framework Category',
            placeHolder: 'Choose a category to browse templates'
        });

        if (!selectedCategory) {
            return null;
        }

        // Get templates for selected category
        const templates = selectedCategory.category === 'all' 
            ? getFrameworkTemplatesByCategory() 
            : getFrameworkTemplatesByCategory(selectedCategory.category);

        const templateItems: ExpressionQuickPickItem[] = templates.map(template => ({
            label: `$(symbol-method) ${template.name}`,
            description: template.description,
            detail: this.truncateExpression(template.expression),
            type: 'framework',
            template
        }));

        // Add back option
        templateItems.unshift({
            label: '$(arrow-left) Back to Categories',
            description: 'Return to category selection',
            type: 'category'
        });

        const selectedTemplate = await vscode.window.showQuickPick(templateItems, {
            title: `${this.capitalizeFirst(selectedCategory.category || 'All')} Framework Templates`,
            placeHolder: 'Select a framework template'
        });

        if (!selectedTemplate) {
            return null;
        }

        if (selectedTemplate.type === 'category') {
            return this.selectFrameworkTemplate(); // Go back to category selection
        }

        if (selectedTemplate.template) {
            // Show preview and confirmation
            const confirmed = await this.showExpressionPreview(
                selectedTemplate.template.name,
                selectedTemplate.template.expression,
                selectedTemplate.template.description
            );
            
            return confirmed ? selectedTemplate.template.expression : null;
        }

        return null;
    }

    // Show custom expression selection
    private async selectCustomExpression(): Promise<string | null> {
        const customExpressions = await this.customExpressionManager.getCustomExpressions();

        if (customExpressions.length === 0) {
            const createNew = await vscode.window.showInformationMessage(
                'No custom expressions found. Would you like to create one?',
                'Create New',
                'Cancel'
            );

            if (createNew === 'Create New') {
                return await this.createNewCustomExpression();
            }
            return null;
        }

        const expressionItems: ExpressionQuickPickItem[] = [
            {
                label: '$(add) Create New Expression',
                description: 'Save a new custom expression',
                type: 'custom'
            },
            {
                label: '$(export) Manage Expressions',
                description: 'Import, export, or edit custom expressions',
                type: 'custom'
            },
            ...customExpressions.map(expr => ({
                label: `$(bookmark) ${expr.name}`,
                description: expr.description,
                detail: this.truncateExpression(expr.expression),
                type: 'custom' as const,
                customExpression: expr
            }))
        ];

        const selected = await vscode.window.showQuickPick(expressionItems, {
            title: 'Custom Expressions',
            placeHolder: 'Select a custom expression or manage them'
        });

        if (!selected) {
            return null;
        }

        if (selected.customExpression) {
            const confirmed = await this.showExpressionPreview(
                selected.customExpression.name,
                selected.customExpression.expression,
                selected.customExpression.description
            );
            
            return confirmed ? selected.customExpression.expression : null;
        } else if (selected.label.includes('Create New')) {
            return await this.createNewCustomExpression();
        } else if (selected.label.includes('Manage')) {
            await this.showManageExpressionsMenu();
            return this.selectCustomExpression(); // Return to custom expression selection
        }

        return null;
    }

    // Show manual input dialog
    private async showManualInput(): Promise<string | null> {
        const expression = await vscode.window.showInputBox({
            title: 'Enter File Structure Expression',
            prompt: 'Enter your file structure expression',
            placeHolder: 'e.g., components/{Header.jsx,Footer.jsx} + utils/helpers.js',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Expression cannot be empty';
                }
                return null;
            }
        });

        if (!expression) {
            return null;
        }

        // Ask if user wants to save this expression
        const saveChoice = await vscode.window.showInformationMessage(
            'Would you like to save this expression for future use?',
            'Save as Custom',
            'Use Once',
            'Cancel'
        );

        if (saveChoice === 'Cancel') {
            return null;
        }

        if (saveChoice === 'Save as Custom') {
            await this.saveExpressionAsCustom(expression);
        }

        return expression;
    }

    // Create a new custom expression
    private async createNewCustomExpression(): Promise<string | null> {
        const name = await vscode.window.showInputBox({
            title: 'Create Custom Expression - Name',
            prompt: 'Enter a name for your custom expression',
            placeHolder: 'e.g., My React Component Structure',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Name cannot be empty';
                }
                return null;
            }
        });

        if (!name) {
            return null;
        }

        const expression = await vscode.window.showInputBox({
            title: 'Create Custom Expression - Expression',
            prompt: 'Enter the file structure expression',
            placeHolder: 'e.g., components/{Header.jsx,Footer.jsx} + utils/helpers.js',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Expression cannot be empty';
                }
                return null;
            }
        });

        if (!expression) {
            return null;
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
            await this.customExpressionManager.saveCustomExpression({
                name: name.trim(),
                expression: expression.trim(),
                description: description?.trim() || '',
                category: category?.trim() || 'custom',
                tags: []
            });

            vscode.window.showInformationMessage(`Custom expression "${name}" saved successfully!`);
            return expression;
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to save custom expression: ${error}`);
            return null;
        }
    }

    // Save an expression as custom
    private async saveExpressionAsCustom(expression: string): Promise<void> {
        const name = await vscode.window.showInputBox({
            title: 'Save Expression - Name',
            prompt: 'Enter a name for this expression',
            placeHolder: 'e.g., My File Structure',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Name cannot be empty';
                }
                return null;
            }
        });

        if (!name) {
            return;
        }

        const description = await vscode.window.showInputBox({
            title: 'Save Expression - Description (Optional)',
            prompt: 'Enter a description',
            placeHolder: 'Brief description of what this expression creates'
        });

        const category = await vscode.window.showInputBox({
            title: 'Save Expression - Category (Optional)',
            prompt: 'Enter a category',
            placeHolder: 'e.g., react, components, api, etc.',
            value: 'custom'
        });

        try {
            await this.customExpressionManager.saveCustomExpression({
                name: name.trim(),
                expression: expression.trim(),
                description: description?.trim() || '',
                category: category?.trim() || 'custom',
                tags: []
            });

            vscode.window.showInformationMessage(`Expression "${name}" saved successfully!`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to save expression: ${error}`);
        }
    }

    // Show expression preview and confirmation
    private async showExpressionPreview(name: string, expression: string, description: string): Promise<boolean> {
        const previewText = `**${name}**\n\n${description}\n\n**Expression:**\n\`\`\`\n${expression}\n\`\`\``;
        
        const choice = await vscode.window.showInformationMessage(
            `Preview: ${name}`,
            { modal: true, detail: previewText },
            'Use This Expression',
            'Cancel'
        );

        return choice === 'Use This Expression';
    }

    // Show manage expressions menu
    private async showManageExpressionsMenu(): Promise<void> {
        const actions: ExpressionQuickPickItem[] = [
            {
                label: '$(export) Export Expressions',
                description: 'Export all custom expressions to JSON file',
                type: 'custom'
            },
            {
                label: '$(import) Import Expressions',
                description: 'Import expressions from JSON file',
                type: 'custom'
            },
            {
                label: '$(edit) Edit Expression',
                description: 'Edit an existing custom expression',
                type: 'custom'
            },
            {
                label: '$(trash) Delete Expression',
                description: 'Delete a custom expression',
                type: 'custom'
            }
        ];

        const selected = await vscode.window.showQuickPick(actions, {
            title: 'Manage Custom Expressions',
            placeHolder: 'Select an action'
        });

        if (!selected) {
            return;
        }

        switch (selected.label) {
            case '$(export) Export Expressions':
                await this.exportExpressions();
                break;
            case '$(import) Import Expressions':
                await this.importExpressions();
                break;
            case '$(edit) Edit Expression':
                await this.editExpression();
                break;
            case '$(trash) Delete Expression':
                await this.deleteExpression();
                break;
        }
    }

    // Export expressions to file
    private async exportExpressions(): Promise<void> {
        try {
            const jsonData = await this.customExpressionManager.exportCustomExpressions();
            
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

    // Import expressions from file
    private async importExpressions(): Promise<void> {
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

            const count = await this.customExpressionManager.importCustomExpressions(
                jsonString, 
                mergeMode as 'merge' | 'replace'
            );

            vscode.window.showInformationMessage(`Successfully imported ${count} expressions!`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to import expressions: ${error}`);
        }
    }

    // Edit an existing expression
    private async editExpression(): Promise<void> {
        // Implementation for editing expressions
        const expressions = await this.customExpressionManager.getCustomExpressions();
        
        if (expressions.length === 0) {
            vscode.window.showInformationMessage('No custom expressions to edit.');
            return;
        }

        // Show selection of expressions to edit
        const items = expressions.map(expr => ({
            label: expr.name,
            description: expr.description,
            detail: this.truncateExpression(expr.expression),
            expr
        }));

        const selected = await vscode.window.showQuickPick(items, {
            title: 'Select Expression to Edit',
            placeHolder: 'Choose an expression to edit'
        });

        if (!selected) {
            return;
        }

        // Edit the selected expression
        // This could be expanded to allow editing individual fields
        vscode.window.showInformationMessage('Expression editing feature coming soon!');
    }

    // Delete an expression
    private async deleteExpression(): Promise<void> {
        const expressions = await this.customExpressionManager.getCustomExpressions();
        
        if (expressions.length === 0) {
            vscode.window.showInformationMessage('No custom expressions to delete.');
            return;
        }

        const items = expressions.map(expr => ({
            label: expr.name,
            description: expr.description,
            detail: this.truncateExpression(expr.expression),
            expr
        }));

        const selected = await vscode.window.showQuickPick(items, {
            title: 'Select Expression to Delete',
            placeHolder: 'Choose an expression to delete'
        });

        if (!selected) {
            return;
        }

        const confirmed = await vscode.window.showWarningMessage(
            `Are you sure you want to delete "${selected.expr.name}"?`,
            { modal: true },
            'Delete',
            'Cancel'
        );

        if (confirmed === 'Delete') {
            try {
                await this.customExpressionManager.deleteCustomExpression(selected.expr.id);
                vscode.window.showInformationMessage(`Expression "${selected.expr.name}" deleted successfully!`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to delete expression: ${error}`);
            }
        }
    }

    // Utility methods
    private capitalizeFirst(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private truncateExpression(expression: string, maxLength: number = 100): string {
        if (expression.length <= maxLength) {
            return expression;
        }
        return expression.substring(0, maxLength - 3) + '...';
    }
}
