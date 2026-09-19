import { IconArrowUpRight, IconBrandGithub, IconArrowUpRightCircle } from "@tabler/icons-react";
import { projects } from "../../data.json";

export default function WorkPage() {
  return (
    <section className="section py-20 md:py-32" id="work">
      <div className="section-heading mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
        <div>
          <p className="eyebrow">02 / Projects I've Worked On</p>
          <h2>Useful over pretty.</h2>
        </div>

        <p className="section-note">
          A few things I&apos;ve helped bring to life.
        </p>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <article
            className="project-card"
            key={project.number}
          >
            <div className="card-topline">
              <span>{project.number}</span>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} live site`}
              >
                <IconArrowUpRight size={20} />
              </a>
            </div>

            <div className="project-art" aria-hidden="true">
              <img src={`/production/img/`+ project.imgSrc} alt={project.title}/>
            </div>

            <h3>{project.title}</h3>

            <p>{project.description}</p>
            <div className="tag-row my-3">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 my-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-400 text-black font-bold text-sm sm:text-base transform transition-transform hover:-translate-y-1 hover:shadow-lg dark:text-black
                border-2 border-black dark:border-darkBorder
                shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#555555]">
                      <IconBrandGithub/>
                      Code</a>
              )}

              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-400 text-black font-bold text-sm sm:text-base transform transition-transform hover:-translate-y-1 hover:shadow-lg dark:text-black
                    border-2 border-black dark:border-darkBorder
                    shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#555555]">
                      <IconArrowUpRightCircle/>
                      Live Demo</a>
              )}
            </div>

          </article>
        ))}
      </div>
    </section>
  );
}
