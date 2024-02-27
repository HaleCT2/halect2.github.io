import * as React from "react";
import * as ReactDOM from "react-dom";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import './index.scss';

import Menu from "./Menu.js";
import Automata from "./automata.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
  },
  {
    path: "/automata",
    element: <Automata />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
);