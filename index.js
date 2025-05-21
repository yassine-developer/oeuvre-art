const oeuvres = [];
class OeuvreArt{
    constructor(titre,artiste,annee,genre,prix){
        this.titre = titre;
        this.artiste = artiste;
        this.annee = annee;
        this.genre = genre;
        this.prix = prix;
    }
    afficher(){
        return `L'œuvre intitulée "${this.titre}" a été créée par l'artiste ${this.artiste} en ${this.annee}, et appartient au genre ${this.genre}. Son prix est estimé à ${this.prix}€`;
    }

    comparer(target){
        if(this.prix > target.prix){
            return `${this.titre}  est plus chere que ${target.titre}`;
        }else if( this.prix == target.prix){
            return `${this.titre}  a la meme valeur que ${target.titre}`;
        }else{
            return `${target.titre}  est plus chere que ${this.titre}`;
        }
    }

    modifier(titre,artiste,annee,genre,prix){
        if(titre) this.titre = titre;
        if(artiste) this.artiste = artiste;
        if(annee) this.annee = annee;
        if(genre) this.genre = genre;
        if(prix) this.prix = prix;
    }
}

function afficherListe(){
    const galerie = document.querySelector("#galerie");
    galerie.innerHTML = "";
    oeuvres.forEach(oeuvre => {
        const p =document.createElement('p');
        p.textContent = ` ${oeuvre.afficher()}`;
        galerie.append(p);
    })
}

document.querySelector("button#submit").addEventListener('click', (e)=>{
    e.preventDefault();
    const titre = document.querySelector("#titre").value;
    const artiste = document.querySelector("#artiste").value;
    const annee = document.querySelector("#annee").value;
    const genre = document.querySelector("#genre").value;
    const prix = document.querySelector("#prix").value;
    
    const oeuvre = new OeuvreArt(titre, artiste, annee, genre, prix);
    oeuvres.push(oeuvre);
    // console.log(oeuvre.afficher());
    afficherListe();
    
})

// Fonction pour rechercher une œuvre d'art en utilisant l'API de l'Art Institute of Chicago
async function chercherImageOeuvre(titre) {
    const url = `https://api.artic.edu/api/v1/artworks/search?q=${titre}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Vérifier si des œuvres ont été trouvées
        if (data.data && data.data.length > 0) {
            // Récupérer le premier résultat
            const oeuvre = data.data[0];
            const imageUrl = `https://www.artic.edu/iiif/2/${oeuvre.image_id}/full/843,/0/default.jpg`;

            return imageUrl;
        } else {
            throw new Error('Aucune œuvre trouvée.');
        }
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'image :', error);
    }
}

// Exemple d'utilisation
chercherImageOeuvre('Starry Night').then(imageUrl => {
    if (imageUrl) {
        console.log('Image trouvée :', imageUrl);
        // Vous pouvez ensuite utiliser cette URL pour afficher l'image dans votre galerie
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        document.body.appendChild(imageElement);
    }
});
