
import { useState } from 'react'
import { calculateChemistry } from './chemistry'
import './App.css'

function shufflePlayers(players) {
  const shuffled = [...players];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

const API_BASE_URL = 'http://localhost:8080/api'

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

function normalizeCard(card) {
  return {
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
  }
}

function App() {
  const [squad, setSquad] = useState({})
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [players, setPlayers] = useState([])
  const [choicesBySlot, setChoicesBySlot] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

const chemistryByPlayer = calculateChemistry(squad)

const squadChemistry = Object.values(chemistryByPlayer).reduce(
  (total, chemistry) => total + chemistry,
  0,
)



async function openPosition(slot) {
  // Filled positions cannot be reopened.
  if (squad[slot]) return

  setSelectedSlot(slot)
  setPlayers([])
  setError('')
  setLoading(true)

  // Reuse the original choices when reopening a position.
  if (choicesBySlot[slot]) {
    const pickedIds = Object.values(squad).map((player) => player.id)

    const remainingChoices = choicesBySlot[slot].filter(
      (player) => !pickedIds.includes(player.id),
    )

    setPlayers(remainingChoices)
    setLoading(false)
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/player-cards`)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    // Exclude players already selected in other positions.
    const pickedIds = Object.values(squad).map((player) => player.id)
    const eligiblePositions = positionGroups[slot] || []

    const eligibleCards = data.filter((card) => {
      if (!card.player) return false

      const position = card.position?.toUpperCase()
      const isEligible = eligiblePositions.includes(position)
      const isAlreadyPicked = pickedIds.includes(card.player.id)

      return isEligible && !isAlreadyPicked
    })

    const availablePlayers = eligibleCards.map(normalizeCard)
    const choices = shufflePlayers(availablePlayers).slice(0, 5)

    setChoicesBySlot((current) => ({
      ...current,
      [slot]: choices,
    }))

    setPlayers(choices)
  } catch (err) {
    setError(err.message || 'Could not load players.')
  } finally {
    setLoading(false)
  }
}

  function selectPlayer(player) {
    if (!selectedSlot) return
    if(squad[selectedSlot]) return

    setSquad((current) => ({
      ...current,
      [selectedSlot]: player,
    }))

    setSelectedSlot(null)
    setPlayers([])
    setError('')
  }

  function cancelSelection() {
    setSelectedSlot(null)
    setPlayers([])
    setError('')
  }

  const selectedCount = Object.keys(squad).length
  const selectedPosition = formation.find(
    (slot) => slot.id === selectedSlot
  )

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">ULTIMATE TEAM • DRAFT MODE</p>
        <h1>
          FUT <span>Draft</span>
        </h1>
        <p className="subtitle">
          Build your squad. Pick your starting eleven.
        </p>
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
                  className={`position-slot ${
                    selectedSlot === slot.id ? 'selected' : ''
                  } ${player ? 'filled' : ''}`}
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                  }}
                  onClick={() => {
                    if (!player) openPosition(slot.id)
                    }}
                  aria-label={`${
                    player?.name || 'Choose player for'
                  } ${slot.label}`}
                >
                  <span className="slot-plus">
                    {player
                      ? player.overall
                      : selectedSlot === slot.id
                        ? '✓'
                        : '+'}
                  </span>
                  <span className="slot-position">
                    {player ? player.name : slot.label}
                  </span>

                  {player && (
                    <span className="slot-chemistry">
                      CHEM {chemistryByPlayer[player.cardId ?? player.id] ?? 0}/3
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <aside className="draft-sidebar">
          <p className="eyebrow">DRAFT PROGRESS</p>
          <h2>Build your XI</h2>
          <p className="sidebar-description">
            Select a position on the pitch, then choose a player for your
            squad.
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

          <div className="chemistry-summary">
            <span>Squad chemistry</span>
            <strong>{squadChemistry} / 33</strong>
          </div>

          <div className="selection-panel">
            {!selectedSlot ? (
              <>
                <span className="selection-label">READY WHEN YOU ARE</span>
                <h3>Choose a position</h3>
                <p>
                  Click any slot on the pitch to see available players.
                </p>
              </>
            ) : (
              <>
                <span className="selection-label">PLAYER SELECTION</span>
                <h3>Choose your {selectedPosition?.label}</h3>

                {loading && <p>Loading available players...</p>}

                {error && (
                  <p className="selection-error">{error}</p>
                )}

                {!loading && !error && players.length === 0 && (
                  <p>
                    No available players. Add more players to your database
                    to continue.
                  </p>
                )}

                <div className="choice-list">
                  {players.map((player) => (
                    <button
                      className={`player-choice ${
                        player.cardVersion ? 'fut-card special-card' : ''
                      }`}
                      key={player.cardId || player.id}
                      onClick={() => selectPlayer(player)}
                    >
                      <div className="fut-card-top">
                        <div className="fut-card-rating">
                          <strong>{player.overall}</strong>
                          <span>{player.position}</span>
                        </div>

                        <div className="fut-card-identity">
                          <strong>{player.name}</strong>
                          <span>
                            {player.gameEdition || player.club}
                          </span>
                          <span className="fut-card-version">
                            {player.cardVersion || player.club}
                          </span>
                        </div>

                        <span className="choice-arrow">+</span>
                      </div>

                      <div className="fut-card-stats">
                        {[
                          ['PAC', player.pace],
                          ['SHO', player.shooting],
                          ['PAS', player.passing],
                          ['DRI', player.dribbling],
                          ['DEF', player.defending],
                          ['PHY', player.physical],
                        ].map(([label, value]) => (
                          <div className="fut-stat" key={label}>
                            <strong>{value ?? '-'}</strong>
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  className="secondary-button"
                  onClick={cancelSelection}
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
