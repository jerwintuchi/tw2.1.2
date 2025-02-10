import { SearchIcon } from "lucide-react";
import React from "react";

interface SearchBarProps {
    search: string;
    setSearch: (value: string) => void;
    fetchPokemon: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch, fetchPokemon }) => {
    return (
        <div className="flex flex-row justify-center gap-2">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Pokémon..."
                className="flex border p-2 w-full"
            />
            <button onClick={fetchPokemon} className="bg-transparent text-white hover:text-gray-500 py-2">
                <SearchIcon size={24} />
            </button>
        </div>
    );
};

export default SearchBar;
