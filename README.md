## 📁 Filemet - Emmet-Inspired File & Folder Generator for VS Code

**Filemet** is a blazing-fast, Emmet-style file and folder structure generator for Visual Studio Code. Type expressive path-like syntax and instantly scaffold deeply nested folders and files — no more tedious clicking.

> ✨ Perfect for frontend, backend, and fullstack projects — React, Next.js, Node.js, Go, Python, and beyond.

---

### 🚀 Features

* Emmet-inspired syntax for creating files & folders
* Supports deep nesting and grouping
* Multiple separator types: `+`, `,`
* Mix of bracket styles: `[]`, `{}`, `()`
* Works with dotfiles, extensions, and special characters
* Smart whitespace handling
* Real-time feedback on invalid syntax
* Perfect for bootstrapping complex project scaffolds

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

## 📦 Installation

Search for `Filemet` in the [VS Code Marketplace](https://marketplace.visualstudio.com/) or install directly via Extensions tab.

---

## 🤝 Contributions

Pull requests welcome! Help improve parsing, suggest better syntax patterns, or expand on framework-specific templates.

---

## 📄 License

MIT © Muhammad Umair
