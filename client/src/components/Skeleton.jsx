/**
 * Skeleton loading components for better UX during data loading
 */

// Base Skeleton component
export const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-800 rounded ${className}`}
      {...props}
    />
  );
};

// Manga Card Skeleton
export const MangaCardSkeleton = () => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
};

// Manga Grid Skeleton
export const MangaGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MangaCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Manga Detail Skeleton
export const MangaDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Image Skeleton */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Skeleton className="aspect-[2/3] rounded-lg w-full" />
          </div>

          {/* Info Skeleton */}
          <div className="flex-1">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>

            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Chapters Skeleton */}
        <div className="mt-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Chapter Reader Skeleton
export const ChapterReaderSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 p-4">
        <Skeleton className="h-6 w-64 mb-2" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <Skeleton className="aspect-[2/3] max-w-4xl w-full mx-4 rounded-lg" />
      </div>
    </div>
  );
};

// Carousel Skeleton
export const CarouselSkeleton = () => {
  return (
    <div className="relative">
      <Skeleton className="aspect-[21/9] md:aspect-[21/7] rounded-xl mb-4" />
      <div className="flex gap-2 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-2 w-2 rounded-full" />
        ))}
      </div>
    </div>
  );
};

// Section Skeleton (for manga sections on home page)
export const SectionSkeleton = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <MangaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

// Search Results Skeleton
export const SearchResultsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <MangaGridSkeleton count={20} />
      </div>
    </div>
  );
};

// List Item Skeleton (for chapter lists, etc.)
export const ListItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  );
};

// Text Skeleton (for loading text content)
export const TextSkeleton = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
};
