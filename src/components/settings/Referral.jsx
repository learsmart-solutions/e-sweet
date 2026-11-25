import React, { useCallback, useEffect, useState } from "react";
import { formatNaira, useStore } from "../../context/StoreContext";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import {
  FRIEND_MIN_ORDER,
  REFERRAL_REWARD,
  couponLabel,
  fetchReferral,
  isCouponReady,
} from "../../lib/referrals";
import { NoInternet, OfflineBanner } from "./OfflineState";
import Toast from "./Toast";
import giftIcon from "../../assets/icons/settings/gift-24.svg";
import giftIconSmall from "../../assets/icons/settings/gift-18.svg";
import copyIcon from "../../assets/icons/settings/copy-16.svg";
import copyIconLight from "../../assets/icons/settings/copy-light-16.svg";
import whatsappIcon from "../../assets/icons/settings/whatsapp-20.svg";
import checkIcon from "../../assets/icons/settings/check-12.svg";
import usersIcon from "../../assets/icons/settings/users-40.svg";

// Settings → Referral, from the Figma section "4 · Referral": the page,
// "Link copied", "No friends yet" and the loading skeleton, plus the
// "No internet" pattern from Order history.
//
// The reward is a coupon, not a running balance: coupons never stack, so an
// order can use one coupon. The copy here says "coupon" where Figma says
// "credit" for that reason.

const REWARD = formatNaira(REFERRAL_REWARD);
const MIN_ORDER = formatNaira(FRIEND_MIN_ORDER);
const AVATAR_COLORS = ["bg-sun", "bg-sky", "bg-sand"];

const eyebrowClass =
  "text-[12px] font-bold uppercase tracking-[0.06em] text-muted";

// ---- Data ---------------------------------------------------------------

// The last good response for the signed-in account. Returning to the page
// (or crossing the phone/desktop breakpoint, which remounts it) shows this
// straight away and refreshes in the background instead of flashing the
// skeleton again. It is also what the offline banner means by "what we
// saved".
let lastLoaded = null;

const useReferral = ({ name, email }) => {
  const online = useOnlineStatus();
  const [data, setData] = useState(() =>
    lastLoaded?.email === email ? lastLoaded.data : null,
  );
  const [attempt, setAttempt] = useState(0);
  const [failedKey, setFailedKey] = useState(null);

  // A new key starts a new request: on retry, and whenever the connection
  // drops or comes back. A failure only counts for the request that failed,
  // so a retry goes back to the skeleton on its own.
  const requestKey = `${email}|${attempt}|${online}`;
  const failed = failedKey === requestKey;

  useEffect(() => {
    let active = true;
    fetchReferral({ name, email }).then(
      (next) => {
        if (!active) return;
        lastLoaded = { email, data: next };
        setData(next);
      },
      () => {
        if (active) setFailedKey(requestKey);
      },
    );
    return () => {
      active = false;
    };
  }, [name, email, requestKey]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return {
    data,
    loading: !data && !failed,
    offline: !data && failed,
    // Showing saved data while the connection is down.
    stale: Boolean(data) && (failed || !online),
    retry,
  };
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers, or the page isn't allowed the clipboard. Fall back.
  }
  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  } catch {
    return false;
  }
};

