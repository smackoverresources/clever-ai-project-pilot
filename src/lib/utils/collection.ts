// Array operations
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(
  arr: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const comparison = aVal < bVal ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
}

export function chunk<T>(arr: T[], size: number): T[][] {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0) {
      acc.push(arr.slice(i, i + size));
    }
    return acc;
  }, [] as T[][]);
}

// Object operations
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone) as unknown as T;
  }

  return Object.fromEntries(
    Object.entries(obj as object).map(([key, value]) => [key, deepClone(value)])
  ) as T;
}

export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;

  const source = sources.shift();
  if (!source) return target;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return deepMerge(target, ...sources);
}

// Helper function for deepMerge
function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Search and filter operations
export function filterByQuery<T extends object>(
  items: T[],
  query: string,
  keys: (keyof T)[]
): T[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      if (value == null) return false;
      return String(value).toLowerCase().includes(normalizedQuery);
    })
  );
}

export function fuzzySearch<T extends object>(
  items: T[],
  query: string,
  keys: (keyof T)[],
  threshold = 0.5
): T[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return items;

  return items
    .map((item) => {
      const maxScore = Math.max(
        ...keys.map((key) => {
          const value = item[key];
          if (value == null) return 0;
          const str = String(value).toLowerCase();
          return calculateFuzzyScore(str, normalizedQuery);
        })
      );
      return { item, score: maxScore };
    })
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

// Helper function for fuzzySearch
function calculateFuzzyScore(str: string, query: string): number {
  const str1 = str.toLowerCase();
  const str2 = query.toLowerCase();
  const row = Array(str2.length + 1).fill(0);
  let prev;
  let score;

  for (let i = 0; i < str1.length; i++) {
    prev = row[0];
    row[0] = i + 1;

    for (let j = 0; j < str2.length; j++) {
      score = prev;
      prev = row[j + 1];
      row[j + 1] = str1[i] === str2[j] ? score : Math.min(score, prev, row[j]) + 1;
    }
  }

  const maxLength = Math.max(str1.length, str2.length);
  return 1 - row[str2.length] / maxLength;
} 