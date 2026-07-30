# Backend deploy

**Automatic:** push to `main` that changes `backend/` or the deploy workflow.  
**Manual:** Actions → Deploy Backend → Run workflow.

**GitHub secret (required):** `SSH_PRIVATE_KEY`

**cPanel:** authorize [`../deploy/github-actions.pub`](../deploy/github-actions.pub)

Host/user/path are in the workflow `env:` block. Telegram: [TELEGRAM.md](TELEGRAM.md).
