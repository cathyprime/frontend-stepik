const apiUrl = "https://pokeapi.co/api/v2/pokemon";
const pokemonListDiv = document.getElementById("pokemon-list");
const pokemonDetailsDiv = document.getElementById("pokemon-details");
let allPokemon = [];

async function fetchAllPokemon() {
    try {
        const response = await fetch(`${apiUrl}?limit=1008`);
        if (!response.ok)
            throw new Error("Failed to fetch Pokemon list");

        const data = await response.json();
        allPokemon = data.results;
        displayPokemonList(allPokemon.slice(0, 20));
    } catch (error) {
        pokemonListDiv.innerHTML = `<p>Error loading Pokemon list: ${error.message}</p>`;
    }
}

function displayPokemonList(pokemonList) {
    if (pokemonList.length === 0) {
        pokemonListDiv.innerHTML = `<p>No Pokemon found!</p>`;
        return;
    }

    pokemonListDiv.innerHTML = pokemonList
        .slice(0, 20)
        .map(
            (pokemon, index) => `
        <div class="pokemon-card" onclick="fetchPokemonDetails('${pokemon.name}')">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                allPokemon.findIndex((p) => p.name === pokemon.name) + 1
            }.png" alt="${pokemon.name}">
            <p>${pokemon.name.toUpperCase()}</p>
            <p>#${allPokemon.findIndex((p) => p.name === pokemon.name) + 1}</p>
        </div>`
        )
        .join("");
}

async function fetchPokemonDetails(name) {
    try {
        const response = await fetch(`${apiUrl}/${name}`);
        if (!response.ok) throw new Error("Failed to fetch Pokemon details");
        const pokemon = await response.json();
        displayPokemonDetails(pokemon);
    } catch (error) {
        pokemonDetailsDiv.innerHTML = `<p>Error loading Pokemon details: ${error.message}</p>`;
    }
}

function displayPokemonDetails(pokemon) {
    const types = pokemon.types.map((typeInfo) => typeInfo.type.name).join(", ");
    pokemonDetailsDiv.innerHTML = `
        <h2>${pokemon.name.toUpperCase()}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Types: ${types}</p>
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <h3>Base Stats</h3>
        <ul>
            ${pokemon.stats
                .map(
                    (stat) =>
                        `<li>${stat.stat.name.toUpperCase()}: ${stat.base_stat}</li>`
                )
                .join("")}
        </ul>
    `;
}

function searchPokemon(event) {
    const query = event.target.value.toLowerCase();
    const filteredPokemon = allPokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query)
    );
    displayPokemonList(filteredPokemon.slice(0, 20));
}

document.getElementById("search-bar").addEventListener("input", searchPokemon);

window.onunload = () => {
    document.getElementById("search-bar").removeEventListener("input", searchPokemon);
}

fetchAllPokemon();
