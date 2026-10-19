# Person A: What to do (Part 1)

All Part 1 code is already in this folder. Your job is to get it running and onto GitHub.

## 1. Install tools (one time)
- Node.js LTS: https://nodejs.org
- Git: https://git-scm.com
- A GitHub account

## 2. Run the project
Open a terminal inside `goout-dashboard`:
```bash
npm install
npm run dev
```
Open http://localhost:5173. Check that the Navbar switches between Dashboard, Compare and About.

## 3. Create the GitHub repo
1. On github.com click **New repository**, name it `goout-dashboard`, keep it **empty** (no README), and click Create.
2. In the terminal:
```bash
git init
git add .
git commit -m "feat: Part 1 project setup, routing and layout"
git branch -M main
git remote add origin https://github.com/<your-username>/goout-dashboard.git
git push -u origin main
git checkout -b dev
git push -u origin dev
```

## 4. Add teammates
Repo, then **Settings**, then **Collaborators**, then **Add people**. Add Persons B, C and D.

## 5. Optional (good marks): protect main
Settings, then Branches, then **Add rule** for `main`, and tick "Require a pull request before merging".

## 6. Hand over
Message Person B: "Part 1 is pushed. Clone the repo, upload PROJECT_CONTEXT.md and the src folder to Claude, and start Part 2."

---

### Instructions for every next person
```bash
git clone https://github.com/<A-username>/goout-dashboard.git
cd goout-dashboard
git checkout dev
git checkout -b feature/part-2      # part-3 / part-4 for others
npm install
npm run dev
```
After finishing: update PROJECT_CONTEXT.md, then
```bash
git add .
git commit -m "feat: Part 2 ..."
git push -u origin feature/part-2
```
Open a Pull Request into `dev` on GitHub and merge it. The final person also merges `dev` into `main`.
