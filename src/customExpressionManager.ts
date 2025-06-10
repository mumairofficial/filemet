import * as vscode from 'vscode';

export interface CustomExpression {
    id: string;
    name: string;
    description: string;
    expression: string;
    category: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export class CustomExpressionManager {
    private static readonly STORAGE_KEY = 'filemet.customExpressions';
    
    constructor(private context: vscode.ExtensionContext) {}

    // Get all custom expressions
    async getCustomExpressions(): Promise<CustomExpression[]> {
        const expressions = this.context.globalState.get<CustomExpression[]>(CustomExpressionManager.STORAGE_KEY) || [];
        return expressions.map(expr => ({
            ...expr,
            createdAt: new Date(expr.createdAt),
            updatedAt: new Date(expr.updatedAt)
        }));
    }

    // Save a custom expression
    async saveCustomExpression(expression: Omit<CustomExpression, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomExpression> {
        const expressions = await this.getCustomExpressions();
        
        const newExpression: CustomExpression = {
            ...expression,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        expressions.push(newExpression);
        await this.context.globalState.update(CustomExpressionManager.STORAGE_KEY, expressions);
        
        return newExpression;
    }

    // Update an existing custom expression
    async updateCustomExpression(id: string, updates: Partial<Omit<CustomExpression, 'id' | 'createdAt'>>): Promise<CustomExpression | null> {
        const expressions = await this.getCustomExpressions();
        const index = expressions.findIndex(expr => expr.id === id);
        
        if (index === -1) {
            return null;
        }

        expressions[index] = {
            ...expressions[index],
            ...updates,
            updatedAt: new Date()
        };

        await this.context.globalState.update(CustomExpressionManager.STORAGE_KEY, expressions);
        return expressions[index];
    }

    // Delete a custom expression
    async deleteCustomExpression(id: string): Promise<boolean> {
        const expressions = await this.getCustomExpressions();
        const filteredExpressions = expressions.filter(expr => expr.id !== id);
        
        if (filteredExpressions.length === expressions.length) {
            return false; // Expression not found
        }

        await this.context.globalState.update(CustomExpressionManager.STORAGE_KEY, filteredExpressions);
        return true;
    }

    // Get custom expression by id
    async getCustomExpressionById(id: string): Promise<CustomExpression | null> {
        const expressions = await this.getCustomExpressions();
        return expressions.find(expr => expr.id === id) || null;
    }

    // Get custom expressions by category
    async getCustomExpressionsByCategory(category: string): Promise<CustomExpression[]> {
        const expressions = await this.getCustomExpressions();
        return expressions.filter(expr => expr.category === category);
    }

    // Search custom expressions
    async searchCustomExpressions(query: string): Promise<CustomExpression[]> {
        const expressions = await this.getCustomExpressions();
        const lowercaseQuery = query.toLowerCase();
        
        return expressions.filter(expr => 
            expr.name.toLowerCase().includes(lowercaseQuery) ||
            expr.description.toLowerCase().includes(lowercaseQuery) ||
            expr.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
            expr.expression.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Export custom expressions to JSON
    async exportCustomExpressions(): Promise<string> {
        const expressions = await this.getCustomExpressions();
        return JSON.stringify(expressions, null, 2);
    }

    // Import custom expressions from JSON
    async importCustomExpressions(jsonData: string, mergeMode: 'replace' | 'merge' = 'merge'): Promise<number> {
        try {
            const importedExpressions = JSON.parse(jsonData) as CustomExpression[];
            
            if (!Array.isArray(importedExpressions)) {
                throw new Error('Invalid JSON format: expected an array of expressions');
            }

            // Validate imported expressions
            for (const expr of importedExpressions) {
                if (!expr.name || !expr.expression) {
                    throw new Error('Invalid expression: name and expression are required');
                }
            }

            let currentExpressions: CustomExpression[] = [];
            
            if (mergeMode === 'merge') {
                currentExpressions = await this.getCustomExpressions();
            }

            // Process imported expressions
            const processedExpressions = importedExpressions.map(expr => ({
                ...expr,
                id: expr.id || this.generateId(),
                createdAt: expr.createdAt ? new Date(expr.createdAt) : new Date(),
                updatedAt: new Date(),
                category: expr.category || 'custom',
                tags: expr.tags || [],
                description: expr.description || ''
            }));

            // Merge or replace
            const finalExpressions = mergeMode === 'merge' 
                ? [...currentExpressions, ...processedExpressions]
                : processedExpressions;

            await this.context.globalState.update(CustomExpressionManager.STORAGE_KEY, finalExpressions);
            return processedExpressions.length;
        } catch (error) {
            throw new Error(`Failed to import expressions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Get all categories from custom expressions
    async getCustomCategories(): Promise<string[]> {
        const expressions = await this.getCustomExpressions();
        const categories = new Set(expressions.map(expr => expr.category));
        return Array.from(categories).sort();
    }

    // Get all tags from custom expressions
    async getAllTags(): Promise<string[]> {
        const expressions = await this.getCustomExpressions();
        const tags = new Set<string>();
        expressions.forEach(expr => expr.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }

    private generateId(): string {
        return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
