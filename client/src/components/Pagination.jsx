import { ChevronRight, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button"; // Assuming shadcn/ui

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function Pagination({ current = 1, total = 3, onPageChange }) {
  return (
    <nav className="flex gap-4 items-center">
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === current ? "default" : "ghost"}
          className={
            page === current
              ? "rounded-full w-14 h-14 bg-pink-300 text-black text-xl font-bold shadow-md pointer-events-none cursor-default"
              : "rounded-full w-14 h-14 bg-slate-800/60 text-slate-300 text-xl font-bold"
          }
          onClick={() => page !== current && onPageChange && onPageChange(page)}
          disabled={page === current}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        className="rounded-full w-14 h-14 bg-slate-800/60 text-slate-300"
        onClick={() => onPageChange && onPageChange(current + 1)}
        disabled={current === total}
      >
        <ChevronRight size={24} />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full w-14 h-14 bg-slate-800/60 text-slate-300"
        onClick={() => onPageChange && onPageChange(total)}
        disabled={current === total}
      >
        <ChevronsRight size={24} />
      </Button>
    </nav>
  );
}
