/** The sort of a list page (column and direction), kept in the browser's local storage so that the list opens sorted the way it was left. */
export interface ListSort {
  column: string;
  direction: 'asc' | 'desc';
}

const KEY_PREFIX = 'list_sort_';

/** The sort kept for a list, or null when there is none (or it is not one of the list's `columns`, e.g. after the list changed). */
export function loadListSort(list: string, columns: string[]): ListSort | null {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY_PREFIX + list) ?? 'null');
    if (stored && columns.includes(stored.column) && (stored.direction === 'asc' || stored.direction === 'desc')) {
      return { column: stored.column, direction: stored.direction };
    }
  }
  catch {
    // local storage is blocked or holds something else: the list is simply not sorted
  }
  return null;
}

/** Keeps the sort of a list (null: no sort, which is forgotten). */
export function saveListSort(list: string, sort: ListSort | null) {
  try {
    if (sort) {
      localStorage.setItem(KEY_PREFIX + list, JSON.stringify(sort));
    }
    else {
      localStorage.removeItem(KEY_PREFIX + list);
    }
  }
  catch {
    // local storage is blocked: the sort is just not kept
  }
}
