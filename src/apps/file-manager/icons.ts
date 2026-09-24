/**
 * Lazy loaders for the file-manager icons, keyed by name.
 *
 * @remarks
 * Each value is a dynamic `import()` so an icon is only fetched when used.
 * To add an icon, drop the image into `static/assets/images/demo/icons/Files`
 * and add an entry here.
 *
 * @example
 * ```ts
 * const { default: url } = await IconRegistry.PDF();
 * ```
 */
export const IconRegistry = {
  Documents: () => import("@assets/images/demo/icons/Files/Documents.png"),
  Downloads: () => import("@assets/images/demo/icons/Files/Downloads.png"),
  Applications: () =>
    import("@assets/images/demo/icons/Files/Applications.png"),
  Desktop: () => import("@assets/images/demo/icons/Files/Desktop.png"),
  Recents: () => import("@assets/images/demo/icons/Files/Recents.png"),

  XLSX: () => import("@assets/images/demo/icons/Files/XLSX.png"),
  DOCX: () => import("@assets/images/demo/icons/Files/DOCX.png"),
  PDF: () => import("@assets/images/demo/icons/Files/PDF.png"),
  AEP: () => import("@assets/images/demo/icons/Files/AEP.png"),
  PSD: () => import("@assets/images/demo/icons/Files/PSD.png"),
};
