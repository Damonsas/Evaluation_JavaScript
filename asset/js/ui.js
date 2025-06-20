function displaySearchResults(results) {
    const container = document.getElementById('affiEmprunts');
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-search"></i> Aucun livre trouvé. Essayez avec d'autres mots-clés.
            </div>
            ${getUserBooksHTML()}
        `;
        return;
    }

    container.innerHTML = `
        <div class="mb-4">
            <h5><i class="fas fa-search"></i> Résultats de recherche (${results.length})</h5>
            <div class="row">
                ${results.map(book => `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100">
                            ${book.thumbnail ? `
                                <img src="${book.thumbnail}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${book.title}">
                            ` : `
                                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                                    <i class="fas fa-book fa-3x text-muted"></i>
                                </div>
                            `}
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title">${book.title}</h6>
                                <p class="card-text text-muted small">
                                    <i class="fas fa-user"></i> ${book.authors.join(', ')}
                                </p>
                                <p class="card-text text-muted small">
                                    <i class="fas fa-calendar"></i> ${book.publishedDate}
                                    ${book.pageCount !== 'Non spécifié' ? `| <i class="fas fa-file-alt"></i> ${book.pageCount} pages` : ''}
                                </p>
                                <p class="card-text small">${book.description.substring(0, 100)}${book.description.length > 100 ? '...' : ''}</p>
                                <div class="mt-auto">
                                    <button class="btn btn-primary btn-sm w-100 mb-2" onclick="addBookToLibrary(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                                        <i class="fas fa-plus"></i> Ajouter à ma bibliothèque
                                    </button>
                                    <button class="btn btn-success btn-sm w-100 mt-2" onclick="addFavori(${JSON.stringify(book).replace(/"/g, '&quot;')}); displayFavoris();">Ajouter aux favoris</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ${getUserBooksHTML()}
    `;
}

const searchInput = document.querySelector('input[type="search"]');
const searchType = document.getElementById('search-type');

searchInput.addEventListener('input', function() {
    debouncedSearch(this.value, searchType.value);
});
searchType.addEventListener('change', function() {
    debouncedSearch(searchInput.value, this.value);
});

function getUserBooksHTML() {
    const books = BookLibrary.getAll();

    if (books.length === 0) {
        return `
            <div class="mt-4">
                <h5><i class="fas fa-book"></i> Ma bibliothèque (0 livre)</h5>
                <div class="alert alert-secondary">
                    <i class="fas fa-book-open"></i> Votre bibliothèque est vide. Utilisez la recherche ci-dessus pour ajouter des livres !
                </div>
            </div>
        `;
    }

    return `
        <div class="mt-4">
            <h5><i class="fas fa-book"></i> Ma bibliothèque (${books.length} livre${books.length > 1 ? 's' : ''})</h5>
            <div class="list-group">
                ${books.map(book => `
                    <div class="list-group-item ${book.read ? 'list-group-item-success' : ''}" data-book-id="${book.id}">
                        <div class="d-flex">
                            ${book.thumbnail ? `
                                <img src="${book.thumbnail}" class="me-3" style="width: 60px; height: 80px; object-fit: cover;" alt="${book.title}">
                            ` : `
                                <div class="me-3 bg-light d-flex align-items-center justify-content-center" style="width: 60px; height: 80px;">
                                    <i class="fas fa-book text-muted"></i>
                                </div>
                            `}
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="flex-grow-1">
                                        <div class="form-check d-flex align-items-center mb-2">
                                            <input class="form-check-input me-2" type="checkbox" ${book.read ? 'checked' : ''} 
                                                   onchange="toggleRead(${book.id})" id="check-${book.id}">
                                            <h6 class="mb-0 ${book.read ? 'text-decoration-line-through text-muted' : ''}" 
                                                style="cursor: pointer;" onclick="toggleRead(${book.id})">
                                                ${book.title}
                                            </h6>
                                        </div>
                                        <p class="text-muted small mb-1">
                                            <i class="fas fa-user"></i> ${book.author}
                                        </p>
                                        <p class="text-muted small mb-0">
                                            <i class="fas fa-calendar"></i> ${book.publishedDate}
                                            ${book.pageCount !== 'Non spécifié' ? `| <i class="fas fa-file-alt"></i> ${book.pageCount} pages` : ''}
                                        </p>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge ${book.read ? 'bg-success' : 'bg-warning'} me-2">
                                            ${book.read ? 'Lu' : 'Non lu'}
                                        </span>
                                        <i class="fas fa-trash text-danger" style="cursor: pointer;" 
                                           onclick="deleteBook(${book.id})" title="Supprimer ce livre"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
 function showMessage(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'} alert-floating position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

const debouncedSearch = debounce(async (query, type) => {
    if (!query.trim()) {
        displayUserBooks();
        return;
    }
    
    const container = document.getElementById('affiEmprunts');
    container.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Recherche en cours...</span>
            </div>
            <p class="mt-2">Recherche de "${query}"...</p>
        </div>
        ${getUserBooksHTML()}
    `;
    
   
   
    const results = await searchBooksAPI(query, type);
    displaySearchResults(results);
}, 500);
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[type="search"]');
    const searchForm = document.querySelector('form[role="search"]');
    
    if (searchInput && searchForm) {
        searchInput.placeholder = "Rechercher des livres à ajouter (titre, auteur, ISBN...)";
        
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
        
        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });
        
        displayUserBooks();
    } else {
        console.error('Barre de recherche non trouvée dans le HTML');
    }
});

function displayUserBooks() {
    const container = document.getElementById('affiEmprunts');
    container.innerHTML = getUserBooksHTML();
}


function showSection(section) {
    document.querySelectorAll('.main-section').forEach(div => div.style.display = 'none');
    document.getElementById(section).style.display = 'block';
}

function displayFavoris() {
    const favoris = getFavoris();
    const container = document.getElementById('favoris');
    if (!container) return;
    if (favoris.length === 0) {
        container.innerHTML = "<p>Aucun favori pour l'instant.</p>";
        return;
    }
    container.innerHTML = favoris.map(livre => `
        <div>
            <strong>${livre.title}</strong> par ${livre.author}
            <button class="btn btn-warning btn-sm w-30 onclick="removeFavori(${livre.id}); displayFavoris();">Retirer</button>
        </div>
    `).join('');
}

function displayReservations() {
    const reservations = getReservations();
    const container = document.getElementById('Réservations');
    if (!container) return;
    if (reservations.length === 0) {
        container.innerHTML = "<p>Aucune réservation pour l'instant.</p>";
        return;
    }
    container.innerHTML = reservations.map(livre => `
        <div>
            <strong>${livre.title}</strong> par ${livre.author}
            <button class="btn btn-warning btn-sm w-30 onclick="removeReservation(${livre.id}); displayReservations();">Annuler</button>
        </div>
    `).join('');
}

function displayHistorique() {
    const historique = getHistorique();
    const container = document.getElementById('Historique');
    if (!container) return;
    if (historique.length === 0) {
        container.innerHTML = "<p>Aucun historique pour l'instant.</p>";
        return;
    }
    container.innerHTML = historique.map(livre => `
        <div>
            <strong>${livre.title}</strong> par ${livre.author}
            <button class="btn btn-success btn-sm w-30 onclick="removeHistorique(${livre.id}); displayHistorique();">Retirer</button>
        </div>
    `).join('');
}
