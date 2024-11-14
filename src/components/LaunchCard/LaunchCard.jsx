import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { formatDistanceToNow } from 'date-fns';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const LaunchCard = ({ launch }) => {
  const launchDate = new Date(launch.launch_date_unix * 1000);
  const timeAgo = formatDistanceToNow(launchDate, { addSuffix: true });

  return (
    <div className="launch-card">
      <h3>
        {launch.mission_name}
        <span
          className={`status-badge ${
            launch.upcoming ? '' : launch.launch_success ? 'status-success' : 'status-failed'
          }`}
        >
          {launch.upcoming ? 'upcoming' : launch.launch_success ? 'success' : 'failed'}
        </span>
      </h3>
      <p><strong>Flight Number:</strong> {launch.flight_number}</p>
      <p><strong>Year:</strong> {launch.launch_year}</p>
      <p><strong>Launched:</strong> {timeAgo}</p> 
      <p><strong>Details:</strong> {launch.details || 'No details available.'}</p>
      {launch.links.article_link && (
        <p>
          <a href={launch.links.article_link} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </p>
      )}
      <div className="carousel">
        {launch.links.flickr_images.length > 0 ? (
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={3000}
            stopOnHover
          >
            {launch.links.flickr_images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Launch image ${index + 1}`} className="carousel-image" />
              </div>
            ))}
          </Carousel>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export default LaunchCard;
