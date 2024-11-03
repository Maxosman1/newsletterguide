import React from "react";

const NewsletterCard = ({ newsletter }) => {
  return (
    <div className="newsletter-card">
      <h2>
        {newsletter.title} ({newsletter.category})
      </h2>
      {newsletter.feedImage ? (
        <img src={newsletter.feedImage} alt={`${newsletter.title} logo`} />
      ) : (
        <div className="fallback-image">No Image Available</div>
      )}
      {newsletter.articles.map((article) => (
        <div key={article.link}>
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          <p>
            {article.author} - {new Date(article.pubDate).toLocaleDateString()}
          </p>
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsletterCard;
