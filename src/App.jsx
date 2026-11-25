import React, { useEffect } from "react";
import { StoreProvider } from "./context/StoreContext";
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

const App = () => {
  const route = useRoute();
  const settingsRoute = isSettingsRoute(route);
  // A friend's invite link, /r/CODE. Keep the code for signup, then go
  // there.
  const inviteCode = route.startsWith("/r/") ? route.slice(3) : null;
  const homeRoute =
    route === "/" ||
    (!knownRoutes.has(route) && !settingsRoute && inviteCode === null);

  useEffect(() => {
    if (inviteCode === null) return;
    savePendingReferral(inviteCode);
    navigate("/signup", { replace: true });
  }, [inviteCode]);

  return (
    <StoreProvider>
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
