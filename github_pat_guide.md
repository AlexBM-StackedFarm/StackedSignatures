# GitHub Personal Access Token (PAT) Guide

## Why GitHub Requires PATs for Pushing Code

GitHub discontinued password authentication for Git operations in August 2021 to enhance security. Personal Access Tokens are now required because they:

1. Offer **granular permissions** (specific scopes)
2. Can be **limited in duration** (expiration dates)
3. Are **revocable** without changing your password
4. Provide an **audit trail** of token usage
5. Reduce risk from **password breaches**

## Creating a GitHub PAT

1. **Log in** to your GitHub account
2. Click your **profile photo** → **Settings**
3. Scroll to **Developer settings** (bottom of sidebar)
4. Select **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token** → **Generate new token (classic)**
6. **Name** your token descriptively
7. Set an **expiration** (30 days recommended)
8. Select **scopes**:
   - For basic repository operations: `repo` (full control)
   - For minimal push access: `public_repo` (public repos only)
9. Click **Generate token**
10. **IMPORTANT**: Copy your token immediately—you won't see it again!

## Using Your PAT for Git Operations

### First-time setup:
```bash
git remote set-url origin https://USERNAME:TOKEN@github.com/USERNAME/REPO.git
```

### Alternative: Store in credential helper:
```bash
git config --global credential.helper store
# Then push (you'll be prompted once)
git push
```

### For one-time use:
```bash
git push https://USERNAME:TOKEN@github.com/USERNAME/REPO.git
```

## Best Practices

- **Never share** your token
- **Limit scope** to only what's needed
- Set **reasonable expiration** dates
- Use **different tokens** for different purposes
- **Revoke tokens** when no longer needed
- Consider using **SSH keys** as an alternative

## Troubleshooting

If you encounter authentication issues:
- Verify token has correct permissions
- Check token hasn't expired
- Ensure remote URL is correct
- Try revoking and creating a new token