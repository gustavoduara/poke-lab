// crypto.randomUUID só existe em conexão segura (HTTPS ou localhost). Ao testar pela
// rede de casa (http://192.168...), é preciso gerar o identificador de outra forma.
export const novoId = () =>
  crypto.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