const shareLink = ({ code, link }) =>
  `https://wa.me/?text=${encodeURIComponent(
    `Get ${REWARD} off your first e'sweet order over ${MIN_ORDER}. Sign up with my code ${code}: ${link}`,
  )}`;

const displayLink = (link) => link.replace(/^https?:\/\//, "");

// ---- Pieces -------------------------------------------------------------

const Hero = ({ desktop }) => (
  <section
    className={`flex flex-col bg-tomato text-cream-light ${
      desktop
        ? "gap-2.5 rounded-[24px] p-7 @min-[760px]:min-w-0 @min-[760px]:flex-1"
        : "gap-2 rounded-[22px] p-5"
    }`}
  >
    <p className="text-[12px] font-bold uppercase tracking-[0.06em]">
      Refer a friend
    </p>
    <h2
      className={`font-display font-extrabold tracking-[-0.02em] ${
        desktop ? "text-[36px] leading-[1.15]" : "text-[30px] leading-[34px]"
      }`}
    >
      Give {REWARD}, get {REWARD}
    </h2>
    <p className={desktop ? "text-[15px] leading-[22px]" : "text-[14px] leading-5"}>
      Your friend gets {REWARD} off their first order over {MIN_ORDER}. You
      get a {REWARD} coupon when they order.
    </p>
  </section>
);

const RewardsCard = ({ coupons, desktop }) => {
  const ready = coupons.filter(isCouponReady);
  const total = ready.reduce((sum, coupon) => sum + coupon.amount, 0);
  let note = `${ready.length} coupon${ready.length === 1 ? "" : "s"} ready. One per order at checkout.`;
  if (ready.length === 0) {
    note =
      coupons.length === 0
        ? "No coupons yet. Each friend who orders earns you one."
        : "All used. Each friend who orders earns you another.";
  }

  return (
    <section
      className={`flex items-center bg-cream-light ${
        desktop
          ? "gap-3.5 rounded-[24px] p-6 @min-[560px]:col-span-2 @min-[860px]:col-span-1 @min-[860px]:flex-col @min-[860px]:items-start @min-[860px]:gap-2"
          : "gap-3.5 rounded-[20px] p-4"
      }`}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sun">
        <img src={giftIcon} alt="" width="24" height="24" />
      </span>
      <div
        className={`flex min-w-0 flex-1 flex-col ${
          desktop ? "gap-0.5 @min-[860px]:gap-2" : "gap-0.5"
        }`}
      >
        <h2 className="text-[13px] text-muted">Rewards earned</h2>
        <p
          className={`font-display font-extrabold tracking-[-0.02em] text-ink ${
            desktop ? "text-[32px] leading-none" : "text-[24px]"
          }`}
        >
          {formatNaira(total)}
          {!desktop && " in coupons"}
        </p>
        <p
          className={
            desktop ? "text-[13px] text-muted" : "text-[12px] leading-4 text-muted"
          }
        >
          {note}
        </p>
      </div>
    </section>
  );
};

const CopyButton = ({ onClick, label, ink = false }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato ${
      ink
        ? "bg-ink text-cream-light hover:bg-black"
        : "border-[1.5px] border-ink bg-cream-light text-ink hover:bg-cream"
    }`}
  >
    <img
      src={ink ? copyIconLight : copyIcon}
      alt=""
      width="16"
      height="16"
    />
    Copy
  </button>
);

const WhatsAppButton = ({ href }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex w-full items-center justify-center gap-2.5 rounded-full bg-leaf px-4 py-3.5 text-[15px] font-bold text-cream-light transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomato"
  >
    <img src={whatsappIcon} alt="" width="20" height="20" />
    Share on WhatsApp
  </a>
);

const CodeCard = ({ data, desktop, compact = false, onCopy }) => (
  <section
    aria-label="Your code and link"
    className={`flex flex-col bg-cream-light ${compact ? "gap-2.5" : "gap-3"} ${
      desktop
        ? "rounded-[24px] p-6 @min-[760px]:w-[420px] @min-[760px]:shrink-0"
        : "rounded-[20px] p-4"
    }`}
  >
    <p className="text-[13px] font-bold text-ink">Your code</p>
    <div
      className={`flex items-center gap-2.5 rounded-[14px] bg-cream py-2.5 pl-4 pr-2.5 ${
        compact ? "" : "border-[1.5px] border-dashed border-ink/35"
      }`}
    >
      <p className="min-w-0 flex-1 select-all truncate font-display text-[24px] font-extrabold tracking-[0.04em] text-ink">
        {data.code}
      </p>
      <CopyButton
        ink
        label="Copy your code"
        onClick={() => onCopy(data.code, "Code copied")}
      />
    </div>

    {!compact && (
      <>
        <p className="text-[13px] font-bold text-ink">Your link</p>
        <div className="flex items-center gap-2.5 rounded-[14px] bg-cream py-2.5 pl-4 pr-2.5">
          <p className="min-w-0 flex-1 select-all truncate text-[15px] font-semibold text-ink">
            {displayLink(data.link)}
          </p>
          <CopyButton
            label="Copy your link"
            onClick={() => onCopy(data.link, "Link copied")}
          />
        </div>
      </>
    )}

    <WhatsAppButton href={shareLink(data)} />
  </section>
);

const HowItWorks = ({ desktop }) => {
  const steps = [
    {
      title: "Share your code or link",
      body: desktop
        ? "Send it on WhatsApp or anywhere."
        : "Send it to friends on WhatsApp or anywhere.",
    },
    {
      title: "Your friend orders",
      body: desktop
        ? `${REWARD} off their first order over ${MIN_ORDER}.`
        : `They get ${REWARD} off their first order over ${MIN_ORDER}.`,
    },
    {
      title: "You both get rewarded",
      body: `A ${REWARD} coupon lands in your account.`,
    },
  ];

  return (
    <section
      className={`flex flex-col gap-3 bg-cream-light ${
        desktop ? "rounded-[24px] p-6" : "rounded-[20px] p-4"
      }`}
    >
      <h2 className={eyebrowClass}>How it works</h2>
      <ol className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`flex gap-3 ${desktop ? "items-center" : "items-start"}`}
          >
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-tomato font-display text-[15px] font-extrabold text-cream-light"
            >
              {index + 1}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-semibold text-ink">
                {step.title}
              </span>
              <span className="text-[13px] leading-[18px] text-muted">
                {step.body}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className="rounded-[12px] bg-cream px-3 py-2 text-[12px] leading-4 text-muted">
        Coupons don&rsquo;t stack. You can use one coupon per order.
      </p>
    </section>
  );
};

const Avatar = ({ name, index, desktop }) => (
  <span
    aria-hidden="true"
    className={`grid shrink-0 place-items-center rounded-full font-display font-extrabold text-ink ${
      AVATAR_COLORS[index % AVATAR_COLORS.length]
    } ${desktop ? "size-8 text-[14px]" : "size-9 text-[16px]"}`}
  >
    {name.trim()[0]?.toUpperCase() || "?"}
  </span>
);

const FriendStatus = ({ friend, desktop }) =>
  friend.status === "ordered" ? (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf px-2.5 py-1 text-[12px] font-bold text-cream-light">
      {!desktop && <img src={checkIcon} alt="" width="12" height="12" />}
      Ordered · {REWARD}
      {!desktop && " earned"}
    </span>
  ) : (
    <span className="shrink-0 rounded-full bg-cream px-2.5 py-1 text-[12px] font-bold text-ink">
      Joined
    </span>
  );

const EmptyFriends = () => (
  <div className="flex flex-col items-center gap-3 rounded-[20px] border-[1.5px] border-dashed border-sand bg-cream-light px-6 py-8 text-center">
    <span className="grid size-[88px] place-items-center rounded-full bg-sand">
      <img src={usersIcon} alt="" width="40" height="40" />
    </span>
    <p className="font-display text-[20px] font-extrabold tracking-[-0.02em] text-ink">
      No friends yet
    </p>
    <p className="text-[14px] leading-5 text-muted">
      Share your code. When a friend orders, you both get a {REWARD} coupon.
    </p>
  </div>
);

const friendsTitle = (friends) => `Friends referred · ${friends.length}`;

