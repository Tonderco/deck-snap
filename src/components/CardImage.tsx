"use client";

type Props = { src?: string; alt?: string; label: "Previous" | "Current" };

export default function CardImage({ src, alt, label }: Props) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="w-40 h-56 rounded-xl bg-white/70 shadow flex items-center justify-center overflow-hidden">
                {src ? (
                    <img src={src} alt={alt ?? label} className="w-full h-full object-contain animate-[fade_300ms_ease]" />
                ) : (
                    <div className="text-gray-400">—</div>
                )}
            </div>
        </div>
    );
}
