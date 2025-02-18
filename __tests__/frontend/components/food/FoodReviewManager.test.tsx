import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from "vitest";
import FoodReviewManager from "../../../../app/(dashboard)/(routes)/food/_components/FoodReviewManager";
import { usePhoto } from "../../../../utils/hooks/usePhoto";
import { PhotoUploader } from "@/app/(dashboard)/(routes)/drive/_components/PhotoUploader";
import "@testing-library/jest-dom/vitest";
import FoodReview from "@/app/(dashboard)/(routes)/food/_components/FoodReview";
import FoodList from "@/app/(dashboard)/(routes)/food/_components/FoodList";
// Mock the usePhoto hook
vi.mock("../../../../utils/hooks/usePhoto", () => ({
    usePhoto: vi.fn(),
}));

// Mock photo data
const mockPhotos = [
    {
        id: "1",
        user_id: "test-user-id",
        photo_url: "test-photo-1.jpg",
        photo_name: "Sushi",
        created_at: "2024-02-18T12:00:00Z",
    },
    {
        id: "2",
        user_id: "test-user-id",
        photo_url: "test-photo-2.jpg",
        photo_name: "Pizza",
        created_at: "2024-02-18T13:00:00Z",
    },
];

// Mock the User type from Supabase
const mockUser = {
    id: "test-user-id",
    email: "test@example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "",
    created_at: "",
    updated_at: "",
};

describe("FoodReviewManager", () => {
    let mockUsePhoto: any;

    beforeEach(() => {
        mockUsePhoto = {
            photos: mockPhotos,
            uploading: false,
            search: "",
            setSearch: vi.fn(),
            sortType: "date",
            setSortType: vi.fn(),
            uploadPhotos: vi.fn(),
            deletePhoto: vi.fn(),
            updatePhotoName: vi.fn(),
        };

        // Ensure usePhoto returns the mockUsePhoto object
        (usePhoto as Mock).mockReturnValue(mockUsePhoto);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the component with initial state", () => {
        render(<FoodReviewManager user={mockUser} />);

        expect(screen.getByText("Manage your Food Reviews")).toBeDefined();
        expect(screen.getByPlaceholderText("Search by food name...")).toBeDefined();
        expect(screen.getByText("Sort by Name")).toBeDefined();
        expect(screen.getByText("Sort by Date")).toBeDefined();
    });

    it("displays photos from the usePhoto hook", async () => {
        render(<FoodReviewManager user={mockUser} />);

        // Wait for the photos to be displayed
        await waitFor(() => {
            expect(screen.getByText("Sushi")).toBeDefined();
            expect(screen.getByText("Pizza")).toBeDefined();
        });
    });

    it("handles sort type changes", async () => {
        const user = userEvent.setup();
        render(<FoodReviewManager user={mockUser} />);

        const sortByNameButton = screen.getByText("Sort by Name");
        await user.click(sortByNameButton);

        expect(mockUsePhoto.setSortType).toHaveBeenCalledWith("name");

        const sortByDateButton = screen.getByText("Sort by Date");
        await user.click(sortByDateButton);

        expect(mockUsePhoto.setSortType).toHaveBeenCalledWith("date");
    });

    it('triggers upload function when files are selected', () => {
        const mockUploadPhotos = vi.fn();

        // Render the component with mockUploadPhotos as a prop
        render(<PhotoUploader uploading={false} uploadPhotos={mockUploadPhotos} />);

        // Find the file input element (invisible input used for file selection)
        const fileInput = screen.getByTestId('photo-uploader').querySelector('input[type="file"]');

        // Simulate selecting files via the file input
        const fileList = {
            0: new File(['file-content'], 'Food1.jpg', { type: 'image/jpeg' }),
            length: 1
        } as unknown as FileList;

        fireEvent.change(fileInput!, { target: { files: fileList } });

        // Ensure the upload function was called with the files
        expect(mockUploadPhotos).toHaveBeenCalledWith(fileList);
    });

    it("shows loading state during upload", () => {
        (usePhoto as Mock).mockReturnValue({
            ...mockUsePhoto,
            uploading: true,
        });

        render(<FoodReviewManager user={mockUser} />);

        const input = screen
            .getByTestId("photo-uploader")
            .querySelector('input[type="file"]');
        expect(input).toHaveProperty("disabled", true);
    });

    it("handles photo deletion", async () => {
        const user = userEvent.setup();
        render(<FoodReviewManager user={mockUser} />);

        const deleteButtons = screen.getAllByText("Delete");
        await user.click(deleteButtons[0]);

        expect(mockUsePhoto.deletePhoto).toHaveBeenCalledWith(
            mockPhotos[0].id,
            mockPhotos[0].photo_url
        );
    });

    it("opens the FoodReview modal when clicking 'Reviews' button", () => {
        const mockDeletePhoto = vi.fn();
        const mockUpdatePhotoName = vi.fn();

        const photos = [
            {
                id: "1",
                user_id: "user123",
                photo_url: "photo1.jpg",
                photo_name: "Food Photo 1",
                created_at: "2025-02-18T00:00:00Z",
            },
        ];

        render(
            <FoodList
                userId="user123"
                photos={photos}
                deletePhoto={mockDeletePhoto}
                updatePhotoName={mockUpdatePhotoName}
            />
        );

        // Click on the 'Reviews' button
        fireEvent.click(screen.getByText(/Reviews/i));

        // Check that the FoodReview component is rendered
        expect(screen.getByTestId("food-review")).toBeInTheDocument();
    });

});
