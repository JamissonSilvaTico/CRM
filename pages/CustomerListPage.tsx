import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCustomers, deleteCustomer } from "../services/customerService";
import type { Customer } from "../types";
import Input from "../components/Input";

const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  // Handles YYYY-MM-DD
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const BirthdayIndicator: React.FC<{ dob?: string; filterMonth?: string }> = ({
  dob,
  filterMonth,
}) => {
  if (!dob || !filterMonth) return null;
  const monthFromDob = dob.split("-")[1];
  if (parseInt(monthFromDob, 10) === parseInt(filterMonth, 10)) {
    return <span className="ml-2">🎂</span>;
  }
  return null;
};

const CustomerCard: React.FC<{
  customer: Customer;
  onDelete: (id: string) => void;
  birthdayMonth?: string;
}> = ({ customer, onDelete, birthdayMonth }) => (
  <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1">
    <div>
      <h3 className="text-xl font-bold text-blue-700 flex items-center">
        {customer.preferredName || customer.fullName}
        <BirthdayIndicator dob={customer.dob} filterMonth={birthdayMonth} />
      </h3>
      {customer.preferredName && (
        <p className="text-sm text-gray-500 mb-2">{customer.fullName}</p>
      )}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <p>
          <strong>Nascimento Cliente:</strong> {formatDate(customer.dob)}
        </p>
        <p>
          <strong>CPF:</strong> {customer.cpf}
        </p>
        <p>
          <strong>Telefone:</strong> {customer.phone}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        {customer.instagram && (
          <p>
            <strong>Instagram:</strong> @{customer.instagram}
          </p>
        )}
        {customer.husbandName && (
          <p>
            <strong>Marido:</strong> {customer.husbandName}
          </p>
        )}
        {customer.husbandDob && (
          <p className="flex items-center">
            <strong>Nascimento Marido:</strong>{" "}
            {formatDate(customer.husbandDob)}
            <BirthdayIndicator
              dob={customer.husbandDob}
              filterMonth={birthdayMonth}
            />
          </p>
        )}
        {customer.children.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <h4 className="font-semibold">
              Filhos ({customer.children.length}):
            </h4>
            <ul className="list-disc list-inside">
              {customer.children.map((child, index) => (
                <li key={index} className="flex items-center">
                  {child.name} ({formatDate(child.dob)})
                  <BirthdayIndicator
                    dob={child.dob}
                    filterMonth={birthdayMonth}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
      <Link
        to={`/edit/${customer.id}`}
        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
      >
        Editar
      </Link>
      <button
        onClick={() => onDelete(customer.id)}
        className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
      >
        Excluir
      </button>
    </div>
  </div>
);

const CustomerListPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({ month: "" });
  const [error, setError] = useState<string>("");

  const fetchCustomers = useCallback(
    async (currentFilters: { month: string }) => {
      setIsLoading(true);
      setError("");
      try {
        const params = {
          month: currentFilters.month || undefined,
        };
        const data = await getCustomers(params);
        setCustomers(data);
      } catch (err) {
        setError("Falha ao carregar clientes.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCustomers({ month: "" });
  }, [fetchCustomers]);

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await deleteCustomer(id);
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== id)
        );
      } catch (err) {
        setError("Falha ao excluir o cliente. Tente novamente.");
      }
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilters = () => {
    fetchCustomers(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { month: "" };
    setFilters(clearedFilters);
    fetchCustomers(clearedFilters);
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lowercasedFilter = searchTerm.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(lowercasedFilter) ||
        (customer.preferredName &&
          customer.preferredName.toLowerCase().includes(lowercasedFilter)) ||
        customer.email.toLowerCase().includes(lowercasedFilter) ||
        customer.cpf.includes(lowercasedFilter)
    );
  }, [customers, searchTerm]);

  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
        Lista de Clientes
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6 space-y-4">
        <Input
          label="Pesquisar por nome, CPF ou email"
          id="search"
          placeholder="Digite para pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-gray-50 items-center">
          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="w-full text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Aniversariantes do Mês</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Filtrar
          </button>
          <button
            onClick={handleClearFilters}
            className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm font-medium"
          >
            Limpar
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onDelete={handleDelete}
              birthdayMonth={filters.month}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p className="text-gray-600">
            {customers.length === 0
              ? "Nenhum cliente cadastrado."
              : "Nenhum cliente encontrado com os critérios de busca."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerListPage;
