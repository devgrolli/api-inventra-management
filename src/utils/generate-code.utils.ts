export const generateCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const timestampCodeExpires = () => {
  return Date.now() + 120000;
};
