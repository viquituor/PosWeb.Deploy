import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ListagemLayout from "../../layouts/ListagemLayout";
import Tabela from "../../components/Tabela";
import TituloTabela from "../../components/TituloTabela";


import { colunasOuvidoria } from "./ouvidoria.columns";
import { buscarOuvidorias, excluirOuvidoria } from "./ouvidoria.service";

export default function AlunoPage() {
  const navigate = useNavigate();
  const [dados, setDados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarOuvidorias() {
      try {
        setLoading(true);
        const alunos = await buscarOuvidorias();
        setDados(alunos);

      } catch (error) {
        console.error("Erro ao buscar ouvidorias:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarOuvidorias();
  }, []);

   async function handleDelete(id) {
      const confirmar = window.confirm("Tem certeza que deseja excluir este aluno?");
      if (!confirmar) return;
  
      try {
        await excluirOuvidoria(id);
  
        // Atualização otimista (remove da lista sem recarregar página)
        setDados((prev) =>
          prev.filter((ouvidoria) => ouvidoria.id !== id)
        );
      } catch (error) {
        console.error("Erro ao excluir:", error.response?.data || error.message);
        alert("Erro ao excluir Ouvidoria");
      }
    }

  const dadosFiltrados = useMemo(() => {
      if (!pesquisa.trim()) return dados;
  
      const termo = pesquisa.toLowerCase();
  
      return dados.filter((ouvidoria) =>
        ouvidoria.autor?.toLowerCase().includes(termo) ||
        ouvidoria.texto?.toLowerCase().includes(termo) ||
        ouvidoria.id?.toString().includes(termo)
      );
    }, [dados, pesquisa]);

  return (
    <ListagemLayout
            titulo="Lista de ouvidorias"
            subtitulo="Gerencie e visualize todos as Ouvidorias"
            placeholderPesquisa="Buscar ouvidorias..."
            pesquisa={pesquisa}
            onPesquisa={(e) => setPesquisa(e.target.value)}
            onAdicionar={() => navigate("/ouvidorias/novo")}
            textoBotao="Nova ouvidoria"
          >
      <TituloTabela
        titulo="Ouvidorias Enviadas"
        paginaAtual={paginaAtual}
        totalPaginas={1}
        totalRegistros={dadosFiltrados.length}
        inicio={1}
        fim={dadosFiltrados.length}
        onPaginaChange={setPaginaAtual}

      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Tabela
          dados={dadosFiltrados}
          colunas={colunasOuvidoria}
          chaveSelecao="id"
           onAcaoClick={(acao, item) => {
            if (acao === "visualizar") {
            navigate(`/ouvidorias/${item.id}`);

            }

            if (acao === "editar") {
              navigate(`/ouvidorias/${item.id}/editar`);
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
