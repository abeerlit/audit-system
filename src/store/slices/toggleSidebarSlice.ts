import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const toggleSidebarSlice = createSlice({
  name: "toggleSidebar",
  initialState:{
    isSidebarOpen: false,
  },
  reducers: {
    openSidebar: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    closeSidebar: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    }
  },
});

export default toggleSidebarSlice.reducer;

export const { openSidebar, closeSidebar } = toggleSidebarSlice.actions;
