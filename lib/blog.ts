import fs from "fs"
import path from "path"

// Define the blog post type
export interface BlogPost {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  content: string
  coverImage?: string
  tags?: string[]
}

// Get all blog post slugs
export function getAllBlogSlugs(): string[] {
  try {
    const blogDirectory = path.join(process.cwd(), "content", "blog")
    console.log("Looking for blog posts in:", blogDirectory)

    // Check if directory exists
    if (!fs.existsSync(blogDirectory)) {
      console.warn("Blog directory does not exist:", blogDirectory)
      // Create the directory structure if it doesn't exist
      fs.mkdirSync(blogDirectory, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(blogDirectory)
    console.log("Found blog files:", fileNames)
    return fileNames.filter((fileName) => fileName.endsWith(".md")).map((fileName) => fileName.replace(/\.md$/, ""))
  } catch (error) {
    console.error("Error reading blog slugs:", error)
    return []
  }
}

// Get blog post data by slug
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const blogDirectory = path.join(process.cwd(), "content", "blog")
    const fullPath = path.join(blogDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      console.warn(`Blog post file not found: ${fullPath}`)
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    console.log(`Read blog post file: ${fullPath}`)

    // Extract metadata and content
    const { metadata, content } = parseMarkdownWithMetadata(fileContents)

    // Add the slug to the blog post data
    return {
      ...metadata,
      content,
      slug,
    } as BlogPost
  } catch (error) {
    console.error(`Error reading blog file for slug ${slug}:`, error)
    return null
  }
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogDirectory = path.join(process.cwd(), "content", "blog")
    console.log("Getting all blog posts from:", blogDirectory)

    const fileNames = fs.readdirSync(blogDirectory)
    console.log("Found blog files for processing:", fileNames)

    // Only create sample posts if no markdown files exist
    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith(".md"))
    if (markdownFiles.length === 0) {
      console.log("No markdown files found, creating samples")
      createSampleBlogPosts(blogDirectory)
      const updatedFileNames = fs.readdirSync(blogDirectory)
      return processBlogFiles(updatedFileNames, blogDirectory)
    }

    return processBlogFiles(fileNames, blogDirectory)
  } catch (error) {
    console.error("Error reading blog directory:", error)
    return []
  }
}

// Helper function to process blog files
function processBlogFiles(fileNames: string[], blogDirectory: string): BlogPost[] {
  try {
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "")
        const fullPath = path.join(blogDirectory, fileName)

        try {
          const fileContents = fs.readFileSync(fullPath, "utf8")
          console.log(`Processing blog file: ${fileName}`)

          // Extract metadata and content
          const { metadata, content } = parseMarkdownWithMetadata(fileContents)

          return {
            ...metadata,
            content,
            slug,
          } as BlogPost
        } catch (fileError) {
          console.error(`Error processing blog file ${fileName}:`, fileError)
          return null
        }
      })
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error processing blog files:", error)
    return []
  }
}

// Get recent blog posts
export async function getRecentBlogPosts(count = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  return posts.slice(0, count)
}

// Parse markdown with metadata
function parseMarkdownWithMetadata(fileContents: string): { metadata: any; content: string } {
  // Extract metadata and content using custom delimiter pattern
  const metadataPattern = /^===\s*([\s\S]*?)\s*===\s*([\s\S]*)$/
  const match = fileContents.match(metadataPattern)

  if (!match) {
    console.error("Invalid markdown format. Missing metadata delimiters.")
    throw new Error(`Invalid markdown format. Missing metadata delimiters.`)
  }

  // Parse metadata JSON
  let metadata
  try {
    const metadataStr = match[1].trim()
    metadata = JSON.parse(metadataStr)
  } catch (error) {
    console.error("Invalid JSON in metadata section:", error)
    throw new Error(`Invalid JSON in metadata section`)
  }

  // Get the content
  const content = match[2].trim()

  return {
    metadata,
    content,
  }
}

