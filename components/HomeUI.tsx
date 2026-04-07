import React from 'react';
import Hero from './Hero';
import InfoCards from './InfoCards';
import NewsAndEvents from './NewsAndEvents';
import UseCases from './UseCases';
import WhySwalang from './WhySwalang';
import CommunitySections from './CommunitySections';
import Roadmap from './Roadmap';
import { NewsArticle, Package } from '@/lib/api';

interface HomeUIProps {
    latestVersion: string;
    latestNews: NewsArticle[];
    popularPackages: Package[];
}

const HomeUI: React.FC<HomeUIProps> = ({ latestVersion, latestNews, popularPackages }) => {
  return (
    <main>
      <Hero version={latestVersion} />
      <InfoCards />
      {/* We pass the dynamic news down */}
      <NewsAndEvents news={latestNews} />
      <UseCases />
      <WhySwalang />
      <Roadmap />
      {/* We pass the dynamic packages down to the community section (SwaHub preview) */}
      <CommunitySections packages={popularPackages} />
    </main>
  );
};

export default HomeUI;