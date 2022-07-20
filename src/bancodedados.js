module.exports = {
	banco: {
		nome: "Cubos Bank",
		numero: "123",
		agencia: "0001",
		senha: "Cubos123Bank",
	},
	contas: [
		{
			numero: 1,
			saldo: 1,
			usuario: {
				nome: "Bruno",
				cpf: "1",
				data_nascimento: "2021-03-15",
				telefone: "6133552718",
				email: "b@gmail.com",
				senha: "teibou12",
			},
		},
		{
			numero: 2,
			saldo: 0,
			usuario: {
				nome: "Luana",
				cpf: "2",
				data_nascimento: "2021-03-15",
				telefone: "6133552718",
				email: "l@gmail.com",
				senha: "teibou12",
			},
		},
		{
			numero: 3,
			saldo: 0,
			usuario: {
				nome: "Antonia",
				cpf: "3",
				data_nascimento: "2021-03-15",
				telefone: "6133552718",
				email: "a@gmail.com",
				senha: "teibou12",
			},
		},
	],
	saques: [
		{
			data: "2021-08-10 23:40:35",
			numero_conta: 1,
			valor: 10000,
		},
		{
			data: "2021-08-10 23:40:35",
			numero_conta: 1,
			valor: 100000,
		},
	],
	depositos: [
		{
			data: "2021-08-10 23:40:35",
			numero_conta: 1,
			valor: 10000,
		},
	],
	transferencias: [
		{
			data: "2021-08-10 23:40:35",
			numero_conta_origem: 1,
			numero_conta_destino: 2,
			valor: 10000,
		},
		{
			data: "2021-08-10 23:40:35",
			numero_conta_origem: 2,
			numero_conta_destino: 1,
			valor: 10000,
		},
	],
};
