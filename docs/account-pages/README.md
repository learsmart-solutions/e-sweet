# Account pages under Settings

How the Profile, Food preferences and Help and support pages are put together,
and the shared pieces they use. Per-page notes live beside this file:

| Page | Route | Doc |
| --- | --- | --- |
| Profile | `/settings/profile` | [profile.md](./profile.md) |
| Food preferences | `/settings/food-preferences` | [food-preferences.md](./food-preferences.md) |
| Help and support | `/settings/help` | [help-and-support.md](./help-and-support.md) |

(Each file appears when its page is installed.)

## How a page gets on screen

1. `src/components/settings/sections.js` lists every section (`key`, `label`,
   `to`). The routes above are already there. **Do not change a `to`.**
2. `src/pages/Settings.jsx` (the shell: top bar on phone, sidebar on desktop)
   finds the section for the current route and renders
   `<SectionContent section={section} fallback={...} />`.
3. `src/components/settings/SectionContent.jsx` looks the section's `key` up
   among the files in `src/components/settings/account/*Page.jsx`. A match
   renders that page; no match renders the `fallback` (the existing
   "coming soon" panel). Pages that other people built and wired in
   `Settings.jsx` keep working exactly as before.

### Adding or removing a page

Create `src/components/settings/account/<Name>Page.jsx` with two exports:

```jsx
export const sectionKey = "profile"; // must equal `key` in sections.js
export default ProfilePage;          // takes no props
```

Nothing else needs registering.

## The page is mounted twice

`Settings.jsx` draws a phone tree (`lg:hidden`) and a desktop tree
(`hidden lg:flex`), so a page is mounted **twice** and CSS shows one.
Consequences for anyone writing a page:

- Use `useId()` for every `id` / `htmlFor` / `aria-*` reference. Never a
  hard-coded id.
- Local state is per copy. Keep anything that must be shared in
  `StoreContext` or `localStorage`.
- Open overlays only from user actions (never on mount), so only the visible
  copy ever opens one.
- Prefer responsive classes (`lg:`) over JS for layout differences. Where JS is
  needed, `useMediaQuery("(min-width: 1024px)")` matches the `lg` break.

## Shared building blocks (`src/components/settings/kit/`)

They live in their own folder so they never clash with other Settings
components (the referral and address pages have their own).

| File | What it is |
| --- | --- |
| `SettingsOverlay.jsx` | One overlay, three looks: desktop dialog, phone full-screen page (`phoneVariant="screen"`), phone bottom sheet (`"sheet"`). Escape closes, Tab is kept inside, page scroll is locked, focus returns to the opener. Props are documented at the top of the file. |
| `Toast.jsx` + `useToast.js` | `const { toast, showToast } = useToast(); showToast("Saved"); showToast("Failed", "error"); <Toast toast={toast} />`. One toast at a time, hides after 3.2 s. Errors use `role="alert"`. |
| `SettingsForm.jsx` | `FieldLabel`, `HelperText`, `TextInput`, `TextArea` (both take `invalid`), `Chip` (`selected`), `SectionCard`, `ActionBar`. |
| `icons.jsx` | Inline `currentColor` icons (camera, lock, trash, alert, ...). |
| `Avatar.jsx` | Photo or initial circle (installed with the Profile page). |

These pages also use existing project code: `buttonVariants` and `getInitial`
from `settings/settingsStyles.js`, `FormError`, the validators in
`src/lib/validation.js`, `useMediaQuery`, and the router `Link`.

> There is now a second `Toast` in the project (the referral page's). They are
> separate on purpose. If the team wants one, replace the usages of
> `kit/Toast` with the referral one and delete `kit/Toast.jsx` and
> `kit/useToast.js`; the API is only `toast` plus `showToast`.

### Phone layout rule: the pinned action bar

On phones the primary button is pinned to the bottom of the screen (see
`ActionBar` in `kit/SettingsForm.jsx`). For `mt-auto` to push it down, the
page root must be a flex column with a minimum height:

```jsx
<div className="flex min-h-[calc(100svh-6rem)] flex-col lg:min-h-0">
```

`6rem` is the phone top bar (4rem) plus the `<main>` padding (`pt-2` + `pb-6`)
in `Settings.jsx`. If those change, update this number.

## How the pages were added to the project

An installer script (`node install.mjs <profile|food|help|all>`) copied the new
files in and made three small edits to existing ones:

| Existing file | Edit | Pages |
| --- | --- | --- |
| `src/pages/Settings.jsx` | import `SectionContent`; wrap each `ComingSoon` in it | all |
| `src/context/StoreContext.jsx` | add `updateProfile` and `deleteAccount`; restore `photo` on login | Profile |
| `src/components/menu/BagDrawer.jsx` | prefill the kitchen note from saved preferences | Food preferences |

The `Settings.jsx` edit is identical for every page, so branches that each
contain it merge without conflicts.

## Testing checklist (every page)

- [ ] Phone width (375 px) and desktop width (1440 px) both match Figma.
- [ ] Signed-out visit to the route shows the signed-out prompt (existing).
- [ ] Keyboard only: every control reachable, visible focus ring, Escape
      closes overlays, focus returns to the button that opened them.
- [ ] Resize across 1024 px with an overlay closed: nothing breaks.
- [ ] `npm run lint` has no new warnings; `npm run build` passes.
