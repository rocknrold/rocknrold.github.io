/* eslint-disable @next/next/no-img-element -- static export serves images as-is */
import {
  awards,
  certifications,
  education,
  experience,
  profile,
  sideProjects,
  skills,
  work,
  type IconName,
} from "@/data/resume";
import { Icon } from "./Icon";
import { CurrentYear, RoleDuration, YearsOfExperience } from "./Live";
import s from "./Sections.module.css";

const month = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const fmt = (ym: string) => month.format(new Date(`${ym}-01T00:00:00Z`));

function SectionHead({ id, eyebrow, title, lead }: { id: string; eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="section-head reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title" id={`${id}-title`}>
        {title}
      </h2>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Hero() {
  const stats = [
    {
      value: (
        <>
          <YearsOfExperience />+ yrs
        </>
      ),
      label: "Building production back ends",
    },
    { value: "2025", label: "KMC Project of the Year" },
    { value: "PHP · .NET", label: "Laravel and ASP.NET Core" },
    { value: "Full SDLC", label: "Leading teams from spec to release" },
  ];
  return (
    <section id="top" className={s.hero} aria-labelledby="hero-title">
      <div className={s.heroBg} aria-hidden="true" />
      <div className={`container ${s.heroGrid}`}>
        <div className={s.heroCopy}>
          <p className={s.kicker}>
            <span className={s.pulse} aria-hidden="true" />
            Senior Back-End Developer · Project Team Lead
          </p>
          <h1 id="hero-title" className={s.heroTitle}>
            Harold Aaron
          </h1>
          <p className={s.heroLead}>
            I design <em>reliable backend systems</em> in Laravel and .NET, and I lead the teams that ship them.
          </p>
          <p className={s.heroText}>
            <YearsOfExperience />+ years building enterprise platforms at KMC Solutions and for Sky Cable. Today I architect internal
            platforms and put LLMs to work in production with OpenAI GPT and the Model Context Protocol.
          </p>
          <div className={s.heroCtas}>
            <a className="btn btn-primary" href="#api">
              Query my API <Icon name="arrow-right" size={16} />
            </a>
            <a className="btn btn-ghost" href={`mailto:${profile.links.email}`}>
              <Icon name="mail" size={16} /> Email me
            </a>
            <div className={s.socials}>
              <a className="icon-btn" href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                <Icon name="github" size={18} />
              </a>
              <a className="icon-btn" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                <Icon name="linkedin" size={18} />
              </a>
            </div>
          </div>
          <p className={s.heroMeta}>
            <span>
              <Icon name="map-pin" size={15} /> Taguig City, Philippines
            </span>
            <span>
              <Icon name="server" size={15} /> Currently at {profile.company}
            </span>
          </p>
        </div>

        <aside className={s.profileCard} aria-label="Profile summary">
          <div className={s.profileBar}>
            <span className={s.get}>GET</span>
            <code>/api/v1/profile.json</code>
            <span className={s.ok}>200 OK</span>
          </div>
          <div className={s.profileBody}>
            <img src="/Aaron.jpg" alt="Portrait of Harold Aaron" width={96} height={96} className={s.avatar} />
            <div>
              <p className={s.profileName}>Harold Aaron</p>
              <p className={s.profileRole}>Senior Back-End Developer</p>
            </div>
          </div>
          <pre className={s.miniJson} aria-hidden="true">
            <span className={s.jp}>{"{"}</span>
            {"\n  "}
            <span className={s.jk}>&quot;stack&quot;</span>: [<span className={s.js}>&quot;Laravel&quot;</span>,{" "}
            <span className={s.js}>&quot;.NET&quot;</span>, <span className={s.js}>&quot;Azure&quot;</span>],
            {"\n  "}
            <span className={s.jk}>&quot;leads&quot;</span>: <span className={s.js}>&quot;dev · QA · PM · PO&quot;</span>,
            {"\n  "}
            <span className={s.jk}>&quot;building&quot;</span>: <span className={s.js}>&quot;MCP + GPT tooling&quot;</span>,
            {"\n  "}
            <span className={s.jk}>&quot;award&quot;</span>: <span className={s.js}>&quot;Project of the Year&quot;</span>
            {"\n"}
            <span className={s.jp}>{"}"}</span>
          </pre>
        </aside>
      </div>

      <div className="container">
        <dl className={s.stats}>
          {stats.map((st) => (
            <div key={st.label} className={s.stat}>
              <dt>{st.label}</dt>
              <dd>{st.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container">
        <SectionHead
          id="experience"
          eyebrow="Experience"
          title="Where I've shipped"
          lead="From BIR-compliant billing at a telco to company-wide platforms at KMC, the work has stayed close to the data and the business rules."
        />
        <ol className={s.timeline}>
          {experience.map((role) => (
            <li key={`${role.company}-${role.start}`} className={`${s.role} reveal`}>
              <div className={s.roleWhen}>
                <p className={s.roleDates}>
                  <time dateTime={role.start}>{fmt(role.start)}</time> –{" "}
                  {role.end ? <time dateTime={role.end}>{fmt(role.end)}</time> : <span className={s.now}>Present</span>}
                </p>
                <p className={s.roleDuration}>
                  <RoleDuration start={role.start} end={role.end} />
                </p>
                <p className={s.roleCompany}>{role.company}</p>
                {role.client && <p className={s.roleClient}>Client: {role.client}</p>}
              </div>
              <div className={s.roleBody}>
                <h3>{role.title}</h3>
                <ul className={s.bullets}>
                  {role.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <ul className="chips" aria-label="Technologies">
                  {role.stack.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          id="work"
          eyebrow="Selected work"
          title="Systems I've designed and led"
          lead="Most of this runs behind a company login, so here's what each one does and how I contributed."
        />
        <div className={s.bento}>
          {work.map((w) => (
            <article key={w.slug} className={`card ${s.workCard} ${w.featured ? s.featured : ""} reveal`}>
              <div className={s.workTop}>
                <span className={s.iconTile}>
                  <Icon name={w.icon} size={w.featured ? 24 : 20} />
                </span>
                {w.badge && <span className={`badge ${w.badge === "In progress" ? "badge-muted" : ""}`}>{w.badge}</span>}
              </div>
              <p className={s.workContext}>{w.context}</p>
              <h3 className={s.workTitle}>{w.name}</h3>
              <p className={s.workSummary}>{w.summary}</p>
              <ul className="chips" aria-label="Tags">
                {w.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const principles: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "workflow",
    title: "Own the whole lifecycle",
    text: "Requirements, architecture, data model, development, testing, and release. I stay accountable for all of it.",
  },
  {
    icon: "users",
    title: "Lead across disciplines",
    text: "I run a cross-functional team of developers, QA engineers, a project manager, and a product owner.",
  },
  {
    icon: "git-branch",
    title: "Ship continuously",
    text: "CI/CD pipelines and steady, small releases keep mission-critical internal tools available.",
  },
  {
    icon: "sparkles",
    title: "Put AI to practical use",
    text: "Agentic development with Claude Code and Cursor, plus production LLM features built on OpenAI and MCP.",
  },
];

export function Leadership() {
  return (
    <section id="leadership" className="section" aria-labelledby="leadership-title">
      <div className={`container ${s.leadGrid}`}>
        <div>
          <SectionHead
            id="leadership"
            eyebrow="Team leadership"
            title="How I lead engineering work"
            lead="Strong code and a working team are both part of delivery."
          />
          <ul className={s.principles}>
            {principles.map((p) => (
              <li key={p.title} className="reveal">
                <span className={s.iconTile}>
                  <Icon name={p.icon} size={20} />
                </span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <aside className={`card ${s.awards} reveal`} aria-labelledby="awards-title">
          <h3 id="awards-title">
            <Icon name="award" size={20} /> Recognition
          </h3>
          <ul>
            {awards.map((a) => (
              <li key={a.name}>
                <p className={s.awardName}>{a.name}</p>
                <p className={s.awardMeta}>
                  {a.issuer} · {a.years.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead id="skills" eyebrow="Toolbox" title="Technical skills" />
        <div className={s.skillGrid}>
          {skills.map((g) => (
            <div key={g.group} className={`card ${s.skillCard} reveal`}>
              <h3>
                <span className={s.iconTile}>
                  <Icon name={g.icon} size={18} />
                </span>
                {g.group}
              </h3>
              <ul className="chips">
                {g.items.map((i) => (
                  <li key={i} className="chip">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function EarlierWork() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHead
          id="projects"
          eyebrow="Earlier work"
          title="Personal and academic projects"
          lead="Earlier projects from university and my own time, kept here for the record."
        />
        <div className={s.projectGrid}>
          {sideProjects.map((p) => (
            <article key={p.name} className={`card ${s.projectCard} reveal`}>
              <div className={s.shot}>
                <img src={p.image} alt={`Screenshot of ${p.name}`} loading="lazy" decoding="async" width={640} height={400} />
              </div>
              <div className={s.projectBody}>
                <p className={s.workContext}>{p.tagline}</p>
                <h3 className={s.workTitle}>{p.name}</h3>
                <p className={s.workSummary}>{p.description}</p>
                <ul className="chips" aria-label="Technologies">
                  {p.stack.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className={s.projectLinks}>
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noopener noreferrer">
                      <Icon name="github" size={16} /> Source
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer">
                      <Icon name="external" size={16} /> Live site
                    </a>
                  )}
                  {p.note && <span>{p.note}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Credentials() {
  return (
    <section id="credentials" className="section" aria-labelledby="credentials-title">
      <div className="container">
        <SectionHead id="credentials" eyebrow="Credentials" title="Education & certifications" />
        <div className={s.credGrid}>
          <div className={`card ${s.credCard} reveal`}>
            <span className={s.iconTile}>
              <Icon name="graduation" size={20} />
            </span>
            <div>
              <h3>{education.degree}</h3>
              <p className={s.awardMeta}>
                {education.school} · {education.year}
              </p>
            </div>
          </div>
          {certifications.map((c) => (
            <div key={c.name} className={`card ${s.credCard} reveal`}>
              <span className={s.iconTile}>
                <Icon name="shield" size={20} />
              </span>
              <div>
                <h3>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className={s.credLink}>
                      {c.name} <Icon name="arrow-up-right" size={15} />
                    </a>
                  ) : (
                    c.name
                  )}
                </h3>
                <p className={s.awardMeta}>{c.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <div className={`${s.contact} reveal`}>
          <div>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title" className="section-title">
              Have a backend to build or a team to lead?
            </h2>
            <p className="section-lead">
              I&apos;m happy to talk about senior backend and team-lead work, or about the systems you&apos;re building.
              Email is the fastest way to reach me.
            </p>
            <div className={s.heroCtas}>
              <a className="btn btn-primary" href={`mailto:${profile.links.email}`}>
                <Icon name="mail" size={16} /> {profile.links.email}
              </a>
              <a className="btn btn-ghost" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                <Icon name="linkedin" size={16} /> LinkedIn
              </a>
              <a className="btn btn-ghost" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                <Icon name="github" size={16} /> GitHub
              </a>
            </div>
          </div>
          <pre className={s.terminal} aria-label="Example terminal command">
            <span className={s.termBar} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className={s.prompt}>$</span> curl -s rocknrold.github.io/api/v1/profile.json \{"\n"}
            {"    "}| jq &apos;.data.links&apos;{"\n"}
            <span className={s.jp}>{"{"}</span>
            {"\n  "}
            <span className={s.jk}>&quot;email&quot;</span>: <span className={s.js}>&quot;{profile.links.email}&quot;</span>,
            {"\n  "}
            <span className={s.jk}>&quot;linkedin&quot;</span>: <span className={s.js}>&quot;…/in/aaronharoldc&quot;</span>
            {"\n"}
            <span className={s.jp}>{"}"}</span>
          </pre>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`container ${s.footerInner}`}>
        <p>
          © <CurrentYear /> Harold Aaron · Taguig City, Philippines
        </p>
        <nav aria-label="Footer" className={s.footerLinks}>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.links.email}`}>Email</a>
          <a href="#top">Back to top</a>
        </nav>
      </div>
    </footer>
  );
}
