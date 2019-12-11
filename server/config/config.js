// =========
// Puerto

process.env.PORT = process.env.PORT || 3000;

// =========
// Vencimiento del TOKEN
// 60 segundos, 60 minutos, 24 horas, 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =========
// SEED de autenticación

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';