import React, { useState } from 'react';
import SearchInterface from '@/components/SearchInterface';
import SearchResults from '@/components/SearchResults';
import ChatInterface from '@/components/ChatInterface';

type ViewMode = 'search' | 'results' | 'chat';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  source?: string;
  timestamp?: Date;
  type: 'answer' | 'source' | 'summary';
}

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    setIsLoading(true);
    setViewMode('results');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Results are handled in SearchResults component with mock data
    }, 2000);
  };

  const handleStartChat = (initialQuery?: string) => {
    if (initialQuery) {
      setCurrentQuery(initialQuery);
    }
    setViewMode('chat');
  };

  const handleBack = () => {
    if (viewMode === 'results') {
      setViewMode('search');
    } else if (viewMode === 'chat') {
      setViewMode('search');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {viewMode === 'search' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <SearchInterface 
            onSearch={handleSearch}
            onStartChat={() => handleStartChat()}
            isLoading={isLoading}
          />
        </div>
      )}

      {viewMode === 'results' && (
        <SearchResults
          query={currentQuery}
          results={searchResults}
          onBack={handleBack}
          onStartChat={handleStartChat}
          isLoading={isLoading}
        />
      )}

      {viewMode === 'chat' && (
        <ChatInterface
          onBack={handleBack}
          initialQuery={currentQuery}
        />
      )}
    </div>
  );
};

export default Index;
