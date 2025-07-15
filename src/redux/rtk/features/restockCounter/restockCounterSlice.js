import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: {},
  total: null,
  information: null,
  restock: null,
  error: "",
  loading: false,
};

export const addRestockCounter = createAsyncThunk(
  "restock/addRestockCounter",
  async (values) => {
    console.log({values});
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `restock-counter/`,
        data: {
          ...values,
        },
      });

      const newData = {
        ...data.createdRestock,
      };

      return successHandler(newData, "The counter restocked");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

// export const deleteRestock = createAsyncThunk(
//   "restock/deleteRestock",
//   async (id) => {
//     try {
//       const { data } = await axios({
//         method: "patch",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json;charset=UTF-8",
//         },
//         url: `restock-counter/${id}`,
//         data: {
//           status: "false",
//         },
//       });
//       return successHandler(data, "Restock details deleted");
//     } catch (error) {
//       return errorHandler(error, true);
//     }
//   }
// );

// export const loadSingleRestock = createAsyncThunk(
//   "restock/loadSingleRestock",
//   async (id) => {
//     try {
//       const { data } = await axios.get(`restock-counter/${id}`);
//       return successHandler(data);
//     } catch (error) {
//       return errorHandler(error);
//     }
//   }
// );

export const loadAllRestockCounter = createAsyncThunk(
  "restock/loadAllRestockCounter",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`restock-counter?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

const restockCounterSlice = createSlice({
  name: "restock",
  initialState,
  reducers: {
    clearRestock: (state) => {
      state.restock = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllRestockCounter ======

    builder.addCase(loadAllRestockCounter.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllRestockCounter.fulfilled, (state, action) => {
      console.log({action});
      state.loading = false;
      state.list = action.payload?.data;
      state.total = action.payload?.data?.aggregations?._count?.id;
      state.information = action.payload?.data?.aggregations?._sum;
    });

    builder.addCase(loadAllRestockCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addRestockCounter ======

    builder.addCase(addRestockCounter.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addRestockCounter.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload?.data);
      state.list = list;
    });

    builder.addCase(addRestockCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleRestock ======

    // builder.addCase(loadSingleRestock.pending, (state) => {
    //   state.loading = true;
    // });

    // builder.addCase(loadSingleRestock.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.restock = action.payload?.data;
    // });

    // builder.addCase(loadSingleRestock.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.message;
    // });

    // 4) ====== builders for deleteRestock ======

    // builder.addCase(deleteRestock.pending, (state) => {
    //   state.loading = true;
    // });

    // builder.addCase(deleteRestockCounter.fulfilled, (state, action) => {
    //   state.loading = false;
    // });

    // builder.addCase(deleteRestock.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.message;
    // });
  },
});

export default restockCounterSlice.reducer;
export const { clearRestock: clearRestockCounter } = restockCounterSlice.actions;
