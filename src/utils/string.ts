export function capitalizeFirstLetter(word: string): string {
  if (!word) return "";

  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatDescription(text: string, isMobile: boolean): string {
  if (!isMobile) return text;

  if (text.length > 20) return text.substring(20, 0).trim() + "...";

  return text;
}
