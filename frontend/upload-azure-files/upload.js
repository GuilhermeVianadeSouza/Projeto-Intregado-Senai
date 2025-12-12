'use strict'

import { uploadImageToAzure } from "./upload-image-to-azure.js";

// Configurações da Azure
// const azureConfig = {
//     storageAccount: 'multimidiaocorrencia',
//     containerName: 'fotos-ocorrencia',
//     sasToken: 'sp=racwdl&st=2025-12-11T17:44:46Z&se=2025-12-17T16:00:00Z&sv=2024-11-04&sr=c&sig=IKY8UwPVJzWgmYcLdy07cddhSJF0hpJbOTgxU8CTtGs%3D'
// }

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
