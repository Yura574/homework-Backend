import mongoose from "mongoose";


export async function connectToTestDB() {
    const uri = 'mongodb://localhost:27017/test_db'; // Замените строку на строку подключения к вашей тестовой базе данных
    await mongoose.connect(uri, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });
}

// Функция для отключения от базы данных
export async function disconnectFromTestDB() {
    await mongoose.disconnect();
}