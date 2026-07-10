"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  Gamepad2,
  Hammer,
  MessageCircle,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.grandalfheim.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Grand Alfheim Wiki",
        description:
          "Complete Grand Alfheim Wiki covering codes, races, classes, leveling, weapons, bosses, dungeons, map locations, and beginner tips for the Sword Art Online-inspired fantasy MMORPG on Roblox.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 800,
          caption: "Grand Alfheim - Sword Art Online-Inspired Fantasy MMORPG",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Grand Alfheim Wiki",
        alternateName: "Grand Alfheim",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 800,
          caption: "Grand Alfheim Wiki - Fantasy MMORPG on Roblox",
        },
        sameAs: [
          "https://www.roblox.com/games/85888815008505/Grand-Alfheim",
          "https://www.roblox.com/communities/32393597/Grand-Alfheim",
          "https://discord.com/invite/GrandAlfheimRoblox",
          "https://x.com/GrandAlfheimRBX",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Grand Alfheim",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["MMORPG", "Fantasy", "Adventure", "PvP", "PvE"],
        numberOfPlayers: {
          minValue: 1,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/85888815008505/Grand-Alfheim",
        },
      },
      {
        "@type": "VideoObject",
        name: "Grand Alfheim - Gameplay Showcase",
        description:
          "Grand Alfheim gameplay showcase exploring the Sword Art Online-inspired fantasy MMORPG world of Alfheim on Roblox.",
        uploadDate: "2025-06-01",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/akiQ2goW3M8",
        url: "https://www.youtube.com/watch?v=akiQ2goW3M8",
      },
    ],
  };

  // Dungeon accordion state (default first encounter open)
  const [dungeonExpanded, setDungeonExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/85888815008505/Grand-Alfheim"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域之后 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="akiQ2goW3M8"
              title="Grand Alfheim - Gameplay Showcase"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (位于视频区之后、Latest Updates 之前) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToSection(card.sectionId)}
                className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                           bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                           transition-all duration-300 cursor-pointer text-left
                           hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                >
                  <DynamicIcon
                    name={card.icon}
                    className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                  />
                </div>
                <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section (Tools Grid 之后) */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.beginnerGuide.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.beginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-start gap-3 md:gap-4 mb-3">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-[hsl(var(--nav-theme-light))] font-medium">
                      {step.goal}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 mb-3 pl-2">
                  {step.actions.map((action: string, ai: number) => (
                    <li key={ai} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                      <span className="text-sm md:text-base text-muted-foreground">
                        {action}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground italic border-t border-border pt-3">
                  {step.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Race Tier List */}
      <section
        id="race-tier-list"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <Users className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.raceTierList.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.raceTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-6 md:space-y-8">
            {t.modules.raceTierList.tiers.map((tier: any, ti: number) => (
              <div
                key={ti}
                className="rounded-2xl border border-border bg-white/[0.03] overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 md:p-5 bg-[hsl(var(--nav-theme)/0.1)] border-b border-[hsl(var(--nav-theme)/0.3)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white font-bold text-lg flex-shrink-0">
                    {tier.tier}
                  </span>
                  <div>
                    <h3 className="font-bold text-base md:text-lg">
                      {tier.label}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-5">
                  {tier.races.map((race: any, ri: number) => (
                    <div
                      key={ri}
                      className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-[hsl(var(--nav-theme-light))]">
                          {race.name}
                        </h4>
                      </div>
                      <p className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] inline-block mb-3">
                        {race.magic}
                      </p>
                      <ul className="space-y-1.5 mb-3">
                        {race.strengths.map((s: string, si: number) => (
                          <li key={si} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {s}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground italic border-t border-border pt-2">
                        {race.bestFor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Classes and Builds */}
      <section
        id="classes-and-builds"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <Shield className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.classesAndBuilds.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.classesAndBuilds.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.classesAndBuilds.classes.map((cls: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                    {cls.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-semibold">
                    {cls.mainStat}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">Weapon:</span>{" "}
                  {cls.weapon}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {cls.combatStyle}
                </p>
                <p className="text-xs text-muted-foreground italic border-t border-border pt-2 mt-2">
                  {cls.recommendedFor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Leveling Progression */}
      <section
        id="leveling-progression"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.levelingProgression.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.levelingProgression.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.levelingProgression.stages.map((stage: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <span className="text-sm font-bold px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))] w-fit">
                    {stage.levelRange}
                  </span>
                  <h3 className="font-bold text-lg">{stage.stage}</h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {stage.content.map((c: string, ci: number) => (
                    <li key={ci} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{c}</span>
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-border pt-3">
                  <p className="text-sm">
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Goal: </span>
                    <span className="text-muted-foreground">{stage.goal}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Ready when: </span>
                    <span className="text-muted-foreground">{stage.readyWhen}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Weapons and Armor */}
      <section
        id="weapons-and-armor"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <Hammer className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.weaponsAndArmor.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.weaponsAndArmor.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.weaponsAndArmor.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">{item.item}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${item.rarity === "Mythical" ? "bg-purple-500/10 border-purple-500/30 text-purple-300" : item.rarity === "Legendary" ? "bg-orange-500/10 border-orange-500/30 text-orange-300" : item.rarity === "Epic" ? "bg-pink-500/10 border-pink-500/30 text-pink-300" : item.rarity === "Rare" ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]"}`}
                  >
                    {item.rarity}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border">
                    {item.type}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border">
                    Lv {item.level}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">Class:</span>{" "}
                  {item.class}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">Source:</span>{" "}
                  {item.source}
                </p>
                <p className="text-sm text-muted-foreground italic border-t border-border pt-2">
                  {item.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Dungeons and Bosses */}
      <section
        id="dungeons-bosses"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <AlertTriangle className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.dungeonsBosses.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.dungeonsBosses.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.dungeonsBosses.encounters.map(
              (enc: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/[0.03]"
                >
                  <button
                    onClick={() =>
                      setDungeonExpanded(dungeonExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {enc.type}
                      </span>
                      <h3 className="font-bold text-base md:text-lg">{enc.name}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${dungeonExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {dungeonExpanded === index && (
                    <div className="px-4 md:px-5 pb-5 space-y-3">
                      <p className="text-sm">
                        <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Entry: </span>
                        <span className="text-muted-foreground">{enc.entry}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Pattern: </span>
                        <span className="text-muted-foreground">{enc.pattern}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Preparation: </span>
                        <span className="text-muted-foreground">{enc.preparation}</span>
                      </p>
                      <div>
                        <p className="font-semibold text-sm mb-1.5 text-[hsl(var(--nav-theme-light))]">
                          Rewards
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {enc.rewards.map((r: string, ri: number) => (
                            <span
                              key={ri}
                              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                            >
                              <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Controls and Combat */}
      <section
        id="controls-and-combat"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <Gamepad2 className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.controlsAndCombat.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.controlsAndCombat.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.controlsAndCombat.controls.map(
              (ctrl: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {ctrl.platform}
                    </span>
                    <kbd className="text-xs font-mono font-semibold px-2 py-1 rounded bg-white/10 border border-border text-[hsl(var(--nav-theme-light))]">
                      {ctrl.input}
                    </kbd>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{ctrl.action}</h3>
                  <p className="text-xs text-muted-foreground">{ctrl.usage}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Updates and Early Access */}
      <section
        id="updates-early-access"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
              <Clock className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.updatesEarlyAccess.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.updatesEarlyAccess.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.updatesEarlyAccess.entries.map(
              (entry: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {entry.phase}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${entry.status === "Available" ? "bg-green-500/10 border-green-500/30 text-green-300" : entry.status === "Active" ? "bg-green-500/10 border-green-500/30 text-green-300" : entry.status === "Announced" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-300" : "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]"}`}
                      >
                        {entry.status}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.date}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2">{entry.title}</h3>
                    <ul className="space-y-1">
                      {entry.highlights.map((h: string, hi: number) => (
                        <li key={hi} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {h}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Official community links */}
          <div className="scroll-reveal mt-8 md:mt-10 p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <MessageCircle className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">
                Stay Updated on Grand Alfheim
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://discord.com/invite/GrandAlfheimRoblox"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Official Discord{" "}
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.roblox.com/communities/35651981/grand-alfheim-development"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
              >
                Development Group <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://x.com/GrandAlfheimRBX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
              >
                Official X <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/GrandAlfheimRoblox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/GrandAlfheimRBX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/32393597/Grand-Alfheim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/85888815008505/Grand-Alfheim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
