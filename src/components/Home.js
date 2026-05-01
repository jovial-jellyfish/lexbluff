// src/components/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../hooks/useGame";

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState(null); // "create" | "join"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const gameHook = useGame(null, null, null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { roomId, playerId } = await gameHook.createRoom(name.trim());
      const session = { roomId, playerId, playerName: name.trim() };
      sessionStorage.setItem(`lexbluff_${roomId}`, JSON.stringify(session));
      navigate(`/room/${roomId}`);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!name.trim() || !joinCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { roomId, playerId } = await gameHook.joinRoom(joinCode.trim(), name.trim());
      const session = { roomId, playerId, playerName: name.trim() };
      sessionStorage.setItem(`lexbluff_${roomId}`, JSON.stringify(session));
      navigate(`/room/${roomId}`);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="home">
      <div className="home-bg">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`bg-letter bg-letter-${i}`}>
            {["L","E","X","B","L","U","F","F","?","!","~","*"][i]}
          </div>
        ))}
      </div>

      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="logo">
          <span className="logo-lex">LEX</span>
          <span className="logo-bluff">BLUFF</span>
        </div>
        <p className="tagline">Bluff your way to brilliance.</p>
        <p className="subtitle">
          One player knows the truth. Everyone else lies. Can your team spot the difference?
        </p>

        <AnimatePresence mode="wait">
          {!mode && (
            <motion.div
              key="buttons"
              className="home-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button className="btn btn-primary btn-lg" onClick={() => setMode("create")}>
                Create Room
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => setMode("join")}>
                Join Room
              </button>
            </motion.div>
          )}

          {mode && (
            <motion.div
              key="form"
              className="home-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <input
                className="input"
                placeholder="Your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              {mode === "join" && (
                <input
                  className="input"
                  placeholder="Room code..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}
                />
              )}
              {error && <p className="error">{error}</p>}
              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  onClick={mode === "create" ? handleCreate : handleJoin}
                  disabled={loading}
                >
                  {loading ? "Loading..." : mode === "create" ? "Create Game →" : "Join Game →"}
                </button>
                <button className="btn btn-ghost" onClick={() => { setMode(null); setError(""); }}>
                  ← Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="how-to-play">
          <h3>How to Play</h3>
          <div className="steps">
            <div className="step"><span className="step-num">1</span><span>One Speaker knows the real definition</span></div>
            <div className="step"><span className="step-num">2</span><span>Others invent convincing fake ones</span></div>
            <div className="step"><span className="step-num">3</span><span>Guessers vote on who told the truth</span></div>
            <div className="step"><span className="step-num">4</span><span>Fool them or find them — points await!</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
