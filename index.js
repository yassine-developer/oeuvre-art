async function fetchImageFromArtInstitute(titre) {
    try {
        const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(titre)}&fields=id,title,image_id,artist_display`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.data.length) return null;

        const artwork = data.data.find(item =>
            item.title.toLowerCase().includes(titre.toLowerCase())
        );

        if (artwork && artwork.image_id) {
            const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
            return imageUrl;
        }

        return null;
    } catch (err) {
        console.error("Erreur :", err);
        return null;
    }
}

const oeuvres = [];
class OeuvreArt {
    constructor(titre, artiste, annee, genre, prix) {
        this.titre = titre;
        this.artiste = artiste;
        this.annee = annee;
        this.genre = genre;
        this.prix = prix;
    }
    afficher() {
        return `L'œuvre intitulée \n  "${this.titre}" \n a été créée par l'artiste ${this.artiste} en ${this.annee}, et appartient au genre ${this.genre}. Son prix est estimé à ${this.prix}€`;
    }

    comparer(target) {
        if (this.prix > target.prix) {
            return `${this.titre}  est plus chere que ${target.titre}`;
        } else if (this.prix == target.prix) {
            return `${this.titre}  a la meme valeur que ${target.titre}`;
        } else {
            return `${target.titre}  est plus chere que ${this.titre}`;
        }
    }

    modifier(titre, artiste, annee, genre, prix) {
        if (titre) this.titre = titre;
        if (artiste) this.artiste = artiste;
        if (annee) this.annee = annee;
        if (genre) this.genre = genre;
        if (prix) this.prix = prix;
    }
}

// Function to filter oeuvres based on genre
function filterOeuvresByGenre(genre) {
    if (genre === "tout") {
        return oeuvres; // No filter applied, show all oeuvres
    }
    return oeuvres.filter(oeuvre => oeuvre.genre.toLowerCase() === genre.toLowerCase());
}

// Function to update the displayed list of oeuvres based on filter
function afficherListe() {
    const genreFilter = document.querySelector("#genreFilter").value; // Get selected genre filter
    const filteredOeuvres = filterOeuvresByGenre(genreFilter); // Filter the oeuvres

    const galerie = document.querySelector("#galerie");
    galerie.innerHTML = "";

    filteredOeuvres.forEach(oeuvre => {
        const div = document.createElement('div');
        div.classList.add('carte-oeuvre');

        const p = document.createElement('p');
        p.textContent = oeuvre.afficher();

        div.appendChild(p);

        // 🎨 Ajout : afficher image si dispo
        if (oeuvre.image) {
            const img = document.createElement('img');
            img.src = oeuvre.image;
            img.alt = oeuvre.titre;
            img.style.maxWidth = "200px";
            div.appendChild(img);
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('comparer-checkbox');
        checkbox.dataset.index = oeuvres.indexOf(oeuvre); // stocke l'index de l'œuvre

        div.prepend(checkbox);

        galerie.appendChild(div);
    });
}

// Event listener for filter change
document.querySelector("#genreFilter").addEventListener("change", afficherListe);


document.querySelector("button#submit").addEventListener('click', async (e) => {
    e.preventDefault();

    const titre = document.querySelector("#titre").value;
    const artiste = document.querySelector("#artiste").value;
    const annee = document.querySelector("#annee").value;
    const genre = document.querySelector("#genre").value;
    const prix = document.querySelector("#prix").value;

    const oeuvre = new OeuvreArt(titre, artiste, annee, genre, prix);

    // Récupération de l'image correspondant au titre et artiste
    const imageUrl = await fetchImageFromArtInstitute(titre);
    if (imageUrl) {
        oeuvre.image = imageUrl;
    } else {
        oeuvre.image = null; // ou une image par défaut si tu veux
        console.log("Image non trouvée.");
    }

    oeuvres.push(oeuvre);
    afficherListe();
    document.querySelectorAll("form input").forEach(input => input.value = "");
});

document.querySelector("#comparer-btn").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".comparer-checkbox:checked");
    const resultEl = document.querySelector("#resultat-comparaison");

    if (checkboxes.length !== 2) {
        resultEl.textContent = "❌ Veuillez sélectionner exactement deux œuvres.";
        return;
    }

    const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
    const [oeuvre1, oeuvre2] = [oeuvres[indices[0]], oeuvres[indices[1]]];
    const comparaison = oeuvre1.comparer(oeuvre2);
    resultEl.textContent = `✅ Résultat: ${ comparaison }`;
});

// "Seated Woman", "Alberto Giacometti", 1950, "Sculpture", 5700000
// "Bust of a Woman", "Auguste Rodin", 1885, "Sculpture",
// Head of a Woman", "Pablo Picasso", 1909, "Sculpture", 4800000
// Standing Figure", "Alberto Giacometti", 1947, "Sculpture", 6000000
// "American Gothic", "Grant Wood", 1930, "Peinture", 5000000
// "Nighthawks", "Edward Hopper", 1942, "Peinture", 7000000
// "Self-Portrait", "Vincent van Gogh", 1887, "Peinture", 8000000
// "Water Lilies", "Claude Monet", 1916, "Peinture", 7500000
// The Old Guitarist", "Pablo Picasso", 1903, "Peinture", 9000000
// "The Bathers", "Paul Cézanne", 1898, "Peinture", 6000000
// "The Dance", "Henri Matisse", 1910, "sculture", 6800000
// "The Pianist", "Henri Matisse", 1917, "Peinture", 4500000
// "Madonna and Child", "Duccio di Buoninsegna", 1300, "sculture", 2500000