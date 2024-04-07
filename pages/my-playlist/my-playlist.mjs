import { Song } from "../../classes/song-class.mjs";
import { Login } from "../../classes/login-class.mjs";
import { fetchAllSongs, filterSongs, displayFilteredSongs, openModal, getAllSongs, addToFavorites } from "../../data/song-data.mjs";

if (!Login.isLoggedIn()) {
    location.href = '../login/login.html';
}

async function fetchAndDisplayAllSongs() {
    const songs = await fetchAllSongs();
    displayAllSongs(songs);
}

export async function displayAllSongs() {
    const songContainer = document.getElementById('playlistWrap');
    songContainer.innerHTML = '';

    const allSongs = getAllSongs();

    for (let i = 0; i < allSongs.length; i++) {
        const songData = allSongs[i];
        const song = new Song(songData);
        const songHTML = song.generateSongHTML('playlistWrap');

        songContainer.appendChild(songHTML);

        songHTML.addEventListener('click', () => {
            openModal(song, false);
        });

        const addToFavoritesButton = songHTML.querySelector('.add-to-favorites');
        addToFavoritesButton.addEventListener('click', (event) => {
            event.stopPropagation();
            addToFavorites(song);
        });
    }
}

function filterAndDisplaySongs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const ratingFilter = document.getElementById('ratingFilter').value;

    const allSongs = getAllSongs();
    const containerId = 'playlistWrap'
    const filteredSongs = filterSongs(allSongs, searchTerm, ratingFilter);

     displayFilteredSongs(filteredSongs, containerId, false);
}

document.getElementById('filterButton').addEventListener('click', filterAndDisplaySongs);

fetchAndDisplayAllSongs();
