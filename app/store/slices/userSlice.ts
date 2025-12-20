import { Employee } from "@/app/types";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  user: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: {
    _id: "69467e9e56a55f1b67634225",
    name: "Subham",
    role: "engineer",
    isSkilled: true,
    email: "subham@example.com",
  },
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (bulder) => {},
});

export default userSlice.reducer;
