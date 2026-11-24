import Link from "next/link";
import { ArrowRight, Button } from "@/components/button";
import { CommandBar } from "@/components/command-bar";
import { ConsoleMock } from "@/components/console-mock";
import { Evaluation } from "@/components/evaluation";
import { Factory } from "@/components/factory";
import { FeatureArt } from "@/components/feature-art";
import { Mark } from "@/components/logo";
import { ResearchRecord } from "@/components/research-record";
import { features, pillars } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 pt-16 pb-12 text-center lg:px-9 lg:pt-24 lg:pb-16">
        <Mark shuffle className="mb-8 hidden size-14 md:block" />
        <h1 className="max-w-5xl text-[clamp(2rem,4.2vw,4rem)] leading-none font-medium tracking-[-0.04em] capitalize">
          <span className="block">RL post-training</span>
          <span className="block">for small data</span>
        </h1>
        <p className="mt-5 font-mono text-[clamp(0.75rem,1.15vw,1.15rem)] text-muted">
          Sample efficient. Model agnostic. Fully owned.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact">Start a run</Button>
          <Button href="/contact" variant="ghost">
            Book a lab <ArrowRight />
          </Button>
        </div>
        <div className="mt-8 w-full max-w-[40rem]">
          <CommandBar />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-4 pt-2 lg:px-6 lg:pt-6">
        <div className="aspect-[4/3] overflow-hidden border border-line-strong bg-[radial-gradient(ellipse_at_center,#1a1a1a_0%,#0d0d0d_72%)] sm:aspect-video">
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

      <section className="mx-auto w-full max-w-[1440px] px-4 py-16 lg:px-9 lg:py-24">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-[1.7rem] leading-none tracking-[-0.035em] lg:text-[2.25rem]">
            Build a post-training regime
          </h2>
          <p className="mt-4 text-sm leading-snug text-faint lg:text-base">
            Using our methods, turn a short stack of demonstrations and preferences into a policy. We
            plan the run, apply the update, and validate it against the evals you wrote.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-16">
          {features.map((feature) => (
            <li key={feature.slug} id={feature.slug}>
              <Link href={`/product#${feature.slug}`} className="flex flex-col gap-4">
                <div className="aspect-square overflow-hidden">
                  <FeatureArt slug={feature.slug} />
                </div>
                <h3 className="text-lg leading-snug">{feature.title}</h3>
                <p className="text-sm leading-snug text-faint lg:text-base">{feature.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
