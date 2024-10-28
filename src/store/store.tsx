import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import usersSlice from "./slices/usersSlice";
import toggleSidebarSlice from "./slices/toggleSidebarSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      users: usersSlice,
      toggleSidebar: toggleSidebarSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
