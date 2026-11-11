import React from "react";
import { StoreProvider } from "./context/StoreContext";
import { useRoute } from "./lib/router";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import AuthPage from "./pages/AuthPage";

const knownRoutes = new Set([
  "/",
  "/menu",
  "/bag",
  "/checkout",
  "/checkout-auth",
  "/signup",
  "/login",
]);

const App = () => {
  const route = useRoute();

  return (
    <StoreProvider>
      {route === "/menu" && <MenuPage />}
      {route === "/bag" && <MenuPage bagOpen bagStep="order" />}
      {route === "/checkout" && <MenuPage bagOpen bagStep="checkout" />}
      {route === "/checkout-auth" && <MenuPage authMode="signin" />}
      {route === "/signup" && <AuthPage mode="signup" />}
      {route === "/login" && <AuthPage mode="login" />}
      {(route === "/" || !knownRoutes.has(route)) && <HomePage />}
    </StoreProvider>
  );
};

export default App;
