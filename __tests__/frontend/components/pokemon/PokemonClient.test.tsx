// __tests__/frontend/components/pokemon/PokemonClient.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PokemonClient from '@/app/(dashboard)/(routes)/pokemon/_components/PokemonClient';
import "@testing-library/jest-dom/vitest";


//mock supabase client
vi.mock('@/utils/supabase/client', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                order: vi.fn(() => ({
                    // mock the order method to return a promise that resolves to the expected data
                    then: vi.fn((onFulfilled) => onFulfilled({ data: [] })),
                })),
            })),
        })),
    })),
}));
const mockPokemonData = [
    {
        id: 'pikachu',
        name: 'Pikachu',
        type: 'Electric',
    },
];

const mockReviewsData = [
    {
        id: 'review-123',
        pokemonId: 'pikachu',
        userId: 'user-123',
        review: 'Great Pokémon!',
    },
];

const mockUser = {
    supabaseUser: {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: '',
        updated_at: '',
    },
    username: '',
};
beforeEach(() => {
    render(<PokemonClient user={mockUser} />);
    vi.clearAllMocks();
});

describe('PokemonClient component', () => {
    it('renders the Pokémon client component', async () => {
        expect(screen.getByText('Pokédex')).toBeInTheDocument();
    });

    it('fetches Pokémon data on search', async () => {
        const searchInput = screen.getByTestId('search-bar')
        fireEvent.change(searchInput, { target: { value: 'pikachu' } });
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => screen.getByText(/Pikachu/i));
        expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    it('renders Pokémon reviews', async () => {
        const searchInput = screen.getByTestId('search-bar')
        fireEvent.change(searchInput, { target: { value: 'pikachu' } });
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => screen.getByText('Reviews'));
        expect(screen.getByText('Reviews')).toBeInTheDocument();
    });

    it('allows users to add new reviews', async () => {
        const searchInput = screen.getByTestId('search-bar')
        fireEvent.change(searchInput, { target: { value: 'pikachu' } });
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => screen.getByText('Add Review'));
        fireEvent.click(screen.getByText('Add Review'));
        const reviewInput = screen.getByPlaceholderText('Write your review');
        fireEvent.change(reviewInput, { target: { value: 'Great Pokémon!' } });
        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => screen.getByText('Great Pokémon!'));
        expect(screen.getByText('Great Pokémon!')).toBeInTheDocument();
    });
});