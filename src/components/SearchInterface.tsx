import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Send, Sparkles, MessageCircle, FileText } from 'lucide-react';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  onStartChat: () => void;
  isLoading?: boolean;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ 
  onSearch, 
  onStartChat, 
  isLoading = false 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const suggestedQueries = [
    "Explain quantum computing in simple terms",
    "Latest developments in AI technology",
    "Climate change impact on oceans",
    "Benefits of meditation for mental health"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
            PastelAI
          </h1>
          <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl animate-pulse-glow rounded-full"></div>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your intelligent companion for human-like conversations, smart search, and instant summarization
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything or start a conversation..."
            className="pl-12 pr-24 py-4 text-lg rounded-2xl border-2 border-border bg-card/50 backdrop-blur-sm shadow-soft focus:shadow-medium transition-all duration-300 group-hover:shadow-medium"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Button
              type="submit"
              size="sm"
              variant="default"
              disabled={!query.trim() || isLoading}
              className="rounded-xl px-4 bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-soft"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card 
          className="p-6 cursor-pointer hover:shadow-medium transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-secondary"
          onClick={onStartChat}
        >
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-card-foreground">Start Chat</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Have natural, human-like conversations with AI
          </p>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-medium transition-all duration-300 border-2 hover:border-accent/50 bg-gradient-accent">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-6 w-6 text-accent-foreground" />
            <h3 className="font-semibold text-card-foreground">Smart Search</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Get intelligent answers with real-time information
          </p>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-medium transition-all duration-300 border-2 hover:border-secondary/50">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-6 w-6 text-secondary-foreground" />
            <h3 className="font-semibold text-card-foreground">Summarize</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Get quick, clear summaries of any content
          </p>
        </Card>
      </div>

      {/* Suggested Queries */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground text-center">Try asking about:</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestedQueries.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
              }}
              className="rounded-full text-xs hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;