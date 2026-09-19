import { about } from "../../data.json";
const journey = about.journey;
const education = about.education;

export default function AboutPage() {
  return (
    <>
      <section className="about-hero grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-end md:py-28">
        <div>
          <p className="eyebrow">03 / About the person behind the pixels</p>
          <h1 className="mb-0">
            Curious by
            <br />
            <span className="hero-highlight">default.</span>
          </h1>
        </div>
        <p className="about-lede">
          {about.bio}
        </p>
      </section>

      <section className="about-panel grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
        <div>
          <p className="eyebrow">Journey</p>
          <h2>
            Still in
            <br />
            progress.
          </h2>
        </div>
        <div className="journey-list">
          {journey.map((item) => (
            <article className="journey-item" key={item.year}>
              <span className="journey-year">{item.year}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-panel grid gap-8 border-t-2 border-[var(--border)] md:grid-cols-[0.7fr_1.3fr] md:gap-16">
        <div>
          <p className="eyebrow">Education</p>
          <h2>
            Learning
            <br />
            in public.
          </h2>
        </div>
        <div>
          {education.map((item) => (
            <div className="education-card my-4" key={item.year}>
              <div className="card-topline">
                <span>{item.title}</span>
                <span>{item.year}</span>
              </div>
              <h3>{item.course}</h3>
              <p className="pb-4">{item.description}</p>
              <div className="tag-row">
                {item.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
