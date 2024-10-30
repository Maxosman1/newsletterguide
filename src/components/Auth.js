import React, { useState } from "react";
import Login from "./Login";
import AccountCreation from "./AccountCreation";

const Auth = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleAuthView = () => {
    setIsLoginView((prev) => !prev);
  };

  return (
    <>
      {isLoginView ? (
        <Login toggleAuthView={toggleAuthView} />
      ) : (
        <AccountCreation toggleAuthView={toggleAuthView} />
      )}
    </>
  );
};

export default Auth;
