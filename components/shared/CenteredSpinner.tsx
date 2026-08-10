import { Spinner } from "@/components/ui/spinner"

export const CenteredSpinner = ({ className = "" }: { className?: string }) => (
  <div className={`flex justify-center items-center min-h-[200px] ${className}`}>
    <Spinner className="size-8" />
  </div>
)
