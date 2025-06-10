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

### 5. Whitespace Tolerance

* Whitespace around paths is ignored: `folder / file.ts` → `folder/file.ts`

### 6. Dotfiles & Extensions

* `config{.env,.gitignore}` → `config/.env`, `config/.gitignore`

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
app/{layout.tsx + page.tsx + globals.css}
pages/{api/users/route.ts + (dashboard)/{page.tsx,layout.tsx}}
```

### Node.js / Express

```bash
src/{controllers/{user.js,auth.js} + routes/users.js + middleware/auth.js}
```

### Go Projects

```bash
cmd/api/main.go + internal/{handlers/user.go + models/user.go} + pkg/database/db.go
```

### Python / Django

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
* `+file.ts` → ✅ (leading `+` is ignored)

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
