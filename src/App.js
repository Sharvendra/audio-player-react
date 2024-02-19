import React, { useState, useEffect } from 'react';

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    // Load playlist from localStorage on component mount
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    if (storedPlaylist) {
      setPlaylist(storedPlaylist);
    }
    
    // Load last playing track index from localStorage
    const lastTrackIndex = parseInt(localStorage.getItem('currentTrackIndex'));
    if (!isNaN(lastTrackIndex)) {
      setCurrentTrackIndex(lastTrackIndex);
    }
  }, []);

  useEffect(() => {
    // Update localStorage when playlist changes
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    // Update localStorage when current track index changes
    localStorage.setItem('currentTrackIndex', currentTrackIndex);
  }, [currentTrackIndex]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newPlaylist = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));

    setPlaylist([...playlist, ...newPlaylist]);
  };

  const handlePlay = (index) => {
    setCurrentTrackIndex(index);
  };

  const handleEnded = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  return (
    <div className="App">
      <h1>Audio Player</h1>
      <input type="file" accept="audio/*" multiple onChange={handleFileChange} />
      <div>
        <h2>Playlist</h2>
        <ul>
          {playlist.map((track, index) => (
            <li key={index}>
              <button onClick={() => handlePlay(index)}>
                {track.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Now Playing</h2>
        {playlist.length > 0 && (
          <audio
            controls
            src={playlist[currentTrackIndex].url}
            onEnded={handleEnded}
            autoPlay
          >
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}

export default App;
