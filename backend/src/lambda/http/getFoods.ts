import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getFoodsForUser as getFoodsForUser } from '../../businessLogic/foods'
import { getUserId } from '../utils';

// Get all FOOD items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    // Write your code here
    const userId = getUserId(event)
    const foods = await getFoodsForUser(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: foods
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
