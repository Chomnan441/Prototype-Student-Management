import { avatarClass, initials } from "../../utils/format";
import { cn } from "../../utils/cn";

interface StudentAvatarProps {
  id: string;
  firstName: string;
  lastName: string;
  size?: "sm" | "lg";
}

export function StudentAvatar({ id, firstName, lastName, size = "sm" }: StudentAvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        size === "lg" ? "size-16 text-xl" : "size-9 text-xs",
        avatarClass(id),
      )}
      aria-hidden="true"
    >
      {initials(firstName, lastName)}
    </span>
  );
}
