import Image from "next/image";

function HealthCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-xl p-7 flex items-center gap-6 shadow-sm">
      <div className="w-[70px] h-[70px] rounded-full bg-[#E1F1E5] flex items-center justify-center">
        <Image src={icon} alt="Health Icon" width={38} height={38} />
      </div>
      <div>
        <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#051a6f] mb-1">{value}</h4>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
    </div>
  );
}

export default HealthCard;
