import React from "react";

interface PokemonDisplayProps {
    pokemon: { name: string; image: string } | null;
}

const PokemonDisplay: React.FC<PokemonDisplayProps> = ({ pokemon }) => {
    if (!pokemon) return null;

    return (
        <div className="mt-4 text-center">
            <h2 className="text-xl font-bold">{pokemon.name}</h2>
            <img src={pokemon.image} alt={pokemon.name} className="mx-auto" />
        </div>
    );
};

export default PokemonDisplay;
