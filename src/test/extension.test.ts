import * as assert from 'assert';
import * as vscode from 'vscode';
import { FileStructureParser } from '../fileStructureParser';

suite('FileStructureParser Test Suite', () => {
    vscode.window.showInformationMessage('Start FileStructureParser tests.');
    
    let parser: FileStructureParser;

    suiteSetup(() => {
        parser = new FileStructureParser();
    });

    suite('Basic Single File', () => {
        test('should parse single file', () => {
            assert.deepStrictEqual(parser.parse('file.ts'), ['file.ts']);
            assert.deepStrictEqual(parser.parse('utils.go'), ['utils.go']);
            assert.deepStrictEqual(parser.parse('index.html'), ['index.html']);
        });
    });

    suite('Simple Hierarchy', () => {
        test('should parse simple folder hierarchy', () => {
            assert.deepStrictEqual(parser.parse('src/main.ts'), ['src/main.ts']);
            assert.deepStrictEqual(parser.parse('components/Header.tsx'), ['components/Header.tsx']);
            assert.deepStrictEqual(parser.parse('api/users/controller.js'), ['api/users/controller.js']);
            assert.deepStrictEqual(parser.parse('deep/nested/folder/file.txt'), ['deep/nested/folder/file.txt']);
        });
    });

    suite('Multiple Files (Same Level)', () => {
        test('should parse multiple files with + separator', () => {
            assert.deepStrictEqual(parser.parse('file1.ts + file2.ts'), ['file1.ts', 'file2.ts']);
            assert.deepStrictEqual(parser.parse('a.txt + b.txt + c.txt'), ['a.txt', 'b.txt', 'c.txt']);
        });

        test('should parse multiple files with , separator', () => {
            assert.deepStrictEqual(parser.parse('index.js,utils.js'), ['index.js', 'utils.js']);
        });

        test('should parse mixed separators', () => {
            assert.deepStrictEqual(parser.parse('file1.ts,file2.js + file3.go'), ['file1.ts', 'file2.js', 'file3.go']);
        });
    });

    suite('Basic Grouping', () => {
        test('should parse square bracket grouping', () => {
            assert.deepStrictEqual(parser.parse('components[Header.tsx]'), ['components/Header.tsx']);
            assert.deepStrictEqual(parser.parse('folder[file1.ts + file2.ts]'), ['folder/file1.ts', 'folder/file2.ts']);
        });

        test('should parse curly bracket grouping', () => {
            assert.deepStrictEqual(parser.parse('utils{helpers.ts}'), ['utils/helpers.ts']);
            assert.deepStrictEqual(parser.parse('components{Header.tsx,Footer.tsx}'), ['components/Header.tsx', 'components/Footer.tsx']);
        });

        test('should parse parentheses grouping', () => {
            assert.deepStrictEqual(parser.parse('src(main.go)'), ['src/main.go']);
            assert.deepStrictEqual(parser.parse('pages(home.tsx + about.tsx)'), ['pages/home.tsx', 'pages/about.tsx']);
        });
    });

    suite('Nested Paths in Groups', () => {
        test('should parse nested paths within groups', () => {
            assert.deepStrictEqual(parser.parse('src[components/App.tsx]'), ['src/components/App.tsx']);
            assert.deepStrictEqual(parser.parse('api{users/controller.ts + auth/service.ts}'), [
                'api/users/controller.ts',
                'api/auth/service.ts'
            ]);
            assert.deepStrictEqual(parser.parse('components[ui/Button.tsx + layout/Header.tsx]'), [
                'components/ui/Button.tsx',
                'components/layout/Header.tsx'
            ]);
        });
    });

    suite('Complex Nested Structures', () => {
        test('should parse complex nested groups', () => {
            assert.deepStrictEqual(parser.parse('src{components/App.tsx + utils/helpers.ts}'), [
                'src/components/App.tsx',
                'src/utils/helpers.ts'
            ]);

            assert.deepStrictEqual(parser.parse('api[users/{controller.ts,service.ts} + auth/middleware.ts]'), [
                'api/users/controller.ts',
                'api/users/service.ts',
                'api/auth/middleware.ts'
            ]);

            assert.deepStrictEqual(parser.parse('components{ui/{Button.tsx,Input.tsx} + layout/Header.tsx}'), [
                'components/ui/Button.tsx',
                'components/ui/Input.tsx',
                'components/layout/Header.tsx'
            ]);
        });
    });

    suite('Multiple Top-Level Groups', () => {
        test('should parse multiple separate groups', () => {
            assert.deepStrictEqual(parser.parse('components{Header.tsx} + utils{helpers.ts}'), [
                'components/Header.tsx',
                'utils/helpers.ts'
            ]);

            assert.deepStrictEqual(parser.parse('src[main.ts] + tests[main.test.ts]'), [
                'src/main.ts',
                'tests/main.test.ts'
            ]);

            assert.deepStrictEqual(parser.parse('api{users.ts} + web{index.html} + docs{readme.md}'), [
                'api/users.ts',
                'web/index.html',
                'docs/readme.md'
            ]);
        });
    });

    suite('Whitespace Handling', () => {
        test('should ignore whitespace around expressions', () => {
            assert.deepStrictEqual(parser.parse(' file.ts '), ['file.ts']);
            assert.deepStrictEqual(parser.parse('folder / file.ts'), ['folder/file.ts']);
            assert.deepStrictEqual(parser.parse('components { Header.tsx , Footer.tsx }'), [
                'components/Header.tsx',
                'components/Footer.tsx'
            ]);
            assert.deepStrictEqual(parser.parse(' src [ main.ts + utils.ts ] '), [
                'src/main.ts',
                'src/utils.ts'
            ]);
            assert.deepStrictEqual(parser.parse('file1.ts + file2.ts'), ['file1.ts', 'file2.ts']);
        });
    });

    suite('Mixed Bracket Types', () => {
        test('should handle different bracket types in same expression', () => {
            assert.deepStrictEqual(parser.parse('components[Header.tsx] + utils{helpers.ts} + tests(app.test.ts)'), [
                'components/Header.tsx',
                'utils/helpers.ts',
                'tests/app.test.ts'
            ]);
        });
    });

    suite('Real-World Examples', () => {
        test('should parse common React patterns', () => {
            assert.deepStrictEqual(parser.parse('components/{Header.tsx,Footer.tsx,Nav.tsx}'), [
                'components/Header.tsx',
                'components/Footer.tsx',
                'components/Nav.tsx'
            ]);
        });

        test('should parse complex project structures', () => {
            assert.deepStrictEqual(parser.parse('src[components/App.tsx + utils/{api.ts,helpers.ts} + types/index.ts]'), [
                'src/components/App.tsx',
                'src/utils/api.ts',
                'src/utils/helpers.ts',
                'src/types/index.ts'
            ]);
        });

        test('should parse feature-based structure', () => {
            assert.deepStrictEqual(parser.parse('features{auth/{components/LoginForm.tsx + hooks/useAuth.ts + types.ts}}'), [
                'features/auth/components/LoginForm.tsx',
                'features/auth/hooks/useAuth.ts',
                'features/auth/types.ts'
            ]);
        });

        test('should parse monorepo structure', () => {
            assert.deepStrictEqual(parser.parse('packages{ui/src/{Button.tsx,Input.tsx} + api/src/server.ts}'), [
                'packages/ui/src/Button.tsx',
                'packages/ui/src/Input.tsx',
                'packages/api/src/server.ts'
            ]);
        });
    });

    suite('Edge Cases - Valid', () => {
        test('should handle empty groups', () => {
            assert.deepStrictEqual(parser.parse('folder[]'), []);
        });

        test('should ignore trailing separators', () => {
            assert.deepStrictEqual(parser.parse('a + b +'), ['a', 'b']);
            assert.deepStrictEqual(parser.parse('file.ts,'), ['file.ts']);
        });

        test('should handle no spaces around separators', () => {
            assert.deepStrictEqual(parser.parse('file.ts+another.ts'), ['file.ts', 'another.ts']);
        });

        test('should handle folders with trailing slash', () => {
            assert.deepStrictEqual(parser.parse('folder{subfolder/}'), ['folder/subfolder/']);
        });

        test('should ignore leading separators', () => {
            assert.deepStrictEqual(parser.parse('+ file.ts'), ['file.ts']);
        });

        test('should support filenames with + prefix', () => {
            assert.deepStrictEqual(parser.parse('+file.ts'), ['+file.ts']);
            assert.deepStrictEqual(parser.parse('folder/+component.tsx'), ['folder/+component.tsx']);
            assert.deepStrictEqual(parser.parse('routes/{+page.svelte,+layout.svelte}'), [
                'routes/+page.svelte',
                'routes/+layout.svelte'
            ]);
        });
    });

    suite('Special Characters & File Types', () => {
        test('should handle common file extensions', () => {
            assert.deepStrictEqual(parser.parse('components{App.tsx,Button.jsx,styles.css,types.ts}'), [
                'components/App.tsx',
                'components/Button.jsx',
                'components/styles.css',
                'components/types.ts'
            ]);

            assert.deepStrictEqual(parser.parse('assets{logo.png,icon.svg,data.json,config.yml}'), [
                'assets/logo.png',
                'assets/icon.svg',
                'assets/data.json',
                'assets/config.yml'
            ]);
        });

        test('should handle special characters in names', () => {
            assert.deepStrictEqual(parser.parse('components{my-component.tsx,my_utils.ts}'), [
                'components/my-component.tsx',
                'components/my_utils.ts'
            ]);

            assert.deepStrictEqual(parser.parse('files{data.min.js,app.config.ts,test.spec.js}'), [
                'files/data.min.js',
                'files/app.config.ts',
                'files/test.spec.js'
            ]);
        });

        test('should handle hidden files and dotfiles', () => {
            assert.deepStrictEqual(parser.parse('config{.env,.gitignore,.eslintrc.json}'), [
                'config/.env',
                'config/.gitignore',
                'config/.eslintrc.json'
            ]);

            assert.deepStrictEqual(parser.parse('.github{workflows/ci.yml + ISSUE_TEMPLATE/bug.md}'), [
                '.github/workflows/ci.yml',
                '.github/ISSUE_TEMPLATE/bug.md'
            ]);
        });
    });

    suite('Error Cases', () => {
        test('should return error for empty expression', () => {
            assert.strictEqual(parser.parse(''), 'ERROR: Invalid expression syntax');
            assert.strictEqual(parser.parse('   '), 'ERROR: Invalid expression syntax');
        });

        test('should return error for unclosed brackets', () => {
            assert.strictEqual(parser.parse('folder[unclosed'), 'ERROR: Invalid expression syntax');
            assert.strictEqual(parser.parse('folder{unclosed'), 'ERROR: Invalid expression syntax');
            assert.strictEqual(parser.parse('folder(unclosed'), 'ERROR: Invalid expression syntax');
        });

        test('should return error for unopened brackets', () => {
            assert.strictEqual(parser.parse('folder]unopened'), 'ERROR: Invalid expression syntax');
            assert.strictEqual(parser.parse('folder}unopened'), 'ERROR: Invalid expression syntax');
            assert.strictEqual(parser.parse('folder)unopened'), 'ERROR: Invalid expression syntax');
        });

        test('should return error for mismatched brackets', () => {
            assert.strictEqual(parser.parse('folder[}'), 'ERROR: Invalid expression syntax');
            assert.strictEqual(parser.parse('folder{]'), 'ERROR: Invalid expression syntax');
            assert.strictEqual(parser.parse('folder([)]'), 'ERROR: Invalid expression syntax');
        });

        test('should return error for unclosed nested brackets', () => {
            assert.strictEqual(parser.parse('folder[[nested]'), 'ERROR: Invalid expression syntax');
            assert.strictEqual(parser.parse('folder{nested{unclosed}'), 'ERROR: Invalid expression syntax');
        });
    });

    suite('Framework-Specific Patterns', () => {
        test('should parse React component structure', () => {
            assert.deepStrictEqual(parser.parse('components/{Button/{Button.tsx,Button.module.css,Button.test.tsx,index.ts}}'), [
                'components/Button/Button.tsx',
                'components/Button/Button.module.css',
                'components/Button/Button.test.tsx',
                'components/Button/index.ts'
            ]);
        });

        test('should parse Next.js app router structure', () => {
            assert.deepStrictEqual(parser.parse('app/{api/users/route.ts + (dashboard)/{page.tsx,layout.tsx}}'), [
                'app/api/users/route.ts',
                'app/(dashboard)/page.tsx',
                'app/(dashboard)/layout.tsx'
            ]);
        });

        test('should parse Node.js API structure', () => {
            assert.deepStrictEqual(parser.parse('src/{controllers/{user.controller.js,auth.controller.js} + routes/{users.js,auth.js} + middleware/auth.js}'), [
                'src/controllers/user.controller.js',
                'src/controllers/auth.controller.js',
                'src/routes/users.js',
                'src/routes/auth.js',
                'src/middleware/auth.js'
            ]);
        });

        test('should parse Go project structure', () => {
            assert.deepStrictEqual(parser.parse('cmd/api/main.go + internal/{handlers/{user.go,auth.go} + models/user.go} + pkg/database/db.go'), [
                'cmd/api/main.go',
                'internal/handlers/user.go',
                'internal/handlers/auth.go',
                'internal/models/user.go',
                'pkg/database/db.go'
            ]);
        });
    });

    suite('Performance & Stress Tests', () => {
        test('should handle large number of files', () => {
            const manyFiles = Array.from({length: 50}, (_, i) => `file${i}.txt`).join(',');
            const result = parser.parse(`files{${manyFiles}}`);
            assert.ok(Array.isArray(result), 'Result should be an array');
            if (Array.isArray(result)) {
                assert.strictEqual(result.length, 50);
                assert.strictEqual(result[0], 'files/file0.txt');
                assert.strictEqual(result[49], 'files/file49.txt');
            }
        });

        test('should handle deep folder structures', () => {
            const deepPath = 'level1/level2/level3/level4/level5/level6/level7/level8/level9/level10/file.txt';
            assert.deepStrictEqual(parser.parse(deepPath), [deepPath]);
        });
    });

    suite('Parser Internal Validation', () => {
        test('should correctly identify matching brackets', () => {
            assert.deepStrictEqual(parser.parse('test[valid]'), ['test/valid']);
            assert.deepStrictEqual(parser.parse('test{valid}'), ['test/valid']);
            assert.deepStrictEqual(parser.parse('test(valid)'), ['test/valid']);
        });

        test('should correctly combine base paths with sub paths', () => {
            assert.deepStrictEqual(parser.parse('base{sub1 + sub2}'), ['base/sub1', 'base/sub2']);
            assert.deepStrictEqual(parser.parse('base{sub/file.txt}'), ['base/sub/file.txt']);
        });
    });
});
