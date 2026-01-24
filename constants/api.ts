import { Platform } from 'react-native';

// Endereço IP do seu computador na rede local.
const DEV_API_URL = 'http://192.168.5.22:3000/api';

const PROD_API_URL = 'http://localhost:3000/api'; // Ou o endereço de produção

export const API_URL = Platform.select({
  web: PROD_API_URL, // Na web, usamos o endereço de produção/localhost
  default: DEV_API_URL, // Em nativo (Android/iOS), usamos o IP da máquina
});

