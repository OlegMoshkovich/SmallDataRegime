import { CommandBar } from "@/components/command-bar";
import { ConsoleMock } from "@/components/console-mock";
import { Evaluation } from "@/components/evaluation";
import { Factory } from "@/components/factory";
import { ResearchRecord } from "@/components/research-record";
import { pillars } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 pt-24 pb-36 text-center lg:px-9 lg:pt-36 lg:pb-44">
        <h1 className="max-w-5xl text-[clamp(2rem,4.2vw,4rem)] leading-none font-light tracking-[-0.04em]">
          small_data_regime
        </h1>
        <p className="mt-5 font-mono text-[clamp(0.75rem,1.15vw,1.15rem)] text-muted">
          Sample efficient. Model agnostic. Fully owned.
        </p>
        <div className="mt-8 w-full max-w-[40rem]">
          <CommandBar />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-4 pt-2 lg:px-6 lg:pt-6">
        <div className="border border-line-strong bg-[radial-gradient(ellipse_at_center,#1a1a1a_0%,#0d0d0d_72%)]">
          <ConsoleMock />
        </div>
      </div>

      <section className="mx-auto hidden w-full max-w-[1440px] px-4 py-16 lg:px-9 lg:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-[2rem] leading-[1.12] tracking-[-0.04em] lg:text-[2.75rem]">
            The foundation for{" "}
            <span className="whitespace-nowrap lg:whitespace-normal">
              small-data <span className="lg:block">post-training</span>
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-snug text-faint lg:text-base">
            Shape a reward, train on a small set, and ship only the policies that
            pass your evals — on a cluster, a lab machine, or an air-gapped host.
          </p>
        </div>
        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <li
              key={pillar.index}
              className="grid content-start gap-5 border border-line bg-surface p-6"
            >
              <p className="flex gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                <span className="text-muted">{pillar.index}</span>
                <span>{pillar.kicker}</span>
              </p>
              <h3 className="text-lg leading-snug">{pillar.title}</h3>
              <p className="text-sm leading-snug text-faint lg:text-base">{pillar.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <ResearchRecord />

      <Factory />

      <Evaluation />
    </>
  );
}
