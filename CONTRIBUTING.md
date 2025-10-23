# Contributing to Hotel Guest Management

First off, thank you for considering contributing to Hotel Guest Management! It's people like you that make this project better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [support@yourhotel.com](mailto:support@yourhotel.com).

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you create a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows, macOS, Linux]
 - Browser: [e.g. Chrome, Firefox, Safari]
 - Version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

### 💡 Suggesting Features

Feature suggestions are tracked as GitHub issues. When creating a feature request, include:

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/hotel-guest-management.git
cd hotel-guest-management
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 5. Start Development Server

```bash
npm run dev
```

## Coding Standards

### TypeScript

- **Always use TypeScript** - No plain JavaScript files
- **Define types explicitly** - Avoid `any` type unless absolutely necessary
- **Use interfaces** for object shapes
- **Export types** that are used across multiple files

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const user: User = { id: '1', name: 'John', email: 'john@example.com' };

// ❌ Bad
const user: any = { id: '1', name: 'John', email: 'john@example.com' };
```

### React Components

- **Use functional components** with hooks
- **One component per file** (except for small, tightly-coupled components)
- **Name files** with PascalCase (e.g., `GuestDetail.tsx`)
- **Export default** for main component
- **Use named exports** for utility functions

```typescript
// ✅ Good
export default function GuestDetail({ guest }: GuestDetailProps) {
  const [editing, setEditing] = useState(false);
  // ...
}

// ❌ Bad
const GuestDetail = (props) => {
  // ...
}
export default GuestDetail;
```

### Styling

- **Use Tailwind CSS** utility classes
- **Avoid inline styles** unless dynamic
- **Keep consistent spacing** (use Tailwind's spacing scale)
- **Follow mobile-first** approach

```typescript
// ✅ Good
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Save
</button>

// ❌ Bad
<button style={{ padding: '8px 16px', background: '#2563eb' }}>
  Save
</button>
```

### File Organization

```typescript
// Component file structure:
// 1. Imports
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export default function Component({ prop }: Props) {
  // 3.1 State
  const [state, setState] = useState();
  
  // 3.2 Effects
  useEffect(() => {}, []);
  
  // 3.3 Handlers
  const handleClick = () => {};
  
  // 3.4 Render
  return <div>...</div>;
}
```

### Code Quality

- **Run linter** before committing: `npm run lint`
- **Type check** your code: `npm run typecheck`
- **Format consistently** - Consider using Prettier
- **Write meaningful comments** for complex logic
- **Remove console.logs** before committing (except in error handlers)

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(guests): add search by country filter"

# Bug fix
git commit -m "fix(calendar): correct date calculation for events"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(validation): extract validation logic to utils"
```

### Detailed Commit

```bash
git commit -m "feat(dashboard): add weekly sales chart

- Implemented Recharts bar chart for weekly sales visualization
- Added automatic week calculation based on month
- Included hover tooltips with formatted currency
- Responsive chart sizing

Closes #123"
```

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest main:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all checks**:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

3. **Test your changes** thoroughly

4. **Update documentation** if needed

### Submitting the PR

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub

3. **Fill out the PR template**:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

## Screenshots (if applicable)
Add screenshots to show the changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested that my fix is effective or that my feature works
```

### Review Process

1. **Automated checks** must pass (linting, type checking, build)
2. At least **one approval** required from maintainers
3. Address any **requested changes**
4. Once approved, a maintainer will **merge** your PR

## Code Review Guidelines

### As a Reviewer

- **Be kind and constructive** - Remember there's a person behind the code
- **Ask questions** rather than make demands
- **Explain your reasoning** - Help the author understand
- **Approve liberally** - Don't nitpick on style if it's consistent
- **Suggest improvements** for future consideration

### As an Author

- **Don't take it personally** - Reviews are about the code, not you
- **Be open to feedback** - Consider suggestions seriously
- **Ask for clarification** if you don't understand a comment
- **Respond to all comments** - Even if just with "Done"
- **Thank reviewers** - They're volunteering their time

## Testing Guidelines

### Writing Tests

Although we don't have tests yet, here's what we expect:

```typescript
// Example test structure
import { render, screen } from '@testing-library/react';
import GuestList from './GuestList';

describe('GuestList', () => {
  it('renders guest list correctly', () => {
    const guests = [
      { id: '1', family_name: 'Smith', room_number: '101', country: 'USA', pax: 2, nights: 3 }
    ];
    
    render(<GuestList guests={guests} onSelectGuest={jest.fn()} />);
    
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('Room 101')).toBeInTheDocument();
  });
  
  it('calls onSelectGuest when guest is clicked', () => {
    const mockSelect = jest.fn();
    // ... test implementation
  });
});
```

### Test Coverage Goals

- **Unit tests**: For utility functions and validation logic
- **Component tests**: For React components
- **Integration tests**: For key user flows
- **Target coverage**: >80%

## Documentation Guidelines

### Code Comments

```typescript
// ✅ Good - Explains WHY
// Calculate week of month accounting for partial weeks at start
const weekNumber = Math.floor((date + firstDayOfWeek) / 7) + 1;

// ❌ Bad - Explains WHAT (obvious from code)
// Add 1 to the result
const weekNumber = calculateWeek(date) + 1;
```

### README Updates

When adding features:
- Update the Features section
- Add to API Reference if applicable
- Update screenshots if UI changed
- Update installation steps if needed

### JSDoc for Complex Functions

```typescript
/**
 * Validates guest data before saving to database
 * @param guest - Partial guest object to validate
 * @returns Validation result with errors array
 * @example
 * const result = validateGuest({ family_name: '', room_number: '101' });
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 */
export function validateGuest(guest: Partial<Guest>): ValidationResult {
  // ...
}
```

## Project-Specific Guidelines

### Supabase Interactions

- **Always handle errors** from Supabase calls
- **Use try-catch** for async operations
- **Show user feedback** (toast notifications)
- **Log errors** for debugging

```typescript
// ✅ Good
try {
  const { data, error } = await supabase.from('guests').select('*');
  if (error) throw error;
  setGuests(data);
  toast.success('Guests loaded successfully');
} catch (error) {
  console.error('Error loading guests:', error);
  toast.error('Failed to load guests');
}

// ❌ Bad
const { data } = await supabase.from('guests').select('*');
setGuests(data);
```

### Form Validation

- **Always validate** user input
- **Use validation utilities** from `utils/validation.ts`
- **Show inline errors** for better UX
- **Prevent submission** if invalid

### State Management

- **Use local state** for component-specific data
- **Lift state up** when needed by multiple components
- **Consider context** for deeply nested prop drilling
- **Keep state minimal** - derive what you can

## Getting Help

### Resources

- **Documentation**: Check the README first
- **Existing Issues**: Search before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Code**: Read existing code for patterns

### Communication Channels

- 💬 **GitHub Discussions** - General questions and ideas
- 🐛 **GitHub Issues** - Bugs and feature requests
- 📧 **Email** - antonio984vs@gmail.com for private matters

### Response Times

- **Issues**: Usually within 2-3 days
- **Pull Requests**: Usually within 1 week
- **Questions**: Usually within 1-2 days

## Recognition

Contributors who make significant contributions will be:
- Added to the README's Contributors section
- Mentioned in release notes
- Given a shoutout on social media (if desired)

## Financial Contributions

This is an open-source project and we don't currently accept financial contributions. The best way to support the project is to:
- Contribute code
- Report bugs
- Improve documentation
- Help other users
- Share the project

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Hotel Guest Management! 🙏**

Your time and effort help make this project better for everyone in the hospitality industry.