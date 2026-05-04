# Commit Message Rules

**CRITICAL REQUIREMENT:** All commit messages MUST follow Conventional Commits format with the task ID extracted from the current branch name.

## Process

Before generating ANY commit message:

1. **Get current branch**: Run `git branch --show-current`
2. **Extract task ID**: Parse the ID from the branch name (e.g., `DES-1590` from `feat/DES-1590` or `refactor/DES-1590`)
3. **Apply format**: `<type>(TASK-ID): <description>`

## Format

```
<type>(TASK-ID): <description>
```

Where:

- `<type>`: feat, fix, chore, refactor, docs, test, etc.
- `TASK-ID`: The ID extracted from branch name (required, never omit)
- `<description>`: Brief description in lowercase

## Examples

Current branch: `refactor/XYZ-1590`

```
refactor(XYZ-1590): simplify authentication logic
feat(XYZ-1590): add user profile validation
fix(XYZ-1590): correct date formatting issue
chore(XYZ-1590): update dependencies
```

**NEVER create a commit message without the task ID scope.**
