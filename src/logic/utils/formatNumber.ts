export const formatNumber = (n: number | string): string => {
  const [integer, fraction] = String(n).split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return fraction ? `${grouped}.${fraction}` : grouped;
};
