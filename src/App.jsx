import { useState } from 'react'
import ParticlesBackground from './components/ParticlesBackground'
import RocketModel from './components/RocketModel'
import SolarSystem from './components/SolarSystem'
import SpaceGame from './components/SpaceGame'
import CometCursor from './components/CometCursor'
import './App.css'

function App() {
  const [showGame, setShowGame] = useState(false)

  if (showGame) {
    return (
      <>
        <CometCursor />
        <SpaceGame onBack={() => setShowGame(false)} />
      </>
    )
  }

  return (
    <div className="app">
      <CometCursor />
      <ParticlesBackground />
      <RocketModel />
      <SolarSystem onStartGame={() => setShowGame(true)} />
    </div>
  )
}

export default App
