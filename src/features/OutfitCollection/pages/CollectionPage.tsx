import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { OUTFIT_BUCKET, OUTFITS_TABLE } from "../../../constants/TableNames";
import fetchOutfits from "../api/fetchOutfits";
import CollectionCard from "../components/CollectionCard";
import supabase from "../../../supabase-client";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";

const CollectionPage = () => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const [selectedOutfit, setSelectedOutfit] = useState<{
    id: string;
    imgURL: string;
  } | null>(null);

  const deleteOutfitMutation = useMutation({
    mutationFn: async (id: string) => {
      // First fetch the row so we know which storage file to delete
      const { data: outfit, error: fetchError } = await supabase
        .from(OUTFITS_TABLE)
        .select("outfit_image_path")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete the image from storage
      const { error: storageError } = await supabase.storage
        .from(OUTFIT_BUCKET)
        .remove([outfit.outfit_image_path]);

      if (storageError) {
        throw storageError;
      }

      // Delete the database row
      const { error: deleteError } = await supabase
        .from(OUTFITS_TABLE)
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
    queryKey: ["outfits", user?.id],
    queryFn: () => fetchOutfits(user!.id),
    enabled: !!user,
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

  async function saveImageToComputer(imgURL: string) {
    const response = await fetch(imgURL);
    const blob = await response.blob();

    const objectURL = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = objectURL;
    link.download = "outfit.png";

    link.click();

    URL.revokeObjectURL(objectURL);
  }
  return (
    <div className="flex flex-1 min-h-0 rounded-2xl bg-gray-100 p-3 md:p-3">
      <main className="grid items-start content-start grid-cols-2 gap-3 md:p-3 md:gap-6 overflow-y-auto md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {outfits.map((outfit) => (
          <article key={outfit.id}>
            {outfit.outfitImageUrl && (
              <CollectionCard
                key={outfit.id}
                id={outfit.id}
                onClick={(id, imgURL) =>
                  setSelectedOutfit({
                    id,
                    imgURL,
                  })
                }
                imgURL={outfit.outfitImageUrl}
              />
            )}
          </article>
        ))}
      </main>

      {selectedOutfit && (
        <div
          className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/50
    "
        >
          <div
            className="
        relative
        flex
        max-h-[90vh]
        max-w-[90vw]
        flex-col
        items-center
        gap-4
        rounded-xl
        bg-white
        p-6
      "
          >
            <button
              type="button"
              onClick={() => setSelectedOutfit(null)}
              className="
          absolute
          right-2
          top-2
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-gray-300
          opacity-50
          shadow
        "
            >
              <IoIosClose size={24} />
            </button>

            <img
              src={selectedOutfit.imgURL}
              alt="Selected outfit"
              className="max-h-[70vh] max-w-[70vw] object-contain"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onDelete(selectedOutfit.id);
                  setSelectedOutfit(null);
                }}
                className="rounded bg-red-500 px-4 py-2 text-white"
              >
                Delete
              </button>

              <button
                type="button"
                onClick={() =>
                  saveImageToComputer(selectedOutfit.imgURL)
                }
                className="rounded bg-blue-500 px-4 py-2 text-white"
              >
                Save to device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollectionPage
