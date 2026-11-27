import React, { useCallback, useState } from "react";
import { useStore } from "../context/StoreContext";
import { formatPhone } from "../lib/validation";
import ActiveOrderCard from "../components/settings/ActiveOrderCard";
import SettingsDesktopNav from "../components/settings/SettingsDesktopNav";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import SignedOutPrompt from "../components/settings/SignedOutPrompt";
import SignOutDialog from "../components/settings/SignOutDialog";
import Referral from "../components/settings/Referral";
import SavedAddresses, {
  AddressModal,
  DeleteAddressDialog,
  PlusIcon,
} from "../components/settings/SavedAddresses";
import Toast from "../components/settings/Toast";
import useMediaQuery from "../hooks/useMediaQuery";
import {
  BottomSignOutButton,
  LegalInfo,
  PhoneTopBar,
  ProfileSummary,
  SettingsGroup,
  SignOutButton,
} from "../components/settings/SettingsParts";
import {
  SETTINGS_PATH,
  settingsGroups,
  settingsItems,
} from "../components/settings/sections";
import SectionContent from "../components/settings/SectionContent";

// Section pages (Profile, Saved addresses, …) are being built separately.
// Until one lands, its route shows this panel inside the Settings shell.
const ComingSoon = ({ label }) => (
  <div className="w-full rounded-[20px] bg-cream-light p-6 text-[14px] leading-5 text-muted">
    {label} is coming soon.
  </div>
);

// Section pages that are built, by section key.
const sectionPages = {
  addresses: SavedAddresses,
  referral: Referral,
};

// Matches Tailwind's `lg`, where Settings switches to the desktop layout.
const DESKTOP_QUERY = "(min-width: 1024px)";

// Settings renders a phone tree and a desktop tree and hides one with CSS.
// Only the visible copy mounts a section page, so a page never runs twice
// (one request, one toast) and nothing can open inside the hidden tree.
// `pageProps[section.key]` is passed through to that page.
const SectionBody = ({ section, layout, pageProps = {} }) => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const Page = sectionPages[section.key];
  if (!Page) return <SectionContent section={section} fallback={<ComingSoon label={section.label} />} />;
  if (isDesktop !== (layout === "desktop")) return null;
  return <Page layout={layout} {...pageProps[section.key]} />;
};

