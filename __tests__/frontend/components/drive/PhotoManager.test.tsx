import { render, screen, fireEvent } from '@testing-library/react';
import PhotoManager from '../../../../app/(dashboard)/(routes)/drive/_components/PhotoManager';
import * as usePhotoModule from '../../../../utils/hooks/usePhoto';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ValidRoutes } from '@/app/types/type-definitions';
import { PhotoUploader } from '@/app/(dashboard)/(routes)/drive/_components/PhotoUploader';
import { usePhoto } from '../../../../utils/hooks/usePhoto';
import { PhotoList } from '@/app/(dashboard)/(routes)/drive/_components/PhotoList';

// Define the expected return type of usePhoto hook
type UsePhotoReturnType = {
    photos: { id: string, user_id: string, photo_url: string, photo_name: string, created_at: string }[];
    uploading: boolean;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    sortType: string;
    setSortType: React.Dispatch<React.SetStateAction<string>>;
    uploadPhotos: () => void;
    deletePhoto: (id: string, photoUrl: string) => void;
    updatePhotoName: (id: string, newName: string) => Promise<void>;
};
vi.mock('@/utils/getImgSrc', () => ({
    getImageSrc: vi.fn().mockReturnValue('https://example.com/photo.jpg'),
}));

// Define a mock user with userId
const mockUser = { id: 'test-user-123' };

// Define a mock apiRoute
const mockApiRoute: ValidRoutes = 'photos';  // Assuming 'photos' is a valid route

// Mock the usePhoto hook with the correct type
vi.mock('../../../../utils/hooks/usePhoto', () => ({
    usePhoto: vi.fn().mockImplementation((userId: string, apiRoute: string) => ({
        photos: [
            {
                id: 'photo-1',
                user_id: 'test-user-123',
                photo_url: 'https://example.com/photo1.jpg',
                photo_name: 'Vacation Photo',
                created_at: '2023-01-01T12:00:00Z',
            },
            {
                id: 'photo-2',
                user_id: 'test-user-123',
                photo_url: 'https://example.com/photo2.jpg',
                photo_name: 'Family Photo',
                created_at: '2023-01-02T12:00:00Z',
            },
        ],
        uploading: false,
        search: '',
        setSearch: vi.fn(),
        sortType: 'date',
        setSortType: vi.fn(),
        uploadPhotos: vi.fn(),
        deletePhoto: vi.fn(),
        updatePhotoName: vi.fn(),
    })),
}));

