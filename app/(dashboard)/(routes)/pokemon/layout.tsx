import { Press_Start_2P } from "next/font/google";
import "./pokemon-globals.css"; // Optional for extra styles

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

export default function PokemonLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${pixelFont.className} min-h-screen border-8 border-black rounded-lg shadow-lg`}>
            {children}
        </div>
    );
}
