import { ResumeData } from '../types/resume';

export const sampleResume: ResumeData = {
  profile: {
    name: "Alex Johnson",
    title: "Software Engineer",
    email: "alex.johnson@email.com",
    phone: "(715) 555-0123",
    location: "River Falls, WI",
    links: [
      { label: "GitHub", url: "https://github.com/alexjohnson" },
      { label: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
      { label: "Portfolio", url: "https://alexjohnson.dev" }
    ]
  },
  summary: "Recent Computer Science graduate from University of Wisconsin-River Falls with strong foundation in software development, data structures, and algorithms. Passionate about building scalable web applications and contributing to open-source projects. Seeking opportunities to apply technical skills in a collaborative environment.",
  skills: [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", 
    "Git", "Docker", "AWS", "REST APIs", "GraphQL", "MongoDB", "PostgreSQL"
  ],
  experience: [
    {
      company: "TechStart Inc.",
      role: "Software Development Intern",
      start: "2024-06",
      end: "2024-08",
      location: "Minneapolis, MN",
      bullets: [
        {
          text: "Developed and maintained React-based web applications, improving user experience and reducing load times by 25%",
          metrics: { impact: 0.8 }
        },
        {
          text: "Collaborated with cross-functional teams to implement new features and fix critical bugs in production",
          metrics: { impact: 0.7 }
        },
        {
          text: "Participated in code reviews and contributed to team's coding standards and best practices",
          metrics: { impact: 0.6 }
        }
      ]
    },
    {
      company: "UWRF Computer Science Department",
      role: "Teaching Assistant",
      start: "2024-01",
      end: "2024-05",
      location: "River Falls, WI",
      bullets: [
        {
          text: "Assisted professors in grading assignments and providing feedback to students in Data Structures and Algorithms courses",
          metrics: { impact: 0.7 }
        },
        {
          text: "Conducted weekly office hours to help students understand complex programming concepts",
          metrics: { impact: 0.8 }
        },
        {
          text: "Developed supplementary learning materials and practice problems for students",
          metrics: { impact: 0.6 }
        }
      ]
    }
  ],
  projects: [
    {
      name: "E-Commerce Platform",
      link: "https://github.com/alexjohnson/ecommerce-platform",
      stack: ["React", "Node.js", "MongoDB", "Stripe"],
      bullets: [
        "Built a full-stack e-commerce application with user authentication, product management, and payment processing",
        "Implemented responsive design using Tailwind CSS and achieved 95+ Lighthouse performance score",
        "Integrated Stripe payment gateway and implemented secure checkout flow with order tracking"
      ]
    },
    {
      name: "Task Management API",
      link: "https://github.com/alexjohnson/task-api",
      stack: ["Node.js", "Express", "PostgreSQL", "JWT"],
      bullets: [
        "Developed RESTful API with JWT authentication, role-based access control, and comprehensive error handling",
        "Implemented database optimization techniques reducing query response time by 40%",
        "Created comprehensive API documentation using Swagger and wrote unit tests with 90% coverage"
      ]
    },
    {
      name: "Weather Dashboard",
      link: "https://github.com/alexjohnson/weather-dashboard",
      stack: ["React", "TypeScript", "OpenWeather API", "Chart.js"],
      bullets: [
        "Created a weather application displaying current conditions and 7-day forecasts with interactive charts",
        "Implemented geolocation services and saved user preferences in localStorage",
        "Used TypeScript for type safety and built responsive design for mobile and desktop users"
      ]
    }
  ],
  education: [
    {
      school: "University of Wisconsin-River Falls",
      degree: "Bachelor of Science in Computer Science",
      grad: "2024-05"
    }
  ],
  awards: [
    "Dean's List (2022-2024)",
    "Computer Science Department Outstanding Student Award (2024)",
    "Hackathon Winner - UWRF Innovation Challenge (2023)"
  ]
};
