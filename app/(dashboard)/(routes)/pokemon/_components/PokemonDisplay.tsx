import React from "react";

interface PokemonDisplayProps {
    pokemon: { name: string; image: string } | null;
}

const PokemonDisplay: React.FC<PokemonDisplayProps> = ({ pokemon }) => {
    if (!pokemon) return null;

    return (
        <div className="mt-4 bg-gray-200 border-4 border-black rounded-lg p-4 shadow-inner relative ">
            <h2 className="text-xl font-bold text-center text-black uppercase">{pokemon.name}</h2>
            <img src={pokemon.image} alt={pokemon.name} className="mx-auto my-2 border-2 border-black rounded-md bg-white" />
        </div>
    );
};

export default PokemonDisplay;