const Settings = ({ route = SETTINGS_PATH }) => {
  const {
    user,
    logout,
    addresses = [],
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [justSignedOut, setJustSignedOut] = useState(false);
  const [addressModal, setAddressModal] = useState({
    open: false,
    mode: "add",
    address: null,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const section = settingsItems.find((item) => item.to === route);
  const isHome = !section;
  const isAddresses = route === `${SETTINGS_PATH}/addresses`;
  const title = section?.label ?? "Settings";
  const phone = user ? formatPhone(user.phone) : "";

  // Stable so the dialog's focus and key handlers are not re-attached on
  // every render.
  const openConfirm = useCallback(() => setConfirmOpen(true), []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  const showToast = useCallback(
    (message) => setToast({ message, id: Date.now() }),
    [],
  );
  const clearToast = useCallback(() => setToast(null), []);

  const openAddAddress = useCallback(
    () => setAddressModal({ open: true, mode: "add", address: null }),
    [],
  );
  const openEditAddress = useCallback(
    (address) => setAddressModal({ open: true, mode: "edit", address }),
    [],
  );
  const closeAddressModal = useCallback(
    () => setAddressModal((prev) => ({ ...prev, open: false })),
    [],
  );
  const requestDeleteAddress = useCallback(
    (address) => setDeleteTarget(address),
    [],
  );
  const cancelDeleteAddress = useCallback(() => setDeleteTarget(null), []);

  const saveAddress = useCallback(
    (data) => {
      if (addressModal.mode === "edit" && addressModal.address?.id) {
        updateAddress(addressModal.address.id, data);
      } else {
        addAddress(data);
      }
      closeAddressModal();
      showToast("Address saved");
    },
    [addressModal, addAddress, updateAddress, closeAddressModal, showToast],
  );

  const confirmDeleteAddress = useCallback(
    (id) => {
      deleteAddress(id);
      setDeleteTarget(null);
      setAddressModal((prev) => ({ ...prev, open: false }));
      showToast("Address deleted");
    },
    [deleteAddress, showToast],
  );

  const makeDefaultAddress = useCallback(
    (id) => {
      setDefaultAddress(id);
      showToast("Default address updated");
    },
    [setDefaultAddress, showToast],
  );

  // Signing out leaves the visitor on this page, which then shows the
  // signed-out prompt (the flow drawn in Figma). The bag is kept.
  const signOut = () => {
    setConfirmOpen(false);
    setJustSignedOut(true);
    logout();
  };

  // TODO: orders are not stored yet. Pass the in-progress order here once
  // they are, and the red card will show.
  const activeOrder = null;

  // Props for section pages that need state owned here. Saved addresses
  // keep their form, delete dialog and toast in this component, rendered
  // once outside both layouts.
  const pageProps = {
    addresses: {
      addresses,
      onAdd: openAddAddress,
      onEdit: openEditAddress,
      onDelete: requestDeleteAddress,
      onSetDefault: makeDefaultAddress,
    },
  };

  const homeTop = user && (
    <>
      <ProfileSummary
        name={user.name}
        phone={phone}
        editTo={`${SETTINGS_PATH}/profile`}
      />
      {activeOrder && (
        <ActiveOrderCard
          order={activeOrder}
          trackTo={`${SETTINGS_PATH}/orders`}
        />
      )}
    </>
  );

  return (
    <div className="min-h-svh bg-cream">
      {/* Phone and tablet */}
      <div className="mx-auto w-full max-w-[520px] lg:hidden">
        <PhoneTopBar
          title={user ? title : "Settings"}
          backTo={isHome || !user ? "/menu" : SETTINGS_PATH}
          onSignOut={user && isHome ? openConfirm : undefined}
        />
        <main
          className={`flex flex-col px-4 ${user ? "gap-5 pb-24 pt-2" : "py-6"}`}
        >
          {!user ? (
            <SignedOutPrompt focusOnMount={justSignedOut} />
          ) : isHome ? (
            <>
              {homeTop}
              {settingsGroups.map((group) => (
                <SettingsGroup key={group.title} {...group} />
              ))}
              <LegalInfo />
              <BottomSignOutButton onClick={openConfirm} />
            </>
          ) : (
            <SectionBody
              section={section}
              layout="phone"
              pageProps={pageProps}
            />
          )}
        </main>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden w-full max-w-[1440px] flex-col px-8 pb-10 pt-5 lg:flex xl:px-[130px]">
        <SettingsDesktopNav user={user} onSignOut={openConfirm} />
        {!user ? (
          <main className="mt-[60px] flex justify-center">
            <SignedOutPrompt focusOnMount={justSignedOut} />
          </main>
        ) : (
          <div className="mt-7 flex items-start gap-8">
            <SettingsSidebar
              user={user}
              phone={phone}
              activeKey={section?.key}
            />
            <main className="flex min-w-0 flex-1 flex-col gap-5">
              <header className="flex items-center gap-3">
                <h1 className="min-w-0 flex-1 font-display text-[36px] font-extrabold tracking-[-0.03em] text-ink">
                  {title}
                </h1>
                {isAddresses && addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={openAddAddress}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[14px] font-bold text-cream transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <PlusIcon size={16} />
                    Add address
                  </button>
                )}
                <SignOutButton onClick={openConfirm} size="lg" />
              </header>
              {isHome ? (
                homeTop
              ) : (
                <SectionBody
                  section={section}
                  layout="desktop"
                  pageProps={pageProps}
                />
              )}
            </main>
          </div>
        )}
      </div>

      <AddressModal
        open={addressModal.open}
        mode={addressModal.mode}
        initialData={addressModal.address}
        onClose={closeAddressModal}
        onSave={saveAddress}
        onDeleteRequest={requestDeleteAddress}
      />
      <DeleteAddressDialog
        open={Boolean(deleteTarget)}
        address={deleteTarget}
        addresses={addresses}
        onCancel={cancelDeleteAddress}
        onConfirm={confirmDeleteAddress}
      />
      <Toast toast={toast} onDone={clearToast} />

      <SignOutDialog
        open={confirmOpen && Boolean(user)}
        email={user?.email}
        onCancel={closeConfirm}
        onConfirm={signOut}
      />
    </div>
  );
};

export default Settings;
