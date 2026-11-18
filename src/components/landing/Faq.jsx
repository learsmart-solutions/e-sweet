import React, { useState } from "react";
import faqItems from "../../data/faq.json";
import Reveal from "./Reveal";

const Faq = () => {
  const [openId, setOpenId] = useState(faqItems[0]?.id ?? null);

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-ink/10 bg-cream px-5 py-20 sm:px-8 md:py-24 lg:px-16"
    >
      <div className="mx-auto grid w-full max-w-[1312px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <Reveal>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.32em] text-tomato sm:text-[11px]">
            FAQ
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,4.4vw,4rem)] font-black leading-[0.95] tracking-[-0.05em] text-ink">
            Before you order.
          </h2>
          <p className="mt-5 max-w-[390px] text-[14px] leading-[1.65] text-ink/60 sm:text-[15px]">
            Quick answers from the kitchen. If your question is not here, come
            find us at the red window and ask.
          </p>
          <a
            href="#visit"
            className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-tomato transition-colors hover:text-[#a5130c]"
          >
            Visit the kitchen
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>

        <Reveal delay={0.08} className="h-full">
          <div className="overflow-hidden rounded-[24px] bg-cream-light shadow-[0_18px_45px_rgba(80,50,20,0.08)] ring-1 ring-ink/[0.05]">
            {faqItems.map((item) => {
              const open = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="border-b border-ink/10 last:border-b-0"
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenId(open ? null : item.id)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-cream/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tomato sm:px-6"
                    >
                      <span className="text-[14px] font-bold leading-snug text-ink sm:text-[15px]">
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[20px] font-light leading-none transition-all duration-200 ${
                          open
                            ? "rotate-45 bg-tomato text-white"
                            : "bg-sand text-ink/65"
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!open}
                    className="px-5 pb-5 sm:px-6 sm:pb-6"
                  >
                    <p className="max-w-[620px] text-[13.5px] leading-[1.65] text-ink/60 sm:text-[14px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Faq;
