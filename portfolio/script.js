// Scroll-triggered fade-in animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

// Music Player
const playlist = [
    {
        title: "GO!",
        artist: "Common",
        src: "assets/songs/Go!/GO!.mp3", 
        cover: "assets/songs/Go!/Common_-_Be.png" 
    },
    {
        title: "Meet Me Halfway",
        artist: "Black Eyed Peas",
        src: "assets/songs/Meet-Me-Halfway/Black Eyed Peas - Meet Me Halfway (Official Music) HQ.mp3",
        cover: "assets/songs/Meet-Me-Halfway/The_E.N.D._cover.png"
    },
    {
        title: "Fine$t",
        artist: "Robb Bank$",
        src: "assets/songs/Fine$t/Robb Bank$- Fine$t (2012).mp3",
        cover: "assets/songs/Fine$t/Calendars Robbbanks.jpg"    
    },
    {
        title: "3005",
        artist: "Childish Gambino",
        src: "assets/songs/3005/Childish Gambino - 3005.mp3 ",
        cover: "assets/songs/3005/Childish-gambino-because-the-internet.png"
    },
];

const audio = document.getElementById('audio');
const trackList = document.getElementById('track-list');
const currentSongImg = document.getElementById('album-cover');
const musicPlayer = document.getElementById('music-player');

let currentSongIndex = 0;
let isShuffled = false;
let originalPlaylist = [...playlist];
let visibleTracks = []; // Will hold indices of visible tracks

// Populate playlist
function loadPlaylist() {
    trackList.innerHTML = '';
    visibleTracks.forEach((playlistIndex, visibleIndex) => {
        const song = playlist[playlistIndex];
        const track = document.createElement('div');
        track.className = 'track';
        track.innerHTML = `
            <div class="thumb">
                <img src="${song.cover}" alt="${song.title} cover">
                <div class="play-icon">
                    <svg viewBox="0 0 8 12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 6L0 0V12L8 6Z" fill="white"/>
                    </svg>
                </div>
            </div>
            <div class="song-details">
                <h5>${song.title}</h5>
                <p>${song.artist}</p>
            </div>
        `;
        track.addEventListener('click', (event) => {
            event.stopPropagation();
            playSong(playlistIndex);
        });
        trackList.appendChild(track);
    });
}

// Shuffle function (hidden, but keep for future)
function shufflePlaylist() {
    if (isShuffled) {
        playlist = [...originalPlaylist];
        isShuffled = false;
    } else {
        playlist = [...originalPlaylist].sort(() => Math.random() - 0.5);
        isShuffled = true;
    }
    // Reset visible tracks to first 3
    visibleTracks = [0, 1, 2];
    // Re-populate the list
    loadPlaylist();
}

function setSong(index) {
    currentSongIndex = index;
    const song = playlist[index];
    audio.src = song.src;
    currentSongImg.src = song.cover;
    currentSongImg.alt = `${song.title} cover`;
}

// Play song
function playSong(index) {
    setSong(index);
    audio.play();
}

// Toggle play/pause
function togglePlayPause() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

// Play next song
function playNext() {
    let nextIndex;
    if (isShuffled) {
        nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
        nextIndex = (currentSongIndex + 1) % playlist.length;
    }
    playSong(nextIndex);
    // Update visible tracks: shift out the first, add next to end
    const lastVisible = visibleTracks[visibleTracks.length - 1];
    visibleTracks.shift();
    visibleTracks.push((lastVisible + 1) % playlist.length);
    loadPlaylist();
}

// Event listeners
musicPlayer.addEventListener('click', togglePlayPause);
audio.addEventListener('ended', playNext);

// Load playlist on page load
document.addEventListener('DOMContentLoaded', () => {
    const initialIndex = Math.floor(Math.random() * playlist.length);
    visibleTracks = [
        initialIndex,
        (initialIndex + 1) % playlist.length,
        (initialIndex + 2) % playlist.length
    ];
    loadPlaylist();
    setSong(initialIndex); // Show random song and cover without autoplay
});
