# Pre-commit Setup for RSS Reader

## What is Pre-commit?

Pre-commit is a framework for managing and maintaining multi-language pre-commit hooks. It automatically
runs code quality checks before each commit, ensuring consistent code style and catching issues early.

## Quick Setup

Run the setup script:

```powershell
.\setup-precommit.ps1
```

Or manually:

```powershell
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install
pre-commit install --hook-type commit-msg

# Test setup
pre-commit run --all-files
```

## What's Configured

### 🐍 Python (Backend)

- **Black**: Code formatting (88 character line length)
- **isort**: Import sorting (compatible with Black)
- **flake8**: Linting and style checks
- **mypy**: Type checking
- **bandit**: Security vulnerability scanning
- **pyupgrade**: Upgrade Python syntax to modern versions
- **pydocstyle**: Docstring style checking

### 🌐 Frontend (React/TypeScript)

- **Prettier**: Code formatting for JS/TS/CSS/HTML
- **ESLint**: Linting with auto-fix

### 🐳 Docker

- **Hadolint**: Dockerfile linting

### 📝 Documentation & Config

- **Prettier**: YAML and JSON formatting
- **Markdownlint**: Markdown linting and formatting
- **SQLFluff**: SQL formatting for Alembic migrations

### 🔒 Security & Quality

- **detect-secrets**: Prevent secrets from being committed
- **Conventional commits**: Enforce commit message standards
- **General hooks**: Trailing whitespace, large files, merge conflicts

## Configuration Files

- `.pre-commit-config.yaml` - Main pre-commit configuration
- `.markdownlint.json` - Markdown linting rules
- `.secrets.baseline` - Baseline for secret detection

## Usage

### Automatic (Recommended)

Pre-commit hooks run automatically on every `git commit`. If issues are found:

1. Hooks will auto-fix what they can
2. You'll need to `git add` the fixed files
3. Commit again

### Manual

```powershell
# Run on all files
pre-commit run --all-files

# Run on specific files
pre-commit run --files backend/app/main.py

# Run specific hook
pre-commit run black
```

### Skip Hooks (Emergency)

```powershell
git commit -m "emergency fix" --no-verify
```

## Commit Message Format

Using conventional commits format:

```sh
type(scope): description

# Examples:
feat(api): add user authentication endpoint
fix(frontend): resolve feed loading issue
docs(readme): update installation instructions
chore(deps): update dependencies
```

## Troubleshooting

### Hook Installation Issues

```powershell
# Reinstall hooks
pre-commit clean
pre-commit install --install-hooks
```

### Slow First Run

The first run installs all tools and can be slow. Subsequent runs are much faster.

### ESLint/Prettier Conflicts

The configuration is set up to avoid conflicts between ESLint and Prettier.

### Python Path Issues

Ensure your virtual environment is activated when running pre-commit.

## Benefits

✅ **Consistent Code Style**: Automatic formatting across the team
✅ **Early Bug Detection**: Catch issues before they reach CI/CD
✅ **Security**: Prevent secrets and vulnerabilities from being committed
✅ **Documentation**: Ensure README and docs are properly formatted
✅ **Type Safety**: MyPy catches type issues in Python code
✅ **Best Practices**: Enforce coding standards and conventions

## Customization

Edit `.pre-commit-config.yaml` to:

- Add/remove hooks
- Modify hook arguments
- Change file patterns
- Adjust formatting rules

After changes, run:

```powershell
pre-commit install --overwrite
```
