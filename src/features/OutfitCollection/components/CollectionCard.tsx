interface CollectionCardProps {
  id: string;
  imgURL: string;
  onClick: (id: string, imgURL: string) => void;
}

const CollectionCard = ({
  id,
  imgURL,
  onClick,
}: CollectionCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(id, imgURL)}
      className="
        group relative aspect-square w-full overflow-hidden rounded-xl
        border border-white/40
        shadow-[0_8px_10px_rgba(0,0,0,0.08)]
        hover:drop-shadow-xl hover:drop-shadow-gray-200 hover:scale-105
        transition-transform duration-200
        cursor-pointer
      "
    >
      <img
        src={imgURL}
        alt="outfit"
        className="h-full w-full object-contain"
      />
    </button>
  );
};

export default CollectionCard;