import { cn } from "@/_lib/cn";
import { forwardRef } from "react";

interface SpinnerProps extends React.ComponentPropsWithoutRef<"div"> {
	withBackdrop?: boolean;
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({ className, withBackdrop = false, ...props }, ref) => {
	const spinner = (
		<div
			ref={ref}
			className={cn(
				"animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-white",
				className
			)}
			{...props}
		/>
	);

	if (!withBackdrop) return spinner;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
			{spinner}
		</div>
	);
});

Spinner.displayName = "Spinner";

export { Spinner };