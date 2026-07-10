import { useEffect, useState } from "react";
import { BookOpen, Video, FileText, GraduationCap, Search, Flame } from "lucide-react";
import api from "../../services/api";
import { Card, Badge, Skeleton, Button } from "../../components/common";

const ICONS = { Article: FileText, Video: Video, Course: GraduationCap, Guide: BookOpen };

export default function Resources() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/resources").then(setData).catch(() => setData({ resources: [] }));
  }, []);

  if (!data) return <Skeleton height={320} />;

  const types = ["All", ...new Set(data.resources.map((r) => r.type))];
  const list = data.resources.filter(
    (r) =>
      (filter === "All" || r.type === filter) &&
      (r.title.toLowerCase().includes(query.toLowerCase()) || r.tag.toLowerCase().includes(query.toLowerCase()))
  );

  const featured = data.resources?.[0];
  const FeaturedIcon = featured?.type ? (ICONS[featured.type] || BookOpen) : BookOpen;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Resources</h1>
          <p>Curated learning material to accelerate your growth.</p>
        </div>
        <Button variant="outline">Browse Library</Button>
      </div>

      {featured && (
        <Card className="mb-2" style={{ background: "linear-gradient(120deg, var(--surface), #2a1414)" }}>
          <div className="row" style={{ gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)", width: 56, height: 56 }}>
              <FeaturedIcon size={26} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Badge variant="warning"><Flame size={13} /> Featured</Badge>
              <h3 style={{ fontSize: 18, marginTop: 8 }}>{featured.title}</h3>
              <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{featured.tag} · {featured.read}</p>
            </div>
            <Button>Start Learning</Button>
          </div>
        </Card>
      )}

      <div className="row between mb-2" style={{ gap: 12, flexWrap: "wrap" }}>
        <div className="row wrap" style={{ gap: 8 }}>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`badge ${filter === t ? "primary" : ""}`}
              style={{ cursor: "pointer", border: "none" }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="search" style={{ width: 240 }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ border: "none", background: "none", outline: "none", color: "var(--text)", width: "100%", fontSize: 14 }}
          />
        </div>
      </div>

      <div className="grid grid-2">
        {list.map((r) => {
          const Icon = ICONS[r.type] || BookOpen;
          return (
            <Card key={r._id || r.id} hover>
              <div className="row" style={{ gap: 14 }}>
                <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="row between">
                    <h4 style={{ fontSize: 15 }}>{r.title}</h4>
                    <Badge variant="primary">{r.type}</Badge>
                  </div>
                  <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                    {r.tag} · {r.read}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="mt-2" style={{ width: "100%" }}>
                Open Resource
              </Button>
            </Card>
          );
        })}
        {list.length === 0 && (
          <p className="muted" style={{ padding: 20 }}>No resources match your filters.</p>
        )}
      </div>
    </div>
  );
}
