export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface PhotosResponse {
  photos: Photo[];
  hasMore: boolean;
}

const API_BASE_URL = 'https://picsum.photos/v2';

export const fetchPhotos = async (
  page: number,
  limit: number = 20,
): Promise<PhotosResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/list?page=${page}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const photos: Photo[] = await response.json();

    const hasMore = photos.length === limit;

    return {
      photos,
      hasMore,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch photos: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};
