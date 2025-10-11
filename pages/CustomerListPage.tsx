import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  getCustomers,
  deleteCustomer,
  addCustomer,
  updateCustomer,
} from "../services/customerService";
import type { Customer, Child, CustomerFormData } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";

// Modal component for adding/editing customers
const CustomerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: CustomerFormData, id?: string) => Promise<void>;
  customerToEdit: Customer | null;
}> = ({ isOpen, onClose, onSave, customerToEdit }) => {
  const initialFormData: CustomerFormData = {
    fullName: "",
    preferredName: "",
    cpf: "",
    dob: "",
    address: "",
    cep: "",
    phone: "",
    email: "",
    instagram: "",
    children: [],
    husbandName: "",
    husbandDob: "",
  };

  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [numChildren, setNumChildren] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (customerToEdit) {
        setFormData({
          ...customerToEdit,
          children: customerToEdit.children || [],
        });
        setNumChildren(customerToEdit.children?.length || 0);
      } else {
        setFormData(initialFormData);
        setNumChildren(0);
      }
      setErrorMessage("");
    }
  }, [customerToEdit, isOpen]);

  useEffect(() => {
    // This effect should only run if the form is open to avoid state changes in the background
    if (isOpen) {
      setFormData((prev) => {
        const newChildren: Child[] = Array(numChildren)
          .fill(null)
          .map((_, index) => prev.children[index] || { name: "", dob: "" });
        return { ...prev, children: newChildren };
      });
    }
  }, [numChildren, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChildChange = (
    index: number,
    field: keyof Child,
    value: string
  ) => {
    const updatedChildren = [...formData.children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setFormData((prev) => ({ ...prev, children: updatedChildren }));
  };

  const handleNumChildrenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumChildren(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      await onSave(formData, customerToEdit?.id);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Ocorreu um erro.");
      } else {
        setErrorMessage("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
          {customerToEdit ? "Editar Cliente" : "Novo Cliente"}
        </h2>
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4"
            role="alert"
          >
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome completo"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              label="Como prefere ser chamada"
              id="preferredName"
              name="preferredName"
              value={formData.preferredName}
              onChange={handleChange}
            />
            <Input
              label="CPF"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
            <Input
              label="Data de nascimento da cliente"
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <Input
              label="Endereço"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Input
              label="CEP"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              required
            />
            <Input
              label="Telefone"
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Instagram"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Informações Familiares
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome do marido"
                id="husbandName"
                name="husbandName"
                value={formData.husbandName}
                onChange={handleChange}
              />
              <Input
                label="Data nascimento marido"
                id="husbandDob"
                name="husbandDob"
                type="date"
                value={formData.husbandDob}
                onChange={handleChange}
              />
              <div>
                <label
                  htmlFor="numChildren"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantos filhos tem?
                </label>
                <select
                  id="numChildren"
                  value={numChildren}
                  onChange={handleNumChildrenChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {numChildren > 0 && (
            <div className="space-y-4 border-t pt-6 mt-6">
              <h4 className="text-md font-semibold text-gray-800">
                Detalhes dos Filhos
              </h4>
              {formData.children.map((child, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-gray-50"
                >
                  <Input
                    label={`Nome do filho(a) ${index + 1}`}
                    id={`childName${index}`}
                    value={child.name}
                    onChange={(e) =>
                      handleChildChange(index, "name", e.target.value)
                    }
                    required
                  />
                  <Input
                    label={`Nascimento do filho(a) ${index + 1}`}
                    id={`childDob${index}`}
                    type="date"
                    value={child.dob}
                    onChange={(e) =>
                      handleChildChange(index, "dob", e.target.value)
                    }
                    required
                  />
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 flex space-x-4">
            <Button type="submit" isLoading={isLoading}>
              {customerToEdit ? "Salvar Alterações" : "Cadastrar Cliente"}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
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
  onEdit: (customer: Customer) => void;
  birthdayMonth?: string;
}> = ({ customer, onDelete, onEdit, birthdayMonth }) => (
  <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1">
    <div>
      <h3 className="text-xl font-bold text-gray-700 flex items-center">
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
      <button
        onClick={() => onEdit(customer)}
        className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        Editar
      </button>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

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

  const handleSaveCustomer = async (
    customerData: CustomerFormData,
    id?: string
  ) => {
    try {
      if (id) {
        await updateCustomer(id, customerData);
      } else {
        await addCustomer(customerData);
      }
      fetchCustomers(filters);
    } catch (error) {
      console.error("Failed to save customer", error);
      throw error;
    }
  };

  const openModalForNew = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
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
    setSearchTerm("");
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
      <div className="flex justify-between items-center mb-6 border-b pb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h2>
        <Button
          onClick={openModalForNew}
          className="!w-auto bg-green-600 hover:bg-green-700"
        >
          + Novo Cliente
        </Button>
      </div>

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
            className="w-full text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
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
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
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

      {!isLoading && filteredCustomers.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-md font-semibold text-gray-800">
            {filters.month
              ? `${filteredCustomers.length} aniversariante(s) encontrado(s).`
              : `${filteredCustomers.length} cliente(s) encontrado(s).`}
          </p>
        </div>
      )}

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
              onEdit={openModalForEdit}
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
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customerToEdit={editingCustomer}
      />
    </div>
  );
};

export default CustomerListPage;
