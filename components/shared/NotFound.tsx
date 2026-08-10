import Navbar from "./Navbar";
import Footer from "./Footer";
import { Button } from "../ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Sorry, we could not find the page you are looking for. It might have been removed, renamed, or does not exist.
          </p>
          <Link href="/">
            <Button size="lg">
              Go Back Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
