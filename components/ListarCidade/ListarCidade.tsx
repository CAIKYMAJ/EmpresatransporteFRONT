"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, Trash2, TriangleAlert } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Cidade {
  id: number;
  nome: string;
  codigo: string;
  precoUnitPeso: number;
  precoUnitValor: number;
  estado: { nome: string };
}

const ListarCidades = () => {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  // Carrega as cidades
  const carregarCidades = () => {
    fetch("http://localhost:8080/cidades/listar") // API para listar cidades
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCidades(data);
        } else {
          console.error("Formato de dados inesperado:", data);
        }
      })
      .catch((err) => console.error("Erro ao buscar cidades:", err));
  };

  useEffect(() => {
    carregarCidades();
  }, []);

  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPesquisa(e.target.value);
  };

  const cidadesFiltradas = cidades.filter((cidade) =>
    cidade.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const excluirCidade = (id: number) => {
    fetch(`http://localhost:8080/cidades/deletar/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          carregarCidades();
          alert("Cidade excluída com sucesso!");
        } else {
          alert("Cidade está sendo utilizada!");
        }
      })
      .catch((err) => alert("Cidade está sendo utilizada!"));
  };

  return (
    <div className="p-5 w-full h-screen flex flex-col">
      <h1 className="text-3xl mb-5">Lista de Cidades</h1>

      {/* Campo de Pesquisa */}
      <div className="mb-4 mt-4">
        <Input
          name="pesquisa"
          placeholder="Pesquisar cidade"
          className="w-96"
          value={pesquisa}
          onChange={handlePesquisaChange}
        />
      </div>

      {/* Tabela */}
      <div className="flex-grow overflow-auto">
        <div className="border rounded-lg p-2 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Preço Unitário (Peso)</TableHead>
                <TableHead>Preço Unitário (Valor)</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Editar</TableHead>
                <TableHead>Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cidadesFiltradas.map((cidade) => (
                <TableRow key={cidade.id} className="hover:bg-gray-200">
                  <TableCell>{cidade.nome}</TableCell>
                  <TableCell>{cidade.codigo}</TableCell>
                  <TableCell>{cidade.precoUnitPeso.toFixed(2)}</TableCell>
                  <TableCell>{cidade.precoUnitValor.toFixed(2)}</TableCell>
                  <TableCell>{cidade.estado.nome}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-blue-500 hover:bg-blue-300"
                      onClick={() => (window.location.href = `/cadastrarCidade?id=${cidade.id}`)}
                    >
                      <Pen />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-red-500 hover:bg-red-300">
                          <Trash2 />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="flex flex-col items-center p-4">
                          <TriangleAlert className="text-red-500 w-16 h-16 mb-4" />
                          <h2 className="text-center text-lg mb-1">
                            Deseja realmente excluir esta cidade?
                          </h2>
                          <p className="text-center text-sm mb-8">
                            Esta ação não pode ser desfeita.
                          </p>
                          <div className="flex justify-center items-center w-full gap-6">
                            <Button className="bg-gray-300 hover:bg-gray-200">
                              Cancelar
                            </Button>
                            <Button
                              className="bg-red-500 hover:bg-red-300"
                              onClick={() => excluirCidade(cidade.id)}
                            >
                              Confirmar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ListarCidades;
