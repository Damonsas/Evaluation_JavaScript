
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

async function searchBooksAPI(query, type = 'all') {
    if (!query.trim()) return [];
    let filter = '';
    if (type === 'book') filter = '+subject:livre';
    if (type === 'journal') filter = '+subject:revue';
    if (type === 'dvd') filter = '+subject:DVD';
    if (type === 'online') filter = '+filter:ebooks';
    
    try {
        const response = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=fr`);
        const data = await response.json();
        
        if (data.items) {
            return data.items.map(item => ({
                id: item.id,
                title: item.volumeInfo.title || 'Titre non disponible',
                authors: item.volumeInfo.authors || ['Auteur inconnu'],
                description: item.volumeInfo.description || 'Pas de description',
                publishedDate: item.volumeInfo.publishedDate || 'Date inconnue',
                thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
                pageCount: item.volumeInfo.pageCount || 'Non spécifié',
                categories: item.volumeInfo.categories || ['Non classé']
            }));
        }
        return [];
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        return [];
    }
}


function addBookToLibrary(bookData) {
    const result = BookLibrary.add(bookData);
    if (!result.success) {
        showMessage(result.message, 'warning');
        return false;
    }
    addReservation(result.book);
    displayUserBooks();
    showMessage(`"${result.book.title}" ajouté à votre bibliothèque !`, 'success');
    return true;
}

function toggleRead(bookId) {
    BookLibrary.toggleRead(bookId);
    displayUserBooks();
}


displaySearchResults([]);

displayUserBooks();

showSection('favoris');
displayFavoris();