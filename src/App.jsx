import React, { useEffect } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { navigate, useRoute } from "./lib/router";
import { savePendingReferral } from "./lib/referrals";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import AuthPage from "./pages/AuthPage";
import Settings from "./pages/Settings";
import WhatsAppFab from "./components/WhatsAppFab";

const knownRoutes = new Set([
  "/",
  "/menu",
  "/bag",
  "/checkout",
  "/checkout-auth",
  "/signup",
  "/login",
  "/settings",
]);

// Settings owns everything under /settings (home and its section pages).
const isSettingsRoute = (route) =>
  route === "/settings" || route.startsWith("/settings/");

// A friend's invite link, /r/CODE. New visitors keep the code for signup
// and go there; someone already signed in has an account, so the invite
// doesn't apply and they go to the menu.
const InviteRedirect = ({ code }) => {
  const { user } = useStore();
  const signedIn = Boolean(user);

  useEffect(() => {
    if (signedIn) {
      navigate("/menu", { replace: true });
      return;
    }
    savePendingReferral(code);
    navigate("/signup", { replace: true });
  }, [code, signedIn]);

  return null;
};

const App = () => {
  const route = useRoute();
  const settingsRoute = isSettingsRoute(route);
  const inviteCode = route.startsWith("/r/") ? route.slice(3) : null;
  const homeRoute =
    route === "/" ||
    (!knownRoutes.has(route) && !settingsRoute && inviteCode === null);

  return (
    <StoreProvider>
      {inviteCode !== null && <InviteRedirect code={inviteCode} />}
      {route === "/menu" && <MenuPage />}
      {route === "/bag" && <MenuPage bagOpen bagStep="order" />}
      {route === "/checkout" && <MenuPage bagOpen bagStep="checkout" />}
      {route === "/checkout-auth" && <MenuPage authMode="signin" />}
      {route === "/signup" && <AuthPage mode="signup" />}
      {route === "/login" && <AuthPage mode="login" />}
      {settingsRoute && <Settings route={route} />}
      {homeRoute && <HomePage />}
      {!homeRoute && (
        <WhatsAppFab
          hidden={
            route === "/bag" ||
            route === "/checkout" ||
            route === "/checkout-auth"
          }
        />
      )}
    </StoreProvider>
  );
};

export default App;
