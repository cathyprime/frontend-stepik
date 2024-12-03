const PokemonList = ({ pokemonList, onSelect }) => {
    const renderPokemonList = () => {
        if (!pokemonList || pokemonList.length === 0) {
            return <p>No Pokemon found!</p>;
        }

        return pokemonList.map((pokemon, index) => {
            const pokemonId = pokemon.url.split('/')[6];

            return (
                <div
                    key={pokemon.name}
                    className="pokemon-card"
                    onClick={() => onSelect(pokemon.name)}
                >
                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                        alt={pokemon.name}
                    />
                    <p>{pokemon.name.toUpperCase()}</p>
                    <p>#{pokemonId}</p>
                </div>
            );
        });
    };

    return <div id="pokemon-list">{renderPokemonList()}</div>;
};

const PokemonDetails = ({ pokemon }) => {
    if (!pokemon) {
        return <p>Select a Pokemon to see details</p>;
    }

    const { name, sprites, types, height, weight, stats } = pokemon;

    return (
        <div id="pokemon-details">
            <h2>{name.toUpperCase()}</h2>
            <img src={sprites.front_default} alt={name} />
            <p>Types: {types.map((typeInfo) => typeInfo.type.name).join(", ")}</p>
            <p>Height: {height}</p>
            <p>Weight: {weight}</p>
            <h3>Base Stats</h3>
            <ul>
                {stats.map((stat, index) => (
                    <li key={index}>
                        {stat.stat.name.toUpperCase()}: {stat.base_stat}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const App = () => {
    const apiUrl = "https://pokeapi.co/api/v2/pokemon";
    let allPokemon = [];
    let currentPokemonList = [];
    let selectedPokemon = null;

    const root = ReactDOM.createRoot(document.getElementById("root"));

    const renderApp = () => {
        root.render(
            <div>
                <h1>Pokemon App</h1>
                <input
                    type="text"
                    id="search-bar"
                    placeholder="Search Pokemon"
                    onInput={handleSearch}
                />
                <PokemonList
                    pokemonList={currentPokemonList}
                    onSelect={fetchPokemonDetails}
                />
                <PokemonDetails pokemon={selectedPokemon} />
            </div>
        );
    };

    const fetchAllPokemon = async () => {
        try {
            const response = await fetch(`${apiUrl}?limit=1008`);
            const data = await response.json();
            allPokemon = data.results;
            currentPokemonList = allPokemon.slice(0, 20);
            renderApp();
        } catch (error) {
            console.error("Failed to fetch Pokemon list", error);
        }
    };

    const fetchPokemonDetails = async (name) => {
        try {
            const response = await fetch(`${apiUrl}/${name}`);
            const data = await response.json();
            selectedPokemon = data;
            renderApp();
        } catch (error) {
            console.error("Failed to fetch Pokemon details", error);
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        currentPokemonList = allPokemon.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(query)
        ).slice(0, 20);
        renderApp();
    };

    fetchAllPokemon();
};

App();
