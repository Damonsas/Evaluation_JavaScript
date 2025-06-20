class Book {
    constructor({ id, title, author, read = false, apiId, thumbnail, description, publishedDate, pageCount, categories }) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.read = read;
        this.apiId = apiId;
        this.thumbnail = thumbnail;
        this.description = description;
        this.publishedDate = publishedDate;
        this.pageCount = pageCount;
        this.categories = categories;
    }
    toggleRead() {
        this.read = !this.read;
    }
}

const BookLibrary = {
    books: [],
    nextId: 1,

    add(bookData) {
    if (Array.isArray(bookData.authors) && !bookData.author) {
        bookData.author = bookData.authors[0];
    }
    const book = new Book({ ...bookData, id: this.nextId++ });
    if (this.books.some(b => b.title.toLowerCase() === book.title.toLowerCase() && b.author && book.author && b.author.toLowerCase() === book.author.toLowerCase())) {
        return { success: false, message: 'Ce livre est déjà dans votre bibliothèque !' };
    }
    this.books.push(book);
    return { success: true, book };
},

    remove(bookId) {
        this.books = this.books.filter(b => b.id !== bookId);
    },

    toggleRead(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (book) book.toggleRead();
    },

    getAll() {
        return this.books;
    }
};

function getFavoris() {
    return JSON.parse(localStorage.getItem('favoris')) || [];
}

function addFavori(livre) {
    const favoris = getFavoris();
    if (!favoris.some(f => f.id === livre.id)) {
        favoris.push(livre);
        localStorage.setItem('favoris', JSON.stringify(favoris));
    }
}

function removeFavori(livreId) {
    let favoris = getFavoris();
    favoris = favoris.filter(f => f.id !== livreId);
    localStorage.setItem('favoris', JSON.stringify(favoris));
}

function getReservations() {
    return JSON.parse(localStorage.getItem('reservations')) || [];
}
function addReservation(livre) {
    const reservations = getReservations();
    if (!reservations.some(r => r.id === livre.id)) {
        reservations.push(livre);
        localStorage.setItem('reservations', JSON.stringify(reservations));
    }
}
function removeReservation(livreId) {
    let reservations = getReservations();
    reservations = reservations.filter(r => r.id !== livreId);
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

function getHistorique() {
    return JSON.parse(localStorage.getItem('historique')) || [];
}
function addHistorique(livre) {
    const historique = getHistorique();
    if (!historique.some(h => h.id === livre.id)) {
        historique.push(livre);
        localStorage.setItem('historique', JSON.stringify(historique));
    }
}
function removeHistorique(livreId) {
    let historique = getHistorique();
    historique = historique.filter(h => h.id !== livreId);
    localStorage.setItem('historique', JSON.stringify(historique));
}

function deleteBook(bookId) {
    const book = BookLibrary.getAll().find(b => b.id === bookId);
    if (book) {
        addHistorique(book); // Ajoute à l'historique AVANT de supprimer
    }
    BookLibrary.remove(bookId);
    displayUserBooks();
}