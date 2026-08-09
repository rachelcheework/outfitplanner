import supabase from "../../../supabase-client";
import { OUTFIT_BUCKET, OUTFITS_TABLE } from "../../../constants/TableNames";

type OutfitItem = {
  id: string;
  outfit_image_path: string;
};

type OutfitItemWithUrl = OutfitItem & {
    outfitImageUrl: string | null;
}

export default async function fetchOutfits(userId: string): Promise<OutfitItemWithUrl[]> {

  const { data, error } = await supabase
    .from(OUTFITS_TABLE)
    .select("id, outfit_image_path")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  const outfitsWithUrls = await Promise.all(
    (data ?? []).map(async (outfit) => {
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from(OUTFIT_BUCKET)
          .createSignedUrl(outfit.outfit_image_path, 60 * 60);

      return {
        ...outfit,
        outfitImageUrl: signedUrlError
          ? null
          : signedUrlData.signedUrl,
      };
    }),
  );

  return outfitsWithUrls;
}