import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the structure of a news article
interface NewsArticle {
  title: string;
  url: string;
  date: string;
  source: string;
  snippet: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function parseNewsContent(content: string): NewsArticle[] {
  // Array to store extracted articles
  const articles: NewsArticle[] = [];
  
  // Match each numbered article section (works with both markdown and plain text formatting)
  const articleRegex = /\*?\*?(\d+)\.?\*?\*?\s*\*?\*?"([^"]+)"\*?\*?\s*([\s\S]*?)(?=\*?\*?\d+\.?\*?\*?\s*\*?\*?"|$)/g;
  let match;
  
  while ((match = articleRegex.exec(content)) !== null) {
    // Extract article number and title
    // const articleNum = match[1];
    const title = match[2]?.trim();
    const details = match[3]?.trim();
    
    if (!title || !details) continue;
    
    // Extract URL
    let url = '';
    const urlMatch = details.match(/URL:\*?\*?\s*\(\[([^\]]+)\]\(([^)]+)\)\)/);
    if (urlMatch) {
      url = urlMatch[2].split('?')[0]; // Remove UTM parameters
    } else {
      // Try alternate URL formats
      const altUrlMatch: RegExpMatchArray | null = details.match(/\(([^)]+\.[a-z]{2,}[^)]*)\)/);

      if (altUrlMatch) {
        url = altUrlMatch[1].split('?')[0];
      }
    }
    
    // Extract date
    let date = '';
    const dateMatch = details.match(/Publication Date:\*?\*?\s*([^\n]+)/);
    if (dateMatch) {
      date = dateMatch[1].trim();
    }
    
    // Extract source
    let source = '';
    const sourceMatch = details.match(/Source:\*?\*?\s*([^\n]+)/);
    if (sourceMatch) {
      source = sourceMatch[1].trim();
    }
    
    // Extract summary/snippet
    let snippet = '';
    const summaryMatch = details.match(/Summary:\*?\*?\s*([\s\S]+?)(?=\n\n|$)/);
    if (summaryMatch) {
      snippet = summaryMatch[1].trim();
    }
    
    // Add article to results array
    articles.push({
      title,
      url,
      date,
      source,
      snippet
    });
  }
  
  // If no articles were extracted or there are fewer than expected, try extracting from "Recent Developments" section
  if (articles.length < 3) {
    const recentSection = content.match(/## Recent Developments[^]*$/);
    if (recentSection) {
      const links = recentSection[0].match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      
      links.forEach(link => {
        const linkMatch = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const title = linkMatch[1].trim();
          const url = linkMatch[2].split('?')[0]; // Remove UTM parameters
          
          // Only add if this is a new article (not duplicate)
          if (!articles.some(a => a.title === title)) {
            articles.push({
              title,
              url,
              date: '',
              source: url.match(/\/\/(?:www\.)?([^/]+)/)?.[1] || '',
              snippet: ''
            });
          }
        }
      });
    }
  }
  
  console.log('Parsed articles:', articles);
  return articles;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Call OpenAI with web search functionality
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-search-preview",
      web_search_options: {},
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that provides news about political figures. For each news article you find, provide the following information in a numbered list format:\n1. Title of the article in quotes\n2. URL\n3. Publication date\n4. Source name\n5. A brief summary\n\nAt the end, include a 'Recent Developments' section with links to the most important articles."
        },
        { 
          role: "user", 
          content: `Find recent news about ${query}` 
        }
      ]
    });

    // Parse the response to extract news items
    const responseContent = response.choices[0].message.content;
    
    if (!responseContent) {
      return NextResponse.json({ error: 'No news found' }, { status: 404 });
    }

    console.log('Raw response:', responseContent);

    // Parse and structure the news content
    const articles = parseNewsContent(responseContent);

    if (articles.length === 0) {
      // If we couldn't parse any articles, return the raw content
      return NextResponse.json({ 
        articles: [{
          title: "News Results",
          snippet: responseContent,
          source: "Various Sources",
          url: "",
          date: ""
        }]
      });
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
} 