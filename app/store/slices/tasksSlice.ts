"use client";

import axios from "@/app/api";
import { Subtask, Task } from "@/app/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface TaskStatusSummary {
  _id: string;
  title: string;
  totalSubtasks: number;
  totalCompletedSubtasks: number;
  inprogressSubtasks: number;
  delayedSubtasks: number;
  notStartedSubtasks: number;
}

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  currentSubtask: any | null;
  statusSummary: TaskStatusSummary[];
  statusSummaryLoading: boolean;
  statusSummaryError: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  currentSubtask: null,
  statusSummary: [],
  statusSummaryLoading: false,
  statusSummaryError: null,
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL + "/tasks";

export const fetchTasks = createAsyncThunk<
  any[],
  string | undefined,
  { rejectValue: string }
>("tasks/fetchTasks", async (searchTerm, { rejectWithValue }) => {
  try {
    const search = searchTerm?.trim();
    const url = search
      ? `${API_BASE}?search=${encodeURIComponent(search)}`
      : API_BASE;

    const res = await axios.get<any[]>(url);
    const data = res.data;
    return data as any[];
  } catch (err: any) {
    const error = err as AxiosError<any>;
    const errorBody = (error.response?.data as any) || {};
    return rejectWithValue(errorBody.error || error.message || "Network error");
  }
});

export const createTask = createAsyncThunk<any, any, { rejectValue: string }>(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_BASE, taskData);
      const createdTask = res.data;
      return createdTask;
    } catch (err: any) {
      const error = err as AxiosError<any>;
      const errorBody = (error.response?.data as any) || {};
      return rejectWithValue(
        errorBody.error || error.message || "Network error"
      );
    }
  }
);

export const fetchTaskById = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("tasks/fetchTaskById", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_BASE}/${id}`);
    const task = res.data;
    return task;
  } catch (err: any) {
    const error = err as AxiosError<any>;
    const errorBody = (error.response?.data as any) || {};
    return rejectWithValue(errorBody.error || error.message || "Network error");
  }
});

export const updateTask = createAsyncThunk<
  any,
  { id: string; data: any },
  { rejectValue: string }
>("tasks/updateTask", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_BASE}/${id}`, data);
    const updatedTask = res.data;
    return updatedTask;
  } catch (err: any) {
    const error = err as AxiosError<any>;
    const errorBody = (error.response?.data as any) || {};
    return rejectWithValue(errorBody.error || error.message || "Network error");
  }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("tasks/deleteTask", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE}/${id}`);
    return id;
  } catch (err: any) {
    const error = err as AxiosError<any>;
    const errorBody = (error.response?.data as any) || {};
    return rejectWithValue(errorBody.error || error.message || "Network error");
  }
});

export const createSubtask = createAsyncThunk<
  string,
  { taskId: string; subtask: Partial<Subtask> },
  { rejectValue: string }
>(
  "tasks/createSubtask",
  async ({ taskId, subtask }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(`${API_BASE}/${taskId}/subtasks`, subtask);
      const updatedTask = res.data;
      dispatch(fetchTasks());
      dispatch(fetchStatusSummary());
      return updatedTask;
    } catch (err: any) {
      const error = err as AxiosError<any>;
      const errorBody = (error.response?.data as any) || {};
      return rejectWithValue(
        errorBody.error || error.message || "Network error"
      );
    }
  }
);

export const updateSubtask = createAsyncThunk<
  any,
  { taskId: string; subtaskId: string; data: any },
  { rejectValue: string }
>(
  "tasks/updateSubtask",
  async ({ taskId, subtaskId, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(
        `/tasks/${taskId}/subtasks/${subtaskId}`,
        data
      );

      const updatedSubtaskOrTask = res.data;
      dispatch(fetchTasks());
      dispatch(fetchStatusSummary());
      return updatedSubtaskOrTask;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

export const deleteSubtask = createAsyncThunk<
  any,
  { taskId: string; subtaskId: string },
  { rejectValue: string }
>(
  "tasks/deleteSubtask",
  async ({ taskId, subtaskId }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/${taskId}/subtasks/${subtaskId}`
      );
      const resp = res.data;
      dispatch(fetchTasks());
      dispatch(fetchStatusSummary());
      return resp;
    } catch (err: any) {
      const error = err as AxiosError<any>;
      const errorBody = (error.response?.data as any) || {};
      return rejectWithValue(
        errorBody.error || error.message || "Network error"
      );
    }
  }
);

