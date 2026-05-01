// src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./hooks/useGame";
import Home from "./components/Home";
import GameRoom from "./components/GameRoom";
import "./styles/global.css";

function RoomWrapper() {
  const { roomId } = useParams();
  const [session, setSession] = useState(() => {
    try {
      const stored = sessionStorage.getItem(`lexbluff_${roomId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const gameHook = useGame(
    session?.roomId,
    session?.playerId,
    session?.playerName
  );

  if (!session) {
    return <JoinPrompt roomId={roomId} onJoin={(s) => setSession(s)} gameHook={gameHook} />;
  }

  return <GameRoom session={session} gameHook={gameHook} />;
}

function JoinPrompt({ roomId, onJoin, gameHook }) {
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [err, setErr] = useState("");

  const handleJoin = async () => {
    if (!name.trim()) return;
    setJoining(true);
    try {
      const { roomId: rid, playerId } = await gameHook.joinRoom(roomId, name.trim());
      const session = { roomId: rid, playerId, playerName: name.trim() };
      sessionStorage.setItem(`lexbluff_${roomId}`, JSON.stringify(session));
      onJoin(session);
    } catch (e) {
      setErr(e.message);
    }
    setJoining(false);
  };

  return (
    <div className="join-prompt">
      <div className="join-card">
        <div className="join-logo">LEX<span>BLUFF</span></div>
        <p className="join-room-code">Room: <strong>{roomId}</strong></p>
        <input
          className="input"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          autoFocus
        />
        {err && <p className="error">{err}</p>}
        <button className="btn btn-primary" onClick={handleJoin} disabled={joining || !name.trim()}>
          {joining ? "Joining..." : "Join Game →"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<RoomWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
