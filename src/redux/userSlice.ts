import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  phone: number;
  depositeAmount: number; // Corrected type to 'number'
  package: string;
  referralUsedCount: number;
  totalAmount: number;
  referralCode: string;
  role: string;
  referralEarned:0;
  dailyIncome:0;
  compoundDays:0;
  token?: string; // Optional field
}

const initialState: userState = {
  id: "",
  phone: 0,
  depositeAmount: 0,
  package: "",
  referralUsedCount: 0,
  totalAmount: 0,
  referralCode: "",
  referralEarned:0,
  dailyIncome:0,
  compoundDays:0,
  role: "",
  
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // The payload type should match the state structure you want to save.
    addUser: (state, action: PayloadAction<userState>) => {
      // Correctly assign all properties from the payload to the state
      state.id = action.payload.id;
      state.phone = action.payload.phone;
      state.depositeAmount = action.payload.depositeAmount;
      state.package = action.payload.package;
      state.referralUsedCount = action.payload.referralUsedCount;
      state.totalAmount = action.payload.totalAmount;
      state.referralCode = action.payload.referralCode;
      state.role = action.payload.role;
      state.referralEarned=action.payload.referralEarned;
      state.dailyIncome=action.payload.dailyIncome;
      state.compoundDays=action.payload.compoundDays;

      // Alternatively, to replace the whole state with the payload, you can use:
      // return action.payload;
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
