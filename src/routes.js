const express = require("express");
const {
	listarDados,
	criarConta,
	alterarConta,
	apagarConta,
	depositarDinhero,
	sacarDinheiro,
	transferirDinheiro,
	saldoConta,
	extratoConta,
} = require("./controllers/conta");
const { verificaSenha } = require("./middlewares");
const routes = express();

//rotas de contas
routes.post("/contas", criarConta);
routes.put("/contas/:numeroConta/usuario", alterarConta);
routes.delete("/contas/:numeroConta", apagarConta);
routes.get("/contas/saldo", saldoConta);
routes.get("/contas/extrato", extratoConta);

//rotas de transacoes
routes.post("/transacoes/depositar", depositarDinhero);
routes.post("/transacoes/sacar", sacarDinheiro);
routes.post("/transacoes/transferir", transferirDinheiro);

routes.get("/contas", verificaSenha, listarDados);

module.exports = {
	routes,
};
