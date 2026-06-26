"use client";

import { useState, type ReactNode } from "react";

interface InputSectionCardProps {
  title: string;
  description?: string;
  /** When true, the card starts collapsed (good for advanced inputs). */
  defaultCollapsed?: boolean;
  /** When false, the card is always open and not collapsible. */
  collapsible?: boolean;
  children: ReactNode;
}

/** A titled, optionally-collapsible group of related inputs. */
export function InputSectionCard({
  title,
  description,
  defaultCollapsed = false,
  collapsible = true,
  children,
}: InputSectionCardProps) {
  const [open, setOpen] = useState(!defaultCollapsed);
  const isOpen = collapsible ? open : true;

  return (
    <div className="card p-5">
      <button
        type="button"
        onClick={() => collapsible && setOpen((v) => !v)}
        className="flex w-full items-start justify-between text-left"
        aria-expanded={isOpen}
        disabled={!collapsible}
      >
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {collapsible && (
          <span
            className={`ml-4 mt-1 shrink-0 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            ▾
          </span>
        )}
      </button>

      {isOpen && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
}
