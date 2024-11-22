"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const CadastrarEstado = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Obtém o ID da URL para edição
  const [formData, setFormData] = useState({
    nome: "",
    uf: "",
    icmsLocal: "",
    icmsOutroUf: "",
  });

  useEffect(() => {
    if (id) {
      // Busca os dados para edição
      fetch(`http://localhost:8080/estados/${id}`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((error) => console.error("Erro ao buscar estado:", error));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = id
      ? `http://localhost:8080/estados/editar/${id}`
      : "http://localhost:8080/estados/criar";
    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(id ? "Estado atualizado com sucesso!" : "Estado cadastrado com sucesso!");
        router.push("/estados"); // Redireciona para a listagem
      } else {
        console.error("Erro ao salvar o estado:", response.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <div className="p-5 w-full h-screen flex flex-col">
      {/* Breadcrumb */}
      <div className="w-full bg-gray-200 text-lg p-2 rounded-lg text-black">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink href="/" className="text-lg text-black">
              Início
            </BreadcrumbLink>
            <h1>|</h1>
            <BreadcrumbLink href="/estados" className="text-lg text-black">
              Estados
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl mb-5">{id ? "Editar Estado" : "Cadastrar Estado"}</h1>
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
              placeholder="Digite o nome do estado"
              required
            />
          </div>
          <div>
            <Label>UF</Label>
            <Input
              name="uf"
              value={formData.uf}
              onChange={handleChange}
              placeholder="Digite a UF (ex: GO)"
              maxLength={2}
              required
            />
          </div>
          <div>
            <Label>ICMS Local</Label>
            <Input
              name="icmsLocal"
              value={formData.icmsLocal}
              onChange={handleChange}
              placeholder="Digite o ICMS Local"
              type="number"
              step="0.01"
              required
            />
          </div>
          <div>
            <Label>ICMS Outro UF</Label>
            <Input
              name="icmsOutroUf"
              value={formData.icmsOutroUf}
              onChange={handleChange}
              placeholder="Digite o ICMS de Outra UF"
              type="number"
              step="0.01"
              required
            />
          </div>
        </div>

        <Button type="submit" className="bg-blue-500 hover:bg-blue-300">
          {id ? "Salvar Alterações" : "Cadastrar"}
        </Button>
      </form>
    </div>
  );
};

export default CadastrarEstado;
