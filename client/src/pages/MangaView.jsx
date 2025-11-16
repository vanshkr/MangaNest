import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  BookOpen,
  ArrowUp,
  Maximize,
  Minimize,
  X,
  Home,
  Settings,
} from "lucide-react";
import { API_ENDPOINTS, fetchWithErrorHandling } from "@/config/api";

export const MangaView = () => {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();

  // State
  const [mangaDetails, setMangaDetails] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapterData, setCurrentChapterData] = useState(null);
  const [chapterPages, setChapterPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState(() =>
    localStorage.getItem("mangaViewMode") || "single"
  );
  const [readingDirection, setReadingDirection] = useState(() =>
    localStorage.getItem("readingDirection") || "ltr"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [error, setError] = useState(null);
  const [loadedPages, setLoadedPages] = useState(new Set([1]));
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const scrollContainerRef = useRef(null);
  const pageRefs = useRef({});
  const fullscreenRef = useRef(null);
  const currentChapterIndex = chapters.findIndex(
    (ch) => ch.chapterId === chapterId
  );
  const totalPages = chapterPages.length;
  const totalChapters = chapters.length;

  // Fetch manga details and chapters
  useEffect(() => {
    const fetchMangaData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchWithErrorHandling(
          API_ENDPOINTS.mangaDetail(mangaId)
        );
        setMangaDetails(data.details);
        setChapters(data.chapters || []);

        // Find current chapter data
        const chapter = data.chapters?.find((ch) => ch.chapterId === chapterId);
        setCurrentChapterData(chapter);
      } catch (err) {
        console.error("Failed to fetch manga details:", err);
        setError("Failed to load manga details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    if (mangaId) {
      fetchMangaData();
    }
  }, [mangaId, chapterId]);

  // Fetch chapter pages
  useEffect(() => {
    const fetchChapterPages = async () => {
      if (!chapterId) return;
      try {
        setIsLoadingPages(true);
        setError(null);
        const data = await fetchWithErrorHandling(
          API_ENDPOINTS.chapterPanels(chapterId)
        );

        // data should be an array of image URLs
        const pages = Array.isArray(data) ? data : [];
        setChapterPages(pages);
        setCurrentPage(1);
        setLoadedPages(new Set([1]));

        // Load reading progress
        const savedProgress = localStorage.getItem(`progress_${mangaId}_${chapterId}`);
        if (savedProgress) {
          const page = parseInt(savedProgress);
          if (page > 1 && page <= pages.length) {
            setCurrentPage(page);
          }
        }

        // Preload first few images
        if (pages.length > 0) {
          preloadImages(pages.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch chapter pages:", err);
        setError("Failed to load chapter pages. Please try again later.");
        setChapterPages([]);
      } finally {
        setIsLoadingPages(false);
      }
    };
    fetchChapterPages();
  }, [chapterId, mangaId]);

  // Preload images
  const preloadImages = useCallback((urls) => {
    urls.forEach((url) => {
      if (!preloadedImages.has(url)) {
        const img = new Image();
        img.src = url;
        setPreloadedImages((prev) => new Set([...prev, url]));
      }
    });
  }, [preloadedImages]);

  // Save reading progress
  useEffect(() => {
    if (mangaId && chapterId && currentPage > 0) {
      localStorage.setItem(`progress_${mangaId}_${chapterId}`, currentPage.toString());
    }
  }, [mangaId, chapterId, currentPage]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("mangaViewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem("readingDirection", readingDirection);
  }, [readingDirection]);

  // Chapter navigation
  const handleChapterChange = (newChapterId) => {
    navigate(`/manga/${mangaId}/read/${newChapterId}`);
  };

  const goToNextChapter = () => {
    if (currentChapterIndex > 0) {
      const nextChapter = chapters[currentChapterIndex - 1];
      handleChapterChange(nextChapter.chapterId);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex < totalChapters - 1) {
      const prevChapter = chapters[currentChapterIndex + 1];
      handleChapterChange(prevChapter.chapterId);
    }
  };

  // Page navigation
  const handlePageChange = (pageNum) => {
    const page = parseInt(pageNum);
    setCurrentPage(page);

    // Scroll to page in multi-page view
    if (viewMode === "multi" && pageRefs.current[page]) {
      pageRefs.current[page].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Preload adjacent pages
    const pagesToPreload = [];
    if (page < totalPages) pagesToPreload.push(chapterPages[page]);
    if (page > 1) pagesToPreload.push(chapterPages[page - 2]);
    preloadImages(pagesToPreload);
  };

  const goToNextPage = () => {
    if (readingDirection === "rtl") {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      } else if (currentChapterIndex > 0) {
        goToNextChapter();
      }
    } else {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      } else if (currentChapterIndex > 0) {
        goToNextChapter();
      }
    }
  };

  const goToPrevPage = () => {
    if (readingDirection === "rtl") {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      } else if (currentChapterIndex < totalChapters - 1) {
        goToPrevChapter();
      }
    } else {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      } else if (currentChapterIndex < totalChapters - 1) {
        goToPrevChapter();
      }
    }
  };

  // Infinite scroll logic for multi-page view
  const handleScroll = useCallback(() => {
    if (viewMode !== "multi" || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Show scroll to top button
    setShowScrollTop(scrollTop > 500);

    // Load more pages when near bottom
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      const nextPagesToLoad = Math.min(5, totalPages - loadedPages.size);
      const newPages = new Set(loadedPages);
      for (let i = 0; i < nextPagesToLoad; i++) {
        const pageNum = loadedPages.size + i + 1;
        if (pageNum <= totalPages) {
          newPages.add(pageNum);
        }
      }
      setLoadedPages(newPages);

      // Preload images
      const urlsToPreload = Array.from(newPages)
        .slice(-nextPagesToLoad)
        .map((pageNum) => chapterPages[pageNum - 1])
        .filter(Boolean);
      preloadImages(urlsToPreload);
    }

    // Update current page based on scroll position
    const pageElements = Object.entries(pageRefs.current);
    for (const [pageNum, element] of pageElements) {
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setCurrentPage(parseInt(pageNum));
          break;
        }
      }
    }
  }, [viewMode, loadedPages, totalPages, chapterPages, preloadImages]);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && viewMode === "multi") {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, viewMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Prevent keyboard shortcuts when typing in input fields
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          goToNextPage();
          break;

        case "ArrowLeft":
          e.preventDefault();
          goToPrevPage();
          break;

        case "ArrowUp":
          e.preventDefault();
          goToPrevChapter();
          break;

        case "ArrowDown":
          e.preventDefault();
          goToNextChapter();
          break;

        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;

        case "Escape":
          if (isFullscreen) {
            e.preventDefault();
            exitFullscreen();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, currentChapterIndex, viewMode, totalPages, readingDirection, isFullscreen]);

  // Reset loaded pages when view mode changes
  useEffect(() => {
    if (viewMode === "multi") {
      const initialPages = new Set(
        Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1)
      );
      setLoadedPages(initialPages);
    }
  }, [viewMode, totalPages]);

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  const enterFullscreen = () => {
    const elem = fullscreenRef.current;
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const getCurrentPages = () => {
    if (viewMode === "single") {
      const page = chapterPages[currentPage - 1];
      return page ? [{ id: currentPage, url: page }] : [];
    } else {
      // Return all loaded pages for infinite scroll
      return Array.from(loadedPages)
        .sort((a, b) => a - b)
        .map((pageNum) => ({
          id: pageNum,
          url: chapterPages[pageNum - 1],
        }))
        .filter((page) => page.url);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading manga...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-2">Error</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Retry
            </Button>
            <Button
              onClick={() => navigate(`/manga/${mangaId}`)}
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
            >
              Back to Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No chapters available
  if (!chapters.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-purple-300 text-lg">No chapters available</p>
          <Button
            onClick={() => navigate(`/manga/${mangaId}`)}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Back to Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={fullscreenRef}
      className="min-h-screen bg-gradient-to-br from-gray-900/60 to-gray-800/40"
    >
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                onClick={() => navigate(`/manga/${mangaId}`)}
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:bg-purple-500/20 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                  {mangaDetails?.title || "Loading..."}
                </h1>
                <p className="text-purple-300 text-xs sm:text-sm truncate">
                  {currentChapterData
                    ? `Chapter ${currentChapterData.chapter}`
                    : "Loading..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                size="sm"
                className="bg-purple-600/20 border-purple-400 text-purple-100 hover:bg-purple-500/30 flex-shrink-0"
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-600/20 border-purple-400 text-purple-100 hover:bg-purple-500/30 flex-shrink-0"
                  >
                    <Info className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Info</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{mangaDetails?.title}</DialogTitle>
                    <DialogDescription>
                      {mangaDetails?.desc?.substring(0, 200)}
                      {mangaDetails?.desc?.length > 200 ? "..." : ""}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Author:</span>
                      <span className="text-white">{mangaDetails?.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white">{mangaDetails?.rating}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white capitalize">{mangaDetails?.status}</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20 sticky top-[72px] sm:top-[84px] z-40">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
              {/* Chapter Selector */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <label className="text-purple-300 text-sm font-medium whitespace-nowrap">
                  Chapter:
                </label>
                <Select value={chapterId} onValueChange={handleChapterChange}>
                  <SelectTrigger className="w-full sm:w-48 bg-gray-800/50 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-500/30 max-h-60">
                    {chapters.map((chapter) => (
                      <SelectItem
                        key={chapter.chapterId}
                        value={chapter.chapterId}
                        className="text-white hover:bg-purple-600/30"
                      >
                        Chapter {chapter.chapter}
                        {chapter.pages && ` (${chapter.pages} pages)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page Selector - Only show in single page mode */}
              {viewMode === "single" && (
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <label className="text-purple-300 text-sm font-medium whitespace-nowrap">
                    Page:
                  </label>
                  <Select
                    value={currentPage.toString()}
                    onValueChange={handlePageChange}
                  >
                    <SelectTrigger className="w-20 bg-gray-800/50 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-purple-500/30 max-h-60">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <SelectItem
                          key={i + 1}
                          value={(i + 1).toString()}
                          className="text-white hover:bg-purple-600/30"
                        >
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-purple-300 text-sm whitespace-nowrap">
                    / {totalPages}
                  </span>
                </div>
              )}

              {/* Multi-page view page indicator */}
              {viewMode === "multi" && (
                <div className="text-purple-300 text-sm">
                  Page {currentPage} / {totalPages}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
              {/* Settings Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800/50 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Settings className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reader Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* View Mode */}
                    <div>
                      <Label className="text-purple-300 mb-3 block">
                        View Mode:
                      </Label>
                      <RadioGroup
                        value={viewMode}
                        onValueChange={setViewMode}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="single"
                            id="single"
                            className="border-purple-400 text-purple-400"
                          />
                          <Label
                            htmlFor="single"
                            className="text-white cursor-pointer"
                          >
                            Single Page - Navigate page by page
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="multi"
                            id="multi"
                            className="border-purple-400 text-purple-400"
                          />
                          <Label
                            htmlFor="multi"
                            className="text-white cursor-pointer"
                          >
                            Multi Page - Infinite scroll through all pages
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Reading Direction */}
                    <div>
                      <Label className="text-purple-300 mb-3 block">
                        Reading Direction:
                      </Label>
                      <RadioGroup
                        value={readingDirection}
                        onValueChange={setReadingDirection}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="ltr"
                            id="ltr"
                            className="border-purple-400 text-purple-400"
                          />
                          <Label
                            htmlFor="ltr"
                            className="text-white cursor-pointer"
                          >
                            Left to Right (Western style)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="rtl"
                            id="rtl"
                            className="border-purple-400 text-purple-400"
                          />
                          <Label
                            htmlFor="rtl"
                            className="text-white cursor-pointer"
                          >
                            Right to Left (Manga style)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Navigation Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={goToPrevPage}
                  disabled={
                    readingDirection === "ltr"
                      ? currentPage === 1 && currentChapterIndex === totalChapters - 1
                      : currentPage === totalPages && currentChapterIndex === 0
                  }
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Prev</span>
                </Button>
                <Button
                  onClick={goToNextPage}
                  disabled={
                    readingDirection === "ltr"
                      ? currentPage === totalPages && currentChapterIndex === 0
                      : currentPage === 1 && currentChapterIndex === totalChapters - 1
                  }
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 sm:ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Area */}
      <main
        ref={scrollContainerRef}
        className={`${viewMode === "multi"
          ? "h-[calc(100vh-140px)] sm:h-[calc(100vh-152px)] overflow-y-auto"
          : ""
          } px-2 sm:px-4 py-4 sm:py-8`}
      >
        {isLoadingPages ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-purple-300">Loading pages...</p>
            </div>
          </div>

        ) : totalPages === 0 ? (
            
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-purple-300 text-lg">No pages available for this chapter</p>
              <Button
                onClick={goToNextChapter}
                disabled={currentChapterIndex === 0}
                className="mt-4 bg-purple-600 hover:bg-purple-700"
              >
                Next Chapter
              </Button>
            </div>
          </div>
        ) : (

          <div className="w-full mx-auto max-w-5xl">
            {viewMode === "single" ? (
              // Single page view
              <div className="grid grid-cols-1">
                {getCurrentPages().map((page) => (
                  <div key={page.id} className="overflow-hidden">
                    <div className="p-0">
                      <div className="relative group">
                        <img
                          src={page.url}
                          alt={`Page ${page.id}`}
                          className="w-full h-auto object-contain mx-auto max-h-[85vh] cursor-pointer"
                          loading="eager"
                          onClick={goToNextPage}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (

              // Multi-page infinite scroll view
              <div className="space-y-2">
                {getCurrentPages().map((page) => (
                  <div
                    key={page.id}
                    ref={(el) => (pageRefs.current[page.id] = el)}
                    className="overflow-hidden"
                  >
                    <div className="p-0">
                      <div className="relative">
                        <img
                          src={page.url}
                          alt={`Page ${page.id}`}
                          className="w-full h-auto object-contain mx-auto"
                          loading="lazy"
                        />

                        {/* Page number indicator */}
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                          {page.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator for infinite scroll */}
                {loadedPages.size < totalPages && (
                  <div className="flex justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                      <p className="text-purple-300 text-sm">
                        Loading more pages...
                      </p>
                    </div>
                  </div>
                )}

                {/* End of chapter indicator */}
                {loadedPages.size >= totalPages && (
                  <div className="text-center py-8">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4 inline-block">
                      <p className="text-purple-300 mb-4">
                        End of Chapter {currentChapterData?.chapter}
                      </p>
                      {currentChapterIndex > 0 && (
                        <Button
                          onClick={goToNextChapter}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Next Chapter
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Scroll to top button for multi-page view */}
      {viewMode === "multi" && showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 rounded-full p-3 shadow-lg"
          size="sm"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Keyboard Hints */}
      <div className="fixed bottom-4 left-4 bg-black/70 backdrop-blur-sm text-purple-300 px-3 py-2 rounded-lg text-xs max-w-48">
        <div>← → : {viewMode === "single" ? "Pages" : "Chapters"}</div>
        <div>↑ ↓ : Previous/Next Chapter</div>
        <div>F : Fullscreen</div>
      </div>
    </div>
  );
};
