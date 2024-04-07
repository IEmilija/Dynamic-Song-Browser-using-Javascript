import { Login } from "../../classes/login-class.mjs";
import { Song } from "../../classes/song-class.mjs";
import { filterSongs, displayFilteredSongs, deleteFromFavorites, openModal } from "../../data/song-data.mjs";

function redirectToLoginIfNotLoggedIn() {
    if (!Login.isLoggedIn()) {
        location.href = '../login/login.html';
    }
}

function renderFavoriteSongs() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const songContainer = document.getElementById('favouritesWrap');
    songContainer.innerHTML = '';

    for (let i = 0; i < favorites.length; i++) {
        const songData = favorites[i];
        const song = new Song({
            id: songData.id,
            name: songData.name,
            image: songData.image,
            author: songData.author,
            genre: songData.genre,
            rating: songData.originalRating,
            createdAt: songData.createdAt
        });

        const songHTML = song.generateSongHTML('favouritesWrap');

        songContainer.appendChild(songHTML);

        songHTML.addEventListener('click', () => {
            openModal(song, true);
            handleUpdateRatingBtn(song);
        });

        const deleteFromFavoritesButton = songHTML.querySelector('.delete-from-favorites');
        deleteFromFavoritesButton.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteFromFavorites(song);
            location.reload()
        });
    }

    if (favorites.length === 0) {
        songContainer.innerHTML = '<p>No favorite songs found.</p>';
    }
}

export async function updateSongRating(song, newRating) {
    const apiUrl = `https://65904a96cbf74b575ecaaf60.mockapi.io/songs/${song.id}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rating: (newRating * 10),
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update rating. Status: ${response.status}`);
        }

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const updatedFavorites = favorites.map((favSong) => {
            if (favSong.id === song.id) {
                return {
                    ...favSong,
                    originalRating: newRating * 10,
                };
            }
            return favSong;
        });

        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        // renderFavoriteSongs();
    } catch (error) {
        console.error('Error updating rating:', error);
        throw error;
    }
}

function handleUpdateRatingBtn(song) {
    const updateRatingBtn = document.getElementById('updateRatingBtn');
    const newRatingInput = document.getElementById('newRating');

    updateRatingBtn.addEventListener('click', async () => {
        const newRating = parseInt(newRatingInput.value);
        if (!isNaN(newRating) && newRating >= 1 && newRating <= 10) {
            try {
                await updateSongRating(song, newRating);
                // renderFavoriteSongs();
                location.reload()
            } catch (error) {
                console.error('Error updating rating:', error);
            }
        } else {
            alert('Please enter a valid rating between 1 and 10.');
        }
    });
}

function filterAndDisplaySongs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const ratingFilter = document.getElementById('ratingFilter').value;

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const containerId = 'favouritesWrap'
    const filteredSongs = filterSongs(favorites, searchTerm, ratingFilter);

    displayFilteredSongs(filteredSongs, containerId, true);
}


document.getElementById('filterButton').addEventListener('click', filterAndDisplaySongs);

const goBackBtn = document.getElementById('goBack');
if (goBackBtn) {
    goBackBtn.addEventListener('click', () => {
        window.location.href = '../my-playlist/my-playlist.html';
    });
}

redirectToLoginIfNotLoggedIn();
renderFavoriteSongs();