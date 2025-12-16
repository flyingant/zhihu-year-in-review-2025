export const formatDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return '';

  const parts = dateStr.split('-');

  if (parts.length === 3) {
    return `${parts[1]}月 ${parts[2]}日`;
  }

  return dateStr;
};

export const formatFullDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return '';

  const parts = dateStr.split('-');

  if (parts.length === 3) {
    return `${parts[0]}年${parts[1]}月${parts[2]}日`;
  }

  return dateStr;
};

export interface DateParts {
  year: string;
  month: string;
  day: string;
}
export const formatDateWithoutText = (dateStr: string | undefined | null): DateParts => {
  if (!dateStr) return { year: '', month: '', day: '' };

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return {
      year: parts[0],
      month: parts[1],
      day: parts[2]
    };
  }

  return { year: '', month: '', day: '' };
};


export const truncateText = (text: string | null | undefined, maxLength: number = 20) => {
  if (!text) return '';
  const str = String(text);
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};
