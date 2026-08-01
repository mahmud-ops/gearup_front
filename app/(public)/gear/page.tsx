import GearCard, { type GearCardProps } from "@/components/shared/GearCard";
import { getGears } from "@/services/gear";

const GearPage = async () => {
  const gears = await getGears();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 m-2">
      {gears.map((g) => (
        <GearCard
          key={g.id}
          id={g.id}
          image={g.image}
          name={g.name}
          availableQuantity={g.availableQuantity}
          dailyRate={g.dailyRate}
          category={g.category.name}
        />
      ))}
    </div>
  );
};

export default GearPage;
