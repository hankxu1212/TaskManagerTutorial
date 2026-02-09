import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ImpersonatedUser {
    cognitoId: string;
    userId: number;
    username: string;
    email?: string;
}

export interface initialStateTypes {
    isSidebarCollapsed: boolean;
    isDarkMode: boolean;
    impersonatedUser: ImpersonatedUser | null;
}

const initialState: initialStateTypes = {
    isSidebarCollapsed: false,
    isDarkMode: false,
    impersonatedUser: null,
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },
        setIsDarkMode: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        },
        setImpersonatedUser: (state, action: PayloadAction<ImpersonatedUser | null>) => {
            state.impersonatedUser = action.payload;
        },
    },
});

export const { setIsSidebarCollapsed, setIsDarkMode, setImpersonatedUser } = globalSlice.actions;
export default globalSlice.reducer;