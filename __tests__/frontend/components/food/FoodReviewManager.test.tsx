import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import FoodReviewManager from "../../../../app/(dashboard)/(routes)/food/_components/FoodReviewManager";
import "@testing-library/jest-dom/vitest";
import { User } from "@supabase/supabase-js";
import { PhotoUploader } from "@/app/(dashboard)/(routes)/drive/_components/PhotoUploader";
import { usePhoto } from "@/utils/hooks/usePhoto";
import PhotoManager from "@/app/(dashboard)/(routes)/drive/_components/PhotoManager";

// Mock photos globally
const mockPhotos = [
    { id: "1", photo_name: "Food1", photo_url: "url1.jpg" },
    { id: "2", photo_name: "Food2", photo_url: "url2.jpg" },
];

// Mock the usePhoto hook globally
const mockSetSearch = vi.fn();

vi.mock("../../../../../utils/hooks/usePhoto", () => ({
    usePhoto: vi.fn().mockReturnValue({
        photos: [],
        uploading: false,
        search: "",
        setSearch: vi.fn(),
        sortType: "name",
        setSortType: vi.fn(),
        uploadPhotos: vi.fn(),
        deletePhoto: vi.fn(),
        updatePhotoName: vi.fn(),
    }),
}));

const mockUser: Partial<User> = { id: "test-user-id" };

beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
});

describe("FoodReviewManager", () => {
    test("renders the component", () => {
        render(<FoodReviewManager user={mockUser as User} />);

        expect(screen.getByText("Manage your Food Reviews")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search by food name...")).toBeInTheDocument();
        expect(screen.getByText("Sort by Name")).toBeInTheDocument();
        expect(screen.getByText("Sort by Date")).toBeInTheDocument();
    });

    test("triggers upload photos function when files are selected", async () => {
        const mockUploadPhotos = vi.fn();

        render(<PhotoUploader uploading={false} uploadPhotos={mockUploadPhotos} />);

        // Find the file input element (ensure proper selection)
        const fileInput = screen.getByTestId("photo-uploader").querySelector("input[type='file']");

        // Simulate selecting files
        const fileList = {
            0: new File(["file-content"], "photo1.jpg", { type: "image/jpeg" }),
            length: 1,
        } as unknown as FileList;

        fireEvent.change(fileInput!, { target: { files: fileList } });

        // Ensure uploadPhotos is called with the selected file
        expect(mockUploadPhotos).toHaveBeenCalledWith(fileList);
    });

    test("updates search value when typing in the search input", async () => {
        // Render the component with minimal necessary mocks
        render(<FoodReviewManager user={mockUser as User} />);

        // Get the search input element
        const searchInput = screen.getByPlaceholderText("Search by food name...");

        // Simulate typing "Pizza" in the search input
        fireEvent.change(searchInput, { target: { value: "Pizza" } });

        // Check if the search input value has been updated
        expect(searchInput).toHaveValue("Pizza");
    });

    test('handles sort by name button click', () => {
        const mockSetSortType = vi.fn();

        // Mock the usePhoto hook for this test
        // @ts-ignore
        usePhoto.mockReturnValue({
            photos: [],
            uploading: false,
            search: '',
            setSearch: vi.fn(),
            sortType: 'name',  // Ensure sortType is initially set
            setSortType: mockSetSortType,
            uploadPhotos: vi.fn(),
            deletePhoto: vi.fn(),
        });

        render(<FoodReviewManager user={mockUser as User} />);

        const sortByNameButton = screen.getByText('Sort by Name');
        fireEvent.click(sortByNameButton);

        expect(mockSetSortType).toHaveBeenCalledWith('name');
    });

    test('handles sort by date button click', () => {
        const mockSetSortType = vi.fn();

        // Mock the usePhoto hook
        // @ts-ignore
        usePhoto.mockReturnValue({
            photos: [],
            uploading: false,
            search: '',
            setSearch: vi.fn(),
            sortType: 'date', // Ensure initial sortType
            setSortType: mockSetSortType,
            uploadPhotos: vi.fn(),
            deletePhoto: vi.fn(),
        });

        render(<FoodReviewManager user={mockUser as User} />);

        const sortByDateButton = screen.getByText('Sort by Date');
        fireEvent.click(sortByDateButton);

        expect(mockSetSortType).toHaveBeenCalledWith('date');
    });

    test("renders FoodList with the correct props", () => {
        vi.mock("../../../../../utils/hooks/usePhoto", () => ({
            usePhoto: vi.fn().mockReturnValueOnce({
                photos: mockPhotos,
                uploading: false,
                search: "",
                setSearch: mockSetSearch,
                sortType: "name",
                setSortType: vi.fn(),
                uploadPhotos: vi.fn(),
                deletePhoto: vi.fn(),
                updatePhotoName: vi.fn(),
            }),
        }));

        render(<FoodReviewManager user={mockUser as User} />);

        const foodList = screen.getByTestId("food-list");
        expect(foodList).toBeInTheDocument();
    });

    test("sets search value on user input", async () => {
        const mockSetSearch = vi.fn();

        vi.mock("../../../../../utils/hooks/usePhoto", () => ({
            usePhoto: vi.fn().mockReturnValueOnce({
                photos: [],
                uploading: false,
                search: "",
                setSearch: mockSetSearch,
                sortType: "name",
                setSortType: vi.fn(),
                uploadPhotos: vi.fn(),
                deletePhoto: vi.fn(),
                updatePhotoName: vi.fn(),
            }),
        }));

        render(<FoodReviewManager user={mockUser as User} />);

        const searchInput = screen.getByPlaceholderText("Search by food name...");
        fireEvent.change(searchInput, { target: { value: "Pasta" } });

        expect(mockSetSearch).toHaveBeenCalledTimes(1);
        expect(mockSetSearch).toHaveBeenCalledWith("Pasta");
    });
});
