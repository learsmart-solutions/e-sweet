import React, { useId, useRef, useState } from "react";
import { useStore } from "../../../context/StoreContext";
import { whatsappLink } from "../../../lib/whatsapp";
import {
  REPORT_SENT_MESSAGE,
  SHOP_ADDRESS,
  SUPPORT_CHAT_MESSAGE,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  supportEmailLink,
} from "../../../lib/support";
import faqItems from "../../../data/faq.json";
import WhatsAppIcon from "../../WhatsAppIcon";
import Toast from "../kit/Toast";
import useToast from "../kit/useToast";
import SettingsOverlay from "../kit/SettingsOverlay";
import ReportForm from "./help/ReportForm";
import { APP_VERSION } from "../sections";
import { buttonVariants } from "../settingsStyles";
import {
  AlertIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentIcon,
  HelpIcon,
  MailIcon,
  ShieldIcon,
} from "../kit/icons";
import useMediaQuery from "../../../hooks/useMediaQuery";

export const sectionKey = "help";

const rowClass =
  "flex w-full items-center gap-3 bg-cream-light px-4 py-3 text-left transition-colors hover:bg-[#fff8ec] focus-visible:relative focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tomato";

const RowIcon = ({ children }) => (
  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-tomato/10 text-tomato">
    {children}
  </span>
);

const RowText = ({ title, children }) => (
  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
    <span className="text-[15px] font-semibold text-ink">{title}</span>
    <span className="text-[12px] leading-[1.4] text-muted">{children}</span>
  </span>
);

// "No WhatsApp? Email support@esweet.ng" - the fallback shown with the form.
const EmailFallback = ({ className = "" }) => (
  <p className={`text-[12px] text-muted ${className}`}>
    No WhatsApp? Email{" "}
    <a
      href={supportEmailLink("Issue report")}
      className="font-semibold text-tomato underline underline-offset-2"
    >
      {SUPPORT_EMAIL}
    </a>
  </p>
);

/**
 * Settings > Help and support (/settings/help).
 *
 * WhatsApp first, then FAQ, report an issue and an email fallback.
 *
 * - FAQ opens in place (the answers come from src/data/faq.json, the same
 *   list as the landing page).
 * - Report an issue: desktop shows the form in a card under the help rows;
 *   phone opens it as a full-screen page. Both send through
 *   lib/support.js#sendReport, which for now opens WhatsApp with the report
 *   typed out (no support API exists yet).
 * - Terms and Privacy have no pages yet, so they are shown as plain rows.
 *
 * pages/Settings.jsx mounts this component twice (phone and desktop
 * layouts), so ids come from useId.
 */