// Create sample blog posts if none exist
function createSampleBlogPosts(blogDirectory: string): void {
  console.log("Creating sample blog posts in:", blogDirectory)

  const samplePosts = [
    {
      title: "Getting Started with React and TypeScript",
      date: "2023-04-15",
      author: "John Doe",
      excerpt: "Learn how to set up a new project with React and TypeScript for type-safe development.",
      tags: ["React", "TypeScript", "Web Development"],
      content: `# Getting Started with React and TypeScript

React and TypeScript are a powerful combination for building robust web applications. TypeScript adds static type checking to JavaScript, which can help catch errors early and improve developer productivity.

## Setting Up Your Project

To create a new React project with TypeScript, you can use Create React App with the TypeScript template:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

This will set up a new React project with TypeScript configuration already in place.

## Basic TypeScript with React

Here's a simple example of a React component written with TypeScript:

\`\`\`typescript
import React, { useState } from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  color = 'primary' 
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  const buttonStyle = {
    backgroundColor: isHovered ? '#0056b3' : '#007bff',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };
  
  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </button>
  );
};

export default Button;
\`\`\`

## Benefits of TypeScript with React

1. **Type Safety**: Catch errors at compile time instead of runtime
2. **Better IDE Support**: Get better autocomplete and documentation
3. **Improved Refactoring**: Make changes with confidence
4. **Self-Documenting Code**: Types serve as documentation

## Next Steps

Once you have your project set up, you might want to explore:

- Setting up ESLint and Prettier for code quality
- Adding React Router for navigation
- Implementing state management with Redux or Context API
- Setting up testing with Jest and React Testing Library

Happy coding!`,
    },
    {
      title: "Designing Effective User Interfaces",
      date: "2023-03-22",
      author: "Jane Smith",
      excerpt:
        "Explore key principles and best practices for creating user interfaces that are both beautiful and functional.",
      tags: ["UI/UX", "Design", "User Experience"],
      content: `# Designing Effective User Interfaces

Creating user interfaces that are both aesthetically pleasing and highly functional requires a deep understanding of design principles and user psychology.

## Core Principles of UI Design

### 1. Clarity

Users should never have to wonder what an element does or how to use it. Clear, intuitive interfaces reduce cognitive load and make for a better user experience.

### 2. Consistency

Consistent interfaces are easier to use because they leverage existing knowledge. Use consistent patterns, colors, and interactions throughout your application.

### 3. Feedback

Always provide feedback for user actions. This could be visual (color changes, animations) or functional (success messages, error notifications).

## Color Theory in UI Design

Color choices significantly impact how users perceive and interact with your interface:

\`\`\`css
/* Example of a balanced color palette */
:root {
  --primary: #3498db;
  --secondary: #2ecc71;
  --accent: #e74c3c;
  --text: #2c3e50;
  --background: #ecf0f1;
  --light: #ffffff;
  --dark: #34495e;
}
\`\`\`

## Typography Guidelines

Good typography enhances readability and establishes hierarchy:

1. **Limit Font Families**: Use no more than 2-3 font families
2. **Establish Hierarchy**: Use size, weight, and color to create clear hierarchy
3. **Ensure Readability**: Maintain sufficient contrast and appropriate line height

## Responsive Design Considerations

\`\`\`css
/* Basic responsive layout example */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}
\`\`\`

## Accessibility Matters

Designing for accessibility isn't just ethical—it's good business:

- Use sufficient color contrast (WCAG recommends at least 4.5:1 for normal text)
- Ensure keyboard navigability
- Add appropriate alt text for images
- Use semantic HTML elements

## Testing Your Designs

Always test your designs with real users. Usability testing can reveal issues that weren't apparent during the design phase.

Remember, great UI design is invisible—it gets out of the user's way and lets them accomplish their goals efficiently and enjoyably.`,
    },
    {
      title: "Introduction to Server-Side Rendering with Next.js",
      date: "2023-02-10",
      author: "Alex Johnson",
      excerpt:
        "Discover how Next.js enables server-side rendering for React applications and why it matters for performance and SEO.",
      tags: ["Next.js", "React", "SSR", "Performance"],
      content: `# Introduction to Server-Side Rendering with Next.js

Next.js has revolutionized how developers build React applications by providing an elegant solution for server-side rendering (SSR), static site generation (SSG), and more.

## What is Server-Side Rendering?

Server-side rendering is the process of rendering web pages on the server and sending fully rendered HTML to the client. This differs from client-side rendering, where the browser receives minimal HTML and JavaScript that then builds the UI.

## Benefits of SSR with Next.js

### 1. Improved Performance

Users see content faster with SSR because the initial HTML is already rendered:

\`\`\`jsx
// pages/index.js - Server-side rendered page
export async function getServerSideProps() {
  // Fetch data on the server
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  
  // Pass data to the page via props
  return { props: { data } }
}

export default function Home({ data }) {
  return (
    <div>
      <h1>Server-side Rendered Content</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
\`\`\`

### 2. Better SEO

Search engines can more easily index content that's rendered on the server, improving your site's visibility.

### 3. Social Media Sharing

SSR ensures that social media platforms can properly display previews of your content when shared.

## Static Site Generation

Next.js also excels at static site generation, which pre-renders pages at build time:

\`\`\`jsx
// pages/blog/[slug].js - Statically generated page
export async function getStaticPaths() {
  // Get all possible paths
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  
  const paths = posts.map(post => ({
    params: { slug: post.slug }
  }))
  
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  // Fetch data for a single post
  const res = await fetch(\`https://api.example.com/posts/\${params.slug}\`)
  const post = await res.json()
  
  return { props: { post } }
}

export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
\`\`\`

## Incremental Static Regeneration

Next.js 9.5 introduced Incremental Static Regeneration (ISR), which allows you to update static pages after you've built your site:

\`\`\`jsx
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  
  return {
    props: { data },
    // Re-generate page at most once per hour
    revalidate: 3600
  }
}
\`\`\`

## Getting Started with Next.js

To create a new Next.js project:

\`\`\`bash
npx create-next-app my-next-app
cd my-next-app
npm run dev
\`\`\`

Next.js provides an excellent developer experience with features like:

- File-system based routing
- API routes
- Built-in CSS and Sass support
- Fast Refresh for quick feedback
- Image optimization

Whether you're building a blog, e-commerce site, or complex web application, Next.js provides the tools you need to create fast, SEO-friendly React applications.`,
    },
  ]

  // Create sample blog post files
  try {
    // Ensure the directory exists
    if (!fs.existsSync(blogDirectory)) {
      fs.mkdirSync(blogDirectory, { recursive: true })
    }

    samplePosts.forEach((post, index) => {
      try {
        const { content, ...metadata } = post
        const fileName = `sample-post-${index + 1}.md`
        const filePath = path.join(blogDirectory, fileName)

        // Format the file with metadata and content
        const fileContent = `===
${JSON.stringify(metadata, null, 2)}
===

${content}`

        fs.writeFileSync(filePath, fileContent)
        console.log(`Created sample blog post: ${fileName}`)
      } catch (fileError) {
        console.error(`Failed to create sample blog post ${index + 1}:`, fileError)
      }
    })

    console.log("Sample blog posts creation completed")
  } catch (error) {
    console.error("Error creating sample blog posts:", error)
  }
}
