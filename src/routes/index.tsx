import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CLUSTERS, PROGRAMS, type Cluster } from "@/data/programs";

export const Route = createFileRoute("/")({ component: Catalog });

function Catalog() {
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState<Cluster | "all">("all");
  const [org, setOrg] = useState("all");

  const orgs = useMemo(() => {
    const set = new Set(PROGRAMS.map((p) => p.org));
    return [...set].sort((a, b) => a.localeCompare(b, "ru"));
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMS.filter((p) => {
      if (cluster !== "all" && p.cluster !== cluster) return false;
      if (org !== "all" && p.org !== org) return false;
      if (!q) return true;
      const blob = [p.title, p.direction, p.org, p.level, p.audience, p.cluster]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [query, cluster, org]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            Креативные индустрии
          </p>
          <h1 className="font-display text-4xl leading-none font-medium tracking-tight sm:text-5xl">
            Каталог программ
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            40 программ по четырём кластерам. Составитель — Серая Полина Юрьевна.
            Стоимость и сроки ориентировочные, перед записью сверяйте страницу курса.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:min-w-56">
          <Stat label="Программ" value={String(PROGRAMS.length)} />
          <Stat label="В выборке" value={String(rows.length)} />
        </dl>
      </header>

      <section className="mb-5 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Поиск</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Название, направление, школа…"
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-base text-ink outline-none placeholder:text-muted focus:border-accent"
            />
          </label>
          <label className="sm:w-72">
            <span className="sr-only">Организация</span>
            <select
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="h-12 w-full rounded-xl border border-line bg-surface px-3 text-base text-ink outline-none focus:border-accent"
            >
              <option value="all">Все организации</option>
              {orgs.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={cluster === "all"} onClick={() => setCluster("all")}>
            Все кластеры
          </Chip>
          {CLUSTERS.map((name) => (
            <Chip key={name} active={cluster === name} onClick={() => setCluster(name)}>
              {name}
            </Chip>
          ))}
        </div>
      </section>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface px-5 py-10 text-center text-muted">
          Ничего не нашлось. Сбросьте фильтр или измените запрос.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-3 md:hidden">
            {rows.map((p) => (
              <li key={p.id} className="rounded-xl border border-line bg-surface p-4">
                <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                  {p.cluster}
                </p>
                <h2 className="mt-1 font-display text-xl leading-snug">{p.title}</h2>
                <p className="mt-1 text-sm text-muted">{p.direction}</p>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <Field k="Школа" v={p.org} />
                  <Field k="Лицензия" v={p.license} />
                  <Field k="Для кого" v={p.audience} />
                  <Field k="Уровень" v={p.level} />
                  <Field k="Срок" v={p.duration} />
                  <Field k="Стоимость" v={p.price} />
                </dl>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-11 items-center text-sm font-semibold text-accent underline decoration-line underline-offset-4"
                >
                  Открыть программу
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-hidden rounded-xl border border-line bg-surface md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                <thead className="bg-bg text-xs tracking-wide text-muted uppercase">
                  <tr>
                    <th className="px-3 py-3 font-semibold">Программа</th>
                    <th className="px-3 py-3 font-semibold">Направление</th>
                    <th className="px-3 py-3 font-semibold">Организация</th>
                    <th className="px-3 py-3 font-semibold">Уровень</th>
                    <th className="px-3 py-3 font-semibold">Срок</th>
                    <th className="px-3 py-3 font-semibold">Стоимость</th>
                    <th className="px-3 py-3 font-semibold">Ссылка</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id} className="border-t border-line align-top">
                      <td className="px-3 py-3">
                        <div className="font-semibold text-ink">{p.title}</div>
                        <div className="mt-1 text-xs text-accent">{p.cluster}</div>
                      </td>
                      <td className="px-3 py-3 text-muted">{p.direction}</td>
                      <td className="px-3 py-3">
                        <div>{p.org}</div>
                        <div className="mt-1 text-xs text-muted">{p.license}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div>{p.level}</div>
                        <div className="mt-1 text-xs text-muted">{p.audience}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">{p.duration}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{p.price}</td>
                      <td className="px-3 py-3">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-accent underline decoration-line underline-offset-4"
                        >
                          Сайт
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <dt className="text-xs tracking-wide text-muted uppercase">{label}</dt>
      <dd className="font-display text-3xl leading-none">{value}</dd>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-11 rounded-full bg-accent px-4 text-sm font-semibold text-surface"
          : "h-11 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink"
      }
    >
      {children}
    </button>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="leading-snug">{v}</dd>
    </div>
  );
}
