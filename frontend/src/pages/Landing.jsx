import { useState, useEffect } from "react";
import {
  Cloud,
  Tag,
  Type,
  Shield,
  Github,
  Mail,
  Phone,
  Search,
  Edit3,
} from "lucide-react";
import NavHome from "../components/NavHome";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const initTheme = () => {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
    };
    initTheme();
  }, []);

  const features = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Sync",
      description:
        "Your notes sync  across all your devices with end-to-end encryption.",
    },
    {
      icon: <Tag className="w-8 h-8" />,
      title: "Smart Tags",
      description:
        "Organize your thoughts with an intelligent tagging system .",
    },
    {
      icon: <Type className="w-8 h-8" />,
      title: "Rich Text",
      description:
        "Format your notes beautifully with our intuitive editor and markdown support.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description:
        "Your data belongs to you. We use state of the art encryption to keep your notes private.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="min-h-screen">
      <NavHome />
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto lg:ml-15">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-base-content leading-tight">
                  Your thoughts,
                  <span className="text-5xl lg:text-6xl font-bold text-secondary leading-tight">
                    {" "}
                    beautifully organized
                  </span>
                </h1>
                <p className="text-xl text-base-content/80 leading-relaxed">
                  NotesHub is the clean and minimal note taking app that helps
                  you capture, organize, and securely store your ideas. Focus on
                  what matters most. Your thoughts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-primary px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 shadow-lg"
                >
                  Start Writing
                </button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-base-content/60">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>it's absoluely free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-info rounded-full"></div>
                  <span>Signup today </span>
                </div>
              </div>
            </div>

            {/* App Mockup */}
            <div className="relative">
              <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-base-200 px-4 py-3 border-b border-base-300 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <div className="flex-1 text-center text-sm text-base-content/50">
                    NotesHub - Your Ideas
                  </div>
                </div>

                <div className="p-6">
                  <div className="relative flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-base-content">
                      Hello, Billy
                    </h3>
                    <div className="absolute left-0 right-0 flex justify-center">
                      <Search className="w-5 h-5 text-base-content/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-base-content">
                            Bucket list
                          </h4>
                          <p className="text-sm text-base-content/60 mt-1">
                            A tour of the Great Pyramids of Giza...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="badge badge-primary badge-sm">
                          work
                        </span>
                        <span className="badge badge-secondary badge-sm">
                          ideas
                        </span>
                      </div>
                    </div>

                    <div className="bg-secondary/10 p-4 rounded-lg border-l-4 border-secondary">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-base-content">
                            Meeting Notes
                          </h4>
                          <p className="text-sm text-base-content/60 mt-1">
                            Merge changes - Push to Production...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="badge badge-secondary badge-sm">
                          meetings
                        </span>
                      </div>
                    </div>

                    <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-base-content">
                            Reading List
                          </h4>
                          <p className="text-sm text-base-content/60 mt-1">
                            Books and articles to check out...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="badge badge-accent badge-sm">
                          personal
                        </span>
                        <span className="badge badge-warning badge-sm">
                          books
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-warning/10 p-4 rounded-lg border-l-4 border-warning">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-base-content">
                            Shopping List
                          </h4>
                          <p className="text-sm text-base-content/60 mt-1">
                            ugali ya kisiagi ni must na tilapia fresh...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="badge badge-warning badge-sm">
                          errand
                        </span>
                      </div>
                    </div>

                    <div className="bg-info/10 p-4 rounded-lg border-l-4 border-info">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-base-content">
                            Movie to watch
                          </h4>
                          <p className="text-sm text-base-content/60 mt-1">
                            Shooter series, Need for speed, The Martian...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="badge badge-info badge-sm">
                          movies
                        </span>
                        <span className="badge badge-success badge-sm">
                          plans
                        </span>
                      </div>
                    </div>

                    <div className="bg-success/10 p-4 rounded-lg border-l-4 border-success">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-base-content">
                            Fitness Goal
                          </h4>
                          <p className="text-sm text-base-content/60 mt-1">
                            Hit gym till I gain mucle and strenght...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="badge badge-success badge-sm">
                          health
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-error/10 p-4 rounded-lg border-l-4 border-error">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-base-content">
                            Recipe Idea
                          </h4>
                          <p className="text-sm text-base-content/60 mt-1">
                            This week will try to cook steak and some veges...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="badge badge-error badge-sm">food</span>
                        <span className="badge badge-accent badge-sm">
                          cooking
                        </span>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-base-content">
                            Projects
                          </h4>
                          <p className="text-sm text-base-content/60 mt-1">
                            Project review is in 2 weeks, I have a lot to do...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="badge badge-primary badge-sm">
                          work
                        </span>
                        <span className="badge badge-secondary badge-sm">
                          tasks
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-base-content/80 max-w-3xl mx-auto">
              NotesHub combines powerful features with a clean, intuitive
              interface to help you capture and organize your thoughts easily.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-base-200 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="text-primary mb-4 group-hover:text-secondary transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-3">
                  {feature.title}
                </h3>
                <p className="text-base-content/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Card Container */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-base-content mb-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  question: "Is NotesHub free?",
                  answer: "Yes! absolutely free to use.",
                },
                {
                  question: "How secure is it?",
                  answer: "End-to-end encryption with SHA256.",
                },
                {
                  question: "Does it Support mobile?",
                  answer: "Fully responsive with native app coming soon.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="dropdown dropdown-hover dropdown-bottom"
                >
                  <div
                    tabIndex={0}
                    className="btn btn-ghost hover:bg-base-200 w-full text-left justify-between normal-case font-normal py-2 px-3 rounded-md text-sm"
                  >
                    <span className="truncate">{faq.question}</span>
                    <svg
                      className="w-3 h-3 ml-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div
                    tabIndex={0}
                    className="dropdown-content z-[1] card card-compact bg-base-100 shadow-md border border-base-300 w-full mt-0 p-3"
                  >
                    <div className="card-body p-0">
                      <p className="text-sm text-base-content/80">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=" text-base-content py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">NotesHub</span>
              </div>
              <p className="text-base-content">
                This is the best notes app right now. Signup Today and Enjoy{" "}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-base-content">
                <a href="#" className="block hover:text-base-content">
                  Features
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-base-content/70">
                <a href="#" className="block hover:text-base-content">
                  Help Center
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/blyator"
                  className="text-base-content/70 hover:text-base-content"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="mailto:dmnbilly@gmail.com"
                  className="text-base-content/70 hover:text-base-content"
                >
                  <Mail className="w-6 h-6" />
                </a>
                <a
                  href="tel:+254721400997"
                  className="text-base-content/70 hover:text-base-content"
                >
                  <Phone className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-focus mt-12 pt-8 text-center text-base-content/70">
            <p>&copy; 2025 NotesHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
