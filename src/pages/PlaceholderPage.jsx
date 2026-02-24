import React from "react";

export default function PlaceholderPage({ title, description }) {
  return (
    <section className="placeholder-page">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
