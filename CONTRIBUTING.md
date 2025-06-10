# 🤝 Contributing to Filemet

Thank you for your interest in contributing to Filemet! This guide will help you get started with contributing to this VS Code extension for creating file structures with Emmet-style syntax.

## 🎯 Ways to Contribute

- 🐛 **Report bugs** - Help us identify and fix issues
- ✨ **Suggest features** - Share ideas for new functionality
- 🏗️ **Add framework templates** - Contribute templates for new frameworks
- 📚 **Improve documentation** - Help make our docs clearer
- 🧪 **Write tests** - Improve test coverage
- 🔧 **Fix bugs** - Submit pull requests for bug fixes
- ⚡ **Performance improvements** - Optimize existing code

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or 20.x
- **npm** (comes with Node.js)
- **VS Code** (for testing the extension)
- **Git** for version control

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/filemet.git
   cd filemet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile TypeScript**
   ```bash
   npm run compile
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Open in VS Code**
   ```bash
   code .
   ```

6. **Test the extension**
   - Press `F5` to open a new Extension Development Host window
   - Test your changes in the new VS Code window

## 🧪 Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Changes
- Write your code following our coding standards
- Add tests for new functionality
- Update documentation if needed

### 3. Test Your Changes
```bash
# Run all tests
npm test

# Compile TypeScript
npm run compile

# Lint code
npm run lint

# Test manually in VS Code
```

### 4. Commit Changes
We use [Conventional Commits](https://conventionalcommits.org/):

```bash
git commit -m "feat: add support for Vue.js templates"
git commit -m "fix: resolve parser issue with nested brackets"
git commit -m "docs: update README with new examples"
```

**Commit Types:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `style:` - Code style changes
- `chore:` - Maintenance tasks

### 5. Push and Create PR
```bash
git push origin your-branch-name
```
Then create a Pull Request on GitHub.

## 📁 Project Structure

```
src/
├── extension.ts              # Main extension file
├── fileStructureParser.ts    # Core parser logic
├── frameworkTemplates.ts     # Predefined templates
├── customExpressionManager.ts # Custom expression handling
├── expressionUIManager.ts    # UI for template selection
└── test/                    # Test files
    ├── extension.test.ts
    ├── frameworkTemplates.test.ts
    └── frameworkIntegration.test.ts
```

## 🏗️ Adding Framework Templates

### Creating a New Template

1. **Edit `frameworkTemplates.ts`**
   ```typescript
   {
     id: 'your-framework-id',
     name: 'Your Framework Name',
     description: 'Brief description of the template',
     expression: 'your/file/structure/expression',
     category: 'frontend' // or 'backend', 'fullstack', 'mobile', 'other'
   }
   ```

2. **Test the Template**
   - Add tests in `frameworkIntegration.test.ts`
   - Verify the expression parses correctly
   - Test in the VS Code Extension Development Host

3. **Update Documentation**
   - Add your template to the README.md
   - Include usage examples

### Template Guidelines

- **Use meaningful file names** that reflect real-world usage
- **Include common project files** (README, config files, etc.)
- **Follow framework conventions** for folder structure
- **Test expressions** thoroughly with the parser
- **Keep descriptions concise** but informative

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- --grep "Framework Templates"

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

1. **Unit Tests** - Test individual functions and methods
2. **Integration Tests** - Test component interactions
3. **Framework Tests** - Verify template expressions parse correctly

### Test Structure
```typescript
suite('Your Test Suite', () => {
    test('should do something specific', () => {
        // Arrange
        const input = 'test input';
        
        // Act
        const result = functionUnderTest(input);
        
        // Assert
        assert.strictEqual(result, expectedOutput);
    });
});
```

## 🎨 Code Style

### TypeScript Guidelines
- Use **TypeScript** for all new code
- Define **interfaces** for data structures
- Use **meaningful variable names**
- Add **JSDoc comments** for public methods
- Follow **consistent indentation** (2 spaces)

### Naming Conventions
- **camelCase** for variables and functions
- **PascalCase** for classes and interfaces
- **UPPER_CASE** for constants
- **kebab-case** for file names

### Example Code Style
```typescript
/**
 * Represents a framework template with metadata
 */
export interface FrameworkTemplate {
    id: string;
    name: string;
    description: string;
    expression: string;
    category: TemplateCategory;
}

/**
 * Retrieves framework templates by category
 * @param category - The template category to filter by
 * @returns Array of matching templates
 */
export function getFrameworkTemplatesByCategory(
    category?: TemplateCategory
): FrameworkTemplate[] {
    if (!category) {
        return FRAMEWORK_TEMPLATES;
    }
    return FRAMEWORK_TEMPLATES.filter(template => template.category === category);
}
```

## 🚀 CI/CD and Quality

Our CI pipeline runs automatically on pull requests:

### Automated Checks
- **Linting** - ESLint checks code style
- **Type Checking** - TypeScript compilation
- **Testing** - Full test suite across platforms
- **Security Audit** - npm audit for vulnerabilities
- **Bundle Analysis** - Check compiled size

### Quality Gates
- All tests must pass
- No linting errors
- TypeScript compilation successful
- Security audit clean
- Code coverage maintained

## 📋 Pull Request Process

### Before Submitting
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Commit messages follow conventional format
- [ ] No merge conflicts with main branch

### PR Review Process
1. **Automated checks** run via GitHub Actions
2. **Manual review** by maintainers
3. **Testing** on different platforms if needed
4. **Approval** and merge

### What to Include in PR
- **Clear description** of changes
- **Testing information** - how you tested
- **Screenshots** if UI changes
- **Breaking changes** clearly marked
- **Related issues** linked

## 🐛 Reporting Issues

### Before Creating an Issue
- Search existing issues for duplicates
- Test with the latest version
- Gather relevant information

### Information to Include
- **Environment details** (OS, VS Code version, extension version)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **File structure expression** you were using
- **Error messages** or logs
- **Screenshots** if helpful

## 💬 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and community chat
- **Documentation** - Check README and code comments

## 🎉 Recognition

Contributors will be:
- **Listed in CONTRIBUTORS.md**
- **Mentioned in release notes** for significant contributions
- **Tagged in announcements** for major features

## 📜 Code of Conduct

We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Please be respectful and inclusive in all interactions.

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Filemet! 🚀 Your help makes this tool better for developers worldwide.
