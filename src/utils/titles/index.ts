import { IGeneratedTopic } from "@/types/components/dashboard";

export const groupTitles = (titles: IGeneratedTopic[]) => {
  if (!titles) return {};
  return titles?.reduce((acc, curr) => {
    const date = formatDateToWords(curr.createdAt);
    if (acc[date]) {
      acc[date] = [...acc[date], curr];
    } else {
      acc[date] = [curr];
    }
    return acc;
  }, {} as Record<string, IGeneratedTopic[]>);
};
export function formatDateToWords(dateString: string) {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatToSimpleDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
