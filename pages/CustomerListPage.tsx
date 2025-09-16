import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getCustomers, deleteCustomer } from "../services/customerService";
import type { Customer } from "../types";
import Input from "../components/Input";

const CustomerCard: React.FC<{
  customer: Customer;
  onDelete: (id: string) => void;
}> = ({ customer, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1">
    <div>
      <h3 className="text-xl font-bold text-blue-700">
        {customer.preferredName || customer.fullName}
      </h3>
      {customer.preferredName && (
        <p className="text-sm text-gray-500 mb-2">{customer.fullName}</p>
      )}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
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
        {customer.children.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <h4 className="font-semibold">
              Filhos ({customer.children.length}):
            </h4>
            <ul className="list-disc list-inside">
              {customer.children.map((child, index) => (
                <li key={index}>
                  {child.name} ({child.dob})
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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        setError("Falha ao carregar clientes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

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

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
        Lista de Clientes
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-6">
        <Input
          label="Pesquisar por nome, CPF ou email"
          id="search"
          placeholder="Digite para pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
