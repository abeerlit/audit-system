import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Users = {
  id: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  experience: number;
  specialty: string;
  otpVerified: boolean;
  password: string;
  isActive: boolean;
  role: string;
  createdAt: string;
  profileImage?: string;
};

const initialState: Users[] = [{
  id: 0,
  email: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  experience: 0,
  specialty: "",
  otpVerified: false,
  password: "",
  isActive: false,
  role: "",
  createdAt: "2024-10-25T14:12:11.912Z",
  profileImage: "",
}];

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUsers: (state, action: PayloadAction<Users[]>) => {
      return action.payload; 
    },
    resetUsers: () => {
      return initialState;
    },
  },
});

export default usersSlice.reducer;

export const { addUsers, resetUsers } = usersSlice.actions;
