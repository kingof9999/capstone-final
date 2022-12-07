import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { FoodItem } from '../models/FoodItem'
import { FoodUpdate } from '../models/FoodUpdate';
//import { promises } from 'fs'
var AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('FoodsAccess')

// Implement the dataLayer logic
export class FoodsAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly foodsTable = process.env.FOODS_TABLE,
        private readonly foodsIndex = process.env.INDEX_NAME
    ) {}

    async getAllFoods(userId: string): Promise<FoodItem[]> {
        logger.info('Get all foods function called')

        const result = await this.docClient
        .query({
            TableName: this.foodsTable,
            IndexName: this.foodsIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId': userId
            }
        })
        .promise()

        const items = result.Items
        return items as FoodItem[]
    }

    async createFoodItem(foodItem: FoodItem): Promise<FoodItem> {
        logger.info('Create food item function called')

        const result = await this.docClient
        .put({
            TableName: this.foodsTable,
            Item: foodItem
        })
        .promise()
        logger.info('Food item created', result)

        return foodItem as FoodItem
    }

    async updateFoodItem(
        foodId: string,
        userId: string,
        foodUpdate: FoodUpdate
    ): Promise<FoodUpdate> {
        logger.info('Update food item function called')
        
        const result = await this.docClient
        .update({
            TableName: this.foodsTable,
            Key: {
            foodId,
            userId
            },
            UpdateExpression: 'set #name = :name, price = :price, ingredient = :ingredient',
            ExpressionAttributeValues:{
            ':name': foodUpdate.name,
            ':price': foodUpdate.price,
            ':ingredient': foodUpdate.ingredient
            },
            ExpressionAttributeNames: {
            '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        })
        .promise()

        const foodItemUpdate = result.Attributes
        logger.info('Food item updated', foodItemUpdate)
        return foodItemUpdate as FoodUpdate
    }

    async deleteFoodItem(foodId: string, userId: string): Promise<string> {
        logger.info('Delete food item function called')

        const result = await this.docClient
        .delete({
            TableName: this.foodsTable,
            Key: {
            foodId,
            userId
            }
        })
        .promise()
        logger.info('Food item deleted', result)
        return foodId as string
    }

    // async updateTodoAttachmentUrl(
    //     todoId: string,
    //     userId: string,
    //     attachmentUrl: string
    // ): Promise<void> {
    //     logger.info('Update todo attachment url function called')

    //     await this.docClient
    //     .update({
    //         TableName: this.todosTable,
    //         Key: {
    //         todoId,
    //         userId
    //         },
    //         UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    //         ExpressionAttributeNames: {
    //             ':attachmentUrl': attachmentUrl
    //         }
    //     })
    //     .promise()
    // }
}