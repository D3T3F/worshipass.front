export function onlyThisFieldFilled<T extends object>(
  obj: T,
  field: keyof T
): boolean {
  return Object.entries(obj).every(([key, value]) => {
    const isFilled =
      value !== null &&
      value !== undefined &&
      !(typeof value === "string" && value.trim() === "");

    return key === field ? isFilled : !isFilled;
  });
}
