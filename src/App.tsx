import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { GameLogic } from './game_logic'
import { World } from './world'

const SECTIONS = [
  { id: 'solar', name: 'Solar', colorName: 'Yellow' },
  { id: 'wind', name: 'Wind', colorName: 'Blue' },
  { id: 'gas', name: 'Gas', colorName: 'Orange' },
  { id: 'battery', name: 'Battery', colorName: 'Green' },
]

function App() {
  const [allocations, setAllocations] = useState<Record<string, number>>({
    solar: 62,
    wind: 44,
    gas: 38,
    battery: 72,
  })
  const [outputs, setOutputs] = useState<Record<string, number>>({
    solar: 0,
    wind: 0,
    gas: 0,
    battery: 0,
  })
  const [batteryUsage, setBatteryUsage] = useState(15)
  const game = useMemo(() => new GameLogic(new World()), [])

  useEffect(() => {
    const nextOutputs: Record<string, number> = { ...outputs }
    SECTIONS.forEach((section) => {
      const maxMw = game.getPowerSourceMaxCapacity(section.id)
      const allocationMw = (allocations[section.id] / 100) * maxMw
      game.setPowerSourceAllocation(section.id, allocationMw)
      nextOutputs[section.id] = game.getPowerSourceProduced(section.id)
    })
    setOutputs(nextOutputs)
  }, [allocations, game])
  const usageValue = batteryUsage >= 0 ? `+${batteryUsage}%` : `${batteryUsage}%`
  const usageAbs = Math.min(Math.abs(batteryUsage), 100)
  const usagePosition = (batteryUsage + 100) / 2

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">Power Grid Console</p>
        <h1>Output vs Allocation</h1>
        <p className="subtitle">
          Four dark sections with output and allocation columns.
        </p>
      </header>

      <div className="panel-grid">
        {SECTIONS.map((section) => (
          <section key={section.id} className={`panel theme-${section.id}`}>
            <div className="panel-title">
              <h2>{section.name}</h2>
              <span className="panel-pill">
                {section.colorName} - {section.name}
              </span>
            </div>

            <div className="panel-columns">
              {section.id === 'battery' ? (
                <>
                  <div className="panel-column">
                    <h3>Capacity</h3>
                    <div className="bar-group">
                      <div className="bar-track" aria-hidden="true">
                        <div
                          className="bar-fill"
                          style={{ height: `${allocations[section.id]}%` }}
                        />
                      </div>
                      <div className="metric-value">
                        {allocations[section.id]}%
                      </div>
                      <div className="metric-subtext">
                        {Math.round(
                          (allocations[section.id] / 100) *
                            game.getPowerSourceMaxCapacity(section.id),
                        )}{' '}
                        MW
                      </div>
                    </div>
                  </div>
                  <div className="panel-column">
                    <h3>Battery Usage</h3>
                    <div className="usage-column">
                      <div className="usage-track" aria-hidden="true">
                        <div className="usage-center" />
                        <div
                          className={`usage-fill ${batteryUsage >= 0 ? 'usage-positive' : 'usage-negative'}`}
                          style={{ '--usage': `${usageAbs}` } as React.CSSProperties}
                        />
                      </div>
                      <span className="usage-value">{usageValue}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="panel-column">
                    <h3>Output</h3>
                    <div className="bar-group">
                      <div className="bar-track" aria-hidden="true">
                        <div
                          className="bar-fill"
                          style={{
                            height: `${(outputs[section.id] / game.getPowerSourceMaxCapacity(section.id)) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="metric-value">
                        {Math.round(
                          (outputs[section.id] / game.getPowerSourceMaxCapacity(section.id)) * 100,
                        )}%
                      </div>
                      <div className="metric-subtext">
                        {Math.round(outputs[section.id])} MW
                      </div>
                    </div>
                  </div>
                  <div className="panel-column">
                    <h3>Allocation</h3>
                    <label className="allocation-control">
                      <div className="slider-vertical">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={allocations[section.id]}
                          onChange={(event) =>
                            setAllocations((prev) => ({
                              ...prev,
                              [section.id]: Number(event.target.value),
                            }))
                          }
                          style={{ '--value': `${allocations[section.id]}%` } as React.CSSProperties}
                          aria-label={`${section.name} allocation`}
                        />
                      </div>
                      <span className="metric-value">
                        {allocations[section.id]}%
                      </span>
                      <span className="metric-subtext">
                        {Math.round(
                          (allocations[section.id] / 100) *
                            game.getPowerSourceMaxCapacity(section.id),
                        )}{' '}
                        MW
                      </span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </section>
        ))}
      </div>

      <section className="panel theme-battery">
        <div className="panel-title">
          <h2>Battery Control</h2>
          <span className="panel-pill">Temporary Usage</span>
        </div>

        <div className="panel-columns single-column">
          <div className="panel-column">
            <h3>Battery Usage</h3>
            <label className="allocation-control">
              <div className="slider-vertical slider-usage">
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={batteryUsage}
                  onChange={(event) => setBatteryUsage(Number(event.target.value))}
                  style={
                    {
                      '--value': `${usagePosition}%`,
                    } as React.CSSProperties
                  }
                  aria-label="Temporary battery usage"
                />
              </div>
              <span className="usage-value">{usageValue}</span>
            </label>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
