import Image from "next/image";

export const UserCard = ({ type }: { type: string }) => {
  return (
    <div
      className="
        rounded-2xl 
        odd:bg-lamaPurple even:bg-lamaYellow 
        p-2 
        min-w-[130px] flex-1
        transition-all duration-300 
        hover:scale-105 hover:shadow-lg hover:shadow-gray-300/50
        cursor-pointer
      "
    >
      <div className="flex justify-between items-center">
        <span className="bg-white rounded-full text-[10px] px-2 py-1 text-green-600 font-medium">
          2024/25
        </span>
        <Image src="/more.png" alt="more-icon" width={20} height={20} />
      </div>

      <h1 className="text-2xl font-semibold my-4 text-gray-800">1,234</h1>
      <h2 className="text-gray-500 text-sm font-medium capitalize">{type}s</h2>
    </div>
  );
};

export default UserCard;
