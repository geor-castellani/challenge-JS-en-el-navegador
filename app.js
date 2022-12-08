// Variables necesarias
const newTransaction = document.querySelector("#transactions");
const incomeList = document.querySelector("#positive-money");
const expenseList = document.querySelector("#negative-money");
const balanceList = document.querySelector("#current-balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");


// Obtengo las transacciones del almacenamiento local
const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];


// Remuevo transacción mediante ID
const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  start();
};


// Actualizo transacciones del almacenamiento local
const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};


// Historial de transacciones
const transactionDom = ({amount, name, id}) => {
  const operator = amount < 0 ? "-" : "+";
  const CSSClass = amount < 0 ? "negative" : "positive";
  const absoluteAmount = Math.abs(amount); 
  const itemList = document.createElement("li");

  itemList.classList.add(CSSClass);
  itemList.innerHTML = `${name} <span>${operator}${absoluteAmount}</span>
  <button class="delete-add-button" onClick="removeTransaction(${id})">x</button>`;
  newTransaction.append(itemList);
};


// Obtengo GASTOS
const getExpenses = (transactionsAmounts) =>
  Math.abs(transactionsAmounts
      .filter((item) => item < 0)
      .reduce((accu, item) => accu + item, 0))
      .toFixed(2);


// Obtengo INGRESOS
const getIncome = (transactionsAmounts) =>
  transactionsAmounts
    .filter((item) => item > 0)
    .reduce((accu, value) => accu + value, 0)
    .toFixed(2);


const getTotalBalance = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accu, transaction) => accu + transaction, 0)
    .toFixed(2);


// Actualizo el saldo
const updateBalanceCurrent = () => {
  const transactionsAmounts = transactions.map(({amount}) => amount);

  const totalBalance = getTotalBalance(transactionsAmounts);
  const income = getIncome(transactionsAmounts);
  const expense = getExpenses(transactionsAmounts);

  balanceList.textContent = `${totalBalance} €`;
  incomeList.textContent = `${income} €`;
  expenseList.textContent = `${expense} €`;
};


// Inicializo la aplicación
const start = () => {
  newTransaction.innerHTML = "";
  transactions.forEach(transactionDom);
  updateBalanceCurrent();
};
start();


// Genero ID aleatorio
const generateId = () => Math.round(Math.random() * 1000);
const addToTransationArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateId(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};


// Limpio los inputs
const cleanInputs = () => {
  inputTransactionAmount.value = "";
  inputTransactionName.value = "";
};


// Evento del botón de añadir transacción
const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const inputEmpty = transactionAmount === "" || transactionName == "";
  if (inputEmpty) {
    alert("All fields must be filled!");
    return;
  }
  addToTransationArray(transactionName, transactionAmount);

  start();
  updateLocalStorage();
  cleanInputs();
};

form.addEventListener("submit", handleFormSubmit);