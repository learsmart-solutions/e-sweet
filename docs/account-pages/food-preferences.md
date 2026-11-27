# Food preferences (`/settings/food-preferences`)

Figma: "6 · Food preferences" (phone and desktop).
Code: `src/components/settings/account/FoodPreferencesPage.jsx`,
`src/lib/foodPreferences.js`, and a small change in
`src/components/menu/BagDrawer.jsx`.

## What it does

| Part | Behaviour |
| --- | --- |
| Default kitchen note | Free text, up to 240 characters (a counter appears in the last 40). Helper: "Added to every order automatically. You can still change it at checkout." |
| Quick-note pills | **Less pepper**, **Extra pepper**, **No onions**, **Sauce on the side**. A pill is filled (ink) when its phrase is in the note. Tapping adds the phrase as a new sentence, or removes it if present. **Less pepper** and **Extra pepper** replace each other. A pill that would push the note past the limit does nothing. |
| Allergies (optional) | Free text, up to 160 characters. |
| Amber notice | Always shown: "We share this with the kitchen. Our kitchen handles nuts, so we can't promise zero traces." |
| Save preferences | Enabled only after a change. Saves both fields and shows the toast "Food preferences saved". |
| Cancel (desktop) | Puts both fields back to the last saved values. |

Nothing is stored until **Save preferences** is pressed.

## How it reaches checkout

`BagDrawer.jsx` starts its "Note for the kitchen" box with
`buildKitchenNote(readFoodPreferences())` **when someone is signed in**:

```
Less pepper, please. Extra plantain if possible.
Allergies: Peanuts (groundnut)
```

The person can still edit the note for that order. Guests get an empty box.
The drawer reads the saved value when it opens, so a change made in Settings
shows up the next time the drawer mounts (it does, because moving between
`/settings` and `/menu` swaps the page).

## Storage

`localStorage` key `esweet-food-preferences` holds `{ note, allergies }`.
The prototype has one account per browser, so preferences are not keyed by
user. Signing out keeps them (like the bag); **deleting the account clears
them** (`StoreContext.deleteAccount`, from the Profile branch). When real
accounts and an API exist, move this into the user record.

## Design decisions to confirm

- Save is disabled until something changes (Figma shows it enabled).
- The allergies line is added to the checkout note as `Allergies: ...` so the
  kitchen sees it with every order. Confirm the wording with the kitchen.
- Max lengths (240 / 160) are not in Figma; adjust the two constants at the top
  of `foodPreferences.js` if the kitchen wants more.

## Manual test script

1. Open the page signed in: both fields empty, Save disabled.
2. Tap **Less pepper**: the note reads "Less pepper." and the pill is filled.
   Tap **Extra pepper**: Less pepper is replaced. Tap it again: removed.
3. Type a note by hand that contains "no onions": that pill fills by itself.
4. Add an allergy; Save; toast; reload the page: values are still there.
5. Edit without saving, press Cancel: values revert.
6. Go to the menu, add an item, open the bag: the note box is prefilled with
   the note and an "Allergies:" line.
7. Sign out, open the bag as a guest: the note box is empty.
