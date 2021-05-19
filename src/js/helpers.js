export const locale = navigator.language.slice(3) || 'US';

export async function getJSON(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export function getDate(date) {
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString(navigator.language, options);
}
