
const player = document.querySelector('.player_body')
const playerImg = player.querySelector('.player_image img')
const playerSongName = player.querySelector('#song_name')
const playerArtistName = player.querySelector('#artist_name')
const playerPlay = player.querySelector('.control .middle')
const playerPrev = player.querySelector('.control .left')
const playerNext = player.querySelector('.control .right')
const audio = player.querySelector('.audio')
const progressBar = player.querySelector('.progress_bar')
const progress = player.querySelector('.progress')


// Имя песни
const songs = ['Sam', 'Chimerical', 'LIKE A (SLOWED)']
// Имя исполнителя
const artists = ['Hensonn', 'VHS Logos', 'requi3m']


let songIndex = 0

function loadSong(song, artist) {
  playerSongName.innerHTML = song
  playerArtistName.innerHTML = artist
  audio.src = `audio/${song}.mp3`
  playerImg.src = `images/${songIndex + 1}.jpg`
}
loadSong(songs[songIndex], artists[songIndex])
function playSong() {
  playerPlay.innerHTML = `<button><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/></svg></button>`
  audio.play()
}
function pauseSong() {
  playerPlay.innerHTML = `<button><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg></button>`
  audio.pause()
}
playerPlay.addEventListener('click', function () {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});
function nextSong() {
  songIndex++
  if (songIndex > songs.length - 1) {
    songIndex = 0
  }
  loadSong(songs[songIndex], artists[songIndex])
  playSong();
}
playerNext.addEventListener('click', nextSong)
function prevSong() {
  songIndex--
  if (songIndex < 0) {
    songIndex = songs.length - 1
  }
  loadSong(songs[songIndex], artists[songIndex])
  playSong();
}
playerPrev.addEventListener('click', prevSong)
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement
  const progressPercent = (currentTime / duration) * 100
  progress.style.width = `${progressPercent}%`

}
audio.addEventListener('timeupdate', updateProgress)
function setProgress(e) {
  const width = this.clientWidth
  const clickX = e.offsetX
  const duration = audio.duration
  audio.currentTime = (clickX / width) * duration
}
progressBar.addEventListener('click', setProgress)


let audioContext;
let analyser;
let source;

window.addEventListener('DOMContentLoaded', () => {
  initializeAudio();
});

function initializeAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // Ensure the audio context is resumed after user interaction
  document.addEventListener('click', () => {
    if (audioContext.state !== 'running') {
      audioContext.resume();
    }
  });

  startVisualizer();
}

function startVisualizer() {
  const visualizer = document.getElementById('visualizer');
  const visualCtx = visualizer.getContext('2d');
  function resizeCanvas() {
    visualizer.width = window.innerWidth;
    visualizer.height = window.innerHeight;
  }

  window.addEventListener('load', resizeCanvas);
  window.addEventListener('resize', resizeCanvas);
  function drawVisualizer() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);

    visualCtx.clearRect(0, 0, visualizer.width, visualizer.height);

    const barWidth = (visualizer.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      visualCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
      visualCtx.fillRect(x, visualizer.height - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
    }

    requestAnimationFrame(drawVisualizer);
  }

  drawVisualizer();
}
