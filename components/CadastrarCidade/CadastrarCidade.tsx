"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

const CadastrarCidade = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Obtém o ID da cidade para edição
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    precoUnitPeso: "",
    precoUnitValor: "",
    estado: "",
  });
  const [estados, setEstados] = useState<any[]>([]);

  // Carrega os estados para o select
  useEffect(() => {
    fetch("http://localhost:8080/estados/listar") // API para listar estados
      .then((res) => res.json())
      .then((data) => setEstados(data))
      .catch((err) => console.error("Erro ao carregar estados:", err));
  }, []);

  // Carrega os dados da cidade para edição
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/cidades/listar/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            nome: data.nome || "",
            codigo: data.codigo || "",
            precoUnitPeso: data.precoUnitPeso || "",
            precoUnitValor: data.precoUnitValor || "",
            estado: data.estado?.id || "",
          });
        })
        .catch((err) => console.error("Erro ao carregar cidade:", err));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectEstado = (value: string) => {
    setFormData((prev) => ({ ...prev, estado: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = id
      ? `http://localhost:8080/cidades/editar/${id}`
      : "http://localhost:8080/cidades/criar";
    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estado: { id: formData.estado }, // Adapta o formato do estado para a API
        }),
      });
      if (response.ok) {
        console.log(id ? "Cidade atualizada!" : "Cidade cadastrada!");
      } else {
        console.error("Erro ao salvar cidade:", response.status);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  return (
    <div className="p-5 w-full">
      <h1 className="text-3xl mb-5">{id ? "Editar Cidade" : "Cadastrar Cidade"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
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
          <Label>Código</Label>
          <Input
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Preço Unitário por Peso</Label>
          <Input
            name="precoUnitPeso"
            value={formData.precoUnitPeso}
            onChange={handleChange}
            type="number"
            step="0.01"
            required
          />
        </div>
        <div>
          <Label>Preço Unitário por Valor</Label>
          <Input
            name="precoUnitValor"
            value={formData.precoUnitValor}
            onChange={handleChange}
            type="number"
            step="0.01"
            required
          />
        </div>
        <div>
          <Label>Estado</Label>
          <Select onValueChange={handleSelectEstado} value={formData.estado}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Estado" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado.id} value={estado.id.toString()}>
                  {estado.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-300">
          {id ? "Salvar Alterações" : "Cadastrar"}
        </Button>
      </form>
    </div>
  );
};

export default CadastrarCidade;
