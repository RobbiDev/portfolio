===
{
  "title": "Sample Project",
  "summary": "This is a sample project demonstrating the markdown content structure for projects.",
  "category": "WEB DEVELOPMENT",
  "technologies": ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  "coverImage": "/digital-grid-neon.png",
  "client": "Demo Client",
  "timeline": "January 2023 - March 2023",
  "role": "Lead Developer",
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/username/sample-project",
  "features": [
    "Responsive design",
    "Dark and light theme",
    "API integration",
    "User authentication"
  ]
}
===

# Sample Project

This is a sample project that demonstrates how to use the markdown format for project content. The metadata is stored in JSON format between the `===` delimiters, and the content is written in Markdown below.

## Project Overview

This project was created to showcase how to structure project content using Markdown files. The content can include rich formatting, code snippets, images, and more.

## Implementation Details

Here's an example of how you might implement a feature in this project:

\`\`\`typescript
// Example component
import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ text, onClick, variant = 'primary' }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-medium';
  const variantClasses = variant === 'primary' 
    ? 'bg-lime-400 text-black hover:bg-lime-300' 
    : 'bg-black border border-lime-400/20 text-white hover:bg-black/50';
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
\`\`\`

## Results

The project was successfully implemented and delivered to the client. Key outcomes included:

- Improved user engagement by 35%
- Reduced load time by 50%
- Increased conversion rate by 20%

## Challenges and Solutions

One of the main challenges was ensuring the application performed well on all devices. This was addressed by:

1. Implementing responsive design principles
2. Optimizing images and assets
3. Using code splitting to reduce bundle size
4. Implementing lazy loading for components

> The most difficult part of the project was optimizing for older browsers while maintaining a modern user experience.

## Conclusion

This project demonstrates the power of using Markdown files for structuring project content. It allows for rich formatting while maintaining a clean separation between metadata and content.
