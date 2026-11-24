import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface MenuProps {
  label: string;
  children: ReactNode;
  trigger: ReactNode;
  triggerClassName?: string;
}

export function Menu({ label, children, trigger, triggerClassName }: MenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return;

    const rect = button.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const width = menuRect.width || 208;
    const height = menuRect.height || 160;
    let left = rect.right - width;
    let top = rect.bottom + 6;
    if (left < 8) left = 8;
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
    if (top + height > window.innerHeight - 8) top = Math.max(8, rect.top - height - 6);
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.classList.remove("invisible");
    menu.querySelector<HTMLButtonElement>("[role='menuitem']")?.focus();

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function onReposition() {
      setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={
          triggerClassName ??
          "inline-flex items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        }
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
      >
        {trigger}
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              className="invisible fixed z-50 min-w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
            >
              <div onClick={() => setOpen(false)}>{children}</div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

interface MenuItemProps {
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
}

export function MenuItem({ onClick, children, icon }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 outline-none hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
