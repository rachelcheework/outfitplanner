//this is for fetching data from clothes_table

import supabase from "../supabase-client";
import { BUCKET_NAME, CLOTHES_TABLE } from "../constants/TableNames";
import type { ClothingCategory } from "../constants/Categories";

//for clothes_table
type ClothesItem = {
  id: Int8Array;
  item_name: string;
  category: ClothingCategory;
  image_path: string;
};

type ClothesItemWithUrl = ClothesItem & {
  imageUrl: string | null;
};


export default async function fetchClothesByCategory(category: ClothingCategory): Promise<ClothesItemWithUrl[]> {
  //fetch data from table
  const { data, error } = await supabase
    .from(CLOTHES_TABLE)
    .select("id, item_name, category, image_path")
    .eq("category", category);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  //generate signed urls for data from table
  const itemsWithUrls = await Promise.all(
    data.map(async (item) => {
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(item.image_path, 60 * 60);

      if (signedUrlError) {
        console.error(signedUrlError);

        return {
          ...item,
          imageUrl: null,
        };
      }

      return {
        ...item,
        imageUrl: signedUrlData.signedUrl,
      };
    })
  );

  //use temporary signed url for display
  return itemsWithUrls;
}