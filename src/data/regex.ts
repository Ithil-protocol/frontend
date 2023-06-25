export const decimalRegex = /^(0|[1-9]\d{0,20})(\.\d?\d{0,5})?$/;

export const getDecimalRegex = (decimals: number) => {
  return new RegExp(`^(0|[1-9]\\d{0,19})(\\.\\d?\\d{0,${decimals - 1}})?$`);
};
