export function errorHandler(err, req, res, next) {
  console.error('Erro não tratado:', err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: 'Erro interno do servidor.'
  });
}
