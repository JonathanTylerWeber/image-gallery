import { useEffect } from 'react';

const useIntersectionObserver = (callback: (entry: IntersectionObserverEntry) => void, options?: IntersectionObserverInit) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, options);

    const elements = document.querySelectorAll('[data-src]');
    elements.forEach(element => observer.observe(element));

    return () => {
      elements.forEach(element => observer.unobserve(element));
    };
  }, [callback, options]);
};

export default useIntersectionObserver;
