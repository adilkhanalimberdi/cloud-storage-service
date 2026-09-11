export type FolderIcon = "DEFAULT" | "HARD_DRIVE" | "USERS" | "CLOCK" | "STAR" | "TRASH";
export type FileIcon = "TXT" | "PDF" | "IMG" | "ZIP";

export const iconMap: Record<FolderIcon | FileIcon, string> = {
    "DEFAULT": "📁",
    "HARD_DRIVE": "💻",
    "USERS": "👥",
    "CLOCK": "🕒",
    "STAR": "⭐",
    "TRASH": "🗑️",
    "TXT": "📄",
    "PDF": "📕",
    "IMG": "🖼️",
    "ZIP": "📦",
}