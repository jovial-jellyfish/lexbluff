// src/components/phases/WritingPhase.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TEAMS } from "../../utils/gameLogic";

export default function WritingPhase({
  gameState, playerId, playerName, isHost, myTeam,
  isTruthSpeaker, myDefinition, onSubmitDefinition, onStartExplaining, onStartRound
}) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // If phase is round_start, start the round
  const needsStart = gameState.phase === "round_start";

  const speakerCount = gameState.players?.filter(p => gameState.teams?.[p.id] === TEAMS.SPEAKERS).length || 0;
  const submittedCount = gameState.definitions?.length || 0;
  const allSubmitted = submittedCount >= speakerCount;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await onSubmitDefinition(text.trim());
    setSubmitted(true);
  };

  if (needsStart) {
    return (
      <div className="phase writing-phase">
        <div className="phase-card">
          <h1 className="phase-title">Round {gameState.round}</h1>
          {isHost ? (
            <>
              <p className="phase-sub">Ready to reveal the word?</p>
              <button className="btn btn-primary btn-lg" onClick={onStartRound}>
                Reveal Word →
              </button>
            </>
          ) : (
            <p className="waiting-note">⏳ Host is starting the next round...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="phase writing-phase">
      <div className="phase-card">
        <div className="word-reveal">
          <p className="word-label">The Word Is</p>
          <motion.h1
            className="the-word"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {gameState.currentWord?.word}
          </motion.h1>
        </div>

        {myTeam === TEAMS.GUESSERS ? (
          <div className="guesser-wait">
            <div className="big-icon">🔍</div>
            <h2>You're a Guesser!</h2>
            <p>Speakers are crafting their definitions. Prepare to detect the truth...</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(submittedCount / speakerCount) * 100}%` }} />
            </div>
            <p className="progress-label">{submittedCount}/{speakerCount} speakers ready</p>
          </div>
        ) : isTruthSpeaker ? (
          <div className="speaker-true">
            <div className="truth-badge">✨ You Know the Truth</div>
            <div className="true-definition">
              <p className="def-label">Real Definition:</p>
              <p className="def-text">"{gameState.currentWord?.definition}"</p>
            </div>
            {!submitted && !myDefinition ? (
              <>
                <p className="instruction">Write it in your own words to make it sound natural:</p>
                <textarea
                  className="def-input"
                  placeholder="Rephrase the real definition..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={3}
                />
                <button className="btn btn-primary" onClick={handleSubmit} disabled={!text.trim()}>
                  Submit Definition ✓
                </button>
              </>
            ) : (
              <div className="submitted-confirmation">
                <p>✅ Submitted! Waiting for other speakers...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="speaker-bluff">
            <div className="bluff-badge">🎭 Bluffer Mode</div>
            <p className="instruction">Invent a convincing fake definition for <strong>{gameState.currentWord?.word}</strong></p>
            {!submitted && !myDefinition ? (
              <>
                <textarea
                  className="def-input"
                  placeholder="Make it sound real..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={3}
                />
                <button className="btn btn-primary" onClick={handleSubmit} disabled={!text.trim()}>
                  Submit Bluff ✓
                </button>
              </>
            ) : (
              <div className="submitted-confirmation">
                <p>✅ Bluff submitted! Waiting for others...</p>
                <p className="your-def">Your definition: "<em>{myDefinition?.text || text}</em>"</p>
              </div>
            )}
          </div>
        )}

        {isHost && allSubmitted && myTeam !== TEAMS.GUESSERS && (
          <button className="btn btn-primary btn-lg mt" onClick={onStartExplaining}>
            Start Explanations →
          </button>
        )}
        {isHost && allSubmitted && myTeam === TEAMS.GUESSERS && (
          <button className="btn btn-primary btn-lg mt" onClick={onStartExplaining}>
            Start Explanations →
          </button>
        )}
      </div>
    </div>
  );
}
