export function zenkakuToHankaku(str: string | null) {
  if (!str) return null
  return str
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0),
    )
    .replace(/　/g, ' ');
}
