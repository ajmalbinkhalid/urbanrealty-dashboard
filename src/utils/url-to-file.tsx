export async function urlToFile(url: string, filename?: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename || "image", { type: blob.type });
}
