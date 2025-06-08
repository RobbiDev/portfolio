import fs from "fs"
import path from "path"
import type { Category, GalleryImage } from "./types"

// Define the project type
export interface Project {
  slug: string
  title: string
  summary: string
  category: string
  technologies: string[]
  coverImage: string
  content?: string
  client?: string
  timeline?: string
  role?: string
  liveUrl?: string
  githubUrl?: string
  features?: string[]
  images?: GalleryImage[] // Updated to use GalleryImage type
  gallery?: GalleryImage[] // Added gallery support
  relatedProjects?: { slug: string; title: string; category: string; summary: string }[]
}

// Get all project slugs
export function getAllProjectSlugs(): string[] {
  try {
    const projectsDirectory = path.join(process.cwd(), "content", "projects")
    console.log("Looking for projects in:", projectsDirectory)

    // Check if directory exists
    if (!fs.existsSync(projectsDirectory)) {
      console.warn("Projects directory does not exist:", projectsDirectory)
      // Create the directory structure if it doesn't exist
      fs.mkdirSync(projectsDirectory, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(projectsDirectory)
    console.log("Found project files:", fileNames)
    return fileNames.filter((fileName) => fileName.endsWith(".md")).map((fileName) => fileName.replace(/\.md$/, ""))
  } catch (error) {
    console.error("Error reading project slugs:", error)
    return []
  }
}

// Get project data by slug
export function getProjectBySlug(slug: string): Project | null {
  try {
    const projectsDirectory = path.join(process.cwd(), "content", "projects")
    const fullPath = path.join(projectsDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      console.warn(`Project file not found: ${fullPath}`)
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    console.log(`Read project file: ${fullPath}`)

    // Extract metadata and content
    const { metadata, content } = parseMarkdownWithMetadata(fileContents)

    // Add the slug to the project data
    return {
      ...metadata,
      content,
      slug,
    } as Project
  } catch (error) {
    console.error(`Error reading project file for slug ${slug}:`, error)
    return null
  }
}

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projectsDirectory = path.join(process.cwd(), "content", "projects")
    console.log("Getting all projects from:", projectsDirectory)

    // Check if directory exists
    if (!fs.existsSync(projectsDirectory)) {
      console.warn("Projects directory does not exist:", projectsDirectory)
      // Create the directory structure if it doesn't exist
      fs.mkdirSync(projectsDirectory, { recursive: true })

      // Add sample projects if none exist
      createSampleProjects(projectsDirectory)
    }

    const fileNames = fs.readdirSync(projectsDirectory)
    console.log("Found project files for processing:", fileNames)

    // Only create sample projects if no markdown files exist
    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith(".md"))
    if (markdownFiles.length === 0) {
      console.log("No markdown files found, creating samples")
      createSampleProjects(projectsDirectory)
      const updatedFileNames = fs.readdirSync(projectsDirectory)
      return processProjectFiles(updatedFileNames, projectsDirectory)
    }

    return processProjectFiles(fileNames, projectsDirectory)
  } catch (error) {
    console.error("Error in getAllProjects:", error)
    return []
  }
}

// Get projects by category
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await getAllProjects()
  return projects.filter((project) => project.category.toLowerCase().replace(/\s+/g, "-") === category.toLowerCase())
}

// Get all project categories
export async function getProjectCategories(): Promise<Category[]> {
  const projects = await getAllProjects()
  const categoryMap = new Map<string, { name: string; count: number }>()

  projects.forEach((project) => {
    const categorySlug = project.category.toLowerCase().replace(/\s+/g, "-")
    const existing = categoryMap.get(categorySlug)
    if (existing) {
      existing.count += 1
    } else {
      categoryMap.set(categorySlug, {
        name: project.category,
        count: 1,
      })
    }
  })

  return Array.from(categoryMap.entries()).map(([slug, { name, count }]) => ({
    name,
    slug,
    count,
  }))
}

// Helper function to process project files
function processProjectFiles(fileNames: string[], projectsDirectory: string): Project[] {
  try {
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "")
        const fullPath = path.join(projectsDirectory, fileName)

        try {
          const fileContents = fs.readFileSync(fullPath, "utf8")
          console.log(`Processing project file: ${fileName}`)

          // Extract metadata and content
          const { metadata, content } = parseMarkdownWithMetadata(fileContents)

          return {
            ...metadata,
            content,
            slug,
          } as Project
        } catch (fileError) {
          console.error(`Error processing project file ${fileName}:`, fileError)
          return null
        }
      })
      .filter((project): project is Project => project !== null)
  } catch (error) {
    console.error("Error processing project files:", error)
    return []
  }
}

