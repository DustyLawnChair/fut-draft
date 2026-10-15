
import { useState } from 'react'
import './App.css'

const formation = [
  { id: 'ST', label: 'ST', x: 50, y: 12 },
  { id: 'LW', label: 'LW', x: 20, y: 25 },
  { id: 'RW', label: 'RW', x: 80, y: 25 },
  { id: 'CAM', label: 'CAM', x: 50, y: 35 },
  { id: 'CM-L', label: 'CM', x: 32, y: 49 },
  { id: 'CM-R', label: 'CM', x: 68, y: 49 },
  { id: 'LB', label: 'LB', x: 12, y: 68 },
  { id: 'CB-L', label: 'CB', x: 38, y: 72 },
  { id: 'CB-R', label: 'CB', x: 62, y: 72 },
  { id: 'RB', label: 'RB', x: 88, y: 68 },
  { id: 'GK', label: 'GK', x: 50, y: 89 },
]

function App() {
  const [squad, setSquad] = useState({})
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function openPosition(slot) {
    setSelectedSlot(slot)
    setPlayers([])
    setError('')
    setLoading(true)

    try {
      const isCam = slot === 'CAM'

    const response = await fetch(
      isCam
        ? 'http://localhost:8080/api/player-cards?position=CAM'
        : 'http://localhost:8080/api/players'
    )



const data = await response.json()

const pickedIds = Object.values(squad).map((player) => player.id)

const positionGroups = {
  ST: ['ST', 'CF'],
  LW: ['LW', 'LM', 'LF'],
  RW: ['RW', 'RM', 'RF'],
  CAM: ['CAM', 'CF'],
  'CM-L': ['CM', 'CDM', 'CAM'],
  'CM-R': ['CM', 'CDM', 'CAM'],
  LB: ['LB', 'LWB'],
  'CB-L': ['CB'],
  'CB-R': ['CB'],
  RB: ['RB', 'RWB'],
  GK: ['GK'],
}

const eligiblePositions = positionGroups[slot] || []

const availablePlayers = isCam
  ? data
      .filter((card) =>
        !pickedIds.includes(card.player.id) ||
        card.player.id === squad[slot]?.id
      )
      .map((card) => ({
        id: card.player.id,
        cardId: card.id,
        name: card.player.name,
        nation: card.player.nation,
        club: card.player.club,
        league: card.player.league,
        position: card.position,
        overall: card.overall,
        pace: card.pace,
        shooting: card.shooting,
        passing: card.passing,
        dribbling: card.dribbling,
        defending: card.defending,
        physical: card.physical,
        gameEdition: card.gameEdition,
        cardVersion: card.cardVersion,
        cardImageUrl: card.cardImageUrl,
      }))
  : data.filter(
      (player) =>
        eligiblePositions.includes(player.position.toUpperCase()) &&
        (!pickedIds.includes(player.id) ||
          player.id === squad[slot]?.id)
    )

  setPlayers(availablePlayers)
    } catch (err) {
      setError(err.message || 'Could not load players.')
    } finally {
      setLoading(false)
    }
  }

  function selectPlayer(player) {
    if (!selectedSlot) return

    setSquad((current) => ({
      ...current,
      [selectedSlot]: player,
    }))

    setSelectedSlot(null)
    setPlayers([])
    setError('')
  }

  const selectedCount = Object.keys(squad).length

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">ULTIMATE TEAM • DRAFT MODE</p>
        <h1>FUT <span>Draft</span></h1>
        <p className="subtitle">Build your squad. Pick your starting eleven.</p>
      </header>

      <section className="draft-layout">
        <div className="pitch-panel">
          <div className="pitch-heading">
            <div>
              <p className="eyebrow">YOUR SQUAD</p>
              <h2>Starting XI</h2>
            </div>
            <span className="formation-label">4-2-3-1</span>
          </div>

          <div className="pitch">
            <div className="pitch-lines">
              <div className="halfway-line" />
              <div className="center-circle" />
              <div className="penalty-box penalty-top" />
              <div className="goal-box goal-top" />
              <div className="penalty-box penalty-bottom" />
              <div className="goal-box goal-bottom" />
            </div>

            {formation.map((slot) => {
              const player = squad[slot.id]

              return (
                <button
                  key={slot.id}
                  className={`position-slot ${selectedSlot === slot.id ? 'selected' : ''} ${player ? 'filled' : ''}`}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  onClick={() => openPosition(slot.id)}
                  aria-label={`${player?.name || 'Choose player for'} ${slot.label}`}
                >
                  <span className="slot-plus">
                    {player ? player.overall : selectedSlot === slot.id ? '✓' : '+'}
                  </span>
                  <span className="slot-position">
                    {player ? player.name : slot.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <aside className="draft-sidebar">
          <p className="eyebrow">DRAFT PROGRESS</p>
          <h2>Build your XI</h2>
          <p className="sidebar-description">
            Select a position on the pitch, then choose a player for your squad.
          </p>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${(selectedCount / 11) * 100}%` }}
            />
          </div>
          <div className="progress-label">
            <span>Players selected</span>
            <strong>{selectedCount} / 11</strong>
          </div>

          <div className="selection-panel">
            {!selectedSlot ? (
              <>
                <span className="selection-label">READY WHEN YOU ARE</span>
                <h3>Choose a position</h3>
                <p>Click any slot on the pitch to see available players.</p>
              </>
            ) : (
              <>
                <span className="selection-label">PLAYER SELECTION</span>
                <h3>Choose your {formation.find((slot) => slot.id === selectedSlot)?.label}</h3>

                {loading && <p>Loading available players...</p>}

                {error && <p className="selection-error">{error}</p>}

                {!loading && !error && players.length === 0 && (
                  <p>No available players. Add more players to your database to continue.</p>
                )}

                <div className="choice-list">
                  {players.map((player) => (
                    <button
                      className="player-choice"
                      key={player.id}
                      onClick={() => selectPlayer(player)}
                    >
                      <span className="choice-rating">{player.overall}</span>
                      <span className="choice-info">
                        <strong>{player.name}</strong>
                          <small>
                            {player.position} · {player.club}
                            {player.gameEdition && ` · ${player.gameEdition}`}
                          </small>

                          {player.cardVersion && (
                            <small className="card-version">{player.cardVersion}</small>
                          )}                      
                        </span>
                      <span className="choice-arrow">+</span>
                    </button>
                  ))}
                </div>

                <button
                  className="secondary-button"
                  onClick={() => setSelectedSlot(null)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
