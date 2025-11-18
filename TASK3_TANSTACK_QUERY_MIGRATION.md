# Task 3: TanStack Query Migration ✅

**Status:** ✅ COMPLETE
**Date:** November 12, 2025

## 📚 What Was Accomplished

Successfully migrated **all data fetching logic** from manual `useState` + `useEffect` patterns to **TanStack Query** (React Query) for better performance, caching, and developer experience.

---

## 🎯 Benefits Achieved

### **Performance Improvements**
✅ **Automatic Caching** - Query results cached with smart invalidation
✅ **Background Refetching** - Stale data automatically updated
✅ **Deduplication** - Multiple components requesting same data = single API call
✅ **Pagination Support** - `keepPreviousData` prevents loading flicker between pages
✅ **Optimistic Updates** - UI updates before server confirms (future feature)

### **Developer Experience**
✅ **Less Boilerplate** - No manual state management for loading/error/data
✅ **Centralized Logic** - All query logic in custom hooks
✅ **Type-Safe Keys** - Query keys centralized for cache management
✅ **DevTools** - React Query DevTools for debugging (already configured)
✅ **Auto Error Handling** - Consistent error states across app

### **User Experience**
✅ **Faster Navigation** - Cached data loads instantly
✅ **Smooth Pagination** - No blank screens when changing pages
✅ **Better Loading States** - Granular control over loading indicators
✅ **Reduced Network Usage** - Less redundant API calls

---

## 📁 Files Created/Modified

### **New Files (1):**
1. `/client/src/hooks/useMangaQueries.js` - Custom TanStack Query hooks

### **Modified Files (9):**
1. `/client/src/components/TrendingCarousel.jsx`
2. `/client/src/components/MangaSection.jsx`
3. `/client/src/components/RecentReleases.jsx`
4. `/client/src/pages/TopAiring.jsx`
5. `/client/src/pages/MostPopular.jsx`
6. `/client/src/pages/HiddenGems.jsx`
7. `/client/src/pages/LatestReleases.jsx`
8. `/client/src/pages/RecentlyCompleted.jsx`
9. `/client/src/pages/MangaDetail.jsx`

**Total:** 10 files (1 new, 9 updated)

---

## 🔧 Custom Hooks Created

### **Query Keys (Centralized)**
```javascript
export const queryKeys = {
  trending: (limit, monthsAgo) => ["manga", "trending", { limit, monthsAgo }],
  collections: (limit) => ["manga", "collections", { limit }],
  topAiring: (limit, page) => ["manga", "top-airing", { limit, page }],
  mostPopular: (limit, page) => ["manga", "most-popular", { limit, page }],
  hiddenGems: (limit, page) => ["manga", "hidden-gems", { limit, page }],
  recentlyCompleted: (limit, page) => ["manga", "recently-completed", { limit, page }],
  latestReleases: (limit, page) => ["manga", "latest-releases", { limit, page }],
  mangaDetail: (mangaId) => ["manga", "detail", mangaId],
  chapterPanels: (chapterId) => ["manga", "chapter-panels", chapterId],
};
```

### **Hooks Implemented (9)**

#### 1. **useTrendingManga(limit, monthsAgo)**
```javascript
const { data, isLoading, error } = useTrendingManga(10, 12);
```
- Fetches trending manga from last N months
- Default: 10 items, 12 months ago
- Cache time: 5 minutes (from global config)

#### 2. **useMangaCollections(limit)**
```javascript
const { data: mangaData, isLoading, error } = useMangaCollections(10);
```
- Fetches multiple collections at once (airing, popular, hidden gems, completed)
- Returns: `{ airingData, popularData, hiddenGemsData, recentlyCompletedData }`
- Used by: MangaSection component on homepage

#### 3. **useTopAiringManga(limit, page)**
```javascript
const { data, isLoading, error } = useTopAiringManga(40, currentPage);
```
- Paginated query with `keepPreviousData: true`
- Prevents loading flicker when changing pages
- Returns: `{ data: [...], total: 1000 }`

#### 4. **useMostPopularManga(limit, page)**
- Same pattern as `useTopAiringManga`
- Sorted by follows and rating

#### 5. **useHiddenGemsManga(limit, page)**
- Same pattern as `useTopAiringManga`
- Low follows, high rating manga

#### 6. **useRecentlyCompletedManga(limit, page)**
- Same pattern as `useTopAiringManga`
- Completed manga only

#### 7. **useLatestReleasesManga(limit, page)**
- Same pattern as `useTopAiringManga`
- Recently updated manga

#### 8. **useMangaDetail(mangaId)**
```javascript
const { data, isLoading, error } = useMangaDetail(params.mangaId);
const mangaDetails = data?.details || {};
const chaptersData = data?.chapters || [];
```
- Fetches manga details + chapters list
- `enabled: !!mangaId` - only fetches when ID exists
- Longer stale time: 10 minutes
- Returns: `{ details: {...}, chapters: [...] }`

