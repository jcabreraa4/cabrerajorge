export function sizeToText(fileSize: number) {
  if (fileSize < 1024) return `Size: ${fileSize} B`;
  else if (fileSize < 1024 * 1024) return `Size: ${(fileSize / 1024).toFixed(2)} KB`;
  else if (fileSize < 1024 * 1024 * 1024) return `Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  else return `Size: ${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
