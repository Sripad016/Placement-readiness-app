import React from "react";
import { Code2, Video, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Practice Problems",
    description: "Sharpen your coding and aptitude skills with guided daily sets.",
    Icon: Code2
  },
  {
    title: "Mock Interviews",
    description: "Rehearse real interview scenarios with structured practice rounds.",
    Icon: Video
  },
  {
    title: "Track Progress",
    description: "Measure growth with clear performance snapshots over time.",
    Icon: BarChart3
  }
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <main className="landing-main">
        <section className="hero-section">
          <h1>Ace Your Placement</h1>
          <p>Practice, assess, and prepare for your dream job</p>
          <Link className="primary-button" to="/dashboard">
            Get Started
          </Link>
        </section>

        <section className="features-section">
          <div className="features-grid">
            {features.map(({ title, description, Icon }) => (
              <article className="feature-card" key={title}>
                <Icon size={24} aria-hidden="true" />
                <h2>{title}</h2>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Placement Readiness. All rights reserved.</p>
      </footer>
    </div>
  );
}
