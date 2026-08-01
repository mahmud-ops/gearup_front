import { GearItem } from "../page";

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

  return (
    <>
        <h1>{`Gear name: ${(await getGear(id)).name}`}</h1>
    </>
  );
};

export default GearDetailsPage;
