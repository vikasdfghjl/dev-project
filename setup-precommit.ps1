# Pre-commit Setup Script for RSS Reader Project
# Run this script to set up pre-commit hooks

Write-Host "🚀 Setting up pre-commit hooks for RSS Reader project..." -ForegroundColor Green

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python first." -ForegroundColor Red
    exit 1
}

# Install pre-commit
Write-Host "📦 Installing pre-commit..." -ForegroundColor Yellow
pip install pre-commit

# Install pre-commit hooks
Write-Host "🔧 Installing pre-commit hooks..." -ForegroundColor Yellow
pre-commit install

# Install commit-msg hook for conventional commits
Write-Host "📝 Installing commit-msg hook..." -ForegroundColor Yellow
pre-commit install --hook-type commit-msg

# Run pre-commit on all files to test setup
Write-Host "🧪 Running pre-commit on all files - this may take a while..." -ForegroundColor Yellow
pre-commit run --all-files

Write-Host "✅ Pre-commit setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 What's configured:" -ForegroundColor Cyan
Write-Host "   • Python: black, isort, flake8, mypy, bandit, pyupgrade" -ForegroundColor White
Write-Host "   • Frontend: prettier, eslint" -ForegroundColor White
Write-Host "   • Docker: hadolint" -ForegroundColor White
Write-Host "   • General: YAML, JSON, Markdown formatting" -ForegroundColor White
Write-Host "   • Security: detect-secrets" -ForegroundColor White
Write-Host "   • Git: conventional commits" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Now your commits will be automatically checked and formatted!" -ForegroundColor Green
