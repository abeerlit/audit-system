import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type dashboardStats = {
  eachAuditTimeAvg:number;
  dailyWorkingHoursAvg:string;
};

const initialState: dashboardStats = {
 eachAuditTimeAvg:0,
 dailyWorkingHoursAvg:"0",
};

export const dashboardStatsSlice = createSlice({
  name: "dashboardStats",
  initialState,
  reducers: {
    addDashboardStats: (state, action: PayloadAction<dashboardStats>) => {
      state.eachAuditTimeAvg = action.payload.eachAuditTimeAvg; 
      state.dailyWorkingHoursAvg = action.payload.dailyWorkingHoursAvg;
      return state; 
    },
  
  },
});

export default dashboardStatsSlice.reducer;

export const { addDashboardStats } = dashboardStatsSlice.actions;