describe('PhotoManager Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders all components correctly', async () => {
        render(<PhotoManager user={mockUser} />);
        screen.debug();
        // Wait for the photo uploader to appear
        const photoUploader = await screen.findByTestId('photo-uploader');
        expect(photoUploader).toBeInTheDocument();

        // You can also add more assertions to check other elements
        expect(screen.getByText('Manage your Photos')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search by photo name...')).toBeInTheDocument();
        expect(screen.getByText('Sort by Name')).toBeInTheDocument();
        expect(screen.getByText('Sort by Date')).toBeInTheDocument();
        expect(screen.getByTestId('photo-list')).toBeInTheDocument();
    });

    test('renders photos from the hook', () => {
        render(<PhotoManager user={mockUser} />);

        expect(screen.getByTestId('photo-photo-1')).toBeInTheDocument();
        expect(screen.getByTestId('photo-photo-2')).toBeInTheDocument();
        expect(screen.getByText('Vacation Photo')).toBeInTheDocument();
        expect(screen.getByText('Family Photo')).toBeInTheDocument();
    });

    test('triggers upload photos function when files are selected', async () => {
        const mockUploadPhotos = vi.fn();

        // Mock the user object with a valid id (use a mock or an actual test user object)
        const mockUser = { id: 'test-user-123' };

        render(<PhotoUploader uploading={false} uploadPhotos={mockUploadPhotos} />);

        // Find the file input element (invisible input used for file selection)
        const fileInput = screen.getByTestId('photo-uploader').querySelector('input[type="file"]');

        // Simulate selecting files via the file input
        const fileList = {
            0: new File(['file-content'], 'photo1.jpg', { type: 'image/jpeg' }),
            length: 1
        } as unknown as FileList;

        fireEvent.change(fileInput!, { target: { files: fileList } });

        // Ensure the uploadPhotos function was called with the files
        expect(mockUploadPhotos).toHaveBeenCalledWith(fileList);
    });

    test('triggers upload photos function when files are dropped', async () => {
        const mockUploadPhotos = vi.fn();

        // Mock the user object with a valid id
        const mockUser = { id: 'test-user-123' };

        render(<PhotoUploader uploading={false} uploadPhotos={mockUploadPhotos} />);

        // Find the drop area (photo uploader div)
        const dropArea = screen.getByTestId('photo-uploader');

        // Simulate a drag-and-drop event with files
        const files = [new File(['file-content'], 'photo1.jpg', { type: 'image/jpeg' })];
        fireEvent.drop(dropArea, { dataTransfer: { files } });

        // Ensure the uploadPhotos function was called with the dropped files
        expect(mockUploadPhotos).toHaveBeenCalledWith(files);
    });

    test('handles sort by name button click', () => {
        // Create a mock function for setSortType
        const mockSetSortType = vi.fn();

        // Mock the usePhoto hook to return the mock function for setSortType and other required values
        // @ts-ignore
        usePhoto.mockImplementation(() => ({
            photos: [],
            uploading: false,
            search: '',
            setSearch: vi.fn(),
            sortType: '',
            setSortType: mockSetSortType,
            uploadPhotos: vi.fn(),
            deletePhoto: vi.fn(),
        }));

        // Render the component with a mock user object
        render(<PhotoManager user={{ id: 'mock-user-id' }} />);

        // Find the "Sort by Name" button and simulate the click
        const sortByNameButton = screen.getByText('Sort by Name');
        fireEvent.click(sortByNameButton);

        // Check if the mock function was called with the correct argument
        expect(mockSetSortType).toHaveBeenCalledWith('name');
    });

    test('handles delete photo function when delete button is clicked', () => {
        const mockDeletePhoto = vi.fn();

        // Mock the photos array
        const photos = [{ id: '1', photo_name: 'photo1.jpg', photo_url: 'https://example.com/url1.jpg' }];

        render(<PhotoList photos={photos} deletePhoto={mockDeletePhoto} />);

        // Find the delete button using the dynamic test ID
        const deleteButton = screen.getByTestId('delete-photo-1');

        // Simulate hover if necessary (to trigger visibility of the button)
        fireEvent.mouseOver(deleteButton);

        // Click the delete button
        fireEvent.click(deleteButton);

        // Verify that the delete function was called with the correct arguments
        expect(mockDeletePhoto).toHaveBeenCalledWith('1', 'https://example.com/url1.jpg');
    });


    test('disables upload button when uploading is in progress', () => {
        const mockUploading = true;

        // Mock the return of usePhoto to include the uploading state
        vi.spyOn(usePhotoModule, 'usePhoto').mockImplementation(() => ({
            photos: [
                {
                    id: 'photo-1',
                    user_id: 'test-user-123',
                    photo_url: 'https://example.com/photo1.jpg',
                    photo_name: 'Vacation Photo',
                    created_at: '2023-01-01T12:00:00Z',
                },
            ],
            uploading: mockUploading,
            search: '',
            setSearch: vi.fn(),
            sortType: 'date',
            setSortType: vi.fn(),
            uploadPhotos: vi.fn(),
            deletePhoto: vi.fn(),
            updatePhotoName: vi.fn(),
        }));

        render(<PhotoManager user={mockUser} />);

        // Find the input element inside the photo uploader
        const uploadInput = screen.getByTestId('photo-uploader').querySelector('input');

        // Ensure the input element is disabled during uploading
        expect(uploadInput).toBeDisabled();
    });



});
