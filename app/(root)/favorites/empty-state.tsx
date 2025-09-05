import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  ctaHref?: string;
  ctaText?: string;
  imageSrc?: string; // optional custom illustration path
}

export default function EmptyState({
  title,
  description,
  ctaHref = "/",
  ctaText = "Bosh sahifaga qaytish",
  imageSrc,
}: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center text-center py-12 sm:py-16">
      {/* Illustration */}
      {imageSrc ? (
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-6">
          <Image src={imageSrc} alt={title} fill className="object-contain" />
        </div>
      ) : (
        <div className="mb-6">
          {/* Inline SVG (shopping bag + heart) */}
          <svg
            width="164"
            height="164"
            viewBox="0 0 164 164"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
            aria-hidden
          >
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <circle cx="82" cy="82" r="78" fill="#F5F3FF" />
            <rect x="38" y="58" width="88" height="70" rx="14" fill="url(#g)" />
            <path
              d="M58 58c0-11 9-20 20-20s20 9 20 20"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="74" cy="86" r="6" fill="white" />
            <circle cx="106" cy="86" r="6" fill="white" />
            <path
              d="M85.5 112.5l-10.2-9.4a8 8 0 0110.9-11.6l1.6 1.5 1.6-1.5a8 8 0 0110.9 11.6l-10.2 9.4a2 2 0 01-2.6 0z"
              fill="#FDE68A"
              stroke="#FCD34D"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}

      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-md">
          {description}
        </p>
      ) : null}

      {ctaHref ? (
        <Link href={ctaHref} className="mt-6">
          <Button className="rounded-xl">{ctaText}</Button>
        </Link>
      ) : null}
    </div>
  );
}
