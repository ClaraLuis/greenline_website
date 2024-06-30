import React, { Component } from "react";
// import Cookies from 'universal-cookie';
import axios from "axios";
import { useHistory } from "react-router-dom";
export const Routedispatcher = React.createContext();

export const Routedispatcherprovider = (props) => {
  let history = useHistory();

  const setroutedispatcher = (route) => {
    history.push(route);
  };

  var routedispatchercontext = setroutedispatcher;

  return (
    <Routedispatcher.Provider
      value={{
        routedispatchercontext,
      }}
    >
      {props.children}
    </Routedispatcher.Provider>
  );
};
