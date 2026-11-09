import React from "react";
import AnimatedNumber from "./AnimatedNumber";
import Reveal from "./Reveal";

const stats = [
  { value: 40, suffix: " ft", label: "of kitchen, steel walls and all" },
  { value: 30, suffix: "+", label: "dishes cooked fresh every day" },
  { value: 15, suffix: " min", label: "average take-out pickup" },
  { value: 4.8, decimals: 1, suffix: "★", label: "from 2,000+ happy eaters" },
];

const Story = () => (
  <section
    id="story"
    className="scroll-mt-24 bg-cream px-5 py-20 sm:px-8 md:py-24 lg:px-16"
  >
    <div className="mx-auto grid w-full max-w-[1312px] gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-12">
      <div>
        <Reveal>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.32em] text-tomato sm:text-[11px]">
            Our story
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.55rem,4.45vw,4rem)] font-black leading-[0.96] tracking-[-0.045em] text-ink">
            Born in a tech hive.
            <br />
            Served from a window.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-6 max-w-[570px] space-y-4 text-[15px] leading-[1.62] text-ink/70 sm:text-[16px]">
            <p>
              In Ota, getting good food on time shouldn&apos;t be a gamble. So
              at Learnsmart tech hive, a team of tech experts, led by the
              executives, sat down and asked one question: how do we fix food
              delivery in our city?
            </p>
            <p>
              The answer was{" "}
              <strong className="font-bold text-ink">E&apos;SWEET</strong>, a
              smart kitchen built from steel, designed to be unmistakable,
              powered by technology and run with real care for flavor. Order
              from the app or walk up to the window, and your meal comes fresh,
              fast and exactly how it should be. It started as a brainstorm in
              a room full of builders. Now it&apos;s a bright red kitchen
              serving the community, and this is only the first of many
              branches.
            </p>
          </div>

          <a
            href="#menu"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-bold text-cream shadow-[0_4px_0_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-black active:translate-y-0"
          >
            Order from the window
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            delay={0.08 + index * 0.08}
            y={22}
            className="h-full"
          >
            <div className="h-full rounded-2xl bg-cream-light p-5 shadow-[0_14px_34px_rgba(80,50,20,0.065)] sm:p-6">
              <p className="font-display text-[clamp(1.9rem,3.9vw,3.5rem)] font-black leading-none tracking-[-0.045em] text-tomato">
                <AnimatedNumber
                  value={stat.value}
                  decimals={stat.decimals ?? 0}
                  suffix={stat.suffix}
                />
              </p>
              <p className="mt-2.5 max-w-[180px] text-[12px] leading-[1.45] text-ink/55 sm:text-[14px]">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Story;
