# ✨ Flashcards App

Simple flashcard app with **Markdown** and **LaTeX** support.

## Features

- ✅ Create, view, delete flashcards
- ✅ Full Markdown support (lists, bold, italic, code, tables, etc.)
- ✅ LaTeX math equations (inline `$...$` and block `$$...$$`)
- ✅ Bulk import via JSON
- ✅ Beautiful gradient UI
- ✅ Real-time preview

---

## 🚀 Deploy to Vercel (5 Minutes)

### Step 1: Push to GitHub

```bash
cd /Users/banana-orange/Desktop/flashcards
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashcards.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Click **"Deploy"** (don't change any settings)

### Step 3: Add Database

1. In your Vercel project dashboard, go to **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Click **"Create"** (free tier, no credit card)
5. Vercel automatically connects it to your app

### Step 4: Run Database Migration

1. In Vercel, go to **"Settings"** → **"Environment Variables"**
2. The `POSTGRES_PRISMA_URL` should already be there
3. Go to **"Deployments"** → Click **"..."** on latest → **"Redeploy"**
4. Check "Use existing Build Cache" is OFF
5. Click **"Redeploy"**

### Done! 🎉

Your app is now live at: `https://your-project.vercel.app`

Share the link with your friends!

---

## 💡 How to Use

### Add Single Flashcard

Click **"+ Add Card"** and use Markdown/LaTeX:

**Question:**
```
## What is the quadratic formula?

Solve for $x$ in $ax^2 + bx + c = 0$
```

**Answer:**
```
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$
```

### Bulk Import

Click **"📦 Bulk Import"** and paste JSON:

```json
[
  {
    "question": "What is **Einstein's equation**?",
    "answer": "$E = mc^2$ - Energy equals mass times the speed of light squared"
  },
  {
    "question": "## Pythagorean Theorem",
    "answer": "$$a^2 + b^2 = c^2$$\n\nWhere:\n- $a$, $b$ are the legs\n- $c$ is the hypotenuse"
  }
]
```

---

## 🏃 Run Locally (Optional)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Note:** You'll need a database. Create `.env` file:
```
POSTGRES_PRISMA_URL="your-database-url"
```

---

## 📝 Tips

- **LaTeX:** Use `$` for inline math, `$$` for block equations
- **Markdown:** Full GFM support (tables, task lists, strikethrough, etc.)
- **Navigation:** Click card to flip, or use buttons
- **Delete:** Delete button removes current card
- **Mobile:** Fully responsive design

---

## 🆓 Cost

**$0/month**

- Vercel Hosting: Free
- Vercel Postgres: Free tier (60 hrs/month compute)
- For 3 days of sharing with friends: You'll use maybe 1-2 hours total

---

## 🔧 Troubleshooting

**App deployed but shows errors:**
- Make sure you added Postgres database in Vercel
- Redeploy after adding database
- Check Environment Variables are set

**Database connection error:**
- Verify `POSTGRES_PRISMA_URL` exists in Environment Variables
- Redeploy with cache disabled

**Need help?**
- Check Vercel deployment logs
- Ensure you committed all files to GitHub

---

Enjoy your flashcards! 🎓
