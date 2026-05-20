import Icon from "../../components/Icon.jsx";
import { AdminLayout } from "../../components/Charts.jsx";
import RankingTable from "../../components/RankingTable.jsx";

export default function AdminRanking() {
  return (
    <AdminLayout label="Ranking">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "end", marginBottom: 32 }}>
        <div>
          <span className="eyebrow">Gestão</span>
          <h1 className="display" style={{ fontSize: 38, margin: "10px 0 0" }}>
            Ranking de doadores
          </h1>
        </div>
        <button className="btn btn-secondary btn-sm">
          <Icon name="upload" size={14} /> Exportar CSV
        </button>
      </div>

      <RankingTable isAdmin={true} />
    </AdminLayout>
  );
}
