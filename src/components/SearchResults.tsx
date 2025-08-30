import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Clock, Globe, MessageCircle, FileText } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  source?: string;
  timestamp?: Date;
  type: 'answer' | 'source' | 'summary';
}

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  onBack: () => void;
  onStartChat: (query: string) => void;
  isLoading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  query, 
  results, 
  onBack, 
  onStartChat,
  isLoading = false 
}) => {
  // Mock search results based on query
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'AI-Powered Answer',
      content: `Based on your query "${query}", here's what I found: This topic involves several key concepts that are important to understand. The current research suggests that there are multiple perspectives and approaches to consider. Let me break this down into digestible information that addresses your specific question.

Key points to consider:
• Recent developments have shown significant progress in this area
• Multiple studies support various approaches and methodologies
• Practical applications are being explored across different industries
• Future implications could be far-reaching and transformative

This information synthesizes current knowledge while acknowledging that this is an evolving field with ongoing research and development.`,
      type: 'answer',
      timestamp: new Date(),
    },
    {
      id: '2',
      title: 'Related Research Sources',
      content: 'Recent studies from leading institutions provide valuable insights into this topic. Research papers and peer-reviewed articles offer in-depth analysis and evidence-based conclusions.',
      source: 'Academic Research Database',
      type: 'source',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      title: 'Quick Summary',
      content: `Summary: ${query.length > 50 ? query.substring(0, 50) + '...' : query} - Key findings suggest this is a complex topic with multiple facets. Current understanding is based on ongoing research and practical applications. Main takeaways include the importance of continued study and practical implementation.`,
      type: 'summary',
      timestamp: new Date(Date.now() - 7200000),
    }
  ];

  const displayResults = results.length > 0 ? results : mockResults;

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <Globe className="h-4 w-4" />;
      case 'source':
        return <ExternalLink className="h-4 w-4" />;
      case 'summary':
        return <FileText className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'answer':
        return 'bg-gradient-primary';
      case 'source':
        return 'bg-gradient-accent';
      case 'summary':
        return 'bg-gradient-secondary';
      default:
        return 'bg-gradient-primary';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Searching...</h1>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Search Results</h1>
              <p className="text-sm text-muted-foreground">"{query}"</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => onStartChat(query)}
            className="rounded-xl"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Continue in Chat
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {displayResults.map((result, index) => (
            <Card 
              key={result.id} 
              className={`p-6 hover:shadow-medium transition-all duration-300 border-2 ${
                index === 0 ? 'border-primary/20' : 'border-border'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${getResultColor(result.type)} rounded-full flex items-center justify-center`}>
                      {getResultIcon(result.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{result.title}</h3>
                      {result.source && (
                        <p className="text-sm text-muted-foreground">{result.source}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full">
                      {result.type}
                    </Badge>
                    {result.timestamp && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {result.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {result.content}
                  </p>
                </div>
                
                {result.type === 'answer' && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onStartChat(`Tell me more about: ${query}`)}
                      className="rounded-xl"
                    >
                      <MessageCircle className="h-3 w-3 mr-2" />
                      Ask follow-up
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-xl"
                    >
                      <FileText className="h-3 w-3 mr-2" />
                      Summarize
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Related Questions */}
        <Card className="p-6 bg-gradient-secondary border-secondary/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Related Questions
          </h3>
          <div className="grid gap-2">
            {[
              `What are the implications of ${query.split(' ').slice(0, 3).join(' ')}?`,
              `How does ${query.split(' ').slice(0, 2).join(' ')} work in practice?`,
              `What are the latest developments in ${query.split(' ').slice(-2).join(' ')}?`
            ].map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-left h-auto p-3 rounded-xl hover:bg-secondary/50"
                onClick={() => onStartChat(question)}
              >
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SearchResults;