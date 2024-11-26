import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuditingItems = {
  id: number;
  itemAction: string | null;
  chapter_id: number | null;
  item_name: string | null;
  item_link: string | null;
  item_image: string | null;
  item_price: number | null;
  item_weight: number | null;
  item_detail: string | null;
  search_sentence: string | null;
  original_hs_code: number | null;
  broker_hs_code: number | null;
  expert_hs_code: number | null;
  created_timestamp: string | null;
  broker_update_timestamp: string | null;
  expert_update_timestamp: string | null;
  status: string | null;
  expert_status: string | null;
  broker_id: number | null;
  chapter: {
    id: number;
    chapterNames_id: number;
    chapter_name: string;
    broker_id: number;
    createdAt: string;
  };
  searchTest: string | null;
};

const initialState: AuditingItems[] = [
  {
    id: -1,
    itemAction: "",
    chapter_id: 0,
    item_name: "",
    item_link: "",
    item_image: "",
    item_price: 0,
    item_weight: 0,
    item_detail: null,
    search_sentence: "",
    original_hs_code: 0,
    broker_hs_code: 0,
    expert_hs_code: 0,
    created_timestamp: "",
    broker_update_timestamp: null,
    expert_update_timestamp: null,
    status: "",
    expert_status: "",
    broker_id: -1,
    chapter: {
      id: 6,
      chapterNames_id: 4,
      chapter_name: "",
      broker_id: -1,
      createdAt: "",
    },
    searchTest: "",
  },
];

export const auditingItemsSlice = createSlice({
  name: "auditingItems",
  initialState,
  reducers: {
    addAuditingItems: (state, action: PayloadAction<AuditingItems[]>) => {
      return action.payload;
    },
    setSearchTest: (state, action: PayloadAction<string>) => {
      return state.map((item) => ({
        ...item,
        searchTest: action.payload,
      }));
    },
    resetAuditingItems: () => {
      return initialState;
    },
  },
});

export default auditingItemsSlice.reducer;

export const { addAuditingItems, resetAuditingItems, setSearchTest } = auditingItemsSlice.actions;
