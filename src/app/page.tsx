import { ApiPlayground, type PlaygroundEndpoint } from "@/components/ApiPlayground";
import { Header } from "@/components/Header";
import { LegacyRoutes } from "@/components/LegacyRoutes";
import {
  Contact,
  Credentials,
  EarlierWork,
  Experience,
  Footer,
  Hero,
  Leadership,
  Skills,
  Work,
} from "@/components/Sections";
import { detailsEndpoint, endpoints } from "@/lib/api";

const playgroundEndpoints: PlaygroundEndpoint[] = [
  ...endpoints.map(({ name, path, description }) => ({ name, path, description })),
  { name: detailsEndpoint.name, path: detailsEndpoint.path, description: detailsEndpoint.description, legacy: true },
];

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <section id="api" className="section" aria-labelledby="api-title">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">API playground</p>
              <h2 className="section-title" id="api-title">
                Don&apos;t just read my résumé. Query it.
              </h2>
              <p className="section-lead">
                A read-only REST API built from the same data that renders this page. Pick an endpoint and hit Send,
                or try <code>POST</code> to see how it handles unsupported methods.
              </p>
            </div>
            <ApiPlayground endpoints={playgroundEndpoints} />
          </div>
        </section>
        <Experience />
        <Work />
        <Leadership />
        <Skills />
        <EarlierWork />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      <LegacyRoutes />
    </>
  );
}
