import { useEffect, useState, useMemo } from "react";
import ListagemLayout from "../../layouts/ListagemLayout";
import Tabela from "../../components/Tabela";
import TituloTabela from "../../components/TituloTabela";
import { useNavigate } from "react-router-dom";

import { buscarInscricoes, excluirInscricao } from "./inscricoes.service";
import { colunasInscricoes } from "./inscricoes.columns";

export default function InscricoesPage() {
  const [dados, setDados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarInscricoes() {
      try {
        setLoading(true);
        const inscricoes = await buscarInscricoes();
        setDados(inscricoes);
      } catch (error) {
        console.error("Erro ao buscar inscrições:", error.response?.data || error.message);
        alert("Erro ao carregar inscrições");
      } finally {
        setLoading(false);
      }
    }

    carregarInscricoes();
  }, []);

  // =============================
  // DELETE
  // =============================
  async function handleDelete(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta inscrição?");
    if (!confirmar) return;

    try {
      await excluirInscricao(id);

      // Atualização otimista (remove da lista sem recarregar página)
      setDados((prev) => prev.filter((inscricao) => inscricao.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error.response?.data || error.message);
      alert("Erro ao excluir inscrição");
    }
  }

  // =============================
  // FILTRO DE PESQUISA (CLIENT SIDE)
  // =============================
  const dadosFiltrados = useMemo(() => {
    if (!pesquisa.trim()) return dados;

    const termo = pesquisa.toLowerCase();

    return dados.filter((inscricao) =>
      inscricao.nome?.toLowerCase().includes(termo) ||
      inscricao.email?.toLowerCase().includes(termo) ||
      inscricao.id?.toString().includes(termo)
    );
  }, [dados, pesquisa]);

  return (
    <ListagemLayout
      titulo="Lista de Inscrições"
      subtitulo="Gerencie e visualize todas as inscrições"
      placeholderPesquisa="Buscar inscrição..."
      pesquisa={pesquisa}
      onPesquisa={(e) => setPesquisa(e.target.value)}
    >
      <TituloTabela
        titulo="Inscrições"
        paginaAtual={paginaAtual}
        totalPaginas={1}
        totalRegistros={dadosFiltrados.length}
        inicio={dadosFiltrados.length > 0 ? 1 : 0}
        fim={dadosFiltrados.length}
        onPaginaChange={setPaginaAtual}
      />

      {loading ? (
        <p className="p-6">Carregando...</p>
      ) : (
        <Tabela
          dados={dadosFiltrados}
          colunas={colunasInscricoes}
          chaveSelecao="id"
          onAcaoClick={(acao, item) => {
            if (acao === "visualizar") {
              navigate(`/inscricoes/${item.id}`);
            }

            if (acao === "editar") {
              navigate(`/inscricoes/${item.id}/editar`);
            }

            if (acao === "excluir") {
              handleDelete(item.id);
            }
          }}
        />
      )}
    </ListagemLayout>
  );
}
