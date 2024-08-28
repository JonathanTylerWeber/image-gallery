import { useEffect, useState } from 'react';
import Photo from './types/photo';
import useIntersectionObserver from './useIntersectionObserver';

const ImageGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
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
      img.removeAttribute('data-src'); // Remove the data-src attribute after setting the src
      img.onload = () => img.classList.add('opacity-100'); // Add opacity class after load
    }
  };

  useIntersectionObserver(handleIntersection, { threshold: 0.1 });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 m-10">
        {photos.map((photo) => (
          <div key={photo.id} className="relative overflow-hidden rounded-lg shadow-sm h-[calc(100vh/2)]">
            <img
              data-src={photo.download_url}
              alt={`Photo by ${photo.author}`}
              className="w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageGallery;
