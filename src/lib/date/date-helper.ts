/**
 * Static helpers that build a future `Date` relative to now, mainly for cookie
 * expiry.
 *
 * @example
 * ```ts
 * CookieService.set("session", token, { expires: DateHelper.expiresInDays(3) });
 * ```
 */
export class DateHelper {
  /**
   * Returns the expiration date after the specified number of minutes from now.
   * @param minutes - Number of minutes until expiration
   * @returns A new `Date` that many minutes from now.
   */
  static expiresInMinutes(minutes: number): Date {
    const d = new Date();
    d.setTime(d.getTime() + minutes * 60 * 1000);
    return d;
  }

  /**
   * Returns the expiration date after the specified number of hours from now.
   * @param hours - Number of hours until expiration
   * @returns A new `Date` that many hours from now.
   */
  static expiresInHours(hours: number): Date {
    const d = new Date();
    d.setTime(d.getTime() + hours * 60 * 60 * 1000);
    return d;
  }

  /**
   * Returns the expiration date after the specified number of days from now.
   * @param days - Number of days until expiration
   * @returns A new `Date` that many days from now.
   */
  static expiresInDays(days: number): Date {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    return d;
  }

  /**
   * Returns the expiration date after the specified number of seconds from now.
   * @param seconds - Number of seconds until expiration
   * @returns A new `Date` that many seconds from now.
   */
  static expiresInSeconds(seconds: number): Date {
    const d = new Date();
    d.setTime(d.getTime() + seconds * 1000);
    return d;
  }
}

export default DateHelper;
