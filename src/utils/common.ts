export const formatDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return '';

  const parts = dateStr.split('-');

  if (parts.length === 3) {
    return `${parts[1]}月 ${parts[2]}日`;
  }

  return dateStr;
};