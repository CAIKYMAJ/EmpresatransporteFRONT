"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useSearchParams } from "next/navigation";

interface Cidade {
  id: number;
  nome: string;
}

interface Pessoa {
  id: number;
  nome: string;
}

interface Funcionario {
  id: number;
  nome: string;
}

const CadastroFrete = () => {
  const searchParams = useSearchParams();
  const freteId = searchParams.get("id");

  const [formData, setFormData] = useState({
    quemPaga: "",
    numeroConhecimento: "",
    peso: 0,
    valor: 0,
    icms: 0,
    pedagio: 0,
    dataFrete: "",
    origem: "",
    destino: "",
    remetente: "",
    destinatario: "",
    funcionario: "",
  });

  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [remetentes, setRemetentes] = useState<Pessoa[]>([]);
  const [destinatarios, setDestinatarios] = useState<Pessoa[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  // Fetch inicial
  useEffect(() => {
    // Busca cidades
    fetch("http://localhost:8080/cidades/listar")
      .then((res) => res.json())
      .then(setCidades)
      .catch((err) => console.error("Erro ao buscar cidades:", err));

    // Busca remetentes (PF e PJ)
    fetch("http://localhost:8080/clientes/listar/pessoa-fisica")
      .then((res) => res.json())
      .then((data) => setRemetentes(data))
      .catch((err) => console.error("Erro ao buscar remetentes:", err));

    fetch("http://localhost:8080/clientes/listar/pessoa-juridica")
      .then((res) => res.json())
      .then((data) => setRemetentes((prev) => [...prev, ...data]))
      .catch((err) => console.error("Erro ao buscar remetentes PJ:", err));

    // Busca destinatários (PF e PJ)
    fetch("http://localhost:8080/clientes/listar/pessoa-fisica")
      .then((res) => res.json())
      .then((data) => setDestinatarios(data))
      .catch((err) => console.error("Erro ao buscar destinatários:", err));

    fetch("http://localhost:8080/clientes/listar/pessoa-juridica")
      .then((res) => res.json())
      .then((data) => setDestinatarios((prev) => [...prev, ...data]))
      .catch((err) => console.error("Erro ao buscar destinatários PJ:", err));

    // Busca funcionários
    fetch("http://localhost:8080/funcionarios/listar")
      .then((res) => res.json())
      .then(setFuncionarios)
      .catch((err) => console.error("Erro ao buscar funcionários:", err));
  }, []);

  // Busca dados do frete para edição
  useEffect(() => {
    if (freteId) {
      fetch(`http://localhost:8080/fretes/${freteId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            quemPaga: data.quemPaga || "",
            numeroConhecimento: data.numeroConhecimento || "",
            peso: data.peso || 0,
            valor: data.valor || 0,
            icms: data.icms || 0,
            pedagio: data.pedagio || 0,
            dataFrete: data.dataFrete || "",
            origem: data.origem?.id || "",
            destino: data.destino?.id || "",
            remetente: data.remetente?.id || "",
            destinatario: data.destinatario?.id || "",
            funcionario: data.funcionario?.id || "",
          });
        })
        .catch((err) => console.error("Erro ao buscar frete:", err));
    }
  }, [freteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = freteId
      ? `http://localhost:8080/fretes/editar/${freteId}`
      : "http://localhost:8080/fretes/criar";
    const method = freteId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          origem: { id: formData.origem },
          destino: { id: formData.destino },
          remetente: { id: formData.remetente },
          destinatario: { id: formData.destinatario },
          funcionario: { id: formData.funcionario },
        }),
      });
      if (response.ok) {
        alert(freteId ? "Frete atualizado com sucesso!" : "Frete criado com sucesso!");
      } else {
        console.error("Erro ao salvar o frete:", response.statusText);
      }
    } catch (err) {
      console.error("Erro ao enviar os dados:", err);
    }
  };

  return (
    <div className="p-5 w-full">
      <h1 className="text-3xl mb-5">{freteId ? "Editar Frete" : "Cadastrar Frete"}</h1>
      <Separator className="mb-5" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Quem Paga</Label>
          <Input name="quemPaga" value={formData.quemPaga} onChange={handleChange} required />
        </div>
        <div>
          <Label>Número Conhecimento</Label>
          <Input
            name="numeroConhecimento"
            value={formData.numeroConhecimento}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Peso</Label>
            <Input name="peso" type="number" value={formData.peso} onChange={handleChange} />
          </div>
          <div>
            <Label>Valor</Label>
            <Input name="valor" type="number" value={formData.valor} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>ICMS</Label>
            <Input name="icms" type="number" value={formData.icms} onChange={handleChange} />
          </div>
          <div>
            <Label>Pedágio</Label>
            <Input name="pedagio" type="number" value={formData.pedagio} onChange={handleChange} />
          </div>
        </div>
        <div>
          <Label>Data do Frete</Label>
          <Input
            name="dataFrete"
            type="date"
            value={formData.dataFrete}
            onChange={handleChange}
            required
          />
        </div>

        {/* Seletores */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Origem</Label>
            <Select name="origem" value={formData.origem} onValueChange={(value) => setFormData((prev) => ({ ...prev, origem: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                {cidades.map((cidade) => (
                  <SelectItem key={cidade.id} value={cidade.id.toString()}>
                    {cidade.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Destino</Label>
            <Select name="destino" value={formData.destino} onValueChange={(value) => setFormData((prev) => ({ ...prev, destino: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                {cidades.map((cidade) => (
                  <SelectItem key={cidade.id} value={cidade.id.toString()}>
                    {cidade.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Remetente</Label>
            <Select name="remetente" value={formData.remetente} onValueChange={(value) => setFormData((prev) => ({ ...prev, remetente: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o remetente" />
              </SelectTrigger>
              <SelectContent>
                {remetentes.map((remetente) => (
                  <SelectItem key={remetente.id} value={remetente.id.toString()}>
                    {remetente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Destinatário</Label>
            <Select name="destinatario" value={formData.destinatario} onValueChange={(value) => setFormData((prev) => ({ ...prev, destinatario: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o destinatário" />
              </SelectTrigger>
              <SelectContent>
                {destinatarios.map((destinatario) => (
                  <SelectItem key={destinatario.id} value={destinatario.id.toString()}>
                    {destinatario.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Funcionário</Label>
          <Select name="funcionario" value={formData.funcionario} onValueChange={(value) => setFormData((prev) => ({ ...prev, funcionario: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o funcionário" />
            </SelectTrigger>
            <SelectContent>
              {funcionarios.map((funcionario) => (
                <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                  {funcionario.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="bg-blue-500 hover:bg-blue-300">
          {freteId ? "Salvar Alterações" : "Cadastrar"}
        </Button>
      </form>
    </div>
  );
};

export default CadastroFrete;
