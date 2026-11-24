import { CheckCircle2, Info, X, XCircle } from "lucide-react";

export type ToastTone = "success" | "info" | "error";

export interface ToastMessage {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastViewportProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const toneStyles = {
  success: "border-emerald-200 bg-white text-slate-900",
  info: "border-sky-200 bg-white text-slate-900",
  error: "border-rose-200 bg-white text-slate-900",
} as const;

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col gap-2 sm:left-auto sm:right-4 sm:w-96"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon = toast.tone === "error" ? XCircle : toast.tone === "info" ? Info : CheckCircle2;
        const iconClass =
          toast.tone === "error" ? "text-rose-600" : toast.tone === "info" ? "text-sky-600" : "text-emerald-600";
        return (
          <article
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${toneStyles[toast.tone]}`}
          >
            <Icon className={`mt-0.5 size-5 shrink-0 ${iconClass}`} aria-hidden="true" />
            <p className="flex-1 text-sm leading-5">{toast.message}</p>
            <button
              type="button"
              className="rounded-md p-1 text-slate-400 outline-none hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </article>
        );
      })}
    </div>
  );
}
