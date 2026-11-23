import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TIME_SLOTS = [];
for (let hour = 11; hour <= 20; hour += 1) {
  for (const minute of [0, 30]) {
    TIME_SLOTS.push(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );
  }
}

const PREP_MINUTES = 30;

const slotToDate = (day, slot) => {
  const [hour, minute] = slot.split(":").map(Number);
  const date = new Date(day);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const availableSlotsForDay = (day, now) => {
  const cutoff = new Date(now.getTime() + PREP_MINUTES * 60 * 1000);
  return TIME_SLOTS.filter((slot) => slotToDate(day, slot) >= cutoff);
};

const buildDays = (now) => {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  }).filter((date) => availableSlotsForDay(date, now).length > 0);
};

const sameDay = (left, right) => left.toDateString() === right.toDateString();

const formatDay = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, tomorrow)) return "Tomorrow";
  return date.toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const formatTime = (value) => {
  const [hour, minute] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6 6 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

const SchedulePicker = ({ open, value, onClose, onConfirm }) => {
  const now = useMemo(() => new Date(), []);
  const days = useMemo(() => buildDays(now), [now]);
  const initialDate = useMemo(() => {
    if (value?.date && days.some((day) => sameDay(day, value.date))) {
      const savedSlots = availableSlotsForDay(value.date, now);
      if (savedSlots.includes(value.time)) return value.date;
    }
    return days[0] || now;
  }, [days, now, value?.date, value?.time]);
  const initialSlots = availableSlotsForDay(initialDate, now);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(() => {
    if (value?.time && initialSlots.includes(value.time)) return value.time;
    return initialSlots[0] || "";
  });

  const slots = availableSlotsForDay(date, now);

  const selectDay = (day) => {
    const nextSlots = availableSlotsForDay(day, now);
    setDate(day);
    setTime((current) =>
      nextSlots.includes(current) ? current : nextSlots[0] || "",
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/35 p-3 backdrop-blur-[3px] sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="schedule-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.75, 0.2, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[calc(100svh-1.5rem)] w-full max-w-[440px] overflow-y-auto rounded-[22px] bg-cream-light p-5 shadow-[0_30px_80px_rgba(30,20,10,0.28)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-tomato">
                  Schedule
                </p>
                <h2
                  id="schedule-title"
                  className="mt-1.5 font-display text-[24px] font-black tracking-[-0.045em] text-ink"
                >
                  Pick a time
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close time picker"
                className="grid h-8 w-8 place-items-center rounded-full border border-ink/15 text-ink/60 transition-colors hover:bg-cream hover:text-ink"
              >
                <CloseIcon />
              </button>
            </div>

            <p className="mt-4 text-[12px] font-bold text-ink">Choose a day</p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {days.map((day) => {
                const active = sameDay(date, day);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => selectDay(day)}
                    aria-pressed={active}
                    className={`rounded-xl border px-2 py-2.5 text-[11px] font-bold transition-colors ${
                      active
                        ? "border-tomato bg-tomato text-white"
                        : "border-ink/15 bg-cream-light text-ink/65 hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {formatDay(day)}
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-[12px] font-bold text-ink">Choose a time</p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const active = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    aria-pressed={active}
                    className={`rounded-xl border px-2 py-2.5 text-[11px] font-bold transition-colors ${
                      active
                        ? "border-tomato bg-tomato text-white"
                        : "border-ink/15 bg-cream-light text-ink/65 hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {formatTime(slot)}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!time}
              onClick={() => {
                if (!time) return;
                const day = formatDay(date);
                const timeLabel = formatTime(time);
                const sentenceDay =
                  day === "Today"
                    ? "today"
                    : day === "Tomorrow"
                      ? "tomorrow"
                      : `on ${day}`;
                onConfirm({
                  date,
                  time,
                  label: `${day} · ${timeLabel}`,
                  sentence: `${sentenceDay} at ${timeLabel}`,
                });
              }}
              className={`mt-5 w-full rounded-xl px-5 py-3.5 text-[14px] font-bold text-white transition-transform duration-200 ${
                time
                  ? "bg-tomato shadow-[0_4px_0_#a5130c,0_10px_20px_rgba(180,30,20,0.16)] hover:-translate-y-0.5 hover:bg-[#bf1f18] active:translate-y-0"
                  : "cursor-not-allowed bg-ink/25"
              }`}
            >
              Confirm time
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SchedulePicker;
