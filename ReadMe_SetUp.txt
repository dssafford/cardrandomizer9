# Environment Setup Guide

## Development Environment Setup

1. Install Node.js
   - Download from https://nodejs.org/
   - Recommended version: Latest LTS

2. Install Angular CLI
   ```bash
   npm install -g @angular/cli
   ```

3. IDE Setup
   - Recommended: Visual Studio Code
   - Useful VS Code Extensions:
     - Angular Language Service
     - ESLint
     - Prettier
     - Angular Snippets

4. Configure ESLint and Prettier
   ```bash
   npm install --save-dev eslint prettier
   ```

5. Setup Git Hooks (optional)
   ```bash
   npm install --save-dev husky lint-staged
   ```

## Common Issues and Solutions

1. Node.js version conflicts
   - Use nvm (Node Version Manager) to manage multiple Node.js versions

2. Angular CLI version mismatch
   - Clear npm cache: `npm cache clean --force`
   - Reinstall Angular CLI globally

3. Port 4200 already in use
   - Kill the process using: `npx kill-port 4200`
   - Or use different port: `ng serve --port 4201`
