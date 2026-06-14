# webproject-horizon

## Monorepo for our Webproject

A collaborative web project built with Node.js backend and static HTML frontend.

---

## Setup

### Prerequisites

- **Node.js** >= 16.x
- **npm** >= 8.x (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd webproject-horizon

# Install dependencies
npm install
```

### Running the Project

**Frontend (Static Website):**

```bash
npm run dev
# Server starts at http://localhost:3000
```

**Development Mode (with auto-reload):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

### JSON and XML API Responses

Backend endpoints return JSON by default.
Add `?format=xml` to get XML instead:

```text
http://localhost:3000/getNews?format=xml
```

### PATCH API Endpoint

The portal uses a PATCH endpoint to update the current user's last access date:

```text
PATCH http://localhost:3000/api/users/last-access
```

### Archive Page

The archive page loads posts from the backend and supports title search:

```text
http://localhost:3000/archive.html
http://localhost:3000/getArchive
```

---

## Folder Conventions

Keep the project organized and maintainable:

```
webproject-horizon/
├── website/              # Frontend - all UI code
│   ├── index.html
│   ├── styles.css        # Global styles
│   └── assets/           # Images, fonts, etc.
├── server/               # Backend - all server logic
│   └── infrastructure/
│       └── server.js
├── package.json
└── README.md
```

**Rules:**

- ✅ All UI components & HTML files go in `/website`
- ✅ All backend logic goes in `/server`
- ✅ Create feature-based subfolders (e.g., `/website/pages`, `/server/api`)
- ✅ One responsibility per file
- ❌ Do NOT mix frontend and backend code
- ❌ Do NOT create large monolithic files

---

## Code Style

Keep the codebase consistent and readable:

### Naming Conventions

- **Variables & Functions:** Use `camelCase`

  ```js
  // ✅ Good
  const getUserData = () => {}
  const activeUsers = []
  
  // ❌ Avoid
  const get_user_data = () => {}
  const final_final_version = []
  ```

- **Files:** Use `kebab-case` for CSS files, `camelCase` for JS
  ```
  ✅ styles.css, utilities.js
  ❌ Styles.css, my_utilities.js
  ```

### Best Practices

- Use meaningful names (no `test1.js`, `temp.js`, `final_final.js`)
- One responsibility per file
- Keep functions small and focused
- Add comments for complex logic
- Avoid large monolithic files (split into smaller modules)

### Prettier & ESLint

If configured in the project, run before committing:

```bash
npm run lint
npm run format
```

---

## Tasks & Tracking

**Every task must have an issue:**

1. Create an **ISSUE** on our GitHub repo describing the task
2. Assign yourself to it
3. Describe what needs to be done
4. Link any relevant discussions or context

This gives us clear visibility on:

- Who's working on what
- What's left to do
- What's in progress

---

## Development Workflow

### Branching Strategy

Each new feature gets its own branch:

```
main (stable, always working)
  ↓
your-feature-branch (where you write code)
  ↓
PR Request to main (code review)
  ↓
Merge to main (after approval)
```

### How to Develop

1. **Create a branch from `main`:**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Write your code** and commit regularly with clear messages:

   ```bash
   git commit -m "Add user authentication"
   ```

3. **Push to your branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

---

## Pull Requests

**Every PR must follow these rules:**

### Requirements

- ✅ **Linked to an Issue** - Every PR must reference an issue (`Closes #123`)
- ✅ **Clear Description** - Include:
  - What was changed
  - Why it was changed
  - How to test it
- ✅ **4-Eyes Principle** - At least one other person must review & approve before merging
- ✅ **No Direct Commits to `main` or `production`** - All code goes through PR review
- ✅ **Definition of Done** - See below before requesting review

### PR Template

```markdown
## Description
Brief summary of what this PR does.

## Changes
- Changed X
- Added Y
- Fixed Z

## Why?
Explain the reasoning behind these changes.

## How to Test?
Step-by-step instructions:
1. Run `npm install`
2. Run `npm run dev`
3. Visit http://localhost:3000
4. Click on X and verify Y happens

## Related Issue
Closes #123
```

---

## Production Branch

**`production` is sacred — always stable:**

### Rules

- ✅ `production` should **always be runnable**
- ✅ Only updated from `main` after thorough testing
- ✅ Never commit directly to `production`
- ✅ Tag releases (v1.0.0, v1.0.1, etc.)
- ❌ No experimental code
- ❌ No direct pushes without approval

### Workflow

```
main (new features & fixes)
  ↓ (after testing)
production (stable, deployable)
```

Create a release PR from `main` to `production` when ready to deploy.

---

## Environment Variables

**IMPORTANT: Never commit secrets!**

### Rules

- ❌ **Never commit `.env` files** to the repository
- ✅ **Always use `.env.example`** to document required variables
- ✅ **Ask the team** for missing credentials (API keys, passwords, etc.)
- ✅ Add `.env` to `.gitignore` (usually already done)

### Example

```bash
# .env.example (commit this)
DB_HOST=localhost
DB_PORT=5432
API_KEY=your_api_key_here

# .env (do NOT commit this)
DB_HOST=localhost
DB_PORT=5432
API_KEY=super_secret_key_12345
```

---

## Definition of Done

A task is **DONE** when **ALL** of the following are met:

- ✅ **Code Complete** - All features implemented as described in the issue
- ✅ **No Console Errors** - No `console.error` or warnings in the browser/terminal
- ✅ **No Console Logs** - Remove all `console.log` statements (or keep only important ones)
- ✅ **Tested Locally** - Works on your machine without errors
- ✅ **Code Follows Standards** - Follows naming conventions and folder structure
- ✅ **PR Review** - Code reviewed by at least one other developer
- ✅ **Approved & Merged** - PR is approved and merged into `main`

**Checklist before requesting review:**
```
- [ ] Feature works as expected
- [ ] No errors in browser console
- [ ] No console.log spam (or debug logs removed)
- [ ] Code follows style guide
- [ ] Tests pass (if applicable)
- [ ] PR description is clear
- [ ] Related issue is linked
```
