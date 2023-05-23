export function isImg(filePath: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp|svg)$/.test(filePath)
}
