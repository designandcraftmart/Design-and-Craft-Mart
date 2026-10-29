/**
 * Contact details and social links, kept in one place so the header, footer
 * and Contact page all stay in sync.
 */
export const site = {
  name: "Design & Craft Mart",
  phoneDisplay: "01645-070698",
  phoneHref: "tel:01645070698",
  whatsappDisplay: "+880 1634-361396",
  whatsappHref: "https://wa.me/8801634361396",
  email: "designandcraftmart@gmail.com",
  emailHref: "mailto:designandcraftmart@gmail.com",
  instagramHandle: "designandcraftmart",
  instagramHref: "https://www.instagram.com/designandcraftmart/",
  facebookName: "https://www.facebook.com/designandcraftmart",
  // TODO: paste the real Facebook page URL. While empty, the footer shows the
  // page name as plain text instead of a link.
  facebookHref: "",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
