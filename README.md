# C++ Toolkit

This is the README for the **C++ Toolkit** extension.
It helps you improve C++ code quality by detecting unused variables.
The goal is to keep your projects clean, efficient, and easier to maintain.

---

## Features

- Detect unused **variables** inside your C++ files
- Lightweight and runs directly inside VS Code
- Future Pro features: project-wide analysis, QuickFixes, CI/CD integration

### Example

![Unused Variable Detection](images/unused-var.png)

---

## Requirements

No external dependencies required.
Just install the extension and open your C++ project.

---

## Extension Settings

This extension currently contributes no custom settings.

---

## Known Issues

- Due to the nature of the check for unused variables (RegEx based) there might be some edge cases which either give a false positive or false negative.

If you find other issues, please open a [GitLab issue](https://gitlab.com/rscd-dev/cpp-toolkit/cpp-toolkit-free/-/issues).

---

## Release Notes

### 1.0.0
- Initial release
- Added unused variable detection

---

## Following extension guidelines

This project follows the official VS Code extension development guidelines:
* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

---

## Development

If you want to run this extension locally:

```bash
# Clone repository
git clone https://github.com/RSCD-DEV/cpp-toolkit-free.git
cd cpp-toolkit-free

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Launch VS Code extension host
npm run watch
