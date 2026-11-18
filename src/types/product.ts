// Shared types: no logic, no imports from other layers. Fields are defined in issue #30.

export type ProductId = number;

export type Product = {
  id: ProductId;
  title: string;
  category: string;
  /** one number in one currency, no formatting: the Price component formats it */
  price: number;
  oldPrice?: number;
  /** from 0 to 5 */
  rating: number;
  /** path to the image, for example 'images/phone.jpg' */
  image: string;
  description: string;
};
