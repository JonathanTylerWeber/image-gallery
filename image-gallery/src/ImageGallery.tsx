import { useEffect, useState } from 'react';
import Photo from './types/photo';
import useIntersectionObserver from './useIntersectionObserver';

const ImageGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://picsum.photos/v2/list');

        if (!res.ok) {
          throw new Error(`Error fetching data: ${res.statusText}`);
        }

        const data: Photo[] = await res.json();
        setPhotos(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
  }, []);

  const handleIntersection = (entry: IntersectionObserverEntry) => {
    const img = entry.target as HTMLImageElement;
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.onload = () => img.classList.add('opacity-100');
    }
  };

  useIntersectionObserver(handleIntersection, { threshold: 0.1 });

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 m-10">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative overflow-hidden rounded-lg shadow-sm h-[calc(100vh/2)] cursor-pointer"
            onClick={() => handlePhotoClick(photo)}
          >
            <img
              data-src={photo.download_url}
              alt={`Photo by ${photo.author}`}
              className="w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out hover:opacity-55"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900">
          <div className="relative p-8 bg-slate-900 rounded-lg shadow-lg max-w-5xl max-h-full">
            <button
              className="absolute top-2 right-0 text-3xl text-white hover:text-gray-500"
              onClick={closeModal}
            >
              ✕
            </button>
            <img src={selectedPhoto.download_url} alt={`Photo by ${selectedPhoto.author}`} className="max-w-full max-h-full object-contain" />
            <div className="mt-4 text-center text-white">Photo by {selectedPhoto.author}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
