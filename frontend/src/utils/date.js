/**
 * Returns today's date as a YYYY-MM-DD string in the LOCAL timezone.
 * 
 * Why not use new Date().toISOString().split('T')[0]?
 * toISOString() returns UTC time. For timezones ahead of UTC (e.g. IST +5:30),
 * this can return yesterday's date after midnight local time.
 */
export const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date string (YYYY-MM-DD) or Date object for display.
 */
export const formatDisplayDate = (dateStr, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!dateStr) return '';
  // Append T00:00:00 to force local-timezone parsing (plain YYYY-MM-DD is parsed as UTC)
  const date = typeof dateStr === 'string' ? new Date(`${dateStr}T00:00:00`) : dateStr;
  return date.toLocaleDateString('en-US', options);
};
