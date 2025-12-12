'use strict'

import { uploadImageToAzure } from "./upload-image-to-azure.js";

// Configurações da Azure
const azureConfig = {
}

export async function uploadImage() {
    let imagesUrls = []
    for (const file of document.getElementById('imagem').files) {
        const uploadParams = {
            storageAccount: azureConfig.storageAccount,
            containerName: azureConfig.containerName,
            file: file,
            sasToken: azureConfig.sasToken
        }
        const image = await uploadImageToAzure(uploadParams)
        imagesUrls.push(image)
    }
    return imagesUrls
}
