const PACKAGE_STYLE_MAP: Record<string, string> = {
  silver: "bg-[#ff3b00] text-black",
  gold: "bg-[#9747ff] text-black",
  platinum: "bg-[#ffa600] text-black",
};

export function getPackageStyle(name?: string) {
  if (!name) {
    return "bg-background text-foreground";
  }

  return PACKAGE_STYLE_MAP[name.toLowerCase()] ?? "bg-muted text-foreground";
}
