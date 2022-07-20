const {
	contas,
	depositos,
	saques,
	transferencias,
} = require("../bancodedados");
const { format } = require("date-fns");

const listarDados = (req, res) => {
	return res.send(contas);
};

let idUnico = 3;
const criarConta = (req, res) => {
	const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

	const validaCpfEmail = contas.find((conta) => {
		return conta.usuario.email === email || conta.usuario.cpf === cpf;
	});

	if (validaCpfEmail) {
		return res
			.status(400)
			.json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
	}

	if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
		return res
			.status(400)
			.json({ mensagem: "Favor todos os campos para cadastrar a conta" });
	}

	const novaConta = {
		numero: (idUnico += 1),
		saldo: 0,
		usuario: {
			nome,
			cpf,
			data_nascimento,
			telefone,
			email,
			senha,
		},
	};

	contas.push(novaConta);

	return res.status(201).json();
};

const alterarConta = (req, res) => {
	const { numeroConta } = req.params;
	const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

	let localizaConta = contas.find((conta) => {
		return conta.numero === Number(numeroConta);
	});

	if (!localizaConta) {
		return res
			.status(404)
			.send({ mensagem: "Não existe conta com esse número" });
	}

	if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
		return res
			.status(400)
			.json({ mensagem: "Favor todos os campos para cadastrar a conta" });
	}

	const existeEmail = contas.find((conta) => {
		return (
			conta.usuario.email === email && conta.numero !== Number(numeroConta)
		);
	});

	if (existeEmail) {
		return res
			.status(400)
			.json({ mensagem: "O e-mail informado já existe cadastrado!" });
	}

	const existeCpf = contas.find((conta) => {
		return conta.usuario.cpf === cpf && conta.numero !== Number(numeroConta);
	});

	if (existeCpf) {
		return res
			.status(400)
			.json({ mensagem: "O CPF informado já existe cadastrado!" });
	}

	localizaConta.usuario = {
		nome,
		cpf,
		data_nascimento,
		telefone,
		email,
		senha,
	};

	return res.status(204).json();
};