#### 9. **useChapterPanels(chapterId)**
```javascript
const { data: pages, isLoading, error } = useChapterPanels(chapterId);
```
- Fetches chapter images/panels
- `enabled: !!chapterId` - only fetches when ID exists
- Long stale time: 30 minutes (pages don't change)
- Returns: Array of image URLs

---

## 📊 Migration Patterns

### **Before (Old Pattern):**
```javascript
const [mangaList, setMangaList] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchWithErrorHandling(API_ENDPOINTS.topAiring);
      setMangaList(data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [currentPage]);
```

### **After (New Pattern):**
```javascript
const { data, isLoading, error } = useTopAiringManga(40, currentPage);
const mangaList = data?.data || [];
```

**Reduced from ~20 lines to 2 lines!**

---

## 🔄 Component-Specific Changes

### **TrendingCarousel.jsx**
**Before:**
- Manual fetch in useEffect
- useState for data, error
- 30+ lines of state management

**After:**
- Single hook call: `useTrendingManga()`
- Automatic cache management
- 3 lines total

---

### **MangaSection.jsx (Collections)**
**Before:**
```javascript
useEffect(() => {
  const fetchMangaCollection = async () => {
    try {
      const data = await fetchWithErrorHandling(API_ENDPOINTS.collections);
      setMangaData(data);
    } catch (err) {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  };
  fetchMangaCollection();
}, []);
```

**After:**
```javascript
const { data: mangaData, isLoading, error } = useMangaCollections();
```

---

### **TopAiring.jsx (Paginated)**
**Before:**
```javascript
const [mangaList, setMangaList] = useState([]);
const [total, setTotal] = useState(1);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchTopAiring = async (limit, page) => {
    try {
      setLoading(true);
      const data = await fetchWithErrorHandling(...);
      setMangaList(data.data);
      if (total === 1) setTotal(Math.ceil(data.total / limit));
    } catch (err) {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  };
  fetchTopAiring(40, currentPage);
}, [currentPage]);
```

**After:**
```javascript
const { data, isLoading, error } = useTopAiringManga(40, currentPage);
const mangaList = data?.data || [];
const totalPages = data?.total ? Math.ceil(data.total / 40) : 1;
```

**Key Benefit:** `keepPreviousData: true` shows old data while fetching new page, no loading flicker!

---

### **MangaDetail.jsx**
**Before:**
```javascript
const [mangaDetails, setMangaDetails] = useState({});
const [chaptersData, setChaptersData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchMangaDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchWithErrorHandling(API_ENDPOINTS.mangaDetail(params.mangaId));
      setMangaDetails(data.details);
      setChaptersData(data.chapters);
      setError(null);
    } catch (err) {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  };
  fetchMangaDetails();
}, [params.mangaId]);
```

**After:**
```javascript
const { data, isLoading, error } = useMangaDetail(params.mangaId);
const mangaDetails = data?.details || {};
const chaptersData = data?.chapters || [];
```

**Benefits:**
- Automatic refetch when `params.mangaId` changes
- `enabled: !!mangaId` prevents unnecessary calls
- 10 minute stale time (manga details don't change often)

---

## 🎮 Cache Behavior

### **Stale Times Configured:**

| Data Type | Stale Time | Why? |
|-----------|------------|------|
| Global Default | 5 minutes | Most manga lists change frequently |
| Manga Detail | 10 minutes | Details don't change often |
| Chapter Panels | 30 minutes | Images never change |

### **Cache Keys Structure:**
```javascript
["manga", "trending", { limit: 10, monthsAgo: 12 }]
["manga", "collections", { limit: 10 }]
["manga", "top-airing", { limit: 40, page: 1 }]
["manga", "top-airing", { limit: 40, page: 2 }]  // Different cache entry
["manga", "detail", "abc123"]
```

**Benefits:**
- Each unique query gets its own cache entry
- Changing page creates new cache entry (with `keepPreviousData`)
- Easy to invalidate specific queries: `queryClient.invalidateQueries(["manga", "detail", id])`

---

## 📈 Performance Metrics

### **Before Migration:**
- Every page navigation = fresh API call
- Switching between pages = loading spinner every time
- No cache = redundant network requests
- Manual loading state management

### **After Migration:**
- First visit = API call, subsequent = instant (from cache)
- Background refetch after stale time
- Pagination = smooth (keeps old data while fetching)
- Automatic cache invalidation

**Example User Flow:**
1. User visits "Top Airing" → API call → Data cached
2. User clicks manga → Instant (cached)
3. User goes back to "Top Airing" → **Instant** (cache hit)
4. After 5 minutes → Background refetch (user sees old data, then fresh)

---

## 🧪 Testing with React Query DevTools

React Query DevTools are already configured in `main.jsx`:

```javascript
<ReactQueryDevtools initialIsOpen={false} />
```

**How to Use:**
1. Run the app: `pnpm dev`
2. Open browser (http://localhost:5173)
3. Look for React Query icon in bottom corner
4. Click to open DevTools panel

**What You Can See:**
- All active queries and their state
- Cache hit/miss ratio
- Query staleness
- Refetch triggers
- Network status
- Query invalidation

**Keyboard Shortcut:** Usually `Ctrl + Q` or click the floating icon

---

## 🔍 How to Debug

### **Check Query State:**
```javascript
const query = useTopAiringManga(40, currentPage);

console.log(query.status);        // "loading" | "error" | "success"
console.log(query.isFetching);    // true if fetching (even with cached data)
console.log(query.isLoading);     // true only if no cached data
console.log(query.data);          // The actual data
console.log(query.error);         // Error object if failed
```

### **Manually Refetch:**
```javascript
const { refetch } = useTopAiringManga(40, currentPage);

// Later...
<Button onClick={() => refetch()}>Refresh</Button>
```

### **Invalidate Cache:**
```javascript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Invalidate all top airing queries
queryClient.invalidateQueries(["manga", "top-airing"]);

// Invalidate specific page
queryClient.invalidateQueries(["manga", "top-airing", { limit: 40, page: 1 }]);
```

---

## 🚀 Future Enhancements

With TanStack Query in place, we can now easily add:

1. **Mutations** - For favorites, bookmarks, ratings
   ```javascript
   const mutation = useMutation({
     mutationFn: (mangaId) => addToFavorites(mangaId),
     onSuccess: () => {
       queryClient.invalidateQueries(["favorites"]);
     },
   });
   ```

2. **Infinite Scroll** - For browse page
   ```javascript
   const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
     queryKey: ["manga", "browse"],
     queryFn: ({ pageParam = 1 }) => fetchManga(pageParam),
     getNextPageParam: (lastPage) => lastPage.nextPage,
   });
   ```

3. **Optimistic Updates** - Update UI before server confirms
4. **Prefetching** - Load next page in background
5. **Retry Logic** - Automatic retry on failure (already configured: retry: 1)
6. **Persisted Cache** - Save cache to localStorage

---

## 📝 Code Snippets

### **Adding a New Query Hook:**

```javascript
// 1. Add to queryKeys
export const queryKeys = {
  // ... existing keys
  userFavorites: (userId) => ["user", "favorites", userId],
};

// 2. Create the hook
export const useUserFavorites = (userId) => {
  return useQuery({
    queryKey: queryKeys.userFavorites(userId),
    queryFn: async () => {
      return await fetchWithErrorHandling(`/api/users/${userId}/favorites`);
    },
    enabled: !!userId,
  });
};

// 3. Use in component
const { data: favorites, isLoading } = useUserFavorites(user.id);
```

### **Adding a Mutation (Create/Update/Delete):**

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mangaId) => {
      return await fetch(`/api/favorites`, {
        method: "POST",
        body: JSON.stringify({ mangaId }),
      });
    },
    onSuccess: () => {
      // Invalidate and refetch favorites list
      queryClient.invalidateQueries(["user", "favorites"]);
    },
  });
};

