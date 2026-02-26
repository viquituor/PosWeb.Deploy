import Titulo from "./Titulo";
import Subtitulo from "./Subtitulo";

export default function TituloTopo({ titulo, subtitulo }) {
  return (
    <div>
      <Titulo>{titulo}</Titulo>
      <Subtitulo>{subtitulo}</Subtitulo>
    </div>
  );
}