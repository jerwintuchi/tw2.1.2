import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import "@testing-library/jest-dom"
import MarkdownNotes from '@/app/(dashboard)/(routes)/markdown/_components/MarkDownNotes';

// Mock data
const mockNotes = [
    { id: 'note-1', title: 'Test Note', content: 'This is a **markdown** note.', user_id: 'user-1', created_at: '2024-02-18' },
    { id: 'note-2', title: 'Test Note 2', content: 'This is another **markdown** note.', user_id: 'user-1', created_at: '2024-02-18' }
];

// Mock response function
const mockResponse = (data: any) => Promise.resolve({ data, error: null });

// Improved mock setup with chainable methods
const mockSupabase = {
    from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
            filter: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue(mockResponse(mockNotes))
            })
        }),
        insert: vi.fn().mockImplementation((data) => mockResponse(data)),
        update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue(mockResponse(null))
        }),
        delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue(mockResponse(null))
        })
    })
};

vi.mock('@/utils/supabase/client', () => ({
    createClient: vi.fn(() => mockSupabase)
}));

const mockUser: User = {
    id: "user-1",
    email: "user@example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "",
    created_at: "",
}

beforeEach(() => {
    vi.clearAllMocks();
    render(<MarkdownNotes user={mockUser} />);
});

describe('MarkdownNotes Component', () => {
    it('renders the note input fields', () => {
        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Write your markdown here...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
    });

    it('adds a new note successfully', async () => {
        const titleInput = screen.getByPlaceholderText('Title');
        const contentInput = screen.getByPlaceholderText('Write your markdown here...');
        const addButton = screen.getByTestId('add-note-button');

        fireEvent.change(titleInput, { target: { value: 'Test Note' } });
        fireEvent.change(contentInput, { target: { value: 'This is a **markdown** note.' } });

        // Enable the button by setting valid input
        await waitFor(() => {
            expect(addButton).not.toBeDisabled();
        });

        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockSupabase.from).toHaveBeenCalledWith("markdown_notes");
            expect(mockSupabase.from().insert).toHaveBeenCalledWith([{
                title: 'Test Note',
                content: 'This is a **markdown** note.',
                user_id: mockUser.id
            }]);
        });
    });

    it('edits a note correctly', async () => {
        // Wait for initial notes to load
        await waitFor(() => {
            expect(mockSupabase.from).toHaveBeenCalledWith("markdown_notes");
        });

        // Find and click the edit button
        const editButton = screen.getByTestId('edit-button-note-1');
        fireEvent.click(editButton);

        // Get the textarea by test ID and change its content
        const editTextarea = screen.getByTestId('note-edit-textarea');
        fireEvent.change(editTextarea, { target: { value: 'Updated content' } });

        // Find and click the save icon button
        const saveButton = screen.getByTestId('save-button')
        fireEvent.click(saveButton);

        // Verify the update was called
        await waitFor(() => {
            expect(mockSupabase.from).toHaveBeenCalledWith("markdown_notes");
            expect(mockSupabase.from().update).toHaveBeenCalled();
        });
    });

    it('deletes a note correctly', async () => {
        await waitFor(() => {
            expect(mockSupabase.from).toHaveBeenCalledWith("markdown_notes");
        });

        const deleteButton = screen.getByTestId('delete-button-note-1');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockSupabase.from).toHaveBeenCalledWith("markdown_notes");
            expect(mockSupabase.from().delete).toHaveBeenCalled();
        });
    });

    it('toggles markdown preview', async () => {
        await waitFor(() => {
            expect(mockSupabase.from).toHaveBeenCalledWith("markdown_notes");
        });

        const toggleButton = screen.getByTestId('toggle-markdown-button-note-1');
        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(screen.getByTestId('note-preview')).toBeInTheDocument();
        });
    });
});