const apagarConta = (req, res) => {
	const { numeroConta } = req.params;

	const localizaConta = contas.find((conta) => {
		return conta.numero === Number(numeroConta);
	});

	if (!localizaConta) {
		return res
			.status(400)
			.send({ mensagem: "Não existe conta com esse número" });
	}

	if (localizaConta.saldo !== 0) {
		return res
			.status(400)
			.send({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
	}

	contas.splice(contas.indexOf(localizaConta), 1);

	return res.status(204).json();
};

const depositarDinhero = (req, res) => {
	const { numero_conta, valor } = req.body;

	if (!numero_conta || !valor) {
		return res
			.status(400)
			.json({ mensagem: "O número da conta e o valor são obrigatórios!" });
	}

	let localizaConta = contas.find((conta) => {
		return conta.numero === Number(numero_conta);
	});

	if (!localizaConta) {
		return res
			.status(400)
			.send({ mensagem: "Não existe conta com esse número" });
	}

	if (valor < 0) {
		return res.status(400).send({
			mensagem: "Não é permitido depósitos com valores abaixo ou iguais a 0",
		});
	}

	localizaConta.saldo += valor;

	const logDeposito = {
		data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
		numero_conta,
		valor,
	};

	depositos.push(logDeposito);

	return res.status(200).json();
};

const sacarDinheiro = (req, res) => {
	const { numero_conta, valor, senha } = req.body;

	if (!numero_conta || !valor || !senha) {
		return res.status(400).json({
			mensagem: "O número da conta, o valor e a senha são obrigatórios!",
		});
	}

	const localizaConta = contas.find((conta) => {
		return conta.numero === Number(numero_conta);
	});

	if (!localizaConta) {
		return res.status(404).json({
			mensagem: "Conta bancária não encontada!",
		});
	}

	if (senha !== localizaConta.usuario.senha) {
		return res.status(403).json({
			mensagem: "Senha inválida!",
		});
	}

	if (localizaConta.saldo < valor) {
		return res.status(400).json({
			mensagem: "Saldo insuficiente para saque",
		});
	}

	localizaConta.saldo -= valor;

	const logSaques = {
		data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
		numero_conta,
		valor,
	};

	saques.push(logSaques);

	return res.status(204).json();
};

const transferirDinheiro = (req, res) => {
	const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

	if (!numero_conta_origem || !numero_conta_destino || !senha || !valor) {
		return res.status(400).json({
			mensagem:
				"O número da conta (origem e destino), o valor e a senha são obrigatórios!",
		});
	}

	let localizaContaOrigem = contas.find((conta) => {
		return conta.numero === Number(numero_conta_origem);
	});

	if (!localizaContaOrigem) {
		return res.status(404).json({
			mensagem: "Número da conta de origem não encontrado!",
		});
	}

	let localizaContaDestino = contas.find((conta) => {
		return conta.numero === Number(numero_conta_destino);
	});

	if (!localizaContaDestino) {
		return res.status(404).json({
			mensagem: "Número da conta de destino não encontrado!",
		});
	}

	if (senha !== localizaContaOrigem.usuario.senha) {
		return res.status(403).json({
			mensagem: "Senha inválida!",
		});
	}

	if (localizaContaOrigem.saldo < valor) {
		return res.status(400).json({
			mensagem: "Saldo insuficiente para tranferência",
		});
	}

	localizaContaOrigem.saldo -= valor;
	localizaContaDestino.saldo += valor;

	const logTransferencias = {
		data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
		numero_conta_origem,
		numero_conta_destino,
		valor,
	};
	transferencias.push(logTransferencias);

	res.status(204).json();
};

const saldoConta = (req, res) => {
	const { numero_conta, senha } = req.query;
	if (!numero_conta || !senha) {
		return res
			.status(400)
			.json({ mensagem: "Favor informar o número da conta e a senha" });
	}

	const validaConta = contas.find((conta) => {
		return conta.numero === Number(numero_conta);
	});

	if (!validaConta) {
		return res.status(404).json({ mensagem: "Conta bancária não encontada!" });
	}

	if (validaConta.usuario.senha !== senha) {
		return res.status(401).json({ mensagem: "Senha inválida" });
	}

	return res.status(200).json({ saldo: validaConta.saldo });
};

const extratoConta = (req, res) => {
	const { numero_conta, senha } = req.query;
	if (!numero_conta || !senha) {
		return res
			.status(400)
			.json({ mensagem: "Favor informar o número da conta e a senha" });
	}

	const validaConta = contas.find((conta) => {
		return conta.numero === Number(numero_conta);
	});

	if (!validaConta) {
		return res.status(404).json({ mensagem: "Conta bancária não encontada!" });
	}

	if (validaConta.usuario.senha !== senha) {
		return res.status(401).json({ mensagem: "Senha inválida" });
	}

	const extraiSaques = saques.filter((saque) => {
		return saque.numero_conta === Number(numero_conta);
	});

	const extraiDepositos = depositos.filter((deposito) => {
		return deposito.numero_conta === Number(numero_conta);
	});

	const extraiTransferenciasEnviadas = transferencias.filter(
		(transferencia) => {
			return transferencia.numero_conta_origem === Number(numero_conta);
		}
	);

	const extraiTransferenciasRecebidas = transferencias.filter(
		(transferencia) => {
			return transferencia.numero_conta_destino === Number(numero_conta);
		}
	);

	return res.status(200).json({
		extraiSaques,
		extraiDepositos,
		tranferenciasEnviadas: extraiTransferenciasEnviadas,
		transferenciasRecebidas: extraiTransferenciasRecebidas,
	});
};

module.exports = {
	listarDados,
	criarConta,
	alterarConta,
	apagarConta,
	depositarDinhero,
	sacarDinheiro,
	transferirDinheiro,
	saldoConta,
	extratoConta,
};
