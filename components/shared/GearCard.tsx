import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export type GearCardProps = {
  id: string;
  name: string;
  category: string;
  image?: string;
  dailyRate: string;
  availableQuantity: number;
};

const GearCard = ({
  id,
  name,
  category,
  image,
  dailyRate,
  availableQuantity,
}: GearCardProps) => {


  return (
    <>
      <Card className="overflow-hidden rounded-xl">
        {/* Image Container */}
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={image ? image : "/no_image.webp"} // Replace with your image path
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        <CardHeader className="p-4 pb-2">
          <p className="text-xs uppercase text-muted-foreground tracking-wide">
            {category}
          </p>
          <CardTitle className="text-lg">{name}</CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-base">
              {`${Number(dailyRate)} tk`}
              <span className="text-xs font-normal text-muted-foreground">
                / day
              </span>
            </span>
            <span className="text-sm text-muted-foreground">
              {`Available: ${availableQuantity}`}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Link href={`/gear/${id}`} className="w-full">
            <Button className="w-full rounded-xl">View Details</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default GearCard;
