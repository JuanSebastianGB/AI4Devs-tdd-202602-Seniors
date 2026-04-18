### Language:
- Everything should be on english

### Codign rules:
- We use strictly use pnpm
- Don't write inline documentation
- After every new feature update the /docs folder
- For each new feature on frontend implement a unit tests in the /frontend/tests folder
- For each new feature on backend implement a unit tests in the /backend/tests folder

### Git Workflow - IMPORTANT
- **ALWAYS use the pr-pusher agent** when user wants to commit, push, or create PRs
- Trigger keywords: "commit", "push", "create PR", "pull request", "push to main"
- NEVER execute git push directly - always delegate to pr-pusher agent
- pr-pusher will create feature branches and proper PR workflow automatically