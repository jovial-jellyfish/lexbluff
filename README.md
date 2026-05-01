# 🃏 LexBluff

**LexBluff** is a real-time multiplayer social word game where players bluff, deduce, and compete. One player secretly knows the correct definition of a complex word — everyone else invents convincing fakes. Can your team spot the truth?

---

## 🎮 How to Play

1. **Create or join** a room via shareable URL
2. Players are split into **Speakers** and **Guessers**
3. A complex word is revealed — one Speaker knows the real definition; others must **bluff**
4. Speakers take turns explaining their definition
5. Guessers **vote** on who told the truth
6. Score points for fooling opponents (Speakers) or finding the truth (Guessers)
7. Teams swap roles each round — 5 rounds total

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/lexbluff.git
cd lexbluff
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Firestore Database** (start in test mode)
4. Go to **Project Settings → Your Apps → Add Web App**
5. Copy your config values

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Firebase values:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

### 5. Deploy Firestore rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project, use firestore.rules
firebase deploy --only firestore:rules
```

### 6. Run locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploying to GitHub Pages

1. In `package.json`, update the `"homepage"` field:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/lexbluff"
   ```

2. Add deploy scripts (already included):
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

> **Note:** GitHub Pages only serves static files. The React frontend works great on Pages, but Firebase handles all real-time multiplayer data — no server needed!

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + React Router |
| Animations | Framer Motion |
| Realtime DB | Firebase Firestore |
| Hosting | GitHub Pages |
| Styling | CSS Variables + Google Fonts |

---

## 📁 Project Structure

```
lexbluff/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── phases/
│   │   │   ├── Lobby.js
│   │   │   ├── TeamSelection.js
│   │   │   ├── WritingPhase.js
│   │   │   ├── ExplainingPhase.js
│   │   │   ├── VotingPhase.js
│   │   │   ├── ResultsPhase.js
│   │   │   └── GameOver.js
│   │   ├── GameRoom.js
│   │   └── Home.js
│   ├── hooks/
│   │   └── useGame.js       # All Firebase game logic
│   ├── utils/
│   │   ├── gameLogic.js     # Scoring, teams, room codes
│   │   └── wordBank.js      # 20 complex words + definitions
│   ├── styles/
│   │   └── global.css
│   ├── firebase.js
│   ├── App.js
│   └── index.js
├── firestore.rules
├── .env.example
└── package.json
```

---

## 🎨 Features

- ✅ No login required — just a username
- ✅ Shareable room links
- ✅ Real-time sync via Firebase Firestore
- ✅ Automatic team assignment
- ✅ 20 built-in complex words (easily expandable)
- ✅ 5-round games with team rotation
- ✅ Live scoreboard
- ✅ Mobile-responsive
- ✅ Smooth animations with Framer Motion

---

## 🔧 Extending the Word Bank

Edit `src/utils/wordBank.js` to add more words:

```js
{
  word: "Serendipity",
  definition: "The occurrence of events by chance in a happy or beneficial way.",
}
```

---

## 📜 License

MIT — free to use, modify, and share.