const HelpPage = () => {
  const { user } = useStore();
  const { toast, showToast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const faqPanelId = useId();
  const cardFormId = useId();
  const screenFormId = useId();
  const cardDescriptionRef = useRef(null);
  const reportCardRef = useRef(null);

  const [faqOpen, setFaqOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const chatHref = whatsappLink(SUPPORT_CHAT_MESSAGE);

  const handleSent = () => {
    setReportOpen(false);
    showToast(REPORT_SENT_MESSAGE);
  };
  const handleFail = () =>
    showToast(`Couldn't open WhatsApp. Email ${SUPPORT_EMAIL} instead.`, "error");

  // Phone opens the full-screen form; desktop brings the inline card into
  // view and puts the cursor in it.
  const startReport = () => {
    if (isDesktop) {
      reportCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      cardDescriptionRef.current?.focus({ preventScroll: true });
    } else {
      setReportOpen(true);
    }
  };

  const whatsappCard = (
    <section
      aria-labelledby={`${faqPanelId}-chat`}
      className="flex flex-col items-start gap-4 rounded-[20px] bg-[#2f7d4f] p-5 text-white lg:self-start lg:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15">
          <WhatsAppIcon className="size-6" />
        </span>
        <div className="flex flex-col gap-0.5">
          <h2
            id={`${faqPanelId}-chat`}
            className="font-display text-[18px] font-extrabold tracking-[-0.01em] lg:text-[24px]"
          >
            Chat on WhatsApp
          </h2>
          <p className="text-[12px] text-white/85">
            Fastest way to reach us · {SUPPORT_HOURS}
          </p>
        </div>
      </div>
      {chatHref && (
        <a
          href={chatHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-[14px] font-bold text-[#2f7d4f] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:w-auto lg:py-2.5"
        >
          Start a chat <span aria-hidden="true">&nbsp;→</span>
        </a>
      )}
    </section>
  );

  const helpRows = (
    <ul className="flex flex-col gap-px overflow-hidden rounded-[18px] bg-sand">
      <li>
        <button
          type="button"
          onClick={() => setFaqOpen((open) => !open)}
          aria-expanded={faqOpen}
          aria-controls={faqPanelId}
          className={rowClass}
        >
          <RowIcon>
            <HelpIcon size={18} />
          </RowIcon>
          <RowText title="FAQ">Delivery areas, payments, packs</RowText>
          {faqOpen ? (
            <ChevronDownIcon size={18} className="text-ink" />
          ) : (
            <ChevronRightIcon size={18} className="text-ink" />
          )}
        </button>
        {faqOpen && (
          <div id={faqPanelId} className="flex flex-col bg-cream-light px-4 pb-3">
            {faqItems.map((item) => (
              <details key={item.id} className="group border-t border-sand py-2.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDownIcon
                    size={16}
                    className="text-muted transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="pt-2 text-[13px] leading-[1.55] text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        )}
      </li>
      <li>
        <button type="button" onClick={startReport} className={rowClass}>
          <RowIcon>
            <AlertIcon size={18} />
          </RowIcon>
          <RowText title="Report an issue">
            <span className="lg:hidden">Something wrong with the app or a payment</span>
            <span className="hidden lg:inline">Short form · we reply on WhatsApp</span>
          </RowText>
          <ChevronRightIcon size={18} className="text-ink" />
        </button>
      </li>
      <li>
        <a href={supportEmailLink()} className={rowClass}>
          <RowIcon>
            <MailIcon size={18} />
          </RowIcon>
          <RowText title="Email us instead">{SUPPORT_EMAIL}</RowText>
          <ChevronRightIcon size={18} className="text-ink" />
        </a>
      </li>
    </ul>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-6">
        {whatsappCard}
        <section className="flex flex-col gap-2">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted lg:hidden">
            More help
          </h2>
          {helpRows}
        </section>
      </div>

      {/* Desktop: the report form sits on the page. */}
      <section
        ref={reportCardRef}
        aria-labelledby={`${cardFormId}-title`}
        className="hidden rounded-[24px] bg-cream-light p-6 lg:block"
      >
        <h2
          id={`${cardFormId}-title`}
          className="mb-4 font-display text-[20px] font-extrabold tracking-[-0.02em] text-ink"
        >
          Report an issue
        </h2>
        <ReportForm
          formId={cardFormId}
          variant="card"
          user={user}
          descriptionRef={cardDescriptionRef}
          onSent={handleSent}
          onFail={handleFail}
        />
        <div className="mt-4 flex items-center justify-between gap-4">
          <EmailFallback />
          <button type="submit" form={cardFormId} className={buttonVariants.red}>
            Send report
          </button>
        </div>
      </section>

      {/* Phone only: legal rows and the footer. Terms and Privacy pages do
          not exist yet, so the rows are not links. */}
      <section className="flex flex-col gap-2 lg:hidden">
        <h2 className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted">Legal</h2>
        <ul className="flex flex-col gap-px overflow-hidden rounded-[18px] bg-sand">
          {[
            { label: "Terms of service", Icon: DocumentIcon },
            { label: "Privacy policy", Icon: ShieldIcon },
          ].map(({ label, Icon }) => (
            <li key={label} className="flex items-center gap-3 bg-cream-light px-4 py-3">
              <RowIcon>
                <Icon size={18} />
              </RowIcon>
              <span className="flex-1 text-[15px] font-semibold text-ink">{label}</span>
              <span className="text-[12px] text-muted">Coming soon</span>
            </li>
          ))}
        </ul>
      </section>
      <p className="py-2 text-center text-[11px] text-muted lg:hidden">
        e&apos;sweet · version {APP_VERSION} · {SHOP_ADDRESS}
      </p>

      {/* Phone: the report form as a full-screen page. */}
      {reportOpen && !isDesktop && (
        <SettingsOverlay
          open
          onClose={() => setReportOpen(false)}
          title="Report an issue"
          phoneVariant="screen"
          footer={
            <div className="flex flex-col gap-3">
              <EmailFallback className="text-center" />
              <button type="submit" form={screenFormId} className={`${buttonVariants.red} w-full`}>
                Send report
              </button>
            </div>
          }
        >
          <ReportForm
            formId={screenFormId}
            variant="screen"
            user={user}
            onSent={handleSent}
            onFail={handleFail}
          />
        </SettingsOverlay>
      )}

      <Toast toast={toast} />
    </div>
  );
};

export default HelpPage;
