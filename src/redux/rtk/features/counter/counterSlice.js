import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: [],
  counter: null,
  error: "",
  loading: false,
  total: 0,
};

export const loadAllCounter = createAsyncThunk(
  "counter/loadAllCounter",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`counter?${query}`);
      console.log({data});
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const addCounter = createAsyncThunk(
  "counter/addCounter",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        url: `counter/`,
        data: values,
      });
      return successHandler(data, "Counter added successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const updateCounter = createAsyncThunk(
  "counter/updateCounter",
  async ({ id, formData: values, fileConfig }) => {
    try {
      const { data } = await axios({
        method: fileConfig() === "laravel" ? "post" : "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `counter/${id}`,
        data: values,
      });
      return successHandler(data, "Counter updated successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const loadSingleCounter = createAsyncThunk(
  "counter/loadSingleCounter",
  async (id) => {
    try {
      const { data } = await axios.get(`counter/${id}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const loadPosCounter = createAsyncThunk(
  "counter/loadPosCounter",
  async (id) => {
    try {
      const { data } = await axios.get(`counter?query=search&key=${id}`);

      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

export const deleteCounter = createAsyncThunk(
  "counter/deleteCounter",
  async (id) => {
    try {
      const { data } = await axios({
        method: "patch",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `counter/${id}`,
        data: {
          status: "false",
        },
      });
      return successHandler(data, "Counter deleted successfully", "warning");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

export const searchCounter = createAsyncThunk(
  "counter/searchCounter",
  async (prod) => {
    try {
      const { data } = await axios.get(`counter?query=search&key=${prod}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

const counterSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    clearCounter: (state) => {
      state.counter = null;
    },
    clearCounterList: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllCounter ======

    builder.addCase(loadAllCounter.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllCounter.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.data;
      state.total = action.payload?.data.length;
    });

    builder.addCase(loadAllCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addCounter ======

    builder.addCase(addCounter.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addCounter.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.unshift(action.payload?.data);
      state.list = list;
    });

    builder.addCase(addCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleCounter ======

    builder.addCase(loadSingleCounter.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSingleCounter.fulfilled, (state, action) => {
      state.loading = false;
      state.counter = action.payload?.data;
    });

    builder.addCase(loadSingleCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for loadPosCounter ======

    builder.addCase(loadPosCounter.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadPosCounter.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.data;
    });

    builder.addCase(loadPosCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 5) ====== builders for deleteCounter ======

    builder.addCase(deleteCounter.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteCounter.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(deleteCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 6) ====== builders for searchCounter ======

    builder.addCase(searchCounter.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(searchCounter.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.data;
    });

    builder.addCase(searchCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 7) ======= builders for update counter =============
    builder.addCase(updateCounter.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCounter.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
    });
  },
});

export default counterSlice.reducer;
export const { clearCounter, clearCounterList } = counterSlice.actions;
