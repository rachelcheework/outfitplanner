import supabase from "../../../supabase-client";

type OutfitItem = {
  id: string;
  outfit_image_path: string;
};

type OutfitItemWithUrl = OutfitItem & {
    outfitImageUrl: string | null;
}

export default async function fetchOutfits(): Promise<OutfitItemWithUrl[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const { data, error } = await supabase
    .from("outfits_table")
    .select("id, outfit_image_path")
    .eq("user_id", user.id)
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
          .from("outfits-collection")
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