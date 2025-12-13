import { getFoodImageUrl } from './src/utils/image.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log('Testing "Kimchi Fried Rice"...');
    const urlEn = await getFoodImageUrl('Kimchi Fried Rice');
    console.log('Result (EN):', urlEn);

    console.log('Testing "김치볶음밥"...');
    const urlKo = await getFoodImageUrl('김치볶음밥');
    console.log('Result (KO):', urlKo);
}

test();
