import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Pokemon {
    name: string;
    image: string;
    types?: { type: { name: string } }[];
    cries?: { latest: string; legacy: string };
    abilities?: { ability: { name: string } }[];
    evolutions: string[];
}

interface PokemonDisplayProps {
    pokemon: Pokemon | null;
}

const PokemonDisplay: React.FC<PokemonDisplayProps> = ({ pokemon }) => {
    const [evolutionImages, setEvolutionImages] = useState<{ name: string; image: string }[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!pokemon || !Array.isArray(pokemon.evolutions) || pokemon.evolutions.length === 0) return;

        const fetchEvolutionImages = async () => {
            const images = await Promise.all(
                pokemon.evolutions.map(async (evo) => {
                    try {
                        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo}`);
                        if (!res.ok) throw new Error(`Failed to fetch ${evo}`);
                        const data = await res.json();
                        return { name: evo, image: data.sprites.front_default };
                    } catch (error) {
                        console.error(error);
                        return { name: evo, image: "/static/default_pokemon.png" };
                    }
                })
            );
            setEvolutionImages(images);
        };

        fetchEvolutionImages();
    }, [pokemon]);

    if (!pokemon) return null;

    /**  Play Pokémon Cry with animation */
    const playCry = () => {
        if (!pokemon.cries?.latest) {
            alert("No cry available for this Pokémon.");
            return;
        }

        const audio = new Audio(pokemon.cries.latest);
        setIsPlaying(true);
        audio.play()
            .catch((error) => console.error("Error playing audio:", error));

        audio.onended = () => setIsPlaying(false);
    };

    return (
        <div className="mt-4 bg-gray-200 border-4 border-black rounded-lg p-4 shadow-inner relative">
            <h2 className="text-2xl font-bold text-center text-black uppercase">{pokemon.name}</h2>

            {/* Pokémon Image */}
            <div className="flex justify-center my-2">
                <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="border-2 border-black rounded-md bg-white w-32 h-32"
                />
            </div>

            {/* Play Cry Button + Sound Meter */}
            <div className="flex flex-col items-center mt-2">
                <button
                    onClick={playCry}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded border-2 border-black"
                >
                    🔊 Play Cry
                </button>

                {/*  Sound Wave Animation */}
                <div className="flex gap-1 mt-2 h-6">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 rounded-sm transition-all duration-600 ${isPlaying ? `animate-wave wave-${index}` : "h-2 bg-gray-400"}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Pokémon Types */}
            {pokemon.types?.length ? (
                <div className="flex justify-center gap-2 my-2">
                    {pokemon.types.map((t, index) => (
                        <span
                            key={index}
                            className={`text-xs font-bold px-2 py-1 rounded uppercase border-2 border-black 
                        ${typeColors[t.type.name] || "bg-gray-400"}`}
                        >
                            {t.type.name}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600 text-sm">No type data available</p>
            )}

            {/* Pokémon Abilities */}
            {pokemon.abilities?.length ? (
                <div className="text-center mt-2">
                    <h3 className="text-sm font-bold text-black">Abilities</h3>
                    <p className="text-xs text-gray-700 italic">
                        {pokemon.abilities.map((a) => a.ability.name).join(", ")}
                    </p>
                </div>
            ) : (
                <p className="text-center text-gray-600 text-sm">No ability data available</p>
            )}

            {/* Evolution Chain */}
            {evolutionImages.length > 0 && (
                <div className="mt-3">
                    <h3 className="text-sm font-bold text-black text-center">Evolution Chain</h3>
                    <div className="flex justify-center gap-3 mt-2">
                        {evolutionImages.map((evo) => (
                            <div key={evo.name} className="text-center">
                                <Image
                                    src={evo.image}
                                    alt={evo.name}
                                    width={50}
                                    height={50}
                                    className="border-2 border-black bg-white rounded-md"
                                />
                                <p className="text-xs font-bold mt-1 text-black">{evo.name.toUpperCase()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/* Type Colors Mapping */
const typeColors: { [key: string]: string } = {
    fire: "bg-red-500 text-white",
    water: "bg-blue-500 text-white",
    grass: "bg-green-500 text-white",
    electric: "bg-yellow-500 text-black",
    ice: "bg-blue-300 text-black",
    fighting: "bg-orange-700 text-white",
    poison: "bg-purple-500 text-white",
    ground: "bg-yellow-700 text-white",
    flying: "bg-indigo-400 text-black",
    psychic: "bg-pink-500 text-white",
    bug: "bg-green-600 text-white",
    rock: "bg-gray-600 text-white",
    ghost: "bg-indigo-700 text-white",
    dragon: "bg-indigo-900 text-white",
    dark: "bg-gray-900 text-white",
    steel: "bg-gray-500 text-white",
    fairy: "bg-pink-300 text-black",
};

export default PokemonDisplay;
