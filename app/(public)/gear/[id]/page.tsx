type Props = {
  params: Promise<{
    id: string;
  }>;
};

const GearDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <>
        
    </>
  );
};

export default GearDetailsPage;