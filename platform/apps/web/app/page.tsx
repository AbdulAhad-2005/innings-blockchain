import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FadeIn, SlideUp, StaggerChildren, StaggerItem, ParallaxHero, ParallaxLayer } from "@/components/animations"
import { Zap, Trophy, Sparkles, ArrowRight, Shield, TrendingUp, Users } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Live Quizzes",
    description: "Real-time cricket quizzes during matches. Answer questions, earn points, unlock rewards.",
    color: "primary" as const,
  },
  {
    icon: Trophy,
    title: "Reward System",
    description: "Collect points, badges, and blockchain-verified rewards that you actually own.",
    color: "accent" as const,
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description: "Smooth animations, intuitive design, and a gamified interface that keeps you engaged.",
    color: "secondary" as const,
  },
]

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Rewards Claimed", value: "100K+", icon: Trophy },
  { label: "Match Engagement", value: "85%", icon: TrendingUp },
  { label: "Platform Uptime", value: "99.9%", icon: Shield },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff8e7] to-white" />
        
        <ParallaxHero className="absolute inset-0 z-0">
          <ParallaxLayer speed={0.3} className="opacity-30">
            <div className="absolute top-20 left-10 w-32 h-32 border-[8px] border-black rounded-none rotate-12" />
          </ParallaxLayer>
          <ParallaxLayer speed={0.5} className="opacity-20">
            <div className="absolute top-40 right-20 w-24 h-24 bg-[#00b852]" />
          </ParallaxLayer>
          <ParallaxLayer speed={0.4} className="opacity-25">
            <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-[#ffd700] rotate-45" />
          </ParallaxLayer>
          <ParallaxLayer speed={0.6} className="opacity-15">
            <div className="absolute top-1/3 right-1/3 w-20 h-20 border-[6px] border-[#0066ff]" />
          </ParallaxLayer>
        </ParallaxHero>

        <div className="relative z-10 container mx-auto px-6 py-24 text-center">
          <SlideUp delay={0.1}>
            <Badge variant="primary" className="mb-6 text-sm px-6 py-2">
              Built on Blockchain
            </Badge>
          </SlideUp>

          <FadeIn direction="up" delay={0.2}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight mb-6">
              <span className="block">Matchday</span>
              <span className="block text-[#00b852]">Rewards,</span>
              <span className="block">With Bite.</span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10">
              Live matches, fast quizzes, and unlockable blockchain rewards. 
              The ultimate fan engagement platform.
            </p>
          </FadeIn>

          <StaggerChildren delay={0.6} staggerDelay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <StaggerItem>
                <Link href="/login">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-10">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10">
                    Learn More
                  </Button>
                </Link>
              </StaggerItem>
            </div>
          </StaggerChildren>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-[3px] border-black rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-black rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6">
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <StaggerItem key={stat.label}>
                  <div className="text-center p-6 border-[3px] border-white bg-black hover:bg-white/10 transition-colors">
                    <Icon className="w-8 h-8 mx-auto mb-4 text-[#ffd700]" />
                    <div className="font-display text-3xl md:text-4xl font-bold text-[#00b852] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm uppercase tracking-wide text-white/70">
                      {stat.label}
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#fff8e7]">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <Badge variant="accent" className="mb-4">Features</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              Built for Fans
            </h2>
            <p className="text-xl text-gray-600 max-w-xl mx-auto">
              Everything you need for the ultimate cricket experience.
            </p>
          </FadeIn>

          <StaggerChildren className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <StaggerItem key={feature.title}>
                  <div className={`neo-card-${feature.color} neo-card p-8 h-full`}>
                    <div className={`w-16 h-16 border-[3px] border-black bg-${feature.color === 'primary' ? '[#00b852]' : feature.color === 'accent' ? '[#ffd700]' : '[#0066ff]'} flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-display text-2xl font-bold uppercase mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <FadeIn direction="up">
            <div className="neo-card neo-card-cream max-w-3xl mx-auto p-12 md:p-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase mb-6">
                Ready to Join the Game?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                Create your account and start earning rewards today. 
                It only takes a minute.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button variant="primary" size="lg" className="text-lg px-12">
                    Sign Up Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="text-lg px-12">
                    I Have an Account
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00b852] flex items-center justify-center border-[3px] border-white">
                <span className="font-display font-bold text-lg">I</span>
              </div>
              <span className="font-display font-bold text-xl uppercase">Innings</span>
            </div>
            <div className="flex gap-8 text-sm text-white/70">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-white/50">
              &copy; 2026 Innings. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
