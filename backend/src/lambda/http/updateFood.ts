import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateFood } from '../../businessLogic/foods'
import { UpdateFoodRequest } from '../../requests/UpdateFoodRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const foodId = event.pathParameters.foodId
    const updatedFood: UpdateFoodRequest = JSON.parse(event.body)
    // Update a TODO item with the provided id using values in the "updatedFood" object
    const userId = getUserId(event)
    console.log('userId: ', userId)
    await updateFood(
      foodId,
      updatedFood,
      userId
    )
    return {
      statusCode: 204,
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
