import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateFoodRequest } from '../../requests/CreateFoodRequest'
import { getUserId } from '../utils';
import { createFood } from '../../businessLogic/foods'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newFood: CreateFoodRequest = JSON.parse(event.body)
    // Implement creating a new FOOD item
    const userId = getUserId(event)
    const newItem = await createFood(newFood, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }

    // return undefined
  }
)

handler.use(
  cors({
    credentials: true
  })
)
