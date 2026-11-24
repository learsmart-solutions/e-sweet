import React from "react";
import { StoreProvider } from "./context/StoreContext";
import { useRoute } from "./lib/router";
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

  return (
    <StoreProvider>
      {route === "/menu" && <MenuPage />}
      {route === "/bag" && <MenuPage bagOpen bagStep="order" />}
      {route === "/checkout" && <MenuPage bagOpen bagStep="checkout" />}
      {route === "/checkout-auth" && <MenuPage authMode="signin" />}
      {route === "/signup" && <AuthPage mode="signup" />}
      {route === "/login" && <AuthPage mode="login" />}
      {settingsRoute && <Settings route={route} />}
      {(route === "/" || (!knownRoutes.has(route) && !settingsRoute)) && (
        <HomePage />
      )}
      <WhatsAppFab
        hidden={
          route === "/bag" ||
          route === "/checkout" ||
          route === "/checkout-auth"
        }
      />
    </StoreProvider>
  );
};

export default App;
