import { defaultCookieOptions } from "./cookie-options";
import type { CookieOptions } from "./cookie-options";

/**
 * Utility service to manage browser cookies with flexible options.
 */
export class CookieService {
  /**
   * Sets a cookie with given name, value, and options.
   * Options are merged with default cookie options.
   * @param cname - Cookie name
   * @param cvalue - Cookie value
   * @param options - Optional cookie attributes (expires, path, domain, secure, sameSite)
   *
   * @remarks
   * The name and value are URI-encoded. `Secure` is on by default, so the cookie
   * is dropped by browsers on plain HTTP other than localhost.
   */
  static set(cname: string, cvalue: string, options?: CookieOptions): void {
    const mergedOptions = { ...defaultCookieOptions, ...options };

    let cookieStr = `${encodeURIComponent(cname)}=${encodeURIComponent(cvalue)}`;

    if (mergedOptions.expires) {
      const expires =
        mergedOptions.expires instanceof Date
          ? mergedOptions.expires.toUTCString()
          : mergedOptions.expires;
      cookieStr += `; expires=${expires}`;
    }

    if (mergedOptions.path) {
      cookieStr += `; path=${mergedOptions.path}`;
    }

    if (mergedOptions.domain) {
      cookieStr += `; domain=${mergedOptions.domain}`;
    }

    if (mergedOptions.secure) {
      cookieStr += `; Secure`;
    }

    if (mergedOptions.sameSite) {
      cookieStr += `; SameSite=${mergedOptions.sameSite}`;
    }

    document.cookie = cookieStr;
  }

  /**
   * Retrieves the value of a cookie by its name.
   * @param cname - Cookie name
   * @returns Cookie value or null if not found
   *
   * @remarks
   * The whole `document.cookie` string is decoded before splitting, so a value
   * containing an encoded `;` will be misparsed.
   */
  static get(cname: string): string | null {
    const name = encodeURIComponent(cname) + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");

    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length);
      }
    }
    return null;
  }
}
