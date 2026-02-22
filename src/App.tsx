import './App.css'

const steps = [
  'Choose a difficulty',
  'Reload until you like the challenge',
  'Set your timer',
  'Hit play and sketch fast',
]

const perks = [
  'Sharper design thinking',
  'Faster visual decisions',
  'Stronger whiteboard confidence',
  'Better interview storytelling',
]

function App() {
  return (
    <main className="page">
      <section className="phone-shell">
        <p className="eyebrow">DESIGNERCIZE-STYLE</p>
        <h1>Designer, challenge thyself.</h1>
        <p className="lede">
          A random prompt generator for quick whiteboard reps. Built for an iPhone-sized flow.
        </p>

        <div className="card">
          <h2>How it works</h2>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="card controls">
          <h2>Start a round</h2>
          <div className="pill-row" aria-label="Difficulty options">
            <button type="button">Easy</button>
            <button type="button">Medium</button>
            <button type="button">Hard</button>
          </div>
          <div className="timer">15:00</div>
          <button type="button" className="primary">
            Reload Challenge
          </button>
        </div>

        <div className="prompt card" role="status" aria-live="polite">
          <p className="label">Design:</p>
          <p className="value">A one-tap mood playlist starter</p>
          <p className="label">For:</p>
          <p className="value">Night-shift nurses</p>
          <p className="label">To help:</p>
          <p className="value">Reset stress in under 3 minutes</p>
        </div>

        <div className="card">
          <h2>15 minutes a day gives you:</h2>
          <ul>
            {perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </div>

        <a className="footer-link" href="#" onClick={(event) => event.preventDefault()}>
          Get weekly prompt packs
        </a>
take      </section>
    </main>
  )
}

export default App
