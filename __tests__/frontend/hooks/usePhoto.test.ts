import { renderHook, act, waitFor } from '@testing-library/react';
import { usePhoto } from "@/utils/hooks/usePhoto";
import { describe, afterAll, expect, beforeAll, afterEach, vi, it } from 'vitest';

// Setup fetch mock
const originalFetch = global.fetch;
beforeAll(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.resetAllMocks();
});

// Restore original fetch after all tests
afterAll(() => {
  global.fetch = originalFetch;
});

const mockUserId = 'user123';
const apiRoute = 'photos' as const;

const mockPhotos = [
  {
    id: 'photo1',
    user_id: 'user123',
    photo_url: 'https://example.com/photo1.jpg',
    photo_name: 'Vacation Photo',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'photo2',
    user_id: 'user123',
    photo_url: 'https://example.com/photo2.jpg',
    photo_name: 'Birthday Party',
    created_at: '2023-02-01T00:00:00Z',
  },
];

describe('usePhoto hook', () => {
  it('should fetch photos on mount', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    expect(result.current.photos).toEqual([]);
    expect(result.current.uploading).toBe(false);

    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    expect(fetch).toHaveBeenCalledWith(
      `/api/photos?userId=user123&sortType=date`
    );
  });

  it('should handle search filtering', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    act(() => {
      result.current.setSearch('vacation');
    });
    
    expect(result.current.photos).toEqual([mockPhotos[0]]);
    
    act(() => {
      result.current.setSearch('party');
    });
    
    expect(result.current.photos).toEqual([mockPhotos[1]]);
    
    act(() => {
      result.current.setSearch('');
    });
    
    expect(result.current.photos).toEqual(mockPhotos);
  });

  it('should handle sort type changes', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [...mockPhotos].reverse(),
    } as Response);
    
    act(() => {
      result.current.setSortType('name');
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        `/api/photos?userId=user123&sortType=name`
      );
    });
  });

  it('should upload photos successfully', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    const newPhoto = {
      id: 'photo3',
      user_id: 'user123',
      photo_url: 'https://example.com/photo3.jpg',
      photo_name: 'New Photo',
      created_at: '2023-03-01T00:00:00Z',
    };
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [newPhoto],
    } as Response);
    
    const file = new File([''], 'New Photo', { type: 'image/jpeg' });
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file,
    } as unknown as FileList;
    
    await act(async () => {
      await result.current.uploadPhotos(fileList);
    });
    
    await waitFor(() => {
      expect(result.current.photos).toEqual([newPhoto, ...mockPhotos]);
    });
    
    expect(fetch).toHaveBeenLastCalledWith('/api/photos', {
      method: 'POST',
      body: expect.any(FormData),
    });
  });

  it('should prevent duplicate file uploads', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    const file = new File([''], 'Vacation Photo', { type: 'image/jpeg' });
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file,
    } as unknown as FileList;
    
    await act(async () => {
      await result.current.uploadPhotos(fileList);
    });
    
    expect(window.alert).toHaveBeenCalledWith('That file(s) is already uploaded.');
    expect(result.current.photos).toEqual(mockPhotos);
  });

  it('should delete photo successfully', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);
    
    await act(async () => {
      await result.current.deletePhoto('photo1', 'https://example.com/photo1.jpg');
    });
    
    await waitFor(() => {
      expect(result.current.photos).toEqual([mockPhotos[1]]);
    });
    
    expect(fetch).toHaveBeenLastCalledWith(
      '/api/photos?id=photo1&photo_url=https://example.com/photo1.jpg',
      { method: 'DELETE' }
    );
  });

  it('should update photo name successfully', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);
    
    await act(async () => {
      await result.current.updatePhotoName('photo1', 'New Vacation Photo');
    });
    
    await waitFor(() => {
      expect(result.current.photos[0].photo_name).toBe('New Vacation Photo');
    });
    
    expect(fetch).toHaveBeenLastCalledWith(
      '/api/photos?id=photo1&newName=New Vacation Photo',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'photo1', newName: 'New Vacation Photo' }),
      }
    );
  });

  it('should handle fetch error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching photos:',
        expect.any(Error)
      );
    });
    
    expect(result.current.photos).toEqual([]);
  });

  it('should handle upload error', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Upload failed'));
    
    const file = new File([''], 'New Photo', { type: 'image/jpeg' });
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file,
    } as unknown as FileList;
    
    await act(async () => {
      await result.current.uploadPhotos(fileList);
    });
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Upload failed');
    });
    
    expect(result.current.uploading).toBe(false);
  });

  it('should handle delete error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Delete failed'));
    
    await act(async () => {
      await result.current.deletePhoto('photo1', 'https://example.com/photo1.jpg');
    });
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error deleting photo:',
        expect.any(Error)
      );
      expect(window.alert).toHaveBeenCalledWith('Delete failed');
    });
  });

  it('should handle update name error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    } as Response);
    
    const { result } = renderHook(() => 
      usePhoto(mockUserId, apiRoute)
    );
    
    await waitFor(() => expect(result.current.photos).toEqual(mockPhotos));
    
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Update failed'));
    
    await act(async () => {
      await result.current.updatePhotoName('photo1', 'New Name');
    });
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error updating photo name:',
        expect.any(Error)
      );
      expect(window.alert).toHaveBeenCalledWith('Update failed');
    });
  });

  it('should not fetch photos if userId is empty', async () => {
    const { result } = renderHook(() => 
      usePhoto('', apiRoute)
    );
    
    expect(result.current.photos).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });
});