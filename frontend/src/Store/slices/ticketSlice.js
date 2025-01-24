import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketService from '../../services/ticketService';

const initialState = {
  tickets: [],
  currentTicket: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Create Ticket
export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, thunkAPI) => {
    try {
      return await ticketService.createTicket(ticketData);
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch Tickets
export const fetchTickets = createAsyncThunk(
  'tickets/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await ticketService.getTickets();
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Single Ticket
export const getTicket = createAsyncThunk(
  'tickets/getOne',
  async (ticketId, thunkAPI) => {
    try {
      return await ticketService.getTicketById(ticketId);
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Close Ticket
export const closeTicket = createAsyncThunk(
  'tickets/close',
  async (ticketId, thunkAPI) => {
    try {
      return await ticketService.closeTicket(ticketId);
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) || 
        error.message || 
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTicket = action.payload;
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = state.tickets.map(ticket => 
          ticket._id === action.payload._id ? action.payload : ticket
        );
        state.currentTicket = action.payload;
      });
  }
});

export const { reset } = ticketSlice.actions;
export default ticketSlice.reducer;