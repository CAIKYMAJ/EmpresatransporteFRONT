"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbLink } from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const EditarFuncionario = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Obtém o ID para edição
  const [formData, setFormData] = useState({
    nome: "",
    numeroRegistro: "",
  });

  useEffect(() => {
    if (id) {
      // Buscar dados do funcionário para edição
      fetch(`http://localhost:8080/funcionarios/listar/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData(data);
        })
        .catch((err) => console.error("Erro ao buscar funcionário:", err));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = id
      ? `http://localhost:8080/funcionarios/editar/${id}`
      : "http://localhost:8080/funcionarios/criar";
    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(id ? "Funcionário atualizado!" : "Funcionário cadastrado!");
        setFormData({ nome: "", numeroRegistro: "" });
      } else {
        console.error("Erro no envio:", response.status);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  return (
    <div className="p-5 w-full">
      {/* Cabeçalho */}
      <div className="w-full bg-gray-200 text-lg p-2 rounded-lg text-black">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink href="/" className="text-lg text-black">
              Início
            </BreadcrumbLink>
            <h1>|</h1>
            <BreadcrumbLink
              href="/cadastroFuncionario"
              className="text-lg text-black"
            >
              Edição de Funcionários
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl mb-5">{id ? "Editar Funcionário" : "Editar Funcionário"}</h1>
      <Separator className="mb-5" />

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nome</Label>
            <Input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Número de Registro</Label>
            <Input
              name="numeroRegistro"
              value={formData.numeroRegistro}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <Button type="submit" className="bg-blue-500">
          {id ? "Salvar Alterações" : "Editar"}
        </Button>
      </form>
    </div>
  );
};

export default EditarFuncionario;
