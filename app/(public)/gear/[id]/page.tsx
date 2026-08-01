import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  dailyRate: string;
  availableQuantity: number;
  image: string;
  providerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const getGear = async (id: string): Promise<GearItem> => {
  const response = await fetch(
    `https://gearup-backend-api.onrender.com/api/gear_items/${id}`,
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

const GearDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  const gear = await getGear(id);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border rounded-lg p-6">
        <div className="relative aspect-square w-full rounded-md border overflow-hidden bg-muted/20">
          <Image
            src={gear.image || "/no_image.webp"}
            alt={gear.name}
            fill
            className="object-contain p-4"
            priority
          />
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold">{gear.name}</h1>

            <Badge variant={"secondary"} className="p-4 uppercase font-semibold">
              {gear.category.name}
            </Badge>

            <div className="text-xl font-semibold">
              ${gear.dailyRate}{" "}
              <span className="text-sm text-muted-foreground font-normal">
                / day
              </span>
            </div>

            <p className="text-sm">
              <span className="text-muted-foreground">Available: </span>
              <span className="font-medium">{gear.availableQuantity}</span>
            </p>

            <div className="pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {gear.description}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full sm:w-auto px-8 py-2 font-semibold">
              Rent Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GearDetailsPage;
