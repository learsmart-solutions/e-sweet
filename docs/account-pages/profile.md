# Profile (`/settings/profile`)

Figma: "1 · Profile" (phone and desktop frames, plus the photo, change-phone,
change-email and delete-account flows).
Code: `src/components/settings/account/ProfilePage.jsx` and
`src/components/settings/account/profile/`.

## What it does

| Part | Behaviour |
| --- | --- |
| Full name | Editable. **Save changes** is enabled only when the name differs from the saved one. Needs at least 2 characters (`getNameError`). Success toast: "Name updated". **Cancel** (desktop) restores the saved name. |
| Photo | Camera badge or "Change photo". Phone: bottom sheet (Take a photo / Choose from gallery / Remove photo) that saves on pick. Desktop: dialog with a drop zone, preview and **Save photo**. JPG or PNG, up to 5 MB; shrunk to a 256 px square JPEG and stored as a data URL. A bad file shows a toast and the label "Upload failed · Try again". |
| Phone number | Read-only with a lock. **Change** opens the two-step flow below. |
| Email address | Same flow, sent by email. |
| Delete account | Phone: red text link. Desktop: red-outlined card. Opens a confirm ("Keep my account" is focused first). Deleting clears the account and food preferences and signs the person out; the bag is kept. |

### Change phone / change email

1. **Step 1 of 2**: new number (typed without `+234` and without the leading
   0, e.g. `806 555 0192`) or new email. Validated with the existing helpers
   (`getPhoneError`, `getEmailError`); the same value as today is rejected.
   **Send code**.
2. **Step 2 of 2**: six code boxes (type, paste, Backspace and arrow keys all
   work). **Verify and save**.
   - A wrong code shows "That code doesn't match... N tries left" and the
     button becomes **Try again** (clears the boxes).
   - 3 wrong codes lock the boxes until a new code is requested.
   - **Resend code** is available after 45 s (or when locked).
   - **Change** goes back to step 1.
3. On success the value is saved and a toast confirms it. The old value stays
   active until this point.

### Prototype limits (read before demoing)

- **No SMS or email is sent.** `src/lib/verification.js` accepts the code
  **`123456`** (`DEMO_CODE`). Replace `requestCode` and `checkCode` with real
  API calls when the backend exists; the UI does not need to change.
- Data lives in `localStorage` through `StoreContext` (like signup/login).
- Orders, saved addresses and referral credit are not stored yet, so the
  "You will lose" list shows only "Your profile and food preferences". Pass
  real counts to `getLossLines` in `DeleteAccountDialog.jsx` when they exist.
- The photo shows on this page only. `SettingsSidebar` and `ProfileSummary`
  still draw the initial; switch them to `kit/Avatar.jsx` to show the photo there.

## Data and store changes

`src/context/StoreContext.jsx` gained two functions:

```js
updateProfile({ name, email, phone, photo })  // any subset
deleteAccount()
```

`updateProfile` updates the signed-in `user` **and** the saved account record,
otherwise the old values would return the next time the person logs in.
`login` now also restores `photo`.

New helpers: `src/lib/verification.js` (codes, 45 s resend, 3 attempts),
`src/lib/photo.js` (validate, crop, shrink).

## Design decisions to confirm

- Save is disabled until something changes (Figma shows it enabled).
- Success toast on phone is at the top, error toast above the Save bar, as
  drawn; both are bottom-centre on desktop.

## Manual test script

1. Sign up, open Settings, Profile. Name is prefilled; Save is disabled.
2. Edit the name; Save enables; save; toast; the sidebar shows the new name.
3. Clear the name; Save; the error shows under the field.
4. Change phone: enter an invalid number (error), your current number
   (error), a new valid number; code `000000` three times (locks); resend;
   `123456` saves. Repeat for email.
5. Photo: upload a PNG, a 6 MB image (error), a `.gif` (error); remove it.
6. Log out and in again: name, phone, email and photo persisted.
7. Delete account: confirm; you are signed out and cannot log in again.
