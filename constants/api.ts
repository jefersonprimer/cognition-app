import { Platform } from 'react-native';

// Endereço IP do seu computador na rede local.
const DEV_API_URL = 'http://192.168.5.22:3000/api';

const PROD_API_URL = 'http://192.168.5.22:3000/api'; // Mudando para o IP para garantir funcionamento em dev

export const API_URL = Platform.select({
  web: 'http://localhost:3000/api', // Na web, localhost funciona
  default: DEV_API_URL, // Em Android/iOS, deve ser o IP
});

