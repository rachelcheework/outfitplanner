import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import fetchOutfits from "../helper/fetchOutfits";
import CollectionCard from "../components/CollectionCard";
import supabase from "../../../supabase-client";

const CollectionPage = () => {

  const queryClient = useQueryClient();

  const deleteOutfitMutation = useMutation({
    mutationFn: async (id: string) => {
      // First fetch the row so we know which storage file to delete
      const { data: outfit, error: fetchError } = await supabase
        .from("outfits_table")
        .select("outfit_image_path")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete the image from storage
      const { error: storageError } = await supabase.storage
        .from("outfits-collection")
        .remove([outfit.outfit_image_path]);

      if (storageError) {
        throw storageError;
      }

      // Delete the database row
      const { error: deleteError } = await supabase
        .from("outfits_table")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["outfits"],
      });
    },

    onError: (error) => {
      console.error("Failed to delete outfit:", error);
    },
  });

  function onDelete(id: string) {
    deleteOutfitMutation.mutate(id);
  }


  const {
    data: outfits = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["outfits"],
    queryFn: fetchOutfits,
  });

  if (isLoading) {
    return <p>Loading outfits...</p>;
  }

  if (isError) {
    return (
      <p>
        {error instanceof Error
          ? error.message
          : "Failed to load outfits."}
      </p>
    );
  }
  return (
    <div>
      <main className="grid grid-cols-6 gap-2">
        {outfits.map((outfit) => (
          <article key={outfit.id}>
            {outfit.outfitImageUrl && (
              <CollectionCard
                key={outfit.id}
                id={outfit.id}
                onDelete={onDelete}
                imgURL={outfit.outfitImageUrl}
              />
            )}
          </article>
        ))}
      </main>
    </div>
  )
}

export default CollectionPage
