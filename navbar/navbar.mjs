import { getAllSongs, setAllSongs } from "../../data/song-data.mjs";
import { displayAllSongs } from "../pages/my-playlist/my-playlist.mjs";

async function fetchUserInfo(userId) {
    const userResponse = await fetch(`https://65904a96cbf74b575ecaaf60.mockapi.io/users/${userId}`);
    const userData = await userResponse.json();
    return userData;
}

try {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.id) {
        const userInfo = await fetchUserInfo(storedUser.id);
        const avatarBtn = document.getElementById('avatarBtn');
        const myDropdown = document.getElementById('myDropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        const favoritesBtn = document.getElementById('favoritesBtn');
        const favoritesCounter = document.getElementById('favouritesCounter');

        avatarBtn.style.backgroundImage = `url("${userInfo.avatar}")`;
        avatarBtn.addEventListener('click', () => {
            myDropdown.classList.toggle('show');
        });

        window.onclick = function (event) {
            if (!event.target.matches('.dropbtn')) {
                let dropdowns = document.getElementsByClassName('dropdown-content');
                let i;
                for (i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        };

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            localStorage.removeItem('favorites');
            location.href = '../login/login.html';
        });

        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', () => {
                window.location.href = '../favourites/favourites.html';
            });

            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favoritesCounter.textContent = favorites.length;
        }
    }
} catch (error) {
    console.error('Error in navbar.mjs:', error);
};

function showAddNewSongModal(event) {
    event.preventDefault();
    const addNewSongModal = document.getElementById('addNewSongModal');
    if (addNewSongModal) {
        addNewSongModal.style.display = 'block';
    }
}

function closeAddNewSongModal() {
    const addNewSongModal = document.getElementById('addNewSongModal');
    if (addNewSongModal) {
        addNewSongModal.style.display = 'none';
    }
}

const addNewSongBtn = document.getElementById('addNewSongBtn');
if (addNewSongBtn) {
    addNewSongBtn.addEventListener('click', showAddNewSongModal);
}

const closeModalBtn = document.getElementById('closeModalBtn');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeAddNewSongModal);
}

window.onclick = function (event) {
    const addNewSongModal = document.getElementById('addNewSongModal');
    if (addNewSongModal && event.target == addNewSongModal) {
        closeAddNewSongModal();
    }
};

async function handleAddNewSong() {
    try {
        const nameInput = document.getElementById('name');
        const genreInput = document.getElementById('genre');
        const authorInput = document.getElementById('author');
        const ratingInput = document.getElementById('rating');

        if (nameInput && genreInput && authorInput && ratingInput) {
            if (!nameInput.value || !genreInput.value || !authorInput.value || !ratingInput.value) {
                return alert('Please fill in all the required fields and ensure valid inputs.');
            }

            const newSong = {
                name: nameInput.value,
                genre: genreInput.value,
                author: authorInput.value,
                rating: (parseInt(ratingInput.value) * 10),
            };

            const response = await fetch('https://65904a96cbf74b575ecaaf60.mockapi.io/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSong),
            });

            const updatedSongs = [...getAllSongs()];
            updatedSongs.push(newSong);
            setAllSongs(updatedSongs);

            document.getElementById('addNewSongForm').reset();
            // location.reload()
            displayAllSongs();

            const addNewSongModal = document.getElementById('addNewSongModal');
            if (addNewSongModal) {
                addNewSongModal.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error in handleAddNewSong:', error);
    }
}

const addNewSongForm = document.getElementById('addNewSongForm');
if (addNewSongForm) {
    addNewSongForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleAddNewSong();
    });
}