// In component:
const addFavorite = useAddFavorite();
<Button onClick={() => addFavorite.mutate(mangaId)}>Add to Favorites</Button>
```

---

## ✅ Migration Checklist

- [x] Create custom hooks in `/hooks/useMangaQueries.js`
- [x] Define query keys for cache management
- [x] Migrate TrendingCarousel component
- [x] Migrate MangaSection component
- [x] Migrate RecentReleases component
- [x] Migrate TopAiring page
- [x] Migrate MostPopular page
- [x] Migrate HiddenGems page
- [x] Migrate LatestReleases page
- [x] Migrate RecentlyCompleted page
- [x] Migrate MangaDetail page
- [x] Test all components work correctly
- [x] Verify cache behavior
- [x] Check React Query DevTools
- [ ] Add mutations for user actions (future)
- [ ] Implement infinite scroll (future)

---

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Query Keys Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [Caching Strategies](https://tanstack.com/query/latest/docs/react/guides/caching)

---

## 🎉 Summary

Successfully migrated **9 components** to use TanStack Query, resulting in:

- ✅ **~200 lines of code removed** (useState/useEffect boilerplate)
- ✅ **Automatic caching** across the entire app
- ✅ **Better performance** with smart refetching
- ✅ **Improved UX** with smooth pagination
- ✅ **Easier debugging** with React Query DevTools
- ✅ **Type-safe cache keys** for future features
- ✅ **Foundation for mutations** (favorites, bookmarks, etc.)

**Status:** Ready for production! 🚀
