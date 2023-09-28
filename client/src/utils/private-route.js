import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import AccessDenied from "@components/layouts/access-denied";
import { getAuthCredentials, getRefreshToken, hasAccess } from "./auth-utils";
import Loader from "@components/ui/loaders/loader";
import { isValidToken } from "./is-valid-token";
import { ROUTES } from "./routes";

const PrivateRoute = ({
  children,
  authProps,
}) => {
  const router = useRouter();
  const [initialRenderComplete, setInitialRenderComplete] = React.useState(false);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, []);
  
  const { token, permissions }  = getAuthCredentials();
  const isUser = !!token;
  const hasPermission = permissions && hasAccess(authProps.permissions, permissions);

  React.useEffect(() => {
    if (!isUser) router.replace(ROUTES.LOGIN); // If not authenticated, force log in
  }, [isUser, router]);

  if (!initialRenderComplete) return null;

  if (isUser && hasPermission) {
    return <Fragment>{children}</Fragment>;
  }

  if (isUser && !hasPermission) {
    return <AccessDenied />;
  }

  return <Loader showText={false} />;
};

export default PrivateRoute;
