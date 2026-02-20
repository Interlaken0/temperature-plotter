# Contributing to Temperature Plotter
## Development Guidelines and Best Practices

Thank you for your interest in contributing to the Temperature Plotter project! This guide will help you get started and ensure consistency across all contributions.

## Table of Contents

- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Commit Message Standards](#commit-message-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)

## Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git
- VS Code (recommended)

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd temperature-plotter

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests to verify setup
npm test
```

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Jest
- Mermaid Markdown Syntax Highlighting

## Code Style Guidelines

### JavaScript/React Standards
- Use ES6+ features (arrow functions, destructuring, template literals)
- Follow React functional component patterns with hooks
- Use meaningful variable and function names
- Keep functions small and focused on single responsibility

### File Naming Conventions
- Components: `PascalCase.jsx` (e.g., `TemperatureChart.jsx`)
- Hooks: `camelCase.js` with `use` prefix (e.g., `useTemperature.js`)
- Utilities: `camelCase.js` (e.g., `temperatureUtils.js`)
- Tests: `PascalCase.test.js` (e.g., `TemperatureChart.test.js`)

### JSDoc Documentation
All functions and modules must include JSDoc comments:
```javascript
/**
 * Processes temperature data and updates the store
 * @param {number} temperature - The temperature value in Celsius
 * @param {number} timestamp - Unix timestamp for the reading
 * @returns {boolean} Success status of the operation
 */
function processTemperature(temperature, timestamp) {
  // Implementation
}
```

### Import Organization
```javascript
// React imports first
import React, { useState, useEffect } from 'react';

// Third-party libraries
import Recharts from 'recharts';

// Local imports (absolute paths)
import TemperatureChart from '../components/TemperatureChart';
import { useTemperature } from '../hooks/useTemperature';
```

## Testing Requirements

### Test Coverage Requirements
- All new features must include unit tests
- Critical paths must have integration tests
- UI components must have component tests
- Maintain minimum 50% test coverage

### Test Structure
```javascript
describe('ComponentName', () => {
  describe('when rendered', () => {
    it('should display correctly', () => {
      // Test implementation
    });
  });

  describe('when user interacts', () => {
    it('should handle user action', () => {
      // Test implementation
    });
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- TemperatureChart.test.js
```

## Commit Message Standards

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(renderer): add dark mode toggle
fix(main): resolve memory leak in temperature store
docs(readme): update installation instructions
test(integration): add end-to-end CSV export test
```

## Pull Request Process

### Before Creating PR
1. Create feature branch from `main`
2. Ensure all tests pass (`npm test`)
3. Update documentation if needed
4. Follow code style guidelines

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] JSDoc comments added/updated
```

### Review Process
1. Automated checks must pass
2. At least one code review required
3. Address all feedback before merge
4. Maintain clean commit history

## Issue Reporting

### Bug Reports
Use the following template for bug reports:

```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behaviour**
What should happen

**Actual Behaviour**
What actually happens

**Environment**
- OS: [e.g., Windows 10]
- Node.js version: [e.g., 18.17.0]
- Application version: [e.g., 1.0.0]

**Additional Context**
Screenshots, logs, or other relevant information
```

### Feature Requests
```markdown
**Feature Description**
Clear description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this be implemented?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Any other relevant information
```

## Development Workflow

### 1. Setup Development Environment
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Start development
npm run dev
```

### 2. Make Changes
- Write code following style guidelines
- Add/update tests
- Update documentation
- Commit with conventional messages

### 3. Quality Assurance
```bash
# Run tests
npm test

# Check code style (if configured)
npm run lint

# Build application
npm run build
```

### 4. Submit Changes
```bash
# Push to remote
git push origin feature/your-feature-name

# Create pull request
# Follow PR template and wait for review
```

## Architecture Guidelines

### Component Design
- Keep components small and focused
- Use custom hooks for complex state logic
- Implement proper error boundaries
- Follow React best practices

### IPC Communication
- Use contextBridge for security
- Validate all data crossing IPC boundary
- Implement proper error handling
- Document all IPC channels

### State Management
- Use ring buffer for temperature history
- Implement proper data validation
- Handle edge cases (empty data, errors)
- Maintain data integrity

## Performance Considerations

### Memory Management
- Clean up intervals and listeners
- Use efficient data structures
- Monitor memory usage in long-running processes

### UI Performance
- Implement proper React.memo usage
- Use useCallback for expensive computations
- Optimize re-renders
- Handle large datasets efficiently

## Security Guidelines

### IPC Security
- Never expose Node.js APIs directly to renderer
- Validate all incoming data
- Use contextBridge for secure communication
- Implement proper error handling

### Data Handling
- Validate user inputs
- Sanitize file paths
- Handle file operations safely
- Implement proper logging

## Getting Help

### Resources
- [Project Documentation](docs/COMPLETE-DOCUMENTATION-GUIDE.md)
- [System Architecture](docs/system-architecture.md)
- [API Documentation](Inline JSDoc comments in source code)
- [Test Documentation](__tests__/README.md)

### Contact
- Create an issue for bugs or questions
- Start a discussion for general questions
- Check existing issues before creating new ones

---

Thank you for contributing to Temperature Plotter! Your contributions help make this project better for everyone.
