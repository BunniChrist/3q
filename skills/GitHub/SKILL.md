---
name: GitHub
description: Manage GitHub repos, PRs, issues, releases via gh CLI. USE WHEN github, pull request, PR, issue, release, repo, actions, workflow run, gh.
---

# GitHub Skill

Manage GitHub repositories using the `gh` CLI.

## Workflow Routing

- **PR** → create, list, review, merge pull requests
- **Issues** → create, list, close, label issues
- **Releases** → create, list releases and tags
- **Actions** → view workflow runs, logs, re-run
- **Repo** → clone, fork, view repo info

## Prerequisites

- CLI: `gh` v2.45+ installed at `/usr/bin/gh`
- Auth: `gh auth status` to verify login

## Key Commands

### Pull Requests
```bash
gh pr list                          # List open PRs
gh pr create --title "T" --body "B" # Create PR
gh pr view <number>                 # View PR details
gh pr merge <number> --merge        # Merge PR
gh pr checks <number>               # View CI checks
gh pr diff <number>                 # View PR diff
gh pr review <number> --approve     # Approve PR
gh api repos/OWNER/REPO/pulls/N/comments  # PR comments
```

### Issues
```bash
gh issue list                       # List open issues
gh issue create --title "T" --body "B"  # Create issue
gh issue close <number>             # Close issue
gh issue view <number>              # View issue
```

### Actions / CI
```bash
gh run list                         # List workflow runs
gh run view <id>                    # View run details
gh run view <id> --log              # View run logs
gh run rerun <id>                   # Re-run workflow
gh workflow list                    # List workflows
```

### Releases
```bash
gh release list                     # List releases
gh release create <tag> --title "T" --notes "N"  # Create release
gh release upload <tag> <file>      # Upload asset
```

### Repository
```bash
gh repo view                        # View current repo
gh repo clone <repo>                # Clone repo
gh api repos/OWNER/REPO             # API access
```

## Amergon Context

- Repo: `BunniChrist/Amergon` on GitHub
- Main branch: `main`, WIP branch: `wip/mvp2.1`
- PRs created via `gh pr create` with `--base main`

## Safety Notes

- Creating/closing PRs and issues is visible to collaborators — confirm with user
- `gh pr merge` modifies shared branch — always confirm
- Use `gh pr checks` before merging to verify CI passes
