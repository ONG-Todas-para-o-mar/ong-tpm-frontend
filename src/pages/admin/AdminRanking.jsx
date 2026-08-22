import { useState } from "react";
import Icon from "../../components/Icon.jsx";
import { AdminLayout } from "../../components/Charts.jsx";
import RankingTable from "../../components/RankingTable.jsx";
import { Notice } from "../../components/Shared.jsx";
import { baixarArquivo, mensagemDeErro } from "../../lib/api.js";

export default function AdminRanking() {
  const [erro, setErro] = useState(null);
  const [exportando, setExportando] = useState(false);

  const exportar = async () => {
    setErro(null);
    setExportando(true);
    try {
      await baixarArquivo("/doacoes/exportar/?status=confirmada", "doacoes-confirmadas.csv");
    } catch (err) {
      setErro(mensagemDeErro(err, "Não foi possível exportar o CSV."));
    } finally {
      setExportando(false);
    }
  };

  return (
    <AdminLayout label="Ranking">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 28, gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <span className="eyebrow">Gestão</span>
          <h1 className="display" style={{ fontSize: 36, margin: "10px 0 4px" }}>
            Ranking de doadores
          </h1>
          <p style={{ color: "var(--ink-3)", margin: 0, fontSize: 14 }}>
            Mesma lista pública do site. Quem optou por anonimato não aparece aqui.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={exportar} disabled={exportando}>
          <Icon name="download" size={14} /> {exportando ? "Exportando…" : "Exportar CSV"}
        </button>
      </div>

      {erro && (
        <div style={{ marginBottom: 16 }}>
          <Notice tone="erro" onDismiss={() => setErro(null)}>
            {erro}
          </Notice>
        </div>
      )}

      <div className="card" style={{ padding: "0 24px 24px" }}>
        <RankingTable isAdmin />
      </div>
    </AdminLayout>
  );
}
