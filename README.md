# C++ Toolkit

This is the README for the **C++ Toolkit** extension.
It helps you improve C++ code quality by detecting unused variables and unused includes.
The goal is to keep your projects clean, efficient, and easier to maintain.

---

## Features

- Detect unused **variables** inside your C++ files
- Detect unused **includes** inside your C++ files
- Lightweight and runs directly inside VS Code
- Future Pro features: project-wide analysis, QuickFixes, CI/CD integration

## Unused Variable Detection

![Unused Variable Detection](https://gitlab.com/rscd-dev/cpp-toolkit/cpp-toolkit-free/-/raw/main/images/UnusedVarDemo.gif)

## Unused Include Detection

![Unused Include Detection](https://gitlab.com/rscd-dev/cpp-toolkit/cpp-toolkit-free/-/raw/main/images/UnusedIncludeDemo.gif)

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
- Some header files might not be detected when they have multiple dots in their file ending. Thus, they will be marked as unused (as they are viewed as non existant)

If you find other issues, please open a [GitLab issue](https://gitlab.com/rscd-dev/cpp-toolkit/cpp-toolkit-free/-/issues).

---

## Release Notes

### 1.0.0
- Initial release
- Added unused variable detection
- Added unused includes detection

---

## Following extension guidelines

This project follows the official VS Code extension development guidelines:
* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

---