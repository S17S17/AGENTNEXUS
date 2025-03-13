# Contributing to AGENTNEXUS

Thank you for your interest in contributing to AGENTNEXUS! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for AGENTNEXUS.

Before creating bug reports, please check the issue tracker as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots or animated GIFs** which show you following the described steps and clearly demonstrate the problem.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for AGENTNEXUS, including completely new features and minor improvements to existing functionality.

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps** or point out the part of AGENTNEXUS which the suggestion is related to.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful** to most AGENTNEXUS users.
* **List some other applications where this enhancement exists**, if applicable.

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the JavaScript and CSS styleguides
* Include adequate tests
* Document new code based on the Documentation Styleguide
* End all files with a newline

## Development Process

### Setting Up the Development Environment

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/agentnexus.git`
3. Add the original repository as upstream: `git remote add upstream https://github.com/originalowner/agentnexus.git`
4. Install dependencies: `npm install`
5. Copy the example environment file: `cp .env.example .env`
6. Configure your environment variables in the `.env` file
7. Start the development server: `npm run dev`

### Coding Standards

* Use 2 spaces for indentation
* Use camelCase for variables and functions
* Use PascalCase for classes and components
* Use UPPERCASE for constants
* Add comments for complex logic
* Follow the ESLint configuration

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
* `refactor`: A code change that neither fixes a bug nor adds a feature
* `perf`: A code change that improves performance
* `test`: Adding missing tests or correcting existing tests
* `chore`: Changes to the build process or auxiliary tools and libraries

Example: `feat: add support for CrewAI agents`

### Branch Naming Convention

* `feature/`: For new features
* `bugfix/`: For bug fixes
* `docs/`: For documentation changes
* `refactor/`: For code refactoring
* `test/`: For adding or updating tests

Example: `feature/crew-ai-support`

## Testing

* Run tests before submitting a PR: `npm test`
* Add tests for new features
* Make sure all tests pass

## Documentation

* Update documentation for new features or changes to existing functionality
* Use JSDoc comments for functions and classes
* Keep the README.md up to date

## Review Process

* All submissions require review
* Changes may be requested before a pull request is merged
* Maintainers may close pull requests that don't meet the guidelines

## Community

* Join our [Discord server](https://discord.gg/agentnexus) for discussions
* Follow us on [Twitter](https://twitter.com/agentnexus) for updates

Thank you for contributing to AGENTNEXUS! 