export type Icon = "FOLDER" | "HARD_DRIVE" | "USERS" | "CLOCK" |
    "STAR" | "TRASH" | "TXT" | "PDF" | "IMAGE";

export const iconMap: Record<Icon, string> = {
    "FOLDER": "📁",
    "HARD_DRIVE": "💻",
    "USERS": "👥",
    "CLOCK": "🕒",
    "STAR": "⭐",
    "TRASH": "🗑️",
    "TXT": "📄",
    "PDF": "📕",
    "IMAGE": "🖼️"
}