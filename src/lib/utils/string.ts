// String formatting
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function camelToTitle(str: string): string {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function kebabToTitle(str: string): string {
  if (!str) return '';
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function snakeToTitle(str: string): string {
  if (!str) return '';
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// String truncation
export function truncate(
  str: string,
  length: number,
  ending: string = '...'
): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length - ending.length) + ending;
}

// String validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

// String sanitization
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

export function escapeHtml(str: string): string {
  if (!str) return '';
  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

export function slugify(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// String extraction
export function extractEmails(str: string): string[] {
  if (!str) return [];
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
  return str.match(emailRegex) || [];
}

export function extractUrls(str: string): string[] {
  if (!str) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return str.match(urlRegex) || [];
}

export function extractMentions(str: string): string[] {
  if (!str) return [];
  const mentionRegex = /@(\w+)/g;
  const matches = str.match(mentionRegex) || [];
  return matches.map((match) => match.slice(1));
}

export function extractHashtags(str: string): string[] {
  if (!str) return [];
  const hashtagRegex = /#(\w+)/g;
  const matches = str.match(hashtagRegex) || [];
  return matches.map((match) => match.slice(1));
}

// String comparison
export function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

export function similarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1;
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(String(longerLength))
  );
}

// Helper function for similarity calculation
function editDistance(str1: string, str2: string): number {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  const costs: number[] = [];
  for (let i = 0; i <= str1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) {
      costs[str2.length] = lastValue;
    }
  }
  return costs[str2.length];
} 