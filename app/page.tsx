import FreshTuitions from "@/components/homepage/fresh-tuitions"
import Hero from "@/components/homepage/Hero"
import HomeHow from "@/components/homepage/Home-How"
import HomePro from "@/components/homepage/Home-Pro"
import ProjectBehindSection from "@/components/homepage/Project-Info"
import TopSubjects from "@/components/homepage/top-subjects"

export default function Page() {
  return (
    <div>
      <Hero />
      <FreshTuitions />
      <HomeHow />
      <TopSubjects />
      <HomePro />
      <ProjectBehindSection />
    </div>
  )
}
