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
      </div>
    );
  }

  return (
    <div className="container py-20 text-center">
      <h1 className="text-3xl font-bold">Payment Failed</h1>
      <p className="mt-4 text-muted-foreground">
        Please try again.
      </p>
    </div>
  );
};

export default PaymentPage;