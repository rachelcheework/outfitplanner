export const clothingCategories = [
    "tops",
    "bottoms",
    "dresses",
    "outerwear",
    "activewear",
    "beachwear",
    "accessories",
  ] as const;
  
  export type ClothingCategory = (typeof clothingCategories)[number];