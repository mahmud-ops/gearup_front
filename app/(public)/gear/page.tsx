import GearCard, { type GearCardProps } from "@/components/shared/GearCard";

interface GearItem {
  id: string;
  name: string;
  description?: string;
  dailyRate: string;
  availableQuantity: number;
  image: string;
  category: {
    name: string;
  };
}

interface GearResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GearItem[];
}

const getGear = async (): Promise<GearItem[]> => {
  const response = await fetch(
    "https://gearup-backend-api.onrender.com/api/gear_items",
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result: GearResponse = await response.json();

  return result.data;
};

const GearPage = async () => {
  const gears = await getGear();

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
