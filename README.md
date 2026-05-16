# LexBluff

**A real-time multiplayer word bluffing game.**

🎮 **[Play now → https://jovial-jellyfish.github.io/lexbluff/](https://jovial-jellyfish.github.io/lexbluff/)**

---

## How to Play

1. One player creates a room and shares the link with friends.
2. Players are split into two teams — **Speakers** and **Guessers**.
3. A secret word is revealed to the Speakers.
   - One Speaker (the **Truth Speaker**) knows the real dictionary definition.
   - The other Speakers must **invent** a convincing fake definition.
4. Each Speaker explains their definition out loud to the group.
5. Guessers **vote** on which Speaker they think told the truth.
6. Points are awarded: Guessers score for spotting the truth; Bluffers score for every vote they steal.
7. Teams swap roles each round. After all rounds the highest score wins!

## Features

- Real-time multiplayer via Firebase
- Configurable rounds (1–10) and think time (5–60 s) set by the host
- Mobile-friendly
- Join via room code or direct link (e.g. `https://jovial-jellyfish.github.io/lexbluff/room/ABC123`)

## Tech Stack

- React 18
- Firebase Firestore (real-time game state)
- Framer Motion (animations)
- Hosted on GitHub Pages

---

Created by **Doris Li** · 2026
