import mongoose from 'mongoose';

async function clearMockDB(){

    const collectionKeys = Object.keys(mongoose.connection.collections);
    for (const key of collectionKeys) {
        await mongoose.connection.collections[key].deleteMany({});
    }
}


export {clearMockDB}