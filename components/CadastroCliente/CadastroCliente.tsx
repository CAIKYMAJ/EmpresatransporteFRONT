"use client";

import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface Pessoa {
  id: number;
  nome: string;
}

const CadastroCliente = () => {
  const router = useRouter();
  const param = useSearchParams()
  const id = param.get("id"); // Pega o ID da URL para edição
  const [tipoPessoa, setTipoPessoa] = useState("pf"); // Estado para Pessoa Física ou Jurídica
  const [representante, setRepresentante] = useState<Pessoa[]>([]);
  const [formData, setFormData] = useState({
    codigoCli: "",
    dataInscricao: "",
    endereco: "",
    telefone: "",
    nome: "",
    cpf: "",
    cnpj: "",
    razaoSocial: "",
    inscricaoEstadual: "",
    representante: {id: 0},
  });

  useEffect(() => {

    fetch("http://localhost:8080/clientes/listar/pessoa-fisica")
    .then((res) => res.json())
    .then((data) => setRepresentante(data))
    .catch((err) => console.error("Erro ao buscar destinatários:", err));

    if (id) {
      // Busca os dados do cliente para edição
      const endpoint =
        tipoPessoa === "pf"
          ? `http://localhost:8080/clientes/listar/${id}`
          : `http://localhost:8080/clientes/listar/${id}`;
      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
          setFormData(data);
          setTipoPessoa(data.cpf ? "pf" : "pj"); // Define o tipo com base nos dados retornados
        })
        .catch((err) => console.error("Erro ao buscar cliente:", err));
    }
  }, [id, tipoPessoa]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTipoPessoaChange = (value: string) => {
    setTipoPessoa(value);
    // Reseta campos irrelevantes ao alternar entre PF/PJ
    setFormData((prev) => ({
      ...prev,
      cpf: "",
      cnpj: "",
      razaoSocial: "",
      inscricaoEstadual: "",
      representante: {id: 0},
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isPessoaFisica = tipoPessoa === "pf";
    const endpoint = id
      ? isPessoaFisica
        ? `http://localhost:8080/clientes/editar/pessoa-fisica/${id}`
        : `http://localhost:8080/clientes/editar/pessoa-juridica/${id}`
      : isPessoaFisica
      ? `http://localhost:8080/clientes/criar/pessoa-fisica`
      : `http://localhost:8080/clientes/criar/pessoa-juridica`;
    const method = id ? "PUT" : "POST";
    let payload;
    if (tipoPessoa === 'pf') {
      payload = {
        "codigoCli": formData.codigoCli,
        "dataInscrisao": formData.dataInscricao,
        "endereco": formData.endereco,
        "telefone": formData.telefone,
        "nome": formData.nome,
        "cpf": formData.cpf
      }
    } else {
      payload = {
        codigoCli: formData.codigoCli,
        dataInscrisao: formData.dataInscricao,
        endereco: formData.endereco,
        telefone: formData.telefone,
        cnpj: formData.cnpj,
        razaoSocial: formData.razaoSocial,
        inscricaoEstadual: formData.inscricaoEstadual,
        representante: {
          id: formData.representante.id
        }
      }
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert(id ? "Cliente atualizado!" : "Cliente cadastrado!");
        // router.push("/clientes");
      } else {
        alert("Esse registro já existe!:");
      }
    } catch (err) {
      alert("Erro na requisição:");
    }
  };

  return (
    <div className="p-5 w-full">
      <h1 className="text-3xl mb-5">{id ? "Editar Cliente" : "Cadastrar Cliente"}</h1>
      <Separator className="mb-5" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Select onValueChange={handleTipoPessoaChange} value={tipoPessoa}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione PF ou PJ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pf">Pessoa Física</SelectItem>
            <SelectItem value="pj">Pessoa Jurídica</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Código do Cliente</Label>
            <Input
              name="codigoCli"
              value={formData.codigoCli}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Data de Inscrição</Label>
            <Input
              name="dataInscricao"
              type="date"
              value={formData.dataInscricao}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Endereço</Label>
            <Input
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
          </div>

          {tipoPessoa === "pf" && (
            <>
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
                <Label>CPF</Label>
                <Input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {tipoPessoa === "pj" && (
            <>
              <div>
                <Label>Razão Social</Label>
                <Input
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>CNPJ</Label>
                <Input
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Inscrição Estadual</Label>
                <Input
                  name="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Representante</Label>
                <Select name="origem" value={String(formData.representante.id)} onValueChange={(value) => setFormData((prev) => ({ ...prev, representante: {id : Number(value)} }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {representante.map((representante) => (
                      <SelectItem key={representante.id} value={representante.id.toString()}>
                        {representante.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <Button type="submit" className="bg-blue-500">
          {id ? "Salvar Alterações" : "Cadastrar"}
        </Button>
      </form>
    </div>
  );
};

export default CadastroCliente;
