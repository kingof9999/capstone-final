import { apiEndpoint } from '../config'
import { Food } from '../types/Food';
import { CreateFoodRequest } from '../types/CreateFoodRequest';
import Axios from 'axios'
import { UpdateFoodRequest } from '../types/UpdateFoodRequest';

export async function getFoods(idToken: string): Promise<Food[]> {
  console.log('Fetching foods')

  const response = await Axios.get(`${apiEndpoint}/foods`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Foods:', response.data)
  return response.data.items
}

export async function createFood(
  idToken: string,
  newFood: CreateFoodRequest
): Promise<Food> {
  const response = await Axios.post(`${apiEndpoint}/foods`,  JSON.stringify(newFood), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchFood(
  idToken: string,
  foodId: string,
  updatedFood: UpdateFoodRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/foods/${foodId}`, JSON.stringify(updatedFood), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteFood(
  idToken: string,
  foodId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/foods/${foodId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  foodId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/foods/${foodId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
