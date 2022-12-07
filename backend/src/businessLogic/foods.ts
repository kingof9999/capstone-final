import { FoodsAccess } from '../dataLayer/foodsAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { FoodItem } from '../models/FoodItem'
import { CreateFoodRequest } from '../requests/CreateFoodRequest'
import { UpdateFoodRequest } from '../requests/UpdateFoodRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { FoodUpdate } from '../models/FoodUpdate';
//import * as createError from 'http-errors'

// Implement businessLogic
const logger = createLogger('FoodsAccess')
const attachmentUtils = new AttachmentUtils()
const foodsAccess = new FoodsAccess()

// Write get food function
export async function getFoodsForUser(userId: string): Promise<FoodItem[]> {
    logger.info('Get foods for user function call')
    return foodsAccess.getAllFoods(userId)
}

// Create food function
export async function createFood (
    newFood: CreateFoodRequest,
    userId: string
): Promise<FoodItem> {
    logger.info('Create food function called')

    const foodId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(foodId)
    const newItem = {
        userId,
        foodId,
        createdAt,
        attachmentUrl: s3AttachmentUrl,
        ...newFood
    }

    return await foodsAccess.createFoodItem(newItem)
}

// Write update food function
export async function updateFood(
    foodId: string,
    foodUpdate: UpdateFoodRequest,
    userId: string
    ): Promise<FoodUpdate> {
    logger.info('Update food function called')
    return foodsAccess.updateFoodItem(foodId, userId, foodUpdate)
}

// Write delete food function
export async function deleteFood(
    foodId: string,
    userId: string
    ): Promise<string> {
    logger.info('Delete food function called')
    return foodsAccess.deleteFoodItem(foodId, userId)
}

// Wtire create attachment function
export async function createAttachmentPresignedUrl(
    foodId: string,
    userId: string
    ): Promise<string> {
    logger.info('Create attachment function called by user', userId, foodId)
    return attachmentUtils.getUploadUrl(foodId)
}