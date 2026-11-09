import React from "react";
import { ContainerMark } from "../SiteNav";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
    <path
      d="M14 4v10.2a4.2 4.2 0 1 1-3.6-4.16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M14 4c.35 2.1 1.55 3.35 3.7 3.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" aria-hidden="true">
    <path
      d="M5 4.5 19 19.5M19 4.5 5 19.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const socials = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
  { label: "X", href: "#", Icon: XIcon },
];

const Footer = () => (
  <footer className="bg-ink px-5 py-10 text-cream sm:px-8 md:py-12 lg:px-16">
    <div className="mx-auto w-full max-w-[1312px]">
      <div className="flex flex-col gap-8 border-b border-cream/10 pb-8 md:flex-row md:items-center md:justify-between">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="e'sweet home"
        >
          <ContainerMark />
          <span className="font-logo text-[23px] font-extrabold leading-none tracking-[-0.035em] text-tomato">
            e&apos;sweet
          </span>
        </a>

        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-7 gap-y-3 text-[13.5px] font-semibold text-cream/70"
        >
          <a href="#order" className="transition-colors hover:text-cream">
            Order
          </a>
          <a href="#menu" className="transition-colors hover:text-cream">
            Menu
          </a>
          <a href="#story" className="transition-colors hover:text-cream">
            Story
          </a>
          <a href="#visit" className="transition-colors hover:text-cream">
            Visit
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="grid h-9 w-9 place-items-center rounded-full bg-cream/10 text-cream/80 transition-colors hover:bg-tomato hover:text-white"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      <p className="mt-6 text-[11.5px] text-cream/40 sm:text-[12.5px]">
        © 2026 e&apos;sweet Container Kitchen. Cooked with love in Ota.
      </p>
    </div>
  </footer>
);

export default Footer;
