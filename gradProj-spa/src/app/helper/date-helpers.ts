export function convertDate(dateUtc: Date) {
  return new Date(dateUtc.toString() + "Z");
}
