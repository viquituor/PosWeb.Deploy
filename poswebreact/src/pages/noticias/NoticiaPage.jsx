import { useEffect, useState, useMemo} from "react";
import ListagemLayout from "../../layouts/ListagemLayout";
import Tabela from "../../components/Tabela";
import TituloTabela from "../../components/TituloTabela";
import { useNavigate } from "react-router-dom";

import { colunasNoticias } from "./noticias.columns";
import { getNoticias, excluirNoticia } from "./noticias.service";

export default function NoticiaPage() {
  const [dados, setDados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarNoticias() {
      try {
        setLoading(true);
        const noticias = await getNoticias();
        setDados(noticias);

      } catch (error) {
        console.error("Erro ao buscar noticias:",  error.response?.data || error.message);
        alert("Erro ao carregar notícias");
      } finally {
        setLoading(false);
      }
    }

    carregarNoticias();
  }, []);

  async function handleDelete(id) {
      const confirmar = window.confirm("Tem certeza que deseja excluir esta notícia?");
      if (!confirmar) return;
  
      try {
        await excluirNoticia(id);
  
        setDados((prev) =>
          prev.filter((noticia) => noticia.id !== id)
        );
      } catch (error) {
        console.error("Erro ao excluir:", error.response?.data || error.message);
        alert("Erro ao excluir notícia");
      }
    }
  
    const dadosFiltrados = useMemo(() => {
      if (!pesquisa.trim()) return dados;
  
      const termo = pesquisa.toLowerCase();
  
      return dados.filter((noticia) =>
        noticia.titulo?.toLowerCase().includes(termo) ||
        noticia.descricao?.toLowerCase().includes(termo) ||
        noticia.id?.toString().includes(termo)
      );
    }, [dados, pesquisa]);

  return (
    <ListagemLayout
      titulo="Lista de Notícias"
      subtitulo="Gerencie e visualize todas as notícias cadastradas"
      placeholderPesquisa="Buscar notícia..."
      pesquisa={pesquisa}
      onPesquisa={(e) => setPesquisa(e.target.value)}
      onAdicionar={() => navigate("/noticias/novo")}
      textoBotao = "Nova Notícia"
    >
      <TituloTabela
        titulo="Notícias"
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
          colunas={colunasNoticias}
          chaveSelecao="id"
          onAcaoClick={(acao, item) => {
          if (acao === "visualizar") {
            navigate(`/noticias/${item.id}`);
            }
      
            if (acao === "editar") {
              navigate(`/noticias/${item.id}/editar`);
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