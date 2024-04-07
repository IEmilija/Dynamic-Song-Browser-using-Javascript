import { Song } from "../classes/song-class.mjs";

let allSongs = [];

const getSongsURL = 'https://65904a96cbf74b575ecaaf60.mockapi.io';

export async function fetchAllSongs() {
    const response = await fetch(`${getSongsURL}/songs`);
    const songs = await response.json();

    setAllSongs(songs);
    return songs;
}

export function getAllSongs() {
    return allSongs;
}

export function setAllSongs(newSongs) {
    allSongs = newSongs;
}

export function filterSongs(songs, searchTerm, ratingFilter) {
    let filteredSongs = [...songs];

    if (searchTerm && ratingFilter) {
        const filterValue = +ratingFilter;
        filteredSongs = filteredSongs.filter(
            (song) => song.name.toLowerCase().includes(searchTerm) &&
                Math.ceil(song.rating / 10) === filterValue
        );
    } else {
        if (searchTerm && !ratingFilter) {
            filteredSongs = filteredSongs.filter((song) => song.name.toLowerCase().includes(searchTerm));
        } else if (!searchTerm && ratingFilter) {
            const filterValue = +ratingFilter;
            filteredSongs = filteredSongs.filter((song) => Math.ceil(song.rating / 10) === filterValue);
        }
    }

    return filteredSongs;
}

export function displayFilteredSongs(filteredSongs, containerId, isFromFavorites = true) {
    const songContainer = document.getElementById(containerId);
    if (!songContainer) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    songContainer.innerHTML = '';

    filteredSongs.forEach((songData) => {
        const song = new Song(songData);
        const songHTML = song.generateSongHTML(containerId);
        songContainer.appendChild(songHTML);

        songHTML.addEventListener('click', () => {
            openModal(song, isFromFavorites);
        });

        const addToFavoritesButton = songHTML.querySelector('.add-to-favorites');
        const deleteFromFavoritesButton = songHTML.querySelector('.delete-from-favorites');

        if (addToFavoritesButton) {
            addToFavoritesButton.addEventListener('click', (event) => {
                event.stopPropagation();
                addToFavorites(song);
            });
        } else if (deleteFromFavoritesButton) {
            deleteFromFavoritesButton.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteFromFavorites(song);
            });
        }
    });
}

export function openModal(song, isEditable = true) {
    const modal = document.createElement('div');
    modal.id = 'showSongDetailsModal';
    modal.className = 'song-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeModal">&times;</span>
            <h2>${song.name}</h2>
            <img src="${song.image}" alt="${song.name}">
            <p><strong>Author:</strong> ${song.author}</p>
            <p><strong>Genre:</strong> ${song.genre}</p>
            <p><strong>Rating:</strong> ${song.originalRating / 10}</p>
            ${isEditable ? '<label for="newRating">New Rating:</label> <input type="number" id="newRating"><button id="updateRatingBtn">Update Rating</button>' : ''}
        </div>
    `;

    document.body.appendChild(modal);

    const closeModalBtn = document.getElementById('closeModal');
    closeModalBtn.addEventListener('click', () => {
        modal.remove();
    });

    window.onclick = function (event) {
        const showSongDetailsModal = document.getElementById('showSongDetailsModal');
        if (event.target == showSongDetailsModal) {
            modal.remove();
        }
    };
}

export function addToFavorites(song) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const isAlreadyAdded = favorites.some((favorite) => favorite.id === song.id);

    if (isAlreadyAdded) {
        alert('This song is already in your favorites.');
    } else {
        favorites.push(song);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        const favoritesCounter = document.getElementById('favouritesCounter');
        favoritesCounter.textContent = favorites.length;
        alert('Song added to favorites!');
    }
}

export function deleteFromFavorites(song) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex((favorite) => favorite.id === song.id);

    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Song deleted from favorites.');
    } else {
        alert('Song not found in favorites.');
    }
}

