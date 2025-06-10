## 📁 Filemet - Emmet-Inspired File & Folder Generator for VS Code

[![Test Suite](https://github.com/mumairofficial/filemet/actions/workflows/test.yml/badge.svg)](https://github.com/mumairofficial/filemet/actions/workflows/test.yml)
[![CI/CD Pipeline](https://github.com/mumairofficial/filemet/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/mumairofficial/filemet/actions/workflows/ci-cd.yml)
[![Version](https://img.shields.io/visual-studio-marketplace/v/mumairofficial.filemet)](https://marketplace.visualstudio.com/items?itemName=mumairofficial.filemet)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/mumairofficial.filemet)](https://marketplace.visualstudio.com/items?itemName=mumairofficial.filemet)

**Filemet** is a blazing-fast, Emmet-style file and folder structure generator for Visual Studio Code. Type expressive path-like syntax and instantly scaffold deeply nested folders and files — no more tedious clicking.

> ✨ Perfect for frontend, backend, and fullstack projects — React, Next.js, Node.js, Go, Python, and beyond.

---

### 🚀 Features

* **Emmet-inspired syntax** for creating files & folders
* **Predefined framework templates** for popular tech stacks (React, Next.js, Go, Python, Django, etc.)
* **Custom expression saving** and management
* **Smart UI selection** between templates, custom expressions, and manual input
* **Deep nesting and grouping** support
* **Multiple separator types**: `+`, `,`
* **Mix of bracket styles**: `[]`, `{}`, `()`
* **Smart `+` symbol handling** for filenames vs separators
* **Framework-specific patterns** (Next.js routes, Go project structure, etc.)
* **Import/Export functionality** for custom expressions
* **Context menu integration** and keyboard shortcuts
* **Real-time feedback** on invalid syntax

---

## 🎯 Quick Start

### Three Ways to Use Filemet:

1. **🖱️ Right-click in Explorer** → "Filemet: Create File/Folder (Templates & Custom)"
2. **⌨️ Keyboard shortcut**: `Ctrl+Shift+F` (Mac: `Cmd+Shift+F`)
3. **🎨 Command Palette**: `Filemet: Create Files From Expression`

---

## 🏗️ Framework Templates

Filemet includes predefined templates for popular frameworks and project types:

### Frontend Templates
- **React Basic** - Basic React project with components, hooks, utilities
- **React Advanced** - Advanced React with context, services, testing
- **Next.js Basic** - Next.js with app router structure
- **Next.js Advanced** - Full-featured Next.js with authentication, API routes
- **Svelte Basic** - Svelte project structure
- **React Native** - Mobile app structure

### Backend Templates
- **Go Web API** - Clean architecture Go API
- **Go CLI** - Command-line application structure
- **Python Flask** - Flask REST API with blueprints
- **Python FastAPI** - FastAPI with async structure
- **Django Basic** - Django project with apps

### Full-Stack Templates
- **MERN Stack** - Complete MongoDB, Express, React, Node.js structure

### Other Templates
- **Testing Structure** - Comprehensive testing setup
- **Documentation** - Complete docs structure

### Using Framework Templates

1. Right-click in Explorer or use Command Palette
2. Select "Framework Templates"
3. Choose a category (Frontend, Backend, etc.)
4. Pick your framework template
5. Preview and confirm

---

## 💾 Custom Expressions

Save your frequently used file structures as custom expressions:

### Creating Custom Expressions

1. **From Manual Input**: Enter expression manually → choose "Save as Custom"
2. **From Command**: `Filemet: Manage Custom Expressions` → "Create New"

### Managing Custom Expressions

- **View All**: Browse your saved expressions
- **Export**: Save to JSON file for backup/sharing
- **Import**: Load expressions from JSON file
- **Edit/Delete**: Manage existing expressions

### Example Custom Expression
```
Name: "React Feature Module"
Expression: "features/{components/{FeatureList.tsx,FeatureItem.tsx},hooks/useFeature.ts,services/featureApi.ts,types/feature.ts}"
Category: "react"
```

---

## 🧠 Syntax Reference

### 1. Folder Hierarchy

* Use `/` to create subdirectories
* `folder/file.ts` → `folder/file.ts`

### 2. Multiple Files or Folders (Same Level)

* Use `+` or `,`
* `file1.ts + file2.ts` → `file1.ts`, `file2.ts`

### 3. Grouping

* Use `[...]`, `{...}`, or `(...)`
* `components{Button.tsx,Header.tsx}` → `components/Button.tsx`, `components/Header.tsx`
* `src[main.ts + utils.ts]` → `src/main.ts`, `src/utils.ts`

### 4. Nested Grouping

* `src{components{App.tsx + Nav.tsx} + utils{api.ts}}`
  → `src/components/App.tsx`, `src/components/Nav.tsx`, `src/utils/api.ts`

### 5. Smart Plus (`+`) Handling

Filemet intelligently handles the `+` symbol based on context:

#### **As Separator** (creates multiple files):
* **With spaces**: `file1.ts + file2.ts` → `file1.ts`, `file2.ts`
* **Without spaces**: `file.ts+another.ts` → `file.ts`, `another.ts`  
* **Leading with space**: `+ file.ts` → `file.ts` (ignores leading +)

#### **As Filename Prefix** (preserved in filename):
* **At start**: `+file.ts` → `+file.ts`
* **After path separator**: `routes/+page.svelte` → `routes/+page.svelte`
* **In groups**: `app/{+layout.tsx,+page.tsx}` → `app/+layout.tsx`, `app/+page.tsx`

#### **Framework Examples**:
```bash
# SvelteKit special files
src/routes/{+page.svelte,+layout.svelte,+error.svelte}

# Next.js with + prefixed components  
app/(dashboard)/{+page.tsx,+layout.tsx}

# Mixed usage
src/{+main.ts + components/+Button.tsx + utils/helpers.ts}
```

### 6. Whitespace Tolerance

* Whitespace around paths is ignored: `folder / file.ts` → `folder/file.ts`

### 7. Dotfiles & Extensions

* `config{.env,.gitignore}` → `config/.env`, `config/.gitignore`

---

## 📝 Expression Making Guide

### Building Simple Expressions

Start with basic patterns and gradually add complexity:

#### **Single Files**
```bash
file.ts                    # Creates: file.ts
components/Header.tsx      # Creates: components/Header.tsx
```

#### **Multiple Files (Same Level)**
```bash
file1.ts,file2.ts         # Creates: file1.ts, file2.ts
file1.ts + file2.ts       # Creates: file1.ts, file2.ts (with spaces)
file.ts+another.ts        # Creates: file.ts, another.ts (no spaces)
```

#### **Basic Grouping**
```bash
components{Header.tsx,Footer.tsx}           # Creates: components/Header.tsx, components/Footer.tsx
utils[helpers.ts + api.ts]                  # Creates: utils/helpers.ts, utils/api.ts
src(main.go)                                # Creates: src/main.go
```

### Advanced Expression Patterns

#### **Nested Structures**
```bash
# Feature-based structure
auth/{components/{LoginForm.tsx,SignupForm.tsx} + hooks/useAuth.ts + types.ts}

# Layered architecture  
src/{controllers/user.js + services/user.js + models/user.js}

# Component libraries
ui/{components/{Button,Input,Modal}/index.ts + styles/globals.css}
```

#### **Framework-Specific Patterns**

**SvelteKit:**
```bash
src/routes/{+page.svelte,+layout.svelte,+error.svelte}
routes/blog/{+page.svelte,+layout.svelte,posts/[slug]/+page.svelte}
```

**Next.js App Router:**
```bash
app/{layout.tsx,page.tsx,(dashboard)/{page.tsx,layout.tsx}}
app/api/{users/route.ts,auth/route.ts}
```

**Monorepo Structure:**
```bash
packages/{ui/src/{components,hooks,utils}/index.ts + api/src/{routes,middleware}/index.ts}
```

### Expression Best Practices

#### **1. Use Consistent Separators**
✅ **Good**: `components{Header.tsx,Footer.tsx,Nav.tsx}`  
❌ **Avoid**: `components{Header.tsx + Footer.tsx,Nav.tsx}`

#### **2. Group Related Files**
✅ **Good**: `user/{controller.ts,service.ts,model.ts}`  
❌ **Avoid**: `user.controller.ts + user.service.ts + user.model.ts`

#### **3. Leverage Nested Grouping**
✅ **Good**: `src{components/{Header.tsx,Footer.tsx} + utils/helpers.ts}`  
❌ **Avoid**: `src/components/Header.tsx + src/components/Footer.tsx + src/utils/helpers.ts`

#### **4. Handle Special Characters Correctly**
✅ **Good**: `routes/{+page.svelte,+layout.svelte}` (+ as filename prefix)  
✅ **Good**: `file1.ts + file2.ts` (+ as separator with spaces)  
❌ **Avoid**: `routes/{+page.svelte + +layout.svelte}` (ambiguous + usage)

---

## ✅ Examples

### Real-World Scenarios

```bash
components/{Header.tsx,Footer.tsx,Nav.tsx}
src[components/App.tsx + utils/{api.ts,helpers.ts} + types/index.ts]
features{auth/{components/LoginForm.tsx + hooks/useAuth.ts + types.ts}}
```

### React / Next.js

```bash
# Next.js App Router with special files
app/{layout.tsx,page.tsx,loading.tsx,not-found.tsx}
app/(dashboard)/{page.tsx,layout.tsx,users/page.tsx}
app/api/{users/route.ts,auth/login/route.ts}

# React Component Structure
components/{Button/{Button.tsx,Button.module.css,Button.test.tsx,index.ts}}
src/{components/ui/{Button,Input,Modal}/index.tsx + hooks/{useAuth,useLocalStorage}.ts}
```

### SvelteKit

```bash
# SvelteKit special files with + prefix
src/routes/{+page.svelte,+layout.svelte,+error.svelte}
src/routes/blog/{+page.svelte,posts/[slug]/+page.svelte}
src/routes/(auth)/{login/+page.svelte,register/+page.svelte}

# SvelteKit with TypeScript
src/{routes/+page.svelte + lib/{components,utils}/index.ts}
```

### Node.js / Express

```bash
# Express API Structure
src/{controllers/{user.controller.js,auth.controller.js} + routes/{users,auth}.js + middleware/auth.js}
src/{models/User.js + services/userService.js + utils/validation.js}

# Microservices Structure
services/{auth/{controllers,models,routes}/index.js + user/{controllers,models,routes}/index.js}
```

### Go Projects

```bash
# Standard Go Project Layout
cmd/api/main.go + internal/{handlers/{user.go,auth.go} + models/user.go} + pkg/database/db.go
internal/{server/server.go + config/config.go + middleware/cors.go}
```

### Python / Django

```bash
# Django Apps
apps/{users/{models.py,views.py,urls.py,admin.py} + auth/{models.py,views.py}}
myproject/{settings/{base.py,development.py,production.py} + urls.py}
```

### Vue.js / Nuxt

```bash
# Vue 3 Composition API
src/{components/{BaseButton.vue,BaseInput.vue} + composables/{useAuth,useApi}.ts + stores/user.ts}
pages/{index.vue,about.vue,contact.vue}

# Nuxt 3 Structure  
pages/{index.vue,blog/{index.vue,[slug].vue}}
components/{UI/{Button,Input}/index.vue + Layout/{Header,Footer}.vue}
```

### TypeScript Projects

```bash
# Full-stack TypeScript
packages/{client/src/{components,pages,hooks}/index.ts + server/src/{routes,models,controllers}/index.ts}
shared/{types/index.ts + utils/{validation,helpers}.ts}
```

### Monorepo Examples

```bash
# Turborepo Structure
apps/{web/{src,public}/index.ts + api/src/{routes,models}/index.ts}
packages/{ui/src/components/index.ts + config/{eslint,typescript}/index.js}

# Nx Workspace
libs/{shared/{ui,utils}/src/index.ts + feature/{auth,user}/src/lib/index.ts}
```

```bash
apps/{users/{models.py,views.py} + auth/{models.py,views.py}} + tests/test_users.py
```

---

## 🧪 Test Coverage

Check the [Test Cases](#test-cases-by-category) section for a full breakdown — from simple paths to complex edge cases.

---

## ⚠️ Error Handling

Bad expressions are caught early. Examples:

* `folder[unclosed` → ❌ Invalid (unclosed bracket)
* `src({utils]}` → ❌ Invalid (mismatched brackets)
* `+ file.ts` → ✅ Valid (leading + with space is ignored, creates `file.ts`)
* `+file.ts` → ✅ Valid (+ prefix preserved, creates `+file.ts`)

### Plus Symbol (+) Usage Guidelines

---

## ⌨️ Commands & Shortcuts

### Available Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `Filemet: Create File/Folder (Templates & Custom)` | Enhanced UI with templates and custom expressions | `Ctrl+Shift+F` / `Cmd+Shift+F` |
| `Filemet: Create File/Folder (Quick)` | Quick manual input (backward compatibility) | - |
| `Filemet: Create Files From Expression` | Command palette entry point | - |
| `Filemet: Manage Custom Expressions` | Manage, import, export custom expressions | - |

### Context Menu

Right-click on any folder in VS Code Explorer:
- **"Filemet: Create File/Folder (Templates & Custom)"** - Full-featured UI
- **"Filemet: Create File/Folder (Quick)"** - Direct text input

---

## 🎨 Expression Examples

### Basic Examples
```bash
# Single file
README.md

# Simple folder with files  
docs/{getting-started.md,api.md}

# Multiple folders
src + tests + docs

# Nested structure
src/{components/Button.jsx + hooks/useAuth.js + utils/helpers.js}
```

### Framework-Specific Examples

#### React Project
```bash
src/{
  components/{
    ui/{Button.tsx,Modal.tsx,Input.tsx},
    layout/{Header.tsx,Footer.tsx,Sidebar.tsx}
  },
  hooks/{useAuth.ts,useApi.ts,useLocalStorage.ts},
  services/{api.ts,auth.ts},
  utils/{helpers.ts,constants.ts},
  types/{user.ts,api.ts}
}
```

#### Next.js App Router
```bash
app/{
  page.tsx,
  layout.tsx,
  loading.tsx,
  error.tsx,
  (dashboard)/{
    page.tsx,
    analytics/page.tsx,
    settings/page.tsx
  },
  api/{
    users/route.ts,
    auth/route.ts
  }
}
```

#### Go Project
```bash
cmd/api/main.go + 
internal/{
  handlers/{users.go,auth.go},
  models/{user.go,auth.go},
  services/{user_service.go,auth_service.go},
  config/config.go
} + 
pkg/{
  database/postgres.go,
  utils/helpers.go
} + 
go.mod + README.md
```

#### Python Flask API
```bash
app/{
  __init__.py,
  models/{__init__.py,user.py,auth.py},
  routes/{__init__.py,users.py,auth.py},
  services/{__init__.py,user_service.py,auth_service.py},
  utils/{__init__.py,helpers.py}
} + 
tests/{__init__.py,test_users.py,test_auth.py} + 
requirements.txt + .env.example
```

---

## 🔧 Best Practices

### Expression Organization
1. **Use descriptive names** for custom expressions
2. **Categorize expressions** by framework or purpose
3. **Include descriptions** to remember what each expression does
4. **Use consistent naming** patterns

### Syntax Tips
1. **Prefer commas** over plus signs within groups for clarity
2. **Use plus signs** for top-level separation
3. **Group related files** together using brackets
4. **Use meaningful folder names** that reflect their purpose

### Framework Integration
1. **Start with predefined templates** for common patterns
2. **Customize templates** to match your team's conventions
3. **Save frequently used structures** as custom expressions
4. **Share expressions** with your team via export/import

**✅ Correct Usage:**
* `file1.ts + file2.ts` - Separator with spaces
* `file.ts+another.ts` - Separator without spaces  
* `+file.ts` - Filename with + prefix
* `folder/+component.tsx` - + prefix after path separator
* `routes/{+page.svelte,+layout.svelte}` - Multiple + prefixed files

**❌ Ambiguous Usage to Avoid:**
* `routes/{+page.svelte + +layout.svelte}` - Use comma instead: `routes/{+page.svelte,+layout.svelte}`

---

## 🔍 Search Keywords

```
vscode create multiple files
folder structure generator
emmet for files
vscode file scaffold extension
nested file tree from string
vscode bulk file creation
folder and file generator plugin
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### 🚀 Quick Start for Contributors

1. **Fork & Clone** the repository
2. **Install dependencies**: `npm install`
3. **Run tests**: `npm test`
4. **Start developing**: Press `F5` in VS Code to test your changes

### 🏗️ Adding Framework Templates

Want to add support for your favorite framework? Check out our [template contribution guide](CONTRIBUTING.md#-adding-framework-templates) and submit a PR!

---

## 📦 Installation

Search for `Filemet` in the [VS Code Marketplace](https://marketplace.visualstudio.com/) or install directly via Extensions tab.

---

## 🤝 Contributions

Pull requests welcome! Help improve parsing, suggest better syntax patterns, or expand on framework-specific templates.

---

## 📄 License

MIT © Muhammad Umair