const Friends = ({ friends, desktop }) => {
  if (friends.length === 0) {
    return (
      <section className="flex flex-col gap-2">
        <h2 className={eyebrowClass}>{friendsTitle(friends)}</h2>
        <EmptyFriends />
      </section>
    );
  }

  if (desktop) {
    return (
      <section className="flex flex-col gap-2.5 rounded-[24px] bg-cream-light p-6">
        <h2 className={eyebrowClass}>{friendsTitle(friends)}</h2>
        <ul className="flex flex-col gap-2.5">
          {friends.map((friend, index) => (
            <li key={`${friend.name}-${index}`} className="flex items-center gap-2.5">
              <Avatar name={friend.name} index={index} desktop />
              <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">
                {friend.name}
              </span>
              <FriendStatus friend={friend} desktop />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className={eyebrowClass}>{friendsTitle(friends)}</h2>
      <ul className="flex flex-col gap-px overflow-hidden rounded-[18px] bg-sand">
        {friends.map((friend, index) => (
          <li
            key={`${friend.name}-${index}`}
            className="flex items-center gap-3 bg-cream-light px-3.5 py-3"
          >
            <Avatar name={friend.name} index={index} />
            <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">
              {friend.name}
            </span>
            <FriendStatus friend={friend} />
          </li>
        ))}
      </ul>
    </section>
  );
};

// Not in Figma: the coupons behind "Rewards earned", so people can see what
// they can pick at checkout and which ones they've used. Styled like the
// friends list.
const Coupons = ({ coupons }) => {
  if (coupons.length === 0) return null;
  const sorted = [...coupons].sort(
    (a, b) => Number(isCouponReady(b)) - Number(isCouponReady(a)),
  );
  const readyCount = coupons.filter(isCouponReady).length;

  return (
    <section className="flex flex-col gap-2">
      <h2 className={eyebrowClass}>Your coupons · {readyCount} ready</h2>
      <ul className="flex flex-col gap-px overflow-hidden rounded-[18px] bg-sand">
        {sorted.map((coupon) => {
          const ready = isCouponReady(coupon);
          return (
            <li
              key={coupon.id}
              className={`flex items-center gap-3 bg-cream-light px-3.5 py-3 ${
                ready ? "" : "text-muted"
              }`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full ${
                  ready ? "bg-cream" : "bg-cream opacity-60"
                }`}
              >
                <img src={giftIconSmall} alt="" width="18" height="18" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                  className={`text-[15px] font-semibold ${
                    ready ? "text-ink" : "text-muted line-through"
                  }`}
                >
                  {formatNaira(coupon.amount)} off
                </span>
                <span className="truncate text-[13px] text-muted">
                  {couponLabel(coupon)} ·{" "}
                  {coupon.minOrder > 0
                    ? `orders over ${formatNaira(coupon.minOrder)}`
                    : "any order"}
                </span>
              </span>
              {ready ? (
                <span className="shrink-0 rounded-full bg-leaf px-2.5 py-1 text-[12px] font-bold text-cream-light">
                  Ready
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-cream px-2.5 py-1 text-[12px] font-bold text-ink">
                  Used · #{coupon.usedOn.orderCode}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

// ---- Loading ------------------------------------------------------------

const Bar = ({ className }) => (
  <span aria-hidden="true" className={`block max-w-full ${className}`} />
);

const PhoneSkeleton = () => (
  <>
    <div className="flex flex-col gap-2.5 rounded-[22px] bg-sand p-5">
      <Bar className="h-2.5 w-[100px] rounded-[5px] bg-cream-light" />
      <Bar className="h-7 w-[240px] rounded-[8px] bg-cream-light" />
      <Bar className="h-3 w-[290px] rounded-[6px] bg-cream-light" />
    </div>
    <div className="flex items-center gap-3.5 rounded-[20px] bg-cream-light p-4">
      <Bar className="size-12 shrink-0 rounded-full bg-sand" />
      <div className="flex flex-col gap-2">
        <Bar className="h-2.5 w-[90px] rounded-[6px] bg-sand" />
        <Bar className="h-[22px] w-[150px] rounded-[8px] bg-sand" />
      </div>
    </div>
    <div className="flex flex-col gap-3 rounded-[20px] bg-cream-light p-4">
      <Bar className="h-2.5 w-[70px] rounded-[6px] bg-sand" />
      <Bar className="h-12 w-full rounded-[14px] bg-sand" />
      <Bar className="h-2.5 w-[70px] rounded-[6px] bg-sand" />
      <Bar className="h-12 w-full rounded-[14px] bg-sand" />
      <Bar className="h-12 w-full rounded-full bg-sand" />
    </div>
  </>
);

// No desktop skeleton in Figma; this follows the desktop layout with the
// phone skeleton's shapes.
const DesktopSkeleton = () => (
  <>
    <div className="flex flex-col gap-5 @min-[760px]:flex-row">
      <div className="flex flex-col gap-3 rounded-[24px] bg-sand p-7 @min-[760px]:flex-1">
        <Bar className="h-2.5 w-[100px] rounded-[5px] bg-cream-light" />
        <Bar className="h-9 w-[320px] rounded-[10px] bg-cream-light" />
        <Bar className="h-3 w-[340px] rounded-[6px] bg-cream-light" />
        <Bar className="h-3 w-[260px] rounded-[6px] bg-cream-light" />
      </div>
      <div className="flex flex-col gap-3 rounded-[24px] bg-cream-light p-6 @min-[760px]:w-[420px] @min-[760px]:shrink-0">
        <Bar className="h-2.5 w-[70px] rounded-[6px] bg-sand" />
        <Bar className="h-[60px] w-full rounded-[14px] bg-sand" />
        <Bar className="h-2.5 w-[70px] rounded-[6px] bg-sand" />
        <Bar className="h-[60px] w-full rounded-[14px] bg-sand" />
        <Bar className="h-12 w-full rounded-full bg-sand" />
      </div>
    </div>
    <div className="grid items-start gap-5 @min-[560px]:grid-cols-2 @min-[860px]:grid-cols-[260px_1fr_1fr]">
      <div className="flex flex-col gap-2 rounded-[24px] bg-cream-light p-6 @min-[560px]:col-span-2 @min-[860px]:col-span-1">
        <Bar className="size-12 rounded-full bg-sand" />
        <Bar className="h-2.5 w-[90px] rounded-[6px] bg-sand" />
        <Bar className="h-8 w-[120px] rounded-[8px] bg-sand" />
      </div>
      {[0, 1].map((card) => (
        <div
          key={card}
          className="flex flex-col gap-3 rounded-[24px] bg-cream-light p-6"
        >
          <Bar className="h-2.5 w-[100px] rounded-[6px] bg-sand" />
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-3">
              <Bar className="size-7 shrink-0 rounded-full bg-sand" />
              <Bar className="h-3 w-full rounded-[6px] bg-sand" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </>
);

const Loading = ({ desktop }) => (
  <div
    role="status"
    aria-label="Loading your referral details"
    className="flex w-full flex-col gap-4 motion-safe:animate-pulse lg:gap-5"
  >
    {desktop ? <DesktopSkeleton /> : <PhoneSkeleton />}
  </div>
);

// ---- Page ---------------------------------------------------------------

const ReferralContent = ({ user, desktop }) => {
  const { data, loading, offline, stale, retry } = useReferral(user);
  const [toast, setToast] = useState(null);
  const clearToast = useCallback(() => setToast(null), []);

  const copy = async (text, message) => {
    const copied = await copyText(text);
    setToast({
      id: Date.now(),
      message: copied ? message : "Couldn't copy. Select it to copy.",
    });
  };

  const rootClass = desktop
    ? "@container flex w-full flex-col gap-5"
    : "flex w-full flex-col gap-4";

  if (offline) {
    return (
      <div className={rootClass}>
        <OfflineBanner
          desktop={desktop}
          message="We'll load your referral details when you're back online."
        />
        <NoInternet
          what="your referral details"
          onRetry={retry}
          desktop={desktop}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={rootClass}>
        <Loading desktop={desktop} />
      </div>
    );
  }

  const { coupons, friends } = data;
  // Figma's "No friends yet" frame drops the hero, rewards and steps. Keep
  // the full page once there is a coupon to show (a friend's invite gives
  // a new account one before they've referred anybody).
  const isEmpty = friends.length === 0 && coupons.length === 0;

  let body;
  if (isEmpty) {
    body = desktop ? (
      <div className="flex flex-col gap-5 @min-[760px]:flex-row @min-[760px]:items-start">
        <CodeCard data={data} desktop compact onCopy={copy} />
        <div className="min-w-0 flex-1">
          <Friends friends={friends} desktop />
        </div>
      </div>
    ) : (
      <>
        <CodeCard data={data} compact onCopy={copy} />
        <Friends friends={friends} />
      </>
    );
  } else if (desktop) {
    body = (
      <>
        <div className="flex flex-col gap-5 @min-[760px]:flex-row">
          <Hero desktop />
          <CodeCard data={data} desktop onCopy={copy} />
        </div>
        <div className="grid items-start gap-5 @min-[560px]:grid-cols-2 @min-[860px]:grid-cols-[260px_1fr_1fr]">
          <RewardsCard coupons={coupons} desktop />
          <HowItWorks desktop />
          <Friends friends={friends} desktop />
        </div>
        <Coupons coupons={coupons} />
      </>
    );
  } else {
    body = (
      <>
        <Hero />
        <RewardsCard coupons={coupons} />
        <CodeCard data={data} onCopy={copy} />
        <HowItWorks />
        <Friends friends={friends} />
        <Coupons coupons={coupons} />
      </>
    );
  }

  return (
    <div className={rootClass}>
      {stale && <OfflineBanner desktop={desktop} />}
      {body}
      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
};

// Settings' SectionBody mounts only the visible layout's copy, so there is
// one request and one toast.
const Referral = ({ layout }) => {
  const { user } = useStore();
  if (!user) return null;
  return <ReferralContent user={user} desktop={layout === "desktop"} />;
};

export default Referral;
