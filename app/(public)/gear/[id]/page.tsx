import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getGear } from "@/services/gear";
import { getCurrentUser } from "@/services/auth";
import ReviewsSection from "@/components/shared/ReviewsSection";
import { cookies } from "next/headers";



type Props = {
  params: Promise<{
    id: string;
  }>;
};



const GearDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  const gear = await getGear(id);

  const token = (await cookies()).get("accessToken")?.value;
  let currentUserId: string | undefined;
  if (token) {
    try {
      const user = await getCurrentUser(token);
      currentUserId = user.id;
    } catch {
      currentUserId = undefined;
    }
  }

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
            <Link href={`/checkout/${gear.id}`}>
            <Button className="w-full sm:w-auto px-8 py-2 font-semibold">
              Rent Now
            </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <ReviewsSection gearId={id} currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default GearDetailsPage;
