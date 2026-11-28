import PriceCard from "@/components/shared/PriceCard"

export default function HomePro() {
  return (
    <main className="flex flex-col bg-[#F7F5FF] text-black">
      {/* Pricing */}
      <section className="mx-auto w-full max-w-250 flex-1 px-5 pt-10 pb-16">
        <h1 className="mb-10 text-center text-4xl font-black tracking-tight md:text-[42px]">
          Pick your
          <span className="ml-1 rounded-md bg-[#FFDF35] px-2 py-0.5">plan</span>
        </h1>

        <PriceCard />
      </section>
    </main>
  )
}
