export const EnumHelper = {
  getKeyName<T extends Record<string, number>>(
    enumObj: T,
    value: number | string
  ): string | null {
    const numValue = typeof value === "string" ? Number(value) : value;
    const entry = Object.entries(enumObj).find(([, val]) => val === numValue);
    const result = entry ? entry[0] : null;

    if (result === null) {
      return null;
    }

    return result.replace(/_/g, " ");
  },
};
