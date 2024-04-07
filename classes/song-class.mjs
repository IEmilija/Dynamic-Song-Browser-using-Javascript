export class Song {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.image = params.image;
        this.author = params.author;
        this.genre = params.genre;
        this.originalRating = params.rating;
        this.createdAt = params.createdAt;
    }

    generateSongHTML(containerId) {
        const card = document.createElement('div');
        card.classList.add('song-card');

        card.appendChild(document.createElement('img')).src = this.image;
        card.appendChild(document.createElement('h3')).innerText = this.name;

        const actionButton = document.createElement('button');
        actionButton.classList.add(containerId === 'playlistWrap' ? 'add-to-favorites' : 'delete-from-favorites');
        actionButton.innerText = containerId === 'playlistWrap' ? 'Add to Favorites' : 'Delete from Favorites';

        card.appendChild(actionButton);

        return card;
    }

}