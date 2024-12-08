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
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "../ui/breadcrumb";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Arrecadacao {
  cidade: string;
  estado: string;
  quantidadeFretes: number;
  valorTotalArrecadado: number;
}

interface Estado {
  id: number;
  nome: string;
  uf: string;
}

const ListarArrecadacoes = () => {
  const [arrecadacoes, setArrecadacoes] = useState<Arrecadacao[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [ano, setAno] = useState("");

  useEffect(() => {
    // Busca a lista de estados
    fetch("http://localhost:8080/estados/listar")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEstados(data);
        } else {
          console.error("Formato de dados inesperado:", data);
        }
      })
      .catch((err) => console.error("Erro ao buscar estados:", err));
  }, []);

  const buscarArrecadacoes = () => {
    if (!estadoSelecionado || !ano) {
      alert("Por favor, selecione um estado e insira um ano.");
      return;
    }

    fetch(
      `http://localhost:8080/fretes/arrecadacoes/estado/${estadoSelecionado}/ano/${ano}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArrecadacoes(data);
        } else {
          console.error("Formato de dados inesperado:", data);
        }
      })
      .catch((err) => console.error("Erro ao buscar arrecadações:", err));
  };

  return (
    <div className="p-5 w-full h-screen flex flex-col">
      {/* Cabeçalho */}
      <div className="w-full bg-gray-200 text-lg p-2 rounded-lg text-black">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink href="/" className="text-lg text-black">
              Início
            </BreadcrumbLink>
            <h1>|</h1>
            <BreadcrumbLink
              href="/listarArrecadacoes"
              className="text-lg text-black"
            >
              Lista de Arrecadações
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl mb-2 mt-3 flex items-center gap-5">
        Lista de Arrecadações
      </h1>
      <Separator className="w-full" />

      {/* Filtros */}
      <div className="flex gap-4 mb-4 mt-4">
        <select
          className="w-48 p-2 border rounded"
          value={estadoSelecionado}
          onChange={(e) => setEstadoSelecionado(e.target.value)}
        >
          <option value="">Selecione um estado</option>
          {estados.map((estado) => (
            <option key={estado.id} value={estado.id}>
              {estado.nome} ({estado.uf})
            </option>
          ))}
        </select>
        <Input
          name="ano"
          placeholder="Digite o ano"
          type="number"
          className="w-48"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />
        <Button onClick={buscarArrecadacoes} className="bg-blue-500">
          Buscar
        </Button>
      </div>

      {/* Tabela */}
      <div className="flex-grow overflow-auto">
        <div className="border rounded-lg p-2 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Quantidade de Fretes</TableHead>
                <TableHead>Valor Total Arrecadado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {arrecadacoes.map((arrecadacao, index) => (
                <TableRow key={index} className="hover:bg-gray-200">
                  <TableCell>{arrecadacao.cidade}</TableCell>
                  <TableCell>{arrecadacao.estado}</TableCell>
                  <TableCell>{arrecadacao.quantidadeFretes}</TableCell>
                  <TableCell>
                    R$ {arrecadacao.valorTotalArrecadado.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {arrecadacoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ListarArrecadacoes;
