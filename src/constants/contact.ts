/**
 * How users can reach the team to report a problem in a song or in the app.
 * Leave a field empty ('') to hide that contact option.
 */
export const CONTACT = {
  email: 'techcmk11@gmail.com',
  /** WhatsApp number in international format, digits only (+243 980 139 630). */
  whatsapp: '243980139630',
} as const;

export const hasContact = Boolean(CONTACT.email || CONTACT.whatsapp);
