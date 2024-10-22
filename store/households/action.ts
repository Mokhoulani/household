import apiService, { initializeApp } from '../../api/apiService';
import { ApiResponse } from '../../types/ApiResponse';
import { Household } from '../../types/Household';
import { createAppAsyncThunk } from '../hook';

export type CreateHouseholdDto = {
  name: string;
};

export const createHousehold = createAppAsyncThunk<
  Household,
  CreateHouseholdDto
>('households/createHousehold', async ({ name }, thunkAPI) => {
  try {
    initializeApp();
    const response = await apiService.post<ApiResponse<Household>>(
      'Households',
      { name },
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to create household',
    );
  }
});
