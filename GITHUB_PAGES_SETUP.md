# Create GitHub Repo and Enable Pages

Your project is ready to push. Follow these steps (GitHub CLI is not installed, so use the website).

---

## 1. Create the repository on GitHub

1. Go to **https://github.com/new**
2. **Repository name:** e.g. `policy-evaluation-questions` (or `policy-dropdown-wizard`)
3. **Description:** optional, e.g. "Turnkey Policy Dropdown Wizard"
4. Choose **Public**
5. **Do not** check "Add a README" (you already have one)
6. Click **Create repository**

---

## 2. Connect and push from this folder

In Terminal, from this project folder run (replace `YOUR_USERNAME` with your GitHub username and `REPO_NAME` with the repo name you chose):

```bash
cd "/Users/sw/Policy Evaluation Questions"

git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

When prompted, sign in with your GitHub account (or use a Personal Access Token as password if you use 2FA).

---

## 3. Turn on GitHub Pages

1. On the repo page, go to **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / **(root)**
3. Click **Save**.

After a minute or two, your site will be at:

**https://YOUR_USERNAME.github.io/REPO_NAME/**

---

## Summary

| Step | Action |
|------|--------|
| 1 | Create repo at github.com/new (no README) |
| 2 | `git remote add origin https://github.com/USER/REPO.git` then `git push -u origin main` |
| 3 | Settings → Pages → deploy from branch `main` (root) |

Your `index.html` is at the project root, so the root branch option is correct for this static site.