// Get featured projects
export async function getFeaturedProjects(count = 3): Promise<Project[]> {
  const projects = await getAllProjects()
  // Sort by featured property if it exists, otherwise return first N projects
  return projects
    .sort((a, b) => {
      // @ts-ignore - featured might not exist on every project
      if (a.featured && !b.featured) return -1
      // @ts-ignore - featured might not exist on every project
      if (!a.featured && b.featured) return 1
      return 0
    })
    .slice(0, count)
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

// Create sample projects if none exist
function createSampleProjects(projectsDirectory: string): void {
  console.log("Creating sample projects in:", projectsDirectory)

  const sampleProjects = [
    {
      title: "E-Commerce Platform",
      summary:
        "A modern e-commerce platform with advanced filtering and search capabilities. Built with performance and user experience in mind, this project showcases my ability to create complex, interactive web applications.",
      coverImage: "/dark-minimalist-shop.png",
      category: "Web Development",
      technologies: ["React", "Next.js", "Node.js", "Express", "PostgreSQL", "Prisma", "Stripe", "Tailwind CSS"],
      features: [
        "Advanced search and filtering",
        "Real-time inventory management",
        "Secure payment processing",
        "Responsive design for all devices",
      ],
      client: "RetailTech Inc.",
      timeline: "January 2022 - June 2022",
      role: "Lead Developer",
      liveUrl: "https://example-ecommerce.com",
      githubUrl: "https://github.com/username/ecommerce-platform",
      images: [
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Homepage with featured products and search functionality",
          alt: "E-commerce homepage design",
        },
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Product catalog with advanced filtering options",
          alt: "Product catalog interface",
        },
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Shopping cart and checkout process",
          alt: "Shopping cart interface",
        },
      ],
      gallery: [
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Admin dashboard for inventory management",
          alt: "Admin dashboard interface",
        },
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Mobile app interface showing product browsing",
          alt: "Mobile app interface",
        },
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Sales analytics and reporting dashboard",
          alt: "Analytics dashboard",
        },
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Detailed product page with reviews",
          alt: "Product detail page",
        },
      ],
      content: `# E-Commerce Platform

This project is a full-featured e-commerce platform built with modern web technologies. The goal was to create a fast, responsive, and user-friendly shopping experience that could scale to handle thousands of products and users.

## Technical Challenge

The main challenge was building a system that could handle complex filtering and searching across thousands of products while maintaining excellent performance. The solution involved:

- Server-side rendering with Next.js for fast initial page loads
- Optimized database queries with Prisma
- Client-side caching strategy for frequent operations
- Lazy loading and virtualization for product listings

![Architecture Diagram](/placeholder.svg?height=300&width=500&query=ecommerce architecture)

## Implementation Details

### Product Catalog

The product catalog system was built with a flexible schema that allowed for different product types with varying attributes:

\`\`\`typescript
// Product model example
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: Category[];
  attributes: ProductAttribute[];
  images: ProductImage[];
  inventory: Inventory;
}
\`\`\`

### Cart and Checkout System

The cart system used a combination of local storage and server synchronization to provide a seamless experience:

\`\`\`typescript
// Cart management with React Context
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from local storage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Other cart operations...
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
\`\`\`

![Cart Interface](/placeholder.svg?height=300&width=500&query=shopping cart interface)

## Results

The platform has processed over 10,000 orders since launch, with an average page load time of under 2 seconds. The client reported a 35% increase in conversion rate compared to their previous solution.

### Key Metrics

- **Performance**: 95+ Lighthouse score
- **Conversion Rate**: 35% improvement
- **Load Time**: Under 2 seconds average
- **User Satisfaction**: 4.8/5 rating`,
    },
    {
      title: "Portfolio Dashboard",
      summary:
        "Interactive dashboard for tracking and visualizing investment portfolio performance. Features real-time data updates, customizable charts, and comprehensive analytics to help users make informed investment decisions.",
      coverImage: "/financial-dashboard-overview.png",
      category: "Data Visualization",
      technologies: ["TypeScript", "React", "D3.js", "Firebase", "Node.js", "Express", "MongoDB"],
      features: [
        "Real-time data synchronization",
        "Interactive performance charts",
        "Asset allocation visualization",
        "Portfolio risk analysis",
      ],
      client: "FinTech Innovations",
      timeline: "March 2021 - December 2021",
      role: "Full Stack Developer",
      liveUrl: "https://portfolio-dashboard-demo.com",
      // No githubUrl to demonstrate optional button
      images: [
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Main dashboard with portfolio overview and key metrics",
          alt: "Financial dashboard overview",
        },
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Interactive performance charts with customizable time ranges",
          alt: "Performance charts interface",
        },
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Asset allocation visualization with drill-down capabilities",
          alt: "Asset allocation chart",
        },
      ],
      gallery: [
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Risk analysis dashboard showing portfolio volatility",
          alt: "Risk analysis dashboard",
        },
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Investment comparison tool with benchmark indices",
          alt: "Investment comparison tool",
        },
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Dividend tracking and projection calculator",
          alt: "Dividend tracker interface",
        },
      ],
      content: `# Portfolio Dashboard

The Portfolio Dashboard is a comprehensive financial tracking application designed to help investors visualize and analyze their investment portfolios in real-time. This project combines complex data visualization with intuitive user experience to make financial data accessible and actionable.

## Project Overview

The dashboard provides users with a comprehensive view of their investment portfolio, including:

- Asset allocation across different investment types
- Historical performance tracking with customizable date ranges
- Risk analysis based on modern portfolio theory
- Dividend tracking and projection
- Benchmark comparison against major indices

![Dashboard Overview](/placeholder.svg?height=300&width=500&query=portfolio dashboard main view)

## Technical Implementation

### Data Visualization

One of the core challenges was creating interactive, responsive charts that could handle real-time updates. I used D3.js combined with React to create reusable chart components:

\`\`\`typescript
// Example of a reusable chart component
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineChartProps {
  data: DataPoint[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  xAccessor: (d: DataPoint) => Date;
  yAccessor: (d: DataPoint) => number;
}

export function LineChart({ data, width, height, margin, xAccessor, yAccessor }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    
    // Clear previous chart
    svg.selectAll('*').remove();
    
    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xAccessor) as [Date, Date])
      .range([margin.left, width - margin.right]);
      
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yAccessor) as number])
      .range([height - margin.bottom, margin.top]);
      
    // Create line generator
    const line = d3.line<DataPoint>()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)));
      
    // Add line path
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
      
    // Add axes
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
      .attr('transform', \`translate(0,\${height - margin.bottom})\`)
      .call(xAxis);
      
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
      .attr('transform', \`translate(\${margin.left},0\`)
      .call(yAxis);
      
  }, [data, width, height, margin, xAccessor, yAccessor]);
  
  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
}
\`\`\`

### Real-time Data Synchronization

Firebase Realtime Database was used to provide real-time updates to the dashboard:

\`\`\`typescript
// Simplified example of Firebase integration
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

export function usePortfolioData(userId: string) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const portfolioRef = ref(database, \`users/\${userId}/portfolio\`);
    
    const unsubscribe = onValue(portfolioRef, (snapshot) => {
      setLoading(false);
      if (snapshot.exists()) {
        setPortfolioData(snapshot.val());
      } else {
        setError(new Error('Portfolio data not found'));
      }
    }, (error) => {
      setLoading(false);
      setError(error);
    });
    
    return () => unsubscribe();
  }, [userId]);
  
  return { portfolioData, loading, error };
}
\`\`\`

![Real-time Updates](/placeholder.svg?height=300&width=500&query=real-time data updates)

## User Impact

The dashboard has helped investors to:

- Identify underperforming assets
- Recognize asset allocation imbalances
- Track progress toward financial goals
- Make more informed investment decisions

The client reported that users spend an average of 15 minutes per session analyzing their portfolios, and that the platform has helped retain customers with a 25% reduction in churn.`,
    },
    {
      title: "Mobile Fitness App",
      summary:
        "Cross-platform mobile application for tracking workouts and nutrition. Includes features like custom workout plans, progress tracking, and social sharing to keep users motivated and engaged with their fitness goals.",
      coverImage: "/fitness-dashboard-concept.png",
      category: "Mobile Development",
      technologies: ["React Native", "Redux", "Node.js", "MongoDB", "Express", "JWT", "Firebase"],
      features: [
        "Personalized workout plans",
        "Nutrition tracking and meal planning",
        "Progress visualization and analytics",
        "Social sharing and challenges",
      ],
      client: "FitTech Solutions",
      timeline: "August 2020 - April 2021",
      role: "Lead Mobile Developer",
      liveUrl: "https://fitnesstracker-app.com",
      githubUrl: "https://github.com/username/fitness-app",
      images: [
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Home screen with daily workout summary and quick actions",
          alt: "Fitness app home screen",
        },
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Workout tracking interface with exercise timer and progress",
          alt: "Workout tracking interface",
        },
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Nutrition tracking with barcode scanner and meal logging",
          alt: "Nutrition tracking interface",
        },
        {
          url: "/placeholder.svg?height=400&width=600",
          caption: "Progress analytics with charts and achievement tracking",
          alt: "Fitness analytics dashboard",
        },
      ],
      gallery: [
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "User onboarding flow with fitness goal selection",
          alt: "Onboarding screens",
        },
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Exercise library with video demonstrations",
          alt: "Exercise library",
        },
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Social feed showing friend activities and challenges",
          alt: "Social feed interface",
        },
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Achievement system with badges and rewards",
          alt: "Achievements screen",
        },
        {
          url: "/placeholder.svg?height=800&width=1200",
          caption: "Custom workout plan creator interface",
          alt: "Workout plan creator",
        },
      ],
      content: `# Mobile Fitness App

The Mobile Fitness App is a comprehensive health and wellness platform designed to help users track their fitness journey, create personalized workout routines, and monitor their nutrition. Built with React Native, this cross-platform application delivers a native-like experience on both iOS and Android devices.

## Project Goals

The primary goals for this project were:

1. Create an intuitive, user-friendly mobile experience
2. Develop a system for generating customized workout plans based on user goals
3. Implement accurate nutrition tracking and meal recommendations
4. Build a community feature for motivation and accountability
5. Ensure data synchronization across devices

![App Screenshots](/placeholder.svg?height=300&width=500&query=fitness app screenshots)

## Technical Architecture

### App Architecture

The app was built using React Native with a Redux state management system. The architecture followed a feature-based organization:

\`\`\`
src/
├── api/                  # API service layer
├── components/           # Shared UI components
├── features/             # Feature-specific modules
│   ├── auth/             # Authentication feature
│   ├── workouts/         # Workout tracking feature
│   ├── nutrition/        # Nutrition tracking feature  
│   └── social/           # Social features
├── navigation/           # React Navigation setup
├── store/                # Redux store configuration
└── utils/                # Utility functions
\`\`\`

### Backend Services

The backend was built with Node.js and Express, using MongoDB for data storage and Firebase for real-time features:

\`\`\`typescript
// Example of workout generation API endpoint
router.post('/api/workouts/generate', authenticate, async (req, res) => {
  try {
    const { goal, fitnessLevel, equipment, daysPerWeek } = req.body;
    const userId = req.user.id;
    
    // Fetch user profile to get additional preferences
    const userProfile = await UserProfile.findOne({ userId });
    
    // Generate workout plan based on parameters
    const workoutPlan = await WorkoutGenerator.createPlan({
      goal,
      fitnessLevel,
      equipment,
      daysPerWeek,
      preferences: userProfile.preferences,
    });
    
    // Save the generated plan to user's account
    await User.findByIdAndUpdate(userId, {
      $push: { workoutPlans: workoutPlan }
    });
    
    res.json({ success: true, workoutPlan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
\`\`\`

## Key Features

### Workout Tracking

The app includes an extensive exercise database with over 500 exercises, complete with video demonstrations and detailed instructions. Users can:

- Track sets, reps, and weight for strength training
- Record duration, distance, and pace for cardio
- Log custom exercises not in the database
- View progress over time with detailed charts

![Workout Interface](/placeholder.svg?height=300&width=500&query=workout tracking interface)

### Nutrition Tracking

The nutrition module includes:

- Barcode scanner for quick food logging
- Customizable macro tracking
- Meal planning and recipe suggestions
- Water intake monitoring

### Social Features

To keep users motivated, the app includes:

- Friend connections and activity feeds
- Challenges and competitions
- Achievement badges
- Progress sharing

![Social Features](/placeholder.svg?height=300&width=500&query=fitness app social features)

## Results

Since launching, the app has:

- Acquired over 50,000 active users
- Maintained a 4.7/5 star rating on app stores
- Processed over 2 million workout sessions
- Generated over $250,000 in subscription revenue

User feedback has been overwhelmingly positive, with many citing the intuitive interface and personalized workout plans as key differentiators from other fitness apps.

### User Testimonials

> "This app has completely transformed my fitness routine. The personalized workouts are exactly what I needed!" - Sarah M.

> "The nutrition tracking is so easy to use. I love the barcode scanner feature!" - Mike R.`,
    },
  ]

  // Ensure the directory exists
  if (!fs.existsSync(projectsDirectory)) {
    fs.mkdirSync(projectsDirectory, { recursive: true })
  }

  // Create sample project files
  try {
    sampleProjects.forEach((project, index) => {
      try {
        const { content, ...metadata } = project
        const fileName = `sample-project-${index + 1}.md`
        const filePath = path.join(projectsDirectory, fileName)

        // Format the file with metadata and content
        const fileContent = `===
${JSON.stringify(metadata, null, 2)}
===

${content}`

        fs.writeFileSync(filePath, fileContent)
        console.log(`Created sample project: ${fileName}`)
      } catch (fileError) {
        console.error(`Failed to create sample project ${index + 1}:`, fileError)
      }
    })

    console.log("Sample projects creation completed")
  } catch (error) {
    console.error("Error creating sample projects:", error)
  }
}
