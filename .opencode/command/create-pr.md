---
description: Creates PR of the current branch
agent: pr-pusher
subtask: true
---

Create a github PR to my main branch using the specified commands and rules.

**Instructions**

1. Inspect with a git diff everything that has changed on this branch in comparison with the main branch.
2. Create a PR with the following params:

**head** the current branch name. `git branch --show-current`
**title** short and appropiate title based on the changes of the PR
**body** changes in short bullet points listed. nothing else

**CLI command syntax**
```
gh pr create \
    --base main \
    --head <FILL_IN_ACCORDINGLY>
    --title <FILL_IN_ACCORDINGLY>
    --body <FILL_IN_ACCORDINGLY>
```