import { useState } from 'react'
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import './App.css'
import teamData from './CollegeBasketballTeams.json'

interface Team {
  tid: number
  school: string
  name: string
  city: string
  state: string
  latitude: number
  longitude: number
}

interface TeamCardProps {
  school: string
  mascot: string
  city: string
  state: string
}

interface TeamMapProps {
  teams: Team[]
  apiKey: string
}

function Header() {
  return (
    <header className="header">
      <h1>NCAA Basketball Team Directory</h1>
      <p>Browse all NCAA college basketball teams</p>
    </header>
  )
}

function TeamCard({ school, mascot, city, state }: TeamCardProps) {
  return (
    <div className="team-card">
      <h2>{school}</h2>
      <p className="mascot">{mascot}</p>
      <p className="location">{city}, {state}</p>
    </div>
  )
}

function TeamList({ teams }: { teams: Team[] }) {
  return (
    <div className="team-list">
      {teams.map((team) => (
        <TeamCard
          key={team.tid}
          school={team.school}
          mascot={team.name}
          city={team.city}
          state={team.state}
        />
      ))}
    </div>
  )
}

function TeamMap({ teams, apiKey }: TeamMapProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const centerUS = { lat: 39.8283, lng: -98.5795 }

  return (
    <div className="map-container">
      <h2>Team Locations</h2>
      <APIProvider apiKey={apiKey}>
        <Map
          className="team-map"
          defaultCenter={centerUS}
          defaultZoom={4}
          mapId="ncaa-teams-map"
          gestureHandling="greedy"
        >
          {teams.map((team) => (
            <AdvancedMarker
              key={team.tid}
              position={{ lat: team.latitude, lng: team.longitude }}
              onClick={() => setSelectedTeam(team)}
            />
          ))}
          {selectedTeam && (
            <InfoWindow
              position={{ lat: selectedTeam.latitude, lng: selectedTeam.longitude }}
              onCloseClick={() => setSelectedTeam(null)}
            >
              <div className="info-window">
                <h3>{selectedTeam.school}</h3>
                <p>{selectedTeam.name}</p>
                <p>{selectedTeam.city}, {selectedTeam.state}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  )
}

function App() {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

  return (
    <>
      <Header />
      {GOOGLE_MAPS_API_KEY ? (
        <TeamMap teams={teamData.teams as Team[]} apiKey={GOOGLE_MAPS_API_KEY} />
      ) : (
        <div className="api-key-warning">
          <p>To view the interactive map, add your Google Maps API key to a <code>.env</code> file:</p>
          <code>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</code>
        </div>
      )}
      <TeamList teams={teamData.teams as Team[]} />
    </>
  )
}

export default App
