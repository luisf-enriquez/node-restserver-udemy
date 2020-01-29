// =========
// Puerto

process.env.PORT = process.env.PORT || 3000;

// =========
// Vencimiento del TOKEN
// 60 segundos, 60 minutos, 24 horas, 30 días

process.env.CADUCIDAD_TOKEN = '240h';

// =========
// SEED de autenticación

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =========
// Google Client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '712726985461-7lc08jpt5ufrmab8f0v29sa7t72f3l9u.apps.googleusercontent.com';