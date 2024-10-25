import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
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

const initialState: User = {
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
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      return action.payload; 
    },
    resetUser: () => {
      return initialState;
    },
  },
});

export default userSlice.reducer;

export const { addUser, resetUser } = userSlice.actions;
