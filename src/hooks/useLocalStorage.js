import { useState, useEffect, useCallback } from 'react';

const RecentlyViewed_Key = 'uncleflix_recent';
const Watchlist_Key = 'uncleflix_watchlist';
const PlaybackMemory_Key = 'uncleflix_playback';

export const useRecentlyViewed = () => {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(RecentlyViewed_Key);
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  const addRecent = useCallback((item) => {
    const { id, type } = item;
    setRecent((prev) => {
      const filtered = prev.filter((i) => !(i.id === id && i.type === type));
      const updated = [{ ...item }, ...filtered].slice(0, 10);
      localStorage.setItem(RecentlyViewed_Key, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeRecent = useCallback((id, type) => {
    setRecent((prev) => {
      const filtered = prev.filter((i) => !(i.id === id && i.type === type));
      localStorage.setItem(RecentlyViewed_Key, JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    localStorage.removeItem(RecentlyViewed_Key);
  }, []);

  return { recent, addRecent, removeRecent, clearRecent };
};

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(Watchlist_Key);
    if (stored) setWatchlist(JSON.parse(stored));
  }, []);

  const toggle = useCallback((item) => {
    const { id, type } = item;
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === id && i.type === type);
      let updated;
      if (exists) {
        updated = prev.filter((i) => !(i.id === id && i.type === type));
      } else {
        updated = [...prev, { ...item }];
      }
      localStorage.setItem(Watchlist_Key, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isInWatchlist = useCallback((id, type) => {
    return watchlist.some((i) => i.id === id && i.type === type);
  }, [watchlist]);

  const remove = useCallback((id, type) => {
    setWatchlist((prev) => {
      const filtered = prev.filter((i) => !(i.id === id && i.type === type));
      localStorage.setItem(Watchlist_Key, JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  return { watchlist, toggle, isInWatchlist, remove };
};

export const usePlaybackMemory = () => {
  const [memory, setMemory] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem(PlaybackMemory_Key);
    if (stored) setMemory(JSON.parse(stored));
  }, []);

  const saveProgress = useCallback((id, type, season, episode) => {
    setMemory((prev) => {
      const key = `${type}-${id}`;
      const updated = {
        ...prev,
        [key]: { id, type, season, episode, timestamp: Date.now() }
      };
      localStorage.setItem(PlaybackMemory_Key, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getProgress = useCallback((id, type) => {
    const stored = localStorage.getItem(PlaybackMemory_Key);
    if (!stored) return null;
    const data = JSON.parse(stored);
    return data[`${type}-${id}`] || null;
  }, []);

  const clearProgress = useCallback((id, type) => {
    setMemory((prev) => {
      const key = `${type}-${id}`;
      const updated = { ...prev };
      delete updated[key];
      localStorage.setItem(PlaybackMemory_Key, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { memory, saveProgress, getProgress, clearProgress };
};
