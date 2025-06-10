# Change Log

All notable changes to the "filemet" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.2.0] - 2025-06-10

### 🎉 Major Features Added

#### Framework Templates
- **Predefined framework structures** for 15+ popular tech stacks
- **Frontend templates**: React (basic & advanced), Next.js (basic & advanced), Svelte, React Native
- **Backend templates**: Go (web API & CLI), Python (Flask & FastAPI), Django
- **Full-stack templates**: MERN stack
- **Other templates**: Testing structure, Documentation structure
- **Smart categorization** by frontend, backend, fullstack, mobile, other

#### Custom Expression Management
- **Save custom expressions** with name, description, category, and tags
- **Import/Export functionality** for sharing expressions via JSON
- **Search and filter** custom expressions by name, description, or tags
- **Category management** for organizing expressions
- **Persistent storage** using VS Code's global state

#### Enhanced User Interface
- **Three-way selection menu**: Framework Templates | Custom Expressions | Manual Input
- **Category-based browsing** for framework templates
- **Expression preview** with confirmation before creation
- **Quick access commands** and keyboard shortcuts
- **Context menu integration** with both quick and full-featured options

### 🚀 Enhancements

#### Smart Plus (`+`) Symbol Handling
- **Context-aware parsing**: `+` with spaces = separator, `+` at start/after `/` = filename prefix
- **Framework-specific support**: SvelteKit `+page.svelte`, Next.js `+layout.tsx` patterns
- **Mixed usage support**: Separators and filename prefixes in same expression

#### Commands & Shortcuts
- **New commands**: 
  - `Filemet: Create File/Folder (Templates & Custom)` with `Ctrl+Shift+F` shortcut
  - `Filemet: Manage Custom Expressions` for expression management
  - Enhanced context menu with both quick and full options
- **Backward compatibility**: Original commands still available

#### Testing & Reliability
- **Comprehensive test suite**: 48+ tests covering all functionality
- **Framework integration tests**: Validates all predefined templates
- **Custom expression tests**: Full coverage of save/load/search functionality
- **Parser enhancement tests**: Smart `+` handling edge cases

### 📚 Documentation
- **Complete README overhaul** with framework examples and best practices
- **Command reference** with keyboard shortcuts
- **Expression examples** for popular frameworks
- **Best practices guide** for using templates and custom expressions

### 🔧 Technical Improvements
- **Modular architecture**: Separated concerns into specialized managers
- **Type safety**: Full TypeScript coverage with proper interfaces
- **Error handling**: Comprehensive error handling and user feedback
- **Performance**: Efficient storage and retrieval of custom expressions

## [0.1.0] - 2025-06-09

### 🎉 Initial Release

#### Core Parser Features
- **Emmet-inspired syntax** for file and folder creation
- **Deep nesting support** with folder hierarchies
- **Multiple separator types**: `+` and `,` for creating multiple files
- **Bracket grouping**: Support for `[]`, `{}`, and `()` brackets
- **Mixed bracket types** in same expression
- **Whitespace tolerance** with smart normalization

#### File & Folder Creation
- **Context menu integration**: Right-click in Explorer to create structures
- **Command palette support**: `Filemet: Create Files From Expression`
- **Real-time parsing** with error feedback
- **Automatic directory creation** for nested structures
- **File existence checking** to avoid overwrites

#### Expression Patterns
- **Single files**: `README.md`
- **Simple hierarchies**: `src/components/Button.jsx`
- **Multiple files**: `file1.js + file2.js` or `file1.js,file2.js`
- **Grouped structures**: `components/{Header.jsx,Footer.jsx}`
- **Complex nesting**: `src/{components/{App.tsx},utils/{helpers.js}}`

#### Special Character Support
- **Dotfiles**: `.env`, `.gitignore`, `.prettierrc`
- **File extensions**: All common extensions supported
- **Special characters**: Hyphens, underscores, numbers in filenames
- **Hidden files**: Unix-style hidden files with leading dots

#### Error Handling
- **Bracket validation**: Detects unclosed, unopened, and mismatched brackets
- **Empty expression handling**: Graceful error messages
- **Invalid syntax detection**: Clear feedback on parsing errors
- **User-friendly messages**: Descriptive error explanations

#### Testing Foundation
- **39 comprehensive tests** covering all core functionality
- **Edge case coverage**: Empty groups, trailing separators, whitespace
- **Real-world examples**: React, Next.js, Node.js, Go project patterns
- **Performance tests**: Large file counts and deep nesting
- **Error case validation**: All error conditions tested