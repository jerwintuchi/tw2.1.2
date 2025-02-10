export const convertToPHT = (utcDateString: string) => {
  const utcDate = new Date(utcDateString); // Convert UTC string to Date object
  const phtDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000); // Add 8 hours for PHT
  return phtDate.toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    hour12: true,
  });
};
