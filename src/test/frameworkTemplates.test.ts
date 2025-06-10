import * as assert from 'assert';
import * as vscode from 'vscode';
import { FrameworkTemplate, getFrameworkTemplatesByCategory, getCategories, getFrameworkTemplateById, FRAMEWORK_TEMPLATES } from '../frameworkTemplates';
import { CustomExpression, CustomExpressionManager } from '../customExpressionManager';

suite('Framework Templates Test Suite', () => {
    test('should have predefined framework templates', () => {
        assert.ok(FRAMEWORK_TEMPLATES.length > 0, 'Should have predefined templates');
    });

    test('should filter templates by category', () => {
        const frontendTemplates = getFrameworkTemplatesByCategory('frontend');
        const backendTemplates = getFrameworkTemplatesByCategory('backend');
        
        assert.ok(frontendTemplates.length > 0, 'Should have frontend templates');
        assert.ok(backendTemplates.length > 0, 'Should have backend templates');
        
        // Verify all returned templates have the correct category
        frontendTemplates.forEach(template => {
            assert.strictEqual(template.category, 'frontend');
        });
        
        backendTemplates.forEach(template => {
            assert.strictEqual(template.category, 'backend');
        });
    });

    test('should return all templates when no category specified', () => {
        const allTemplates = getFrameworkTemplatesByCategory();
        assert.strictEqual(allTemplates.length, FRAMEWORK_TEMPLATES.length);
    });

    test('should get template by id', () => {
        const reactTemplate = getFrameworkTemplateById('react-basic');
        assert.ok(reactTemplate);
        assert.strictEqual(reactTemplate.id, 'react-basic');
        assert.strictEqual(reactTemplate.name, 'React Basic Structure');
    });

    test('should return undefined for non-existent template id', () => {
        const nonExistentTemplate = getFrameworkTemplateById('non-existent');
        assert.strictEqual(nonExistentTemplate, undefined);
    });

    test('should have valid categories', () => {
        const categories = getCategories();
        assert.ok(categories.length > 0);
        assert.ok(categories.includes('frontend'));
        assert.ok(categories.includes('backend'));
    });

    test('React basic template should have valid structure', () => {
        const reactTemplate = getFrameworkTemplateById('react-basic');
        assert.ok(reactTemplate);
        assert.ok(reactTemplate.expression.includes('components'));
        assert.ok(reactTemplate.expression.includes('hooks'));
        assert.ok(reactTemplate.expression.includes('utils'));
    });

    test('Next.js template should include app router patterns', () => {
        const nextjsTemplate = getFrameworkTemplateById('nextjs-basic');
        assert.ok(nextjsTemplate);
        assert.ok(nextjsTemplate.expression.includes('app/'));
        assert.ok(nextjsTemplate.expression.includes('(dashboard)'));
        assert.ok(nextjsTemplate.expression.includes('api/'));
    });

    test('Go template should include proper Go project structure', () => {
        const goTemplate = getFrameworkTemplateById('go-web-api');
        assert.ok(goTemplate);
        assert.ok(goTemplate.expression.includes('cmd/'));
        assert.ok(goTemplate.expression.includes('internal/'));
        assert.ok(goTemplate.expression.includes('pkg/'));
        assert.ok(goTemplate.expression.includes('go.mod'));
    });

    test('All templates should have required fields', () => {
        FRAMEWORK_TEMPLATES.forEach(template => {
            assert.ok(template.id, `Template should have id: ${JSON.stringify(template)}`);
            assert.ok(template.name, `Template should have name: ${template.id}`);
            assert.ok(template.description, `Template should have description: ${template.id}`);
            assert.ok(template.expression, `Template should have expression: ${template.id}`);
            assert.ok(template.category, `Template should have category: ${template.id}`);
            
            // Verify category is valid
            const validCategories = ['frontend', 'backend', 'fullstack', 'mobile', 'other'];
            assert.ok(validCategories.includes(template.category), `Invalid category: ${template.category} for ${template.id}`);
        });
    });
});

suite('Custom Expression Manager Test Suite', () => {
    let manager: CustomExpressionManager;
    let mockContext: vscode.ExtensionContext;

    setup(() => {
        // Create a mock extension context
        mockContext = {
            globalState: {
                get: () => [],
                update: async () => {},
            },
        } as any;
        
        manager = new CustomExpressionManager(mockContext);
    });

    test('should initialize with empty expressions', async () => {
        const expressions = await manager.getCustomExpressions();
        assert.strictEqual(expressions.length, 0);
    });

    test('should save custom expression', async () => {
        const testExpression = {
            name: 'Test Expression',
            description: 'Test description',
            expression: 'test/{file1.js,file2.js}',
            category: 'test',
            tags: ['testing']
        };

        // Mock the update method to store data
        let savedData: any = null;
        mockContext.globalState.update = async (key: string, value: any) => {
            savedData = value;
        };

        const saved = await manager.saveCustomExpression(testExpression);
        
        assert.ok(saved.id);
        assert.strictEqual(saved.name, testExpression.name);
        assert.strictEqual(saved.expression, testExpression.expression);
        assert.ok(saved.createdAt instanceof Date);
        assert.ok(saved.updatedAt instanceof Date);
    });

    test('should search expressions by name and description', async () => {
        const expressions = [
            {
                id: '1',
                name: 'React Component',
                description: 'Create React components',
                expression: 'components/{Button.jsx,Modal.jsx}',
                category: 'react',
                tags: ['react', 'component'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Vue Component',
                description: 'Create Vue components',
                expression: 'components/{Button.vue,Modal.vue}',
                category: 'vue',
                tags: ['vue', 'component'],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Mock the get method to return test data
        mockContext.globalState.get = () => expressions;
        
        const searchResults = await manager.searchCustomExpressions('react');
        assert.strictEqual(searchResults.length, 1);
        assert.strictEqual(searchResults[0].name, 'React Component');
    });

    test('should export expressions to JSON', async () => {
        const expressions = [
            {
                id: '1',
                name: 'Test Expression',
                description: 'Test',
                expression: 'test/file.js',
                category: 'test',
                tags: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockContext.globalState.get = () => expressions;
        
        const exported = await manager.exportCustomExpressions();
        const parsed = JSON.parse(exported);
        
        assert.strictEqual(parsed.length, 1);
        assert.strictEqual(parsed[0].name, 'Test Expression');
    });

    test('should import expressions from JSON', async () => {
        const importData = [
            {
                name: 'Imported Expression',
                description: 'Imported test',
                expression: 'imported/file.js',
                category: 'imported',
                tags: ['imported']
            }
        ];

        let updatedData: any = null;
        mockContext.globalState.update = async (key: string, value: any) => {
            updatedData = value;
        };

        const count = await manager.importCustomExpressions(JSON.stringify(importData), 'replace');
        
        assert.strictEqual(count, 1);
        assert.ok(updatedData);
        assert.strictEqual(updatedData.length, 1);
        assert.strictEqual(updatedData[0].name, 'Imported Expression');
    });

    test('should handle invalid JSON import', async () => {
        try {
            await manager.importCustomExpressions('invalid json', 'replace');
            assert.fail('Should have thrown an error');
        } catch (error) {
            assert.ok(error instanceof Error);
            assert.ok(error.message.includes('Failed to import expressions'));
        }
    });

    test('should get custom categories', async () => {
        const expressions = [
            { id: '1', name: 'Test1', description: '', expression: 'test', category: 'react', tags: [], createdAt: new Date(), updatedAt: new Date() },
            { id: '2', name: 'Test2', description: '', expression: 'test', category: 'vue', tags: [], createdAt: new Date(), updatedAt: new Date() },
            { id: '3', name: 'Test3', description: '', expression: 'test', category: 'react', tags: [], createdAt: new Date(), updatedAt: new Date() }
        ];

        mockContext.globalState.get = () => expressions;
        
        const categories = await manager.getCustomCategories();
        assert.strictEqual(categories.length, 2);
        assert.ok(categories.includes('react'));
        assert.ok(categories.includes('vue'));
    });

    test('should get all tags', async () => {
        const expressions = [
            { id: '1', name: 'Test1', description: '', expression: 'test', category: 'test', tags: ['react', 'component'], createdAt: new Date(), updatedAt: new Date() },
            { id: '2', name: 'Test2', description: '', expression: 'test', category: 'test', tags: ['vue', 'component'], createdAt: new Date(), updatedAt: new Date() }
        ];

        mockContext.globalState.get = () => expressions;
        
        const tags = await manager.getAllTags();
        assert.strictEqual(tags.length, 3);
        assert.ok(tags.includes('react'));
        assert.ok(tags.includes('vue'));
        assert.ok(tags.includes('component'));
    });
});
