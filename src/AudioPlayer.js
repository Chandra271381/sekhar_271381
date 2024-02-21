import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedTrackIndex = localStorage.getItem('lastTrackIndex');
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];

    if (savedTrackIndex !== null && savedPlaylist.length > 0) {
      setCurrentTrackIndex(parseInt(savedTrackIndex, 10));
      setPlaylist(savedPlaylist);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lastTrackIndex', currentTrackIndex);
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [currentTrackIndex, playlist]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newPlaylist = [...playlist, ...files];
      setPlaylist(newPlaylist);
    }
  };

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handleAudioEnded = () => {
    playNextTrack();
  };

  const handleNextButtonClick = () => {
    playNextTrack();
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentTrackIndex, playlist]);

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <audio ref={audioRef} controls onEnded={handleAudioEnded}>
        <source src={playlist[currentTrackIndex] && URL.createObjectURL(playlist[currentTrackIndex])} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <h2>Playlist</h2>
      <ul>
        {playlist.map((track, index) => (
          <li key={index}>{track.name}</li>
        ))}
      </ul>
      <button onClick={handleNextButtonClick}>Next Track</button>
    </div>
  );
};

export default AudioPlayer;


