import * as assert from 'assert';
import { FileStructureParser } from '../fileStructureParser';
import { getFrameworkTemplateById } from '../frameworkTemplates';

suite('Framework Template Integration Tests', () => {
    const parser = new FileStructureParser();

    test('React basic template should create valid file structure', () => {
        const template = getFrameworkTemplateById('react-basic');
        assert.ok(template);

        const result = parser.parse(template.expression);
        assert.ok(Array.isArray(result), 'Should return file array');

        const files = result as string[];
        
        // Check for expected React structure
        const componentFiles = files.filter(f => f.includes('components/'));
        const hookFiles = files.filter(f => f.includes('hooks/'));
        const utilFiles = files.filter(f => f.includes('utils/'));
        const publicFiles = files.filter(f => f.includes('public/'));

        assert.ok(componentFiles.length > 0, 'Should have component files');
        assert.ok(hookFiles.length > 0, 'Should have hook files');
        assert.ok(utilFiles.length > 0, 'Should have util files');
        assert.ok(publicFiles.length > 0, 'Should have public files');

        // Verify specific files exist
        assert.ok(files.includes('src/components/Header.jsx'));
        assert.ok(files.includes('src/hooks/useAuth.js'));
        assert.ok(files.includes('src/utils/helpers.js'));
        assert.ok(files.includes('public/index.html'));
    });

    test('Next.js template should create app router structure', () => {
        const template = getFrameworkTemplateById('nextjs-basic');
        assert.ok(template);

        const result = parser.parse(template.expression);
        assert.ok(Array.isArray(result));

        const files = result as string[];
        
        // Check for Next.js app router specific files
        assert.ok(files.includes('app/page.tsx'));
        assert.ok(files.includes('app/layout.tsx'));
        assert.ok(files.includes('app/(dashboard)/page.tsx'));
        assert.ok(files.includes('app/api/users/route.ts'));
        
        // Check for components and lib folders
        const componentFiles = files.filter(f => f.includes('components/'));
        const libFiles = files.filter(f => f.includes('lib/'));
        
        assert.ok(componentFiles.length > 0, 'Should have component files');
        assert.ok(libFiles.length > 0, 'Should have lib files');
    });

    test('Go web API template should create proper Go structure', () => {
        const template = getFrameworkTemplateById('go-web-api');
        assert.ok(template);

        const result = parser.parse(template.expression);
        assert.ok(Array.isArray(result));

        const files = result as string[];
        
        // Check for Go project structure
        assert.ok(files.includes('cmd/api/main.go'));
        assert.ok(files.includes('go.mod'));
        assert.ok(files.includes('README.md'));
        
        // Check for internal structure
        const internalFiles = files.filter(f => f.includes('internal/'));
        const pkgFiles = files.filter(f => f.includes('pkg/'));
        
        assert.ok(internalFiles.length > 0, 'Should have internal files');
        assert.ok(pkgFiles.length > 0, 'Should have pkg files');
        
        // Verify specific Go files
        assert.ok(files.some(f => f.includes('handlers/')));
        assert.ok(files.some(f => f.includes('models/')));
        assert.ok(files.some(f => f.includes('services/')));
    });

    test('Python Flask template should create proper Python structure', () => {
        const template = getFrameworkTemplateById('python-flask');
        assert.ok(template);

        const result = parser.parse(template.expression);
        assert.ok(Array.isArray(result));

        const files = result as string[];
        
        // Check for Python project structure
        assert.ok(files.includes('app/__init__.py'));
        assert.ok(files.includes('requirements.txt'));
        assert.ok(files.includes('run.py'));
        
        // Check for Flask app structure
        const modelFiles = files.filter(f => f.includes('models/'));
        const routeFiles = files.filter(f => f.includes('routes/'));
        const testFiles = files.filter(f => f.includes('tests/'));
        
        assert.ok(modelFiles.length > 0, 'Should have model files');
        assert.ok(routeFiles.length > 0, 'Should have route files');
        assert.ok(testFiles.length > 0, 'Should have test files');
        
        // Verify __init__.py files exist
        assert.ok(files.includes('app/models/__init__.py'));
        assert.ok(files.includes('app/routes/__init__.py'));
        assert.ok(files.includes('tests/__init__.py'));
    });

    test('MERN stack template should create full-stack structure', () => {
        const template = getFrameworkTemplateById('mern-stack');
        assert.ok(template);

        const result = parser.parse(template.expression);
        assert.ok(Array.isArray(result));

        const files = result as string[];
        
        // Check for client-side structure
        const clientFiles = files.filter(f => f.includes('client/'));
        assert.ok(clientFiles.length > 0, 'Should have client files');
        assert.ok(files.includes('client/package.json'));
        assert.ok(files.includes('client/src/App.jsx'));
        
        // Check for server-side structure
        const serverFiles = files.filter(f => f.includes('server/'));
        assert.ok(serverFiles.length > 0, 'Should have server files');
        assert.ok(files.includes('server/package.json'));
        assert.ok(files.includes('server/src/app.js'));
        
        // Check for root files
        assert.ok(files.includes('README.md'));
        assert.ok(files.includes('.gitignore'));
    });

    test('All framework templates should produce valid parser results', () => {
        const templateIds = [
            'react-basic', 'react-advanced', 'nextjs-basic', 'nextjs-advanced',
            'svelte-basic', 'go-web-api', 'go-cli', 'python-flask', 'python-fastapi',
            'django-basic', 'mern-stack', 'react-native-basic', 'testing-structure',
            'docs-structure'
        ];

        templateIds.forEach(templateId => {
            const template = getFrameworkTemplateById(templateId);
            assert.ok(template, `Template ${templateId} should exist`);

            const result = parser.parse(template.expression);
            assert.ok(Array.isArray(result), `Template ${templateId} should produce valid parser result`);
            
            const files = result as string[];
            assert.ok(files.length > 0, `Template ${templateId} should create at least one file`);
            
            // Verify no duplicate files
            const uniqueFiles = new Set(files);
            assert.strictEqual(files.length, uniqueFiles.size, `Template ${templateId} should not have duplicate files`);
        });
    });
});
