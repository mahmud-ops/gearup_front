import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    success?: string;
  }>;
};

const PaymentPage = async ({ searchParams }: Props) => {
  const { success } = await searchParams;

  if (success === "true") {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>
        <p className="mt-4 text-muted-foreground">
          Your rental has been confirmed.
        </p>

        <Link href={`/gear`}>
          <Button className={"m-4 rounded-lg border-3"} variant={"outline"}>
            Browse more products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-20 text-center">
      <h1 className="text-3xl font-bold">Payment Failed</h1>
      <p className="mt-4 text-muted-foreground">Please try again.</p>
    </div>
  );
};

export default PaymentPage;
