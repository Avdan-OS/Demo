/**
 * Attributes that can be attached to a cookie by {@link CookieService.set}.
 * Every field is optional and falls back to {@link defaultCookieOptions}.
 */
export type CookieOptions = {
  /** Expiry as a `Date` or a ready-made UTC date string. See `DateHelper` for helpers. */
  expires?: Date | string;
  /** URL path the cookie is sent for. */
  path?: string;
  /** Host the cookie is valid for. */
  domain?: string;
  /** Only send the cookie over HTTPS. */
  secure?: boolean;
  /** Cross-site sending policy. `None` requires `secure`. */
  sameSite?: "Strict" | "Lax" | "None";
};

/**
 * Options applied to every cookie unless overridden: expires in 7 days,
 * path `/`, current hostname, `Secure`, `SameSite=Strict`.
 *
 * @remarks
 * `expires` is computed once, when this module loads, not on each `set` call.
 * Pass an explicit `expires` for anything long-lived.
 */
export const defaultCookieOptions: Required<Omit<CookieOptions, "httpOnly">> = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  path: "/",
  domain: window.location.hostname,
  secure: true,
  sameSite: "Strict",
};

export default CookieOptions;
