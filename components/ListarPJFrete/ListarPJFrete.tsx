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

interface FretePJ {
  funcionario: string;
  empresa: string;
  representante: string;
  data: string;
  valor: number;
}

const ListarPjFrete = () => {
  const [fretesPJ, setFretesPJ] = useState<FretePJ[]>([]);
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  const buscarFretesPJ = () => {
    if (!mes || !ano) {
      alert("Por favor, selecione o mês e insira o ano.");
      return;
    }

    fetch(`http://localhost:8080/fretes/pj-fretes/mes/${mes}/ano/${ano}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFretesPJ(data);
        } else {
          console.error("Formato de dados inesperado:", data);
        }
      })
      .catch((err) => console.error("Erro ao buscar fretes PJ:", err));
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
              href="/listarPjFrete"
              className="text-lg text-black"
            >
              Lista de Fretes PJ
            </BreadcrumbLink>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-3xl mb-2 mt-3 flex items-center gap-5">
        Lista de Fretes PJ
      </h1>
      <Separator className="w-full" />

      {/* Filtros */}
      <div className="flex gap-4 mb-4 mt-4">
        <select
          className="w-48 p-2 border rounded"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        >
          <option value="">Selecione o mês</option>
          <option value="01">Janeiro</option>
          <option value="02">Fevereiro</option>
          <option value="03">Março</option>
          <option value="04">Abril</option>
          <option value="05">Maio</option>
          <option value="06">Junho</option>
          <option value="07">Julho</option>
          <option value="08">Agosto</option>
          <option value="09">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
        </select>
        <Input
          name="ano"
          placeholder="Digite o ano"
          type="number"
          className="w-48"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />
        <Button onClick={buscarFretesPJ} className="bg-blue-500">
          Buscar
        </Button>
      </div>

      {/* Tabela */}
      <div className="flex-grow overflow-auto">
        <div className="border rounded-lg p-2 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Representante</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fretesPJ.map((frete, index) => (
                <TableRow key={index} className="hover:bg-gray-200">
                  <TableCell>{frete.funcionario}</TableCell>
                  <TableCell>{frete.empresa}</TableCell>
                  <TableCell>{frete.representante}</TableCell>
                  <TableCell>
                    {new Date(frete.data).toLocaleDateString()}
                  </TableCell>
                  <TableCell>R$ {frete.valor.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {fretesPJ.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
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

export default ListarPjFrete;