export const fetchSubTaskById = createAsyncThunk<
  any,
  { taskId: string; subtaskId: string },
  { rejectValue: string }
>(
  "tasks/fetchSubTaskById",
  async ({ taskId, subtaskId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_BASE}/${taskId}/subtasks/${subtaskId}`
      );
      const subtask = res.data;
      return subtask;
    } catch (err: any) {
      const error = err as AxiosError<any>;
      const errorBody = (error.response?.data as any) || {};
      return rejectWithValue(
        errorBody.error || error.message || "Network error"
      );
    }
  }
);

export const fetchStatusSummary = createAsyncThunk<
  TaskStatusSummary[],
  void,
  { rejectValue: string }
>("tasks/fetchStatusSummary", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_BASE}/status-summary`);
    const data = res.data;
    return data as TaskStatusSummary[];
  } catch (err: any) {
    const error = err as AxiosError<any>;
    const errorBody = (error.response?.data as any) || {};
    return rejectWithValue(errorBody.error || error.message || "Network error");
  }
});

export const addCommentToTask = createAsyncThunk<
  string,
  {
    taskId: string;
    message: string;
    subtaskId?: string;
    employeeId: string;
    senderName: string;
  }
>("tasks/addCommentToTask", async (payload, { rejectWithValue }) => {
  try {
    const { taskId, subtaskId, ...rest } = payload;
    const response = await axios.post(
      `tasks/${taskId}/subtasks/${subtaskId}/comments`,
      rest
    );

    return response.data;
  } catch (error: unknown) {
    return rejectWithValue((error as AxiosError).message || "Network error");
  }
});
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<any[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchTasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch tasks";
      });

    // createTask
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create task";
      });

    // fetchTaskById
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payloadId = action.payload._id ?? action.payload.id;
        const idx = state.items.findIndex((t: any) => {
          const taskId = t._id ?? t.id;
          return taskId === payloadId;
        });

        if (idx !== -1) {
          state.items[idx] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch task";
      });

    // updateTask
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payloadId = action.payload._id ?? action.payload.id;
        const idx = state.items.findIndex((t: any) => {
          const taskId = t._id ?? t.id;
          return taskId === payloadId;
        });

        if (idx !== -1) {
          state.items[idx] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update task";
      });

    // deleteTask
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(
          (t) => t._id !== action.payload && t._id !== action.payload
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete task";
      });

    // createSubtask
    builder
      .addCase(createSubtask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubtask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSubtask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create subtask";
      });

    // updateSubtask
    builder
      .addCase(updateSubtask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubtask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSubtask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update subtask";
      });

    // deleteSubtask
    builder
      .addCase(deleteSubtask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubtask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSubtask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete subtask";
      });

    builder
      .addCase(fetchSubTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentSubtask = null;
      })
      .addCase(
        fetchSubTaskById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.currentSubtask = action.payload;
        }
      )
      .addCase(fetchSubTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch subtask";
      });
    // fetchStatusSummary
    builder
      .addCase(fetchStatusSummary.pending, (state) => {
        state.statusSummaryLoading = true;
        state.statusSummaryError = null;
      })
      .addCase(
        fetchStatusSummary.fulfilled,
        (state, action: PayloadAction<TaskStatusSummary[]>) => {
          state.statusSummaryLoading = false;
          state.statusSummary = action.payload;
        }
      )
      .addCase(fetchStatusSummary.rejected, (state, action) => {
        state.statusSummaryLoading = false;
        state.statusSummaryError =
          (action.payload as string) || "Failed to fetch status summary";
      });
  },
});

export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
