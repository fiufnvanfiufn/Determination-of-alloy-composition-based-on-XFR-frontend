import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  maxEnergy: number;
}

const initialState: FilterState = {
  maxEnergy: 25,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setMaxEnergy: (state, action: PayloadAction<number>) => {
      state.maxEnergy = action.payload;
    },
  },
});

export const { setMaxEnergy } = filterSlice.actions;
export default filterSlice.reducer;
