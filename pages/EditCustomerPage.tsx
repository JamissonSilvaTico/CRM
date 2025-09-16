import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../services/customerService";
import type { Child, CustomerFormData, Customer } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";

const EditCustomerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerFormData | null>(null);
  const [numChildren, setNumChildren] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!id) {
      setErrorMessage("ID do cliente não encontrado.");
      setIsFetching(false);
      return;
    }

    const fetchCustomerData = async () => {
      setIsFetching(true);
      try {
        const customer = await getCustomerById(id);
        setFormData({
          fullName: customer.fullName,
          preferredName: customer.preferredName,
          cpf: customer.cpf,
          dob: customer.dob,
          address: customer.address,
          cep: customer.cep,
          phone: customer.phone,
          email: customer.email,
          instagram: customer.instagram,
          children: customer.children || [],
          husbandName: customer.husbandName,
          husbandDob: customer.husbandDob,
        });
        setNumChildren(customer.children?.length || 0);
      } catch (error) {
        setErrorMessage("Falha ao carregar os dados do cliente.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchCustomerData();
  }, [id]);

  useEffect(() => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return null;
      const newChildren: Child[] = Array(numChildren)
        .fill(null)
        .map((_, index) => prev.children[index] || { name: "", dob: "" });
      return { ...prev, children: newChildren };
    });
  }, [numChildren]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleChildChange = (
    index: number,
    field: keyof Child,
    value: string
  ) => {
    if (!formData) return;
    const updatedChildren = [...formData.children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setFormData((prev) =>
      prev ? { ...prev, children: updatedChildren } : null
    );
  };

  const handleNumChildrenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumChildren(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !formData) {
      setErrorMessage("Dados do formulário ou ID do cliente estão ausentes.");
      return;
    }
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await updateCustomer(id, formData);
      setSuccessMessage("Cliente atualizado com sucesso!");
      window.scrollTo(0, 0);
      setTimeout(() => navigate("/list"), 2000); // Redirect after 2 seconds
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "Ocorreu um erro ao atualizar o cliente."
        );
      } else {
        setErrorMessage("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="text-center p-10">Carregando dados do cliente...</div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center p-10 text-red-500">
        {errorMessage || "Não foi possível carregar os dados do cliente."}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
        Editar Cliente
      </h2>

      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Sucesso!</strong>
          <span className="block sm:inline ml-2">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
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
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
            Salvar Alterações
          </Button>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomerPage;
