# Deploy keys (public only — safe to commit)

## Public key (already for cPanel)

File: [`github-actions.pub`](github-actions.pub)

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG05oD8hKokMAWT5FhNAeOHAxxdLDvYUOZNluCtKd0jb github-actions-amde-backend
```

Import + **Authorize** this in cPanel → SSH Access → Manage SSH Keys.

## GitHub Secrets (security only)

| Secret | Required | Used by |
|--------|----------|---------|
| `SSH_PRIVATE_KEY` | **Yes** | Backend deploy (and later frontend) |
| `DB_HOST` | No | Only if you tick run_migration |
| `DB_USER` | No | Only if you tick run_migration |
| `DB_PASSWORD` | No | Only if you tick run_migration |
| `DB_NAME` | No | Only if you tick run_migration |

Host, user, port, and remote paths are hardcoded in the workflow `env:` blocks (not secrets).
