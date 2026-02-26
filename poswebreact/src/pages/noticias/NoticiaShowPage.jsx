import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buscarNoticiaPorId } from "./noticias.service";

export default function NoticiaShowPage() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await buscarNoticiaPorId(id);
        setNoticia(data);
      } catch (error) {
        console.error(error.response?.data || error.message);
        setNoticia(null);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id]);

  if (loading) return <p className="p-6">Carregando...</p>;
  if (!noticia) return <p className="p-6">Notícia não encontrada.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Detalhes da Notícia</h1>

      <div className="space-y-2">
        <p><strong>ID:</strong> {noticia.id}</p>
        <p><strong>Título:</strong> {noticia.titulo}</p>
        
        <div className="my-4">
            <img 
                src={`http://localhost:8000/${noticia.imagem}`}
                alt={noticia.titulo}
                className="max-w-2xl rounded"
            />
        </div>
        
        <p><strong>Texto:</strong> {noticia.texto}</p>
      </div>
    </div>
  );